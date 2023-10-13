import { Memory, CrudEntityKey } from 'Types/source';
import { isRegistered, resolve } from 'Types/di';
import { getStore } from 'Application/Env';
import { Model } from 'Types/entity';
import { Service as HistoryService, FilterSource, Constants } from 'Controls/history';
import { IFilterItem } from './View/interface/IFilterItem';
import FilterDescription from './FilterDescription';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import { Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IPrefetchParams } from 'Controls/_filter/interface/IPrefetch';
import { object } from 'Types/util';

const HISTORY_SOURCE_STORAGE_ID = 'CONTROLS_HISTORY_SOURCE_STORE';

const PREFETCH_MODULE = 'Controls-ListEnv/filterPrefetch';

interface IFilterHistoryOptions {
    historyId: string;
    recent?: number;
    favorite?: boolean;
    historyIds?: string[];
    prefetchParams?: IPrefetchHistoryParams;
}

interface IFilterHistoryUpdateMeta {
    historyItem?: Model;
    $_addFromData?: boolean;
}

type THistorySaveCallback = (
    historyData: Record<string, unknown>,
    filterDescription: IFilterItem[]
) => void;

export interface IPrefetchHistoryParams {
    PrefetchSessionId: string;
    PrefetchDataValidUntil: Date;
}

export interface IFilterHistoryData {
    items: IFilterItem[];
    prefetchParams?: IPrefetchHistoryParams;
}

export type THistoryData = IFilterHistoryData | IFilterItem[];

export interface IFindHistoryResult {
    index: number;
    item: Model;
    historyData: THistoryData;
}

const ACTIVE_HISTORY_FILTER_INDEX = 0;

function getHistoryIdsFromDescription(filterDescription: IFilterItem[]): string[] {
    const historyIds = [];
    if (Array.isArray(filterDescription)) {
        filterDescription.forEach((filterItem) => {
            if (filterItem.historyId) {
                historyIds.push(filterItem.historyId);
            }
        });
    }
    return historyIds;
}

function hasSourceInStore(historyId: string): boolean {
    return !!getStore(HISTORY_SOURCE_STORAGE_ID).get(historyId);
}

function getPrefetch(): typeof import('Controls-ListEnv/filterPrefetch').Prefetch {
    return loadSync<typeof import('Controls-ListEnv/filterPrefetch')>(PREFETCH_MODULE).Prefetch;
}

function minimizeItem(item: IFilterItem): IFilterItem {
    const textValue = item.textValue;
    // Two case of saving filter in history
    // 1 case - need to hide textValue in line near button, but save value in history
    // 2 case - need to hide textValue in line near button and not save value in history
    // if textValue is empty string (''), save filter in history
    // if textValue is null, do not save
    const isNeedSaveHistory = textValue !== undefined && textValue !== null;
    const visibility = !isNeedSaveHistory && item.visibility ? false : item.visibility;
    const minimizedItem = {} as IFilterItem;
    const value = item.value;
    const isNeedSaveValue =
        item.resetValue !== undefined
            ? !isEqual(value, item.resetValue) && isNeedSaveHistory
            : true;

    if (visibility !== undefined && (!item.editorTemplateName || item.filterVisibilityCallback)) {
        minimizedItem.visibility = visibility;
    }

    if (isNeedSaveValue && value !== undefined) {
        minimizedItem.value = value;
    }

    if (visibility !== false && textValue !== item.resetTextValue) {
        if (isEqual(value, item.resetValue)) {
            minimizedItem.textValue = '';
        } else {
            minimizedItem.textValue = item.textValue;
        }
    }

    if (item.id) {
        minimizedItem.id = item.id;
    } else {
        minimizedItem.name = item.name;
        minimizedItem.viewMode = item.viewMode;
    }

    if (item.historyId) {
        minimizedItem.historyId = item.historyId;
    }

    if (item.textValueVisible !== undefined) {
        minimizedItem.textValueVisible = item.textValueVisible;
    }
    return minimizedItem;
}

function minimizeFilterDescription(filterDescription: IFilterItem[]): IFilterItem[] {
    return object.clonePlain(filterDescription).map(minimizeItem);
}

function getFilterDescriptionForHistory(filterDescription: IFilterItem[]): IFilterItem[] {
    return filterDescription.filter((item) => {
        return !item.doNotSaveToHistory;
    });
}

function createFilterHistorySource(historyOptions: IFilterHistoryOptions): void {
    const historyId = historyOptions.historyId;
    const historySourceData = {
        historyId,
        pinned: true,
        recent: (Constants[historyOptions.recent] || Constants.MAX_HISTORY) + 1,
        favorite: historyOptions.favorite,
        dataLoaded: true,
        historyIds: historyOptions.historyIds,
    };
    let historySource;

    if (isRegistered('demoSourceHistory-' + historyId)) {
        historySource = resolve('demoSourceHistory-' + historyId, historySourceData);
    } else if (isRegistered('demoSourceHistory')) {
        historySource = resolve('demoSourceHistory', historySourceData);
    } else {
        historySource = new HistoryService(historySourceData);
    }
    const source = new FilterSource({
        originSource: new Memory({
            keyProperty: 'id',
            data: [],
        }),
        historySource,
    });
    getStore(HISTORY_SOURCE_STORAGE_ID).set(historyOptions.historyId, source);
}

