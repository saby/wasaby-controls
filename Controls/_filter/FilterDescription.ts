import { isEmpty, isEqual } from 'Types/object';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';
import { isDebug, Logger } from 'UICommon/Utils';
import { IFilterItemConfiguration } from './View/interface/IFilterItemConfiguration';
import { object } from 'Types/util';
import { getConfig, query } from 'Application/Env';
import { Serializer } from 'UICommon/State';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import type { IPrefetchParams } from 'Controls-ListEnv/filterPrefetch';
import { TFilter } from 'Controls/_interface/IFilter';
import { factory } from 'Types/chain';
import FilterLoader from './FilterLoader';
import FilterCalculator from './FilterCalculator';
import { getDates } from 'Controls/_filter/DateUtils';

const PREFETCH_MODULE = 'Controls-ListEnv/filterPrefetch';

export function isFilterDescriptionChanged(filterDescription: IFilterItem[]): boolean {
    return filterDescription.some(isFilterItemChanged);
}

function getSaveToUrlItems(
    filterDescription: IFilterItem[] = [],
    saveToUrl: boolean
): IFilterItem[] {
    return filterDescription.filter((item) => {
        return item.saveToUrl || (saveToUrl && !item.hasOwnProperty('saveToUrl'));
    });
}

function isFilterItemChanged(filterItem: IFilterItem): boolean {
    const { name, value, resetValue, visibility, editorTemplateName, filterVisibilityCallback } =
        filterItem;
    const isValueChanged = filterItem.hasOwnProperty('resetValue')
        ? !isEqual(value, resetValue)
        : value !== undefined;
    const isFilterVisible = !filterVisibilityCallback || visibility !== false;

    if (isValueChanged && !isFilterVisible && !editorTemplateName) {
        Logger.error(
            `Для элемента фильтра ${name} установлено visibility: false при изменённом значении опции value (value !== resetValue).`
        );
    }

    return isValueChanged && isFilterVisible;
}

export function applyFilterUserHistoryToDescription(
    filterDescription: IFilterItem[],
    userFilterConfig: IFilterItemConfiguration[]
): IFilterItem[] {
    if (!userFilterConfig.length) {
        return filterDescription;
    }
    const itemsClone = object.clonePlain(filterDescription);
    return itemsClone.map((item) => {
        const filterConfiguration = userFilterConfig.find((configItem) => {
            return configItem.name === item.name;
        });
        if (filterConfiguration?.viewMode) {
            item.viewMode = filterConfiguration.viewMode;
        }
        return item;
    });
}

export function getFilterFromURL(
    filterDescription: IFilterItem[],
    saveToUrl: boolean = false
): IFilterItem[] {
    const urlFilter = query.get.filter;
    if (!urlFilter || !getSaveToUrlItems(filterDescription, saveToUrl).length) {
        return;
    }

    let result;

    try {
        const applicationSerializer = new Serializer();
        result = JSON.parse(decodeURIComponent(urlFilter), applicationSerializer.deserialize) || [];
    } catch (e) {
        if (isDebug()) {
            Logger.error(
                'Controls/filter::в query параметре filter лежит невалидное значение, которое невозможно сериализовать.'
            );
        }
        result = [];
    }

    return result;
}

/**
 * Обновляет url, добавляя в него параметры фильтрации
 * @param {IFilterItem[]} filterDescription Массив элементов фильтра
 * @param {boolean} saveToUrl Нужно ли сохранять все элементы структуры фильтров, кроме тех, на которых свойство saveToUrl равно false
 * @returns void
 */
