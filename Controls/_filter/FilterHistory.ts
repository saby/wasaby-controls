import { Model } from 'Types/entity';
import IFilterItem from 'Controls/_filter/interface/IFilterDescriptionItem';
import FilterDescription from './FilterDescription';
import FilterCalculator from './FilterCalculator';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { object } from 'Types/util';
import type { TColumns, THeader } from 'Controls/grid';
import { TFilter } from 'Controls/interface';
import FilterLoader from 'Controls/_filter/FilterLoader';
import { DateTime } from 'Types/entity';
import { THistoryId, Store, IHistoryItem, THistoryLoadConfig } from 'Controls/HistoryStore';
import { Serializer } from 'UI/State';

const ACTIVE_HISTORY_FILTER_INDEX = 0;
const MAX_HISTORY = 10;
const MAX_HISTORY_HORIZONTAL_WINDOW = 7;
const HORIZONTAL_WINDOW_HISTORY_CONFIG = {
    pinned: MAX_HISTORY_HORIZONTAL_WINDOW,
    recent: MAX_HISTORY_HORIZONTAL_WINDOW,
    frequent: 0,
};
const VERTICAL_WINDOW_HISTORY_CONFIG = {
    pinned: MAX_HISTORY,
    recent: MAX_HISTORY,
    frequent: 0,
};
const PARAM_HISTORY_CONFIG = {
    recentCount: 1,
    pinnedCount: 0,
    frequentCount: 0,
};
const DEFAULT_FILTER = '{}';

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
    header?: THeader;
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

/**
 * Модуль, экспортирующий функции для работы с историей фильтров
 * @module Controls/filter:FilterHistory
 * @public
 */

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

function getHistoryLoadConfig({
    historyId,
    historyIds,
    prefetchParams,
}: IFilterHistoryOptions): THistoryLoadConfig {
    if (historyIds?.length && !prefetchParams) {
        const config = {
            [historyId]: VERTICAL_WINDOW_HISTORY_CONFIG,
        };
        historyIds.forEach((id) => {
            config[id] = PARAM_HISTORY_CONFIG;
        });

        return config;
    } else if (prefetchParams) {
        return HORIZONTAL_WINDOW_HISTORY_CONFIG;
    } else {
        return VERTICAL_WINDOW_HISTORY_CONFIG;
    }
}

function loadFilterHistory(
    historyOptions: IFilterHistoryOptions
): Promise<RecordSet<IHistoryItem>> {
    const { historyId, prefetchParams } = historyOptions;
    return Store.load(historyId, getHistoryLoadConfig(historyOptions)).then(() =>
        getItemsByHistory(historyId, prefetchParams ? MAX_HISTORY_HORIZONTAL_WINDOW : MAX_HISTORY)
    );
}

function getFilterHistoryItemData(historyItem: Model<IHistoryItem>): IFilterHistoryData {
    return JSON.parse(historyItem.get('ObjectData') as string, new Serializer().deserialize);
}

/**
 * Возвращает {@link Controls/filter:IFilterDescriptionProps структуру фильтра},
 * если в истории по переданному historyId сохранён применённый фильтр, в противном случе метод вернёт пустой массив.
 * @function Controls/filter:FilterHistory#getHistoryItems
 * @param {string} historyId Идентификатор истории фильтров
 * @returns {Promise<Array<Controls/filter:IFilterDescriptionItem>>} Структура фильтра
 * @example
 * <pre>
 *     import { FilterHistory } from 'Controls/filter';
 *
 *     FilterHistory.getHistoryItems('myHistoryId').then((fromHistoryItems) => {
 *         ...
 *     });
 * </pre>
 * @remark Чтобы записать в историю фильтров используйте метод {@link Controls/filter:FilterHistory#push push}
 * @see Controls/filter:FilterHistory#push
 */