function getFilterHistorySource(historyOptions: IFilterHistoryOptions): typeof FilterSource {
    if (!hasSourceInStore(historyOptions.historyId)) {
        createFilterHistorySource(historyOptions);
    }
    const historySource = getStore(HISTORY_SOURCE_STORAGE_ID).get(historyOptions.historyId);
    if (
        !historyOptions.prefetchParams &&
        historyOptions.historyIds &&
        !isEqual(historySource.getHistoryIds(), historyOptions.historyIds)
    ) {
        createFilterHistorySource(historyOptions);
    }
    return getStore(HISTORY_SOURCE_STORAGE_ID).get(historyOptions.historyId);
}

function loadHistoryItems(historyOptions: IFilterHistoryOptions): Promise<THistoryData> {
    const source = getFilterHistorySource(historyOptions);
    const query = new Query().where({
        $_history: true,
    });
    return source.query(query).then((dataSet) => {
        return new RecordSet({
            rawData: dataSet.getAll().getRawData(),
            adapter: 'adapter.sbis',
        });
    });
}

function mergeHistoryParams(historyData: THistoryData, source: typeof FilterSource): IFilterItem[] {
    const paramsHistoryIds = source.getParams();
    const history = Array.isArray(historyData) ? historyData : historyData.items;
    const historyParams = [];
    for (const historyId in paramsHistoryIds) {
        if (paramsHistoryIds.hasOwnProperty(historyId)) {
            historyParams.push(source.getDataObject(paramsHistoryIds[historyId]));
        }
    }
    historyParams.forEach((hParam) => {
        const historyItem = FilterDescription.getItemByName(history, hParam.name);
        if (!historyItem) {
            history.push(hParam);
        } else {
            const index = history.indexOf(historyItem);
            history[index] = { ...hParam };
        }
    });
    return history;
}

function isFavoriteMode(saveMode: string): boolean {
    return saveMode === 'favorite';
}

function findItemInHistory(
    historyId: string,
    filterDescription: IFilterItem[],
    prefetchParams?: IPrefetchParams,
    historySaveMode?: string
): void | IFindHistoryResult {
    let result;
    let historyData;
    let minimizedItemFromHistory;
    let minimizedItemFromOption;
    const historyIds = getHistoryIdsFromDescription(filterDescription);
    const historySource = getFilterHistorySource({
        historyId,
        historyIds,
        favorite: !!prefetchParams || isFavoriteMode(historySaveMode),
        prefetchParams,
    });
    /* На сервере historySource не кэшируется и история никогда не будет проинициализирована
       Нужно переводить кэширование на сторы Санникова
       https://online.sbis.ru/opendoc.html?guid=4ca5d3b8-65a7-4d98-8ca4-92ed1fbcc0fc
     */
    if (!historySource.historyReady()) {
        return;
    }
    const historyItems = historySource.getItems();
    if (historyItems && historyItems.getCount()) {
        historyItems.each((item, index) => {
            if (!result) {
                historyData = historySource.getDataObject(item);

                if (historyData) {
                    const itemsToSave = getFilterDescriptionForHistory(filterDescription);
                    minimizedItemFromOption = minimizeFilterDescription(itemsToSave);
                    minimizedItemFromHistory = minimizeFilterDescription(
                        historyData.items || historyData
                    );
                    if (minimizedItemFromOption.length && minimizedItemFromHistory.length) {
                        const keyFromOption = minimizedItemFromOption[0].hasOwnProperty('name')
                            ? 'name'
                            : 'id';
                        const keyFromHistory = minimizedItemFromHistory[0].hasOwnProperty('name')
                            ? 'name'
                            : 'id';
                        if (keyFromOption !== keyFromHistory) {
                            minimizedItemFromHistory = minimizedItemFromHistory.map(
                                (historyItem) => {
                                    historyItem[keyFromOption] = historyItem[keyFromHistory];
                                    delete historyItem[keyFromHistory];
                                    return historyItem;
                                }
                            );
                        }
                    }
                    if (isEqual(minimizedItemFromOption, minimizedItemFromHistory)) {
                        result = {
                            item,
                            data: historyData,
                            index,
                        };
                    }
                }
            }
        });
    }

    return result;
}

function removeItem(historyId: string, itemKey: CrudEntityKey): void {
    getFilterHistorySource({ historyId }).destroy(itemKey, {
        $_history: true,
    });
}