function applyFilterDescriptionToURL(
    filterDescription: IFilterItem[],
    saveToUrl: boolean = false
): void {
    const urlFilterItems = getSaveToUrlItems(filterDescription, saveToUrl);
    if (urlFilterItems?.length) {
        const queryParams = getQueryParamsByFilterDescription(filterDescription);
        if (isEmpty(queryParams)) {
            queryParams.replace = true;
        }

        // eslint-disable-next-line
        import('Router/router').then((router) => {
            const state = router.MaskResolver.calculateQueryHref(queryParams);

            // Нужно убрать название точки входа (например, OnlineSbisRu) из ссылки на страницу.
            // Если страница на сервисе, то точка входа в урл не добавляется и удалять ее, соответственно, не нужно.
            // Высчитываем с какой позиции начинается чистый урл и убираем точку входа из урл.
            const service = getConfig('appRoot');

            let href;
            if (!service || service === '/') {
                const pageIndex = state.indexOf('/page/');
                href = state.substring(pageIndex);
            }

            router.History.replaceState({ state, href });
        });
    }
}

interface IQueryParams {
    /**
     * @cfg {string} Фильтр в формате JSON string.
     */
    filter?: string;
    /**
     * @cfg {boolean} Опция для очистки текущих query-параметров.
     */
    replace?: boolean;
}

/**
 * Возвращает объект, содержащий фильтр для последующего сохранения его в праметры url.
 * @param {IFilterItem[]} filterDescription Массив элементов фильтра
 * @returns IQueryParams
 */
function getQueryParamsByFilterDescription(
    filterDescription: IFilterItem[]
): Partial<IQueryParams> {
    const filterItems = [];

    for (const item of filterDescription) {
        if (!isEqual(item.value, item.resetValue)) {
            filterItems.push({
                name: item.name,
                value: item.value,
                textValue: item.textValue,
                visibility: item.visibility,
            });
        }
    }

    const applicationSerializer = new Serializer();
    let queryParams = {};

    if (filterItems.length) {
        queryParams = {
            filter: JSON.stringify(filterItems, applicationSerializer.serialize),
        };
    }

    return queryParams;
}

function isEqualItems(item1: IFilterItem, item2: IFilterItem): boolean {
    const historyId1 = item1.historyId;
    const historyId2 = item2.historyId;

    return item1.name === item2.name && (!historyId1 || !historyId2 || historyId1 === historyId2);
}

function allowMerge(fieldName: string, newItem: IFilterItem, item: IFilterItem): boolean {
    const value = newItem[fieldName];
    let allowMerge;

    switch (fieldName) {
        case 'viewMode':
            // Если из истории пришёл viewMode: 'frequent' (быстрый фильтр),
            // то его мержить в структуру нельзя,
            // потому что viewMode могли поменять и такой фильтр уже не быстрый
            allowMerge =
                value !== undefined &&
                ((value !== 'frequent' && item.viewMode !== 'frequent') || !item.viewMode);
            break;
        case 'textValueVisible':
            // применяем, если в исходном фильтре значение не было задано прикладником
            allowMerge = !item.hasOwnProperty(fieldName);
            break;
        case 'textValue':
            // применяем, даже если в исходном фильтре textValue не был задан
            allowMerge = newItem.hasOwnProperty(fieldName);
            break;
        case 'appliedFrom':
            allowMerge = true;
            break;
        default:
            allowMerge = newItem.hasOwnProperty(fieldName) && item.hasOwnProperty(fieldName);
    }

    return allowMerge;
}

function mergeFilterDescriptions(
    target: IFilterItem[] = [],
    source: IFilterItem[] = [],
    mergeFields?: string[]
): IFilterItem[] {
    target.forEach((item) => {
        source.forEach((historyItem) => {
            if (isEqualItems(item, historyItem)) {
                for (const fieldName in historyItem) {
                    if (
                        historyItem.hasOwnProperty(fieldName) &&
                        (!mergeFields || mergeFields.includes(fieldName))
                    ) {
                        const value = historyItem[fieldName];

                        if (allowMerge(fieldName, historyItem, item)) {
                            item[fieldName] = value;
                        }
                    }
                }
            }
        });
    });

    return target;
}