function getHistoryItems(
    historyId: string,
    filterDescription?: IFilterItem[],
    historySaveMode?: string,
    prefetchParams?: IPrefetchHistoryParams
): Promise<THistoryData> {
    const historyOptions = getHistorySourceOptions(
        historyId,
        filterDescription,
        historySaveMode,
        prefetchParams
    );
    return loadFilterHistory(historyOptions)
        .then(() => {
            let historyResult;
            let historyResultKey;
            let updateApplyDate: boolean = false;

            const recent = Store.getLocal(historyId).recent;

            if (recent?.getCount()) {
                const lastFilter = recent.at(ACTIVE_HISTORY_FILTER_INDEX);
                const lastFilterData = getFilterHistoryItemData(lastFilter);
                historyResult = Object.keys(lastFilterData).length ? lastFilterData : [];
                historyResultKey = lastFilter.get('ObjectId');
            } else {
                historyResult = [];
            }

            //Фильтр по дате должен сбрасываться если пользователь не заходил на страницу 3 дня
            if (historyResult.items) {
                if (Array.isArray(filterDescription)) {
                    historyResult = historyResult.items.map((historyResultItem) => {
                        const filterDescriptionItem = FilterDescription.getItemByName(
                            filterDescription,
                            historyResultItem.name
                        );

                        if (filterDescriptionItem && isDateFilterItem(filterDescriptionItem)) {
                            const millisecondsInDay = 1000 * 60 * 60 * 24;
                            const daysAfterAppliedFilter = historyResult.applyDate
                                ? Math.trunc(
                                      (new DateTime() - historyResult.applyDate) / millisecondsInDay
                                  )
                                : null;

                            updateApplyDate =
                                !isEqual(filterDescriptionItem.value, historyResultItem.value) &&
                                (!historyResult.applyDate || daysAfterAppliedFilter > 0);

                            if (daysAfterAppliedFilter > 3 || !historyResult.applyDate) {
                                if (filterDescriptionItem.resetValue) {
                                    const resetItem =
                                        FilterDescription.resetFilterItem(filterDescriptionItem);
                                    return minimizeItem(resetItem);
                                }
                                return minimizeItem(filterDescriptionItem);
                            }
                        }
                        return historyResultItem;
                    });
                } else {
                    historyResult = historyResult.items;
                }

                if (updateApplyDate) {
                    Store.delete(historyOptions.historyId, historyResultKey);
                    update(historyResult, historyOptions.historyId);
                }
            }
            return mergeHistoryParams(historyResult, filterDescription);
        })
        .catch((error) => {
            error.processed = true;
            return [];
        });
}

function isDateFilterItem({ type, editorTemplateName }: IFilterItem): boolean {
    return (
        type === 'date' ||
        type === 'dateRange' ||
        editorTemplateName === 'Controls/filterPanelEditors:DateRange' ||
        editorTemplateName === 'Controls/filterPanelEditors:DateMenu' ||
        editorTemplateName === 'Controls/filterPanelEditors:Date' ||
        editorTemplateName === 'Controls-ListEnv/filterPanelExtEditors:DateRangeInputEditor'
    );
}

function getDeserializedObjectData(item: Model<IHistoryItem>): Partial<IFilterItem> {
    const serializerInstance = new Serializer();
    return JSON.parse(item.get('ObjectData') as string, serializerInstance.deserialize);
}

function mergeHistoryParams(
    historyData: THistoryData,
    filterDescription: IFilterItem[]
): IFilterItem[] {
    const history = getHistoryItemsFromData(historyData);
    const historyIds = getHistoryIdsFromDescription(filterDescription);
    const historyParams: IFilterItem[][] = [];
    historyIds.forEach((id) => {
        const lastFilter = Store.getLocal(id)?.recent?.at(0);
        if (lastFilter) {
            const hParam = getDeserializedObjectData(lastFilter) as IFilterItem[];
            historyParams.push(hParam);
        }
    });
    historyParams.forEach((hParam) => {
        const historyItem = FilterDescription.getItemByName(history, hParam[0].name);
        if (!historyItem) {
            history.push(hParam[0]);
        } else {
            const index = history.indexOf(historyItem);
            history[index] = { ...hParam[0] };
        }
    });
    return history;
}

