import { Memory, CrudEntityKey } from 'Types/source';
import { isRegistered, resolve } from 'Types/di';
import { getStore } from 'Application/Env';
import { Model } from 'Types/entity';
import { Service as HistoryService, FilterSource, Constants } from 'Controls/history';
import { IFilterItem } from './View/interface/IFilterItem';
import FilterDescription from './FilterDescription';
import FilterCalculator from './FilterCalculator';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import { Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IPrefetchParams } from 'Controls/_filter/interface/IPrefetch';
import { object } from 'Types/util';
import type { TColumns } from 'Controls/grid';
import { TFilter } from 'Controls/interface';
import FilterLoader from 'Controls/_filter/FilterLoader';

const HISTORY_SOURCE_STORAGE_ID = 'CONTROLS_HISTORY_SOURCE_STORE';
const ACTIVE_HISTORY_FILTER_INDEX = 0;

const PREFETCH_MODULE = 'Controls-ListEnv/filterPrefetch';

interface IFilterHistoryOptions {
    historyId: string;
    recent?: number;
    favorite?: boolean;
    historyIds?: string[];
    prefetchParams?: IPrefetchHistoryParams;
}

interface IFilterHistoryUpdateMeta {
    item?: Model;
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

export interface IAdditionalHistoryData {
    prefetchParams?: IPrefetchHistoryParams;
    columns?: TColumns;
}

export interface IFilterHistoryData extends IAdditionalHistoryData {
    items: IFilterItem[];
}

export type THistoryData = IFilterHistoryData | IFilterItem[];

export interface IFindHistoryResult {
    index: number;
    item: Model;
    data: THistoryData;
}

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
    const value = item.value;
    // Two case of saving filter in history
    // 1 case - need to hide textValue in line near button, but save value in history
    // 2 case - need to hide textValue in line near button and not save value in history
    // if textValue is empty string (''), save filter in history
    // if textValue is null, do not save
    const isNeedSaveHistory = textValue !== null;
    const visibility = !isNeedSaveHistory && item.visibility ? false : item.visibility;
    const minimizedItem = {
        name: item.name,
    } as IFilterItem;
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

    if (item.historyId) {
        minimizedItem.historyId = item.historyId;
    }

    if (item.textValueVisible !== undefined) {
        minimizedItem.textValueVisible = item.textValueVisible;
    }

    if (item.appliedFrom) {
        minimizedItem.appliedFrom = item.appliedFrom;
    }
    return minimizedItem;
}

function minimizeFilterDescription(filterDescription: IFilterItem[]): IFilterItem[] {
    return object
        .clonePlain(filterDescription)
        .filter(
            (item) =>
                (!isEqual(item.value, item.resetValue) && item.textValue !== null) || item.historyId
        )
        .map(minimizeItem);
}