function callCallback<T>(
    callback: string | Function,
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: TFilter,
    filterSource?: IFilterItem[]
): T {
    const func = typeof callback === 'string' ? loadSync<Function>(callback) : callback;

    if (func) {
        // делаем поверхностное клонирование, чтобы сохранить ссылку на items
        return func(
            object.clonePlain(item, { processCloneable: false }),
            updatedFilter,
            changedFilters,
            filterSource
        );
    }
}

function loadAndCallCallbacks(
    items: IFilterItem[],
    changedFilters: TFilter,
    updatedFilter: TFilter,
    updateCallback: (filterItems: IFilterItem[]) => void
): void {
    if (FilterLoader.isCallbacksLoaded(items)) {
        callCallbacksOnFilterDescription(changedFilters, updatedFilter, items, updateCallback);
    } else {
        FilterLoader.loadCallbacks(items).then(() => {
            callCallbacksOnFilterDescription(changedFilters, updatedFilter, items, updateCallback);
        });
    }
}

export function initFilterDescription(
    items: IFilterItem[],
    currentFilter: TFilter,
    updateCallback: (filterItems: IFilterItem[]) => void
): void {
    loadAndCallCallbacks(items, {}, currentFilter, updateCallback);
}

export function getItemOnFilterChangedCallback(
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: TFilter,
    filterDescription?: IFilterItem[]
): IFilterItem {
    return (
        callCallback<IFilterItem>(
            item.filterChangedCallback as string,
            item,
            updatedFilter,
            changedFilters,
            filterDescription
        ) || item
    );
}

function getItemVisibility(
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: TFilter,
    callback: string | Function
): boolean {
    return callCallback<boolean>(callback, item, updatedFilter, changedFilters);
}

function updateFilterDescription(
    items: IFilterItem[],
    currentFilter: TFilter,
    updatedFilter: TFilter,
    updateCallback: (filterItems: IFilterItem[]) => void
): void {
    const changedFilters = FilterCalculator.getChangedFilters(currentFilter, updatedFilter);
    if (!isEmpty(changedFilters)) {
        loadAndCallCallbacks(items, changedFilters, updatedFilter, updateCallback);
    } else if (updatedFilter) {
        updateCallback(items);
    }
}

function callFilterVisibilityCallback(
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: TFilter
) {
    if (item.filterVisibilityCallback) {
        item.visibility = getItemVisibility(
            item,
            updatedFilter,
            changedFilters,
            item.filterVisibilityCallback
        );
    }
}

function callVisibilityCallbackOnFilterDescription(
    filterDescription: IFilterItem[],
    filter: TFilter = {},
    changedFilters?: TFilter
) {
    const newFilter = FilterCalculator.getFilterByFilterDescription(filter, filterDescription);
    const changed = changedFilters || FilterCalculator.getChangedFilters(filter, newFilter);
    filterDescription?.forEach((item) => {
        callFilterVisibilityCallback(item, newFilter, changed);
    });
}

function callFilterChangedCallbackOnFilterDescription(
    filterDescription: IFilterItem[],
    filter: TFilter = {},
    changedFilters?: TFilter
): IFilterItem[] {
    const newFilterDescription: IFilterItem[] = [];
    const newFilter = FilterCalculator.getFilterByFilterDescription(filter, filterDescription);
    const changed = changedFilters || FilterCalculator.getChangedFilters(filter, newFilter);

    filterDescription.forEach((item) => {
        newFilterDescription.push(
            getItemOnFilterChangedCallback(item, newFilter, changed, filterDescription)
        );
    });

    return newFilterDescription;
}

function callCallbacksOnFilterDescription(
    changedFilters: TFilter,
    updatedFilter: TFilter,
    filterDescription: IFilterItem[],
    updateCallback?: Function
): IFilterItem[] {
    const newFilterDescription = callFilterChangedCallbackOnFilterDescription(
        filterDescription,
        updatedFilter,
        changedFilters
    );
    callVisibilityCallbackOnFilterDescription(newFilterDescription, updatedFilter, changedFilters);
    if (typeof updateCallback === 'function') {
        updateCallback(newFilterDescription);
    }
    return newFilterDescription;
}