function getItemsByHistory(historyId: string, maxCount: number): RecordSet<IHistoryItem> {
    const historyData = Store.getLocal(historyId);

    if (!historyData) {
        return new RecordSet({ keyProperty: 'ObjectId' });
    }

    const items = new RecordSet({
        keyProperty: 'ObjectId',
        adapter: (historyData.recent || historyData.pinned).getAdapter(),
        format: [
            { name: 'ObjectId', type: 'string' },
            { name: 'ObjectData', type: 'string' },
            { name: 'HistoryId', type: 'string' },
            { name: 'Counter', type: 'integer' },
            { name: 'pinned', type: 'boolean' },
        ],
    });
    let itemsCount = 0;

    historyData.pinned?.each((item) => {
        if (item.get('ObjectData') !== DEFAULT_FILTER) {
            items.add(item.clone());
            items.at(items.getCount() - 1).set('pinned', true);
            itemsCount++;
        }
    });

    historyData.recent?.each((item) => {
        if (
            itemsCount <= maxCount - 1 &&
            !items.getRecordById(item.getKey()) &&
            item.get('ObjectData') !== DEFAULT_FILTER
        ) {
            items.add(item.clone());
            itemsCount++;
        }
    });

    return items;
}

function isFavoriteMode(saveMode: string): boolean {
    return saveMode === 'favorite';
}