function getFilterDescriptionForHistory(filterDescription: IFilterItem[]): IFilterItem[] {
    return filterDescription.filter((item) => {
        return (
            !item.doNotSaveToHistory &&
            // Если для фильтров из строки поиска указан шаблон отображения, его скорее всего нельзя восстановить по тексту из истории.
            // Во избежание ошибок, не сохраняем такой фильтр в историю
            (item.appliedFrom !== 'filterSearch' || !item.editorOptions?.searchSelectedItemTemplate)
        );
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

function loadFilterHistory(historyOptions: IFilterHistoryOptions): Promise<THistoryData> {
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

function getHistoryItems(
    historyId: string,
    filterDescription: IFilterItem[],
    historySaveMode: string,
    prefetchParams: IPrefetchHistoryParams
): Promise<THistoryData> {
    const historyOptions = getHistorySourceOptions(
        historyId,
        filterDescription,
        historySaveMode,
        prefetchParams
    );
    return loadFilterHistory(historyOptions)
        .then((res) => {
            const source = getFilterHistorySource(historyOptions);
            let historyResult;
            const recent = source.getRecent();

            if (recent.getCount()) {
                const lastFilter = recent.at(ACTIVE_HISTORY_FILTER_INDEX);
                const lastFilterData = source.getDataObject(lastFilter);
                historyResult = Object.keys(lastFilterData).length ? lastFilterData : [];
            } else {
                historyResult = [];
            }
            return mergeHistoryParams(historyResult, source);
        })
        .catch((error) => {
            error.processed = true;
            return [];
        });
}

function mergeHistoryParams(historyData: THistoryData, source: typeof FilterSource): IFilterItem[] {
    const paramsHistoryIds = source.getParams();
    const history = historyData.items || historyData;
    const historyParams = [];
    for (const historyId in paramsHistoryIds) {
        if (paramsHistoryIds.hasOwnProperty(historyId)) {
            const hParam = { ...source.getDataObject(paramsHistoryIds[historyId]), historyId };
            historyParams.push(hParam);
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
    const historySource = getFilterHistorySource(
        getHistorySourceOptions(historyId, filterDescription, historySaveMode, prefetchParams)
    );
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

function getHistorySourceOptions(
    historyId: string,
    filterDescription: IFilterItem[],
    historySaveMode: string,
    prefetchParams?: IPrefetchHistoryParams
): IFilterHistoryOptions {
    const isFavoriteSaveMode = isFavoriteMode(historySaveMode);
    const config: IFilterHistoryOptions = {
        historyId,
        favorite: !!prefetchParams || isFavoriteSaveMode,
        prefetchParams,
        recent: isFavoriteSaveMode ? 'MAX_HISTORY_REPORTS' : 'MAX_HISTORY',
    };

    if (!isFavoriteSaveMode && !prefetchParams) {
        config.historyIds = getHistoryIdsFromDescription(filterDescription);
    }
    return config;
}

function resolveHistoryDataForSave(
    filterDescription: IFilterItem[],
    additionalHistoryData?: IAdditionalHistoryData
) {
    const result = {} as IFilterHistoryData;
    const filterDescriptionForHistory = getFilterDescriptionForHistory(filterDescription);

    /* An empty filter should not appear in the history,
       but should be applied when loading data from the history.
       To understand this, save an empty object in history. */
    if (
        FilterDescription.isFilterDescriptionChanged(filterDescriptionForHistory) ||
        getHistoryIdsFromDescription(filterDescriptionForHistory).length
    ) {
        if (additionalHistoryData) {
            Object.assign(result, additionalHistoryData);
        }
        if (additionalHistoryData?.prefetchParams) {
            getPrefetch().addPrefetchToHistory(result, additionalHistoryData.prefetchParams);
        }
        result.items = minimizeFilterDescription(filterDescriptionForHistory);
    }
    return result;
}

function updateFilterHistory(
    meta: IFilterHistoryUpdateMeta = { $_addFromData: true },
    source: typeof FilterSource,
    filterDescription: IFilterItem[],
    additionalHistoryData?: IAdditionalHistoryData,
    onUpdateCallback?: THistorySaveCallback
): Promise<unknown> {
    const prefetchParams = additionalHistoryData?.prefetchParams;
    let historyData;
    if (meta?.item) {
        historyData = meta.item;
        if (historyData && prefetchParams) {
            const historyItems = JSON.parse(historyData.get('ObjectData'));
            const currentSessionId = historyItems.prefetchParams?.PrefetchSessionId;
            const newSessionId = prefetchParams?.PrefetchSessionId;
            if (newSessionId && currentSessionId !== newSessionId) {
                historyItems.prefetchParams = {
                    ...historyItems.prefetchParams,
                    PrefetchSessionId: newSessionId,
                };
                historyData.set('ObjectData', JSON.stringify(historyItems));
            }
        }
    } else {
        historyData = resolveHistoryDataForSave(filterDescription, additionalHistoryData);
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
    updateMeta?: IFilterHistoryUpdateMeta,
    additionalHistoryData?: IAdditionalHistoryData,
    onUpdateCallback?: THistorySaveCallback
): Promise<unknown> {
    const prefetchParams = additionalHistoryData?.prefetchParams;
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
            additionalHistoryData,
            onUpdateCallback
        );
    } else {
        return loadFilterHistory({
            historyId,
            historyIds: getHistoryIdsFromDescription(filterDescription),
            prefetchParams,
        }).then(() => {
            return updateFilterHistory(
                updateMeta,
                source,
                filterDescription,
                additionalHistoryData,
                onUpdateCallback
            );
        });
    }
}

function getHistoryItemsFromData(historyData: THistoryData): IFilterItem[] {
    return historyData.items || historyData;
}

function applyFilterDescriptionFromHistory(
    currentDescription: IFilterItem[],
    filter: TFilter = {},
    historyItems: THistoryData
): IFilterItem[] {
    const history = historyItems.items || historyItems;
    let resultDescription = FilterDescription.mergeFilterDescriptions(
        FilterDescription.prepareFilterDescription(currentDescription, history),
        history
    );
    resultDescription = FilterLoader.initFilterDescriptionFromData(resultDescription);

    if (FilterLoader.isCallbacksLoaded(resultDescription)) {
        FilterDescription.updateFilterDescription(
            resultDescription,
            filter,
            FilterCalculator.getFilterByFilterDescription(filter, resultDescription),
            (newItems) => {
                resultDescription = newItems;
            }
        );
    }

    return resultDescription;
}

export default {
    loadFilterHistory,
    getHistoryItems,
    getHistorySourceOptions,
    findItemInHistory,
    update,
    removeItem,
    getFilterHistorySource,
    getHistoryIdsFromDescription,
    getHistoryItemsFromData,
    minimizeItem,
    minimizeFilterDescription,
    updateFilterHistory,
    mergeHistoryParams,
    applyFilterDescriptionFromHistory,
};