function hasResetValue(items: IFilterItem[]) {
    let hasReset = false;
    factory(items).each((item) => {
        if (hasReset) {
            return;
        }
        hasReset = item.resetValue !== undefined;
    });
    return hasReset;
}

function getPrefetch(): typeof import('Controls-ListEnv/filterPrefetch').Prefetch {
    if (!isLoaded(PREFETCH_MODULE)) {
        Logger.error(
            `Controls/filter для работы кэширования необходимо загрузить модуль: ${PREFETCH_MODULE}`
        );
    }
    return loadSync<typeof import('Controls-ListEnv/filterPrefetch')>(PREFETCH_MODULE).Prefetch;
}

function prepareFilterWithPrefetch(
    filter: TFilter,
    prefetchParams: IPrefetchParams,
    prefetchSessionId?: string
): TFilter {
    return getPrefetch().prepareFilter(filter, prefetchParams, prefetchSessionId);
}

function resetFilterItem(item: IFilterItem): IFilterItem {
    const resetValue = item.resetValue;
    const textValue = item.textValue;
    const editorOptions = item.editorOptions;
    const viewMode = item.viewMode;
    const filterVisibilityCallback = item.filterVisibilityCallback;

    if (item.visibility !== undefined) {
        if (filterVisibilityCallback) {
            // visibility проставляется на элементе, если для него передан filterVisibilityCallback
            // сбросим его именно в undefined, как неопределённое состояние видимости
            // (в фильтре оно трактуется как фильтр виден)
            item.visibility = undefined;
        } else if (item.viewMode === 'extended' && !item.editorTemplateName) {
            item.visibility = false;
        }
    }
    if (item.hasOwnProperty('resetValue')) {
        item.value = resetValue;

        if ((editorOptions?.extendedCaption || item.extendedCaption) && viewMode === 'basic') {
            item.viewMode = 'extended';
        }
        if (textValue !== undefined) {
            item.textValue = textValue === null ? textValue : '';
        }
    }
    return item;
}

function resetFilterDescription(items: IFilterItem[], clone?: boolean): IFilterItem[] {
    const filterItems = clone ? object.clonePlain(items) : items;
    filterItems.forEach(resetFilterItem);
    return filterItems;
}

function getItemByName(filterDescription: IFilterItem[], name: string): IFilterItem {
    return filterDescription.find((item) => {
        return item.name === name;
    });
}

function applyFilterDescription(
    currentFilterDescription: IFilterItem[],
    newFilterDescription: IFilterItem[],
    currentFilter: TFilter
): IFilterItem[] {
    const resultDescription = object.clonePlain(currentFilterDescription);
    mergeFilterDescriptions(resultDescription, newFilterDescription);
    if (!isEqual(resultDescription, currentFilterDescription)) {
        const newFilter = FilterCalculator.getFilterByFilterDescription(
            currentFilter,
            resultDescription
        );
        const changedFilters = FilterCalculator.getChangedFilters(currentFilter, newFilter);
        if (!isEmpty(changedFilters)) {
            return callCallbacksOnFilterDescription(changedFilters, newFilter, resultDescription);
        } else {
            return resultDescription;
        }
    }
}

function setAppliedFrom(
    currentFilterDescription: IFilterItem[],
    newFilterDescription: IFilterItem[],
    appliedFrom?: string
): IFilterItem[] {
    newFilterDescription.forEach((newItem) => {
        const oldItem = getItemByName(currentFilterDescription, newItem.name);
        if (oldItem && !isEqual(newItem.value, oldItem.value)) {
            newItem.appliedFrom = !isEqual(newItem.value, newItem.resetValue)
                ? appliedFrom
                : undefined;
        }
    });
    return newFilterDescription;
}