function removeDescriptionFromHistory(
    historyId: string,
    filterDescription: IFilterItem[],
    prefetchParams: IPrefetchParams,
    historySaveMode: string
) {
    const currentHistory = findItemInHistory(
        historyId,
        filterDescription,
        prefetchParams,
        historySaveMode
    );
    if (currentHistory) {
        removeItem(historyId, currentHistory.item.getKey());
    }
}

function resolveHistoryDataForSave(
    filterDescription: IFilterItem[],
    prefetchParams?: IPrefetchParams
) {
    let result = {} as IFilterHistoryData;
    const filterDescriptionForHistory = getFilterDescriptionForHistory(filterDescription);

    /* An empty filter should not appear in the history,
       but should be applied when loading data from the history.
       To understand this, save an empty object in history. */
    if (
        FilterDescription.isFilterDescriptionChanged(filterDescriptionForHistory) ||
        getHistoryIdsFromDescription(filterDescriptionForHistory).length
    ) {
        result = prefetchParams
            ? getPrefetch().addPrefetchToHistory(result, prefetchParams)
            : result;
        result.items = minimizeFilterDescription(filterDescriptionForHistory);
    }
    return result;
}

function updateFilterHistory(
    meta: IFilterHistoryUpdateMeta,
    source: typeof FilterSource,
    filterDescription: IFilterItem[],
    prefetchParams?: IPrefetchHistoryParams,
    onUpdateCallback?: THistorySaveCallback
): Promise<unknown> {
    let historyData;
    if (meta.historyItem) {
        historyData = meta.historyItem;
        if (historyData && prefetchParams) {
            const historyItems = JSON.parse(historyData.get('ObjectData'));
            const currentSessionId = historyItems.prefetchParams.PrefetchSessionId;
            const newSessionId = prefetchParams?.PrefetchSessionId;
            if (newSessionId && currentSessionId !== newSessionId) {
                historyItems.prefetchParams.PrefetchSessionId = newSessionId;
                historyData.set('ObjectData', JSON.stringify(historyItems));
            }
        }
    } else {
        historyData = resolveHistoryDataForSave(filterDescription, prefetchParams);
        if (onUpdateCallback instanceof Function) {
            onUpdateCallback(historyData, filterDescription);
        }
    }

    return source.update(historyData, meta);
}

function update(
    filterDescription: IFilterItem[],
    historyId: string,
    isFavorite?: boolean,
    updateMeta: IFilterHistoryUpdateMeta = { $_addFromData: true },
    prefetchParams?: IPrefetchHistoryParams,
    onUpdateCallback?: THistorySaveCallback
): Promise<unknown> {
    const source = getFilterHistorySource({
        favorite: isFavorite,
        historyIds: getHistoryIdsFromDescription(filterDescription),
        historyId,
        prefetchParams,
    });
    if (source.historyReady()) {
        return updateFilterHistory(
            updateMeta,
            source,
            filterDescription,
            prefetchParams,
            onUpdateCallback
        );
    } else {
        return loadHistoryItems({
            historyId,
            historyIds: getHistoryIdsFromDescription(filterDescription),
            prefetchParams,
        }).then(() => {
            return updateFilterHistory(
                updateMeta,
                source,
                filterDescription,
                prefetchParams,
                onUpdateCallback
            );
        });
    }
}

function resolveHistoryItems(
    historyId: string,
    historyItems: IFilterItem[],
    prefetchParams: IPrefetchParams,
    filterDescription: IFilterItem[],
    historySaveMode: string
): Promise<THistoryData> {
    const historyIds = getHistoryIdsFromDescription(filterDescription);
    if (prefetchParams && historyItems?.length) {
        return loadHistoryItems({
            historyId,
            historyIds,
            favorite: true,
            prefetchParams,
        }).then((result) => {
            return historyItems ? historyItems : result;
        });
    } else {
        return historyItems
            ? Promise.resolve(historyItems)
            : loadHistoryItems({
                  historyId,
                  historyIds,
                  favorite: isFavoriteMode(historySaveMode) || !!prefetchParams,
                  prefetchParams,
              });
    }
}

function isHistoryLoaded(
    historyId: string,
    filterDescription: IFilterItem[],
    prefetchParams?: IPrefetchHistoryParams,
    historySaveMode?: string
): boolean {
    return getFilterHistorySource({
        historyId,
        historyIds: getHistoryIdsFromDescription(filterDescription),
        favorite: !!prefetchParams && isFavoriteMode(historySaveMode),
        prefetchParams,
    }).historyReady();
}

function getHistoryItemsFromData(historyData: THistoryData): IFilterItem[] {
    return Array.isArray(historyData) ? historyData : historyData.items;
}

export default {
    loadHistoryItems,
    resolveHistoryItems,
    findItemInHistory,
    update,
    removeItem,
    removeDescriptionFromHistory,
    isHistoryLoaded,
    getFilterHistorySource,
    getHistoryIdsFromDescription,
    getHistoryItemsFromData,
};