function findItemInHistory(
    historyId: string,
    filterDescription: IFilterItem[]
): void | IFindHistoryResult {
    let result;
    let historyData;
    let minimizedItemFromHistory;
    let minimizedItemFromOption;
    /* На сервере historySource не кэшируется и история никогда не будет проинициализирована
       Нужно переводить кэширование на сторы Санникова
       https://online.sbis.ru/opendoc.html?guid=4ca5d3b8-65a7-4d98-8ca4-92ed1fbcc0fc
     */
    if (!Store.getLocal(historyId)) {
        return;
    }
    const historyItems = getItemsByHistory(historyId, MAX_HISTORY);
    if (historyItems && historyItems.getCount()) {
        historyItems.each((item, index) => {
            if (!result) {
                historyData = getFilterHistoryItemData(item);

                if (historyData) {
                    const itemsToSave = getFilterDescriptionForHistory(filterDescription);
                    minimizedItemFromOption = minimizeFilterDescription(itemsToSave);
                    minimizedItemFromHistory = minimizeFilterDescription(
                        getHistoryItemsFromData(historyData)
                    );
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
        recent: true,
    };

    if (!isFavoriteSaveMode && !prefetchParams) {
        config.historyIds = getHistoryIdsFromDescription(filterDescription);
    }
    return config;
}

function resolveHistoryDataForSave(
    historyId: string,
    filterDescription: IFilterItem[],
    additionalHistoryData?: IAdditionalHistoryData
) {
    let result = {} as IFilterHistoryData;
    const filterDescriptionForHistory = getFilterDescriptionForHistory(filterDescription);
    const hasHistoryIdOnFilterItems = !!getHistoryIdsFromDescription(filterDescriptionForHistory)
        .length;

    /* An empty filter should not appear in the history,
       but should be applied when loading data from the history.
       To understand this, save an empty object in history. */
    if (
        FilterDescription.isFilterDescriptionChanged(filterDescriptionForHistory) ||
        hasHistoryIdOnFilterItems
    ) {
        if (additionalHistoryData) {
            Object.assign(result, additionalHistoryData);
        }
        if (additionalHistoryData?.prefetchParams) {
            getPrefetch().addPrefetchToHistory(result, additionalHistoryData.prefetchParams);
        }
        result.items = minimizeFilterDescription(filterDescriptionForHistory);
        result.applyDate = new DateTime();

        if (hasHistoryIdOnFilterItems && !additionalHistoryData?.prefetchParams) {
            result = {
                [historyId]: result,
            };

            filterDescription.forEach((filterItem) => {
                if (filterItem.historyId && filterItem.historyId !== historyId) {
                    result[filterItem.historyId] = [minimizeItem(filterItem)];
                }
            });
        }
    }
    return result;
}

function updateFilterHistory(
    meta: IFilterHistoryUpdateMeta = { $_addFromData: true },
    historyId: string,
    filterDescription: IFilterItem[],
    additionalHistoryData?: IAdditionalHistoryData,
    onUpdateCallback?: THistorySaveCallback
): Promise<unknown> {
    const prefetchParams = additionalHistoryData?.prefetchParams;
    const currentHistoryItem = findItemInHistory(historyId, filterDescription);

    let historyData;
    if (meta?.item) {
        historyData = getFilterHistoryItemData(meta.item);

        if (historyData && prefetchParams) {
            const currentSessionId = historyData.prefetchParams?.PrefetchSessionId;
            const newSessionId = prefetchParams?.PrefetchSessionId;
            if (newSessionId && currentSessionId !== newSessionId) {
                historyData.prefetchParams = {
                    ...historyData.prefetchParams,
                    PrefetchSessionId: newSessionId,
                };
            }
        }
    } else {
        historyData = resolveHistoryDataForSave(
            historyId,
            filterDescription,
            additionalHistoryData
        );
        if (onUpdateCallback instanceof Function) {
            onUpdateCallback(historyData, filterDescription);
        }
    }

    if (currentHistoryItem) {
        return Store.update(historyId, currentHistoryItem.item.getKey(), historyData);
    } else {
        return Store.push(historyId, historyData);
    }
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

    if (Store.getLocal(historyId)) {
        return updateFilterHistory(
            updateMeta,
            historyId,
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
                historyId,
                filterDescription,
                additionalHistoryData,
                onUpdateCallback
            );
        });
    }
}

function getHistoryItemsFromData(historyData: THistoryData): IFilterItem[] {
    if (historyData.items) {
        return historyData.items;
    }

    // Защита от кривых записей в истории
    // Страница падать в таком случае не должна, просто построимся с дефолтными фильтрами
    if (!historyData.applyDate && Array.isArray(historyData)) {
        return historyData;
    }

    return [];
}

function applyFilterDescriptionFromHistory(
    currentDescription: IFilterItem[],
    filter: TFilter = {},
    historyItems: THistoryData
): IFilterItem[] {
    const history = getHistoryItemsFromData(historyItems);
    let resultDescription = FilterDescription.prepareFilterDescription(currentDescription, history);

    // Если filterDescription задан функцией, то историю мержит прикладной программист в этой функции
    if (Array.isArray(currentDescription)) {
        resultDescription = FilterDescription.mergeFilterDescriptions(resultDescription, history);
    }
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

/**
 * Записывает фильтр в историю
 * @function Controls/filter:FilterHistory#push
 * @param {string} historyId Идентификатор истории фильтров
 * @param {Array.<Controls/filter:IFilterDescriptionItem>} filterDescription Структура фильтров, которая будет сохранена в историю
 * @example
 * <pre>
 *     import { FilterHistory } from 'Controls/filter';
 *
 *     const filterDescription = [{
 *          name: 'Author',
 *          value: 'Герасимов А.М.',
 *          resetValue: null,
 *          editorTemplateName: 'Controls/filterPanelEditors:Lookup',
 *          editorOptions: {...}
 *     }];
 *
 *     FilterHistory.push('myHistoryId', filterDescription);
 * </pre>
 * @remark Для загрузки истории фильтров используйте {@link Controls/HistoryStore:Store#load}
 */
function push(historyId: THistoryId, filterDescription: IFilterItem[]): Promise<string> {
    const historyData = resolveHistoryDataForSave(historyId, filterDescription);
    return Store.push(historyId, historyData);
}

export default {
    loadFilterHistory,
    getHistoryItems,
    getHistorySourceOptions,
    findItemInHistory,
    update,
    getHistoryIdsFromDescription,
    getHistoryItemsFromData,
    minimizeItem,
    minimizeFilterDescription,
    updateFilterHistory,
    mergeHistoryParams,
    applyFilterDescriptionFromHistory,
    push,
    getItemsByHistory,
    MAX_HISTORY_HORIZONTAL_WINDOW,
    HORIZONTAL_WINDOW_HISTORY_CONFIG,
    MAX_HISTORY,
    getFilterHistoryItemData,
};