function prepareFilterDescription(
    filterDescription: IFilterItem[] | Function,
    history?: IFilterItem[],
    filterFromUrl?: IFilterItem[]
): IFilterItem[] {
    let result;

    if (filterDescription) {
        if (typeof filterDescription === 'function') {
            result = filterDescription(history);
        } else if (filterFromUrl) {
            result = mergeFilterDescriptions(clone(filterDescription), filterFromUrl);
        } else if (history) {
            result = mergeFilterDescriptions(clone(filterDescription), history);
        } else {
            result = clone(filterDescription);
        }
    }

    return result;
}

function clone(filterDescription: IFilterItem[]): IFilterItem[] {
    return filterDescription.map((item) => {
        return { ...item };
    });
}

function getDatesByFilterItem(filterItem: IFilterItem): [Date, Date] {
    return getDates(filterItem);
}

const FILTER_PARAM = 'CalcCountBy';

function applyFilterCounter(
    countValue: unknown,
    fullFilterDescription: IFilterItem[],
    linkedNames?: string[],
    valueConverter?: string | Function
): IFilterItem[] {
    if (countValue !== undefined) {
        const filterDescription = object.clonePlain(fullFilterDescription, {
            processCloneable: false,
        });
        linkedNames?.forEach((linkedFilterName) => {
            const linkedItem = filterDescription.find(
                (item) => item.name === linkedFilterName
            ) as IFilterItem;
            linkedItem.editorOptions = { ...linkedItem.editorOptions };
            let countFilter;
            if (countValue === null && !valueConverter) {
                // Когда выбран другой фильтр по дате, фильтр нужно сбросить
                linkedItem.editorOptions.filter = { ...linkedItem.editorOptions.filter };
                delete linkedItem.editorOptions.filter[FILTER_PARAM];
            } else {
                let valueConverterCallback = valueConverter;
                if (typeof valueConverter === 'string') {
                    valueConverterCallback = loadSync(valueConverter);
                }
                if (valueConverterCallback) {
                    countFilter = valueConverterCallback(countValue, linkedItem, filterDescription);
                } else {
                    countFilter = {
                        [FILTER_PARAM]: countValue,
                    };
                }
                linkedItem.editorOptions.filter = {
                    ...linkedItem.editorOptions.filter,
                    ...countFilter,
                };
            }
        });
        return filterDescription;
    }
    return fullFilterDescription;
}

const DATE_RANGE_EDITORS = [
    'Controls/filterPanelEditors:DateRange',
    'Controls/filterPanelEditors:Date',
];

function isDateRangeFilterChanged(filterDescription: IFilterItem[]) {
    return !!filterDescription?.find(
        ({ value, resetValue, type, editorTemplateName }) =>
            (type === 'dateRange' ||
                type === 'date' ||
                DATE_RANGE_EDITORS.includes(editorTemplateName)) &&
            !isEqual(value, resetValue)
    );
}

export default {
    applyFilterDescriptionToURL,
    applyFilterDescription,
    isFilterItemChanged,
    getItemVisibility,
    getItemOnFilterChangedCallback,
    callCallbacksOnFilterDescription,
    callVisibilityCallbackOnFilterDescription,
    callFilterChangedCallbackOnFilterDescription,
    getQueryParamsByFilterDescription,
    getFilterFromURL,
    isFilterDescriptionChanged,
    applyFilterUserHistoryToDescription,
    mergeFilterDescriptions,
    resetFilterDescription,
    resetFilterItem,
    hasResetValue,
    updateFilterDescription,
    isEqualItems,
    getItemByName,
    initFilterDescription,
    setAppliedFrom,
    prepareFilterDescription,
    getDatesByFilterItem,
    clone,
    applyFilterCounter,
    isDateRangeFilterChanged,
    getPrefetch,
    prepareFilterWithPrefetch,
};
