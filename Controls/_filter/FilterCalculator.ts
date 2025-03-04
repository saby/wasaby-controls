/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { loadSync, isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import { getDates } from 'Controls/_filter/DateUtils';
import { logger as Logger } from 'Application/Env';
import { wrapTimeout } from 'Types/promise';
import { getStateFromUrl, getControllerState } from 'Controls/dataSource';

import type { CrudEntityKey } from 'Types/source';
import { IFilterDescriptionItem, ValidateShape } from 'Controls-DataEnv/interface';
import type IFilterSourceItemOld from 'Controls/_filter/interface/IFilterSourceItemOld';
import type { IFilterHistoryOptions } from 'Controls/_filter/interface/IFilterHistory';
import type {
    ISearchOptions,
    IFilterOptions,
    TFilter,
    TKey,
    IExpandedItemsOptions,
} from 'Controls/interface';
import type { IPrefetchOptions } from 'Controls/_filter/interface/IPrefetch';
import type { IFilterHistoryData } from 'Controls/_filter/FilterHistory';

export const DESCRIPTION_CONVERTER_DELETE_VALUE: symbol = Symbol('DescriptionConverterDelete');

function needAddValueToFilter({
    viewMode,
    value,
    visibility,
    descriptionToValueConverter,
}: IFilterDescriptionItem & { visibility?: boolean }): boolean {
    return !!(
        value !== undefined &&
        (visibility === undefined ||
            visibility ||
            viewMode === 'frequent' ||
            descriptionToValueConverter)
    );
}

function addValueToFilter(
    item: IFilterDescriptionItem,
    filter: Record<string, unknown>,
    filterDescription: IFilterDescriptionItem[]
): void {
    let valueConverter;

    if (
        typeof item.descriptionToValueConverter === 'string' &&
        isLoaded(item.descriptionToValueConverter)
    ) {
        valueConverter = loadSync<() => object | void | false>(item.descriptionToValueConverter);
    } else {
        valueConverter = item.descriptionToValueConverter as Function;
    }

    if (valueConverter) {
        const value = valueConverter(item, filterDescription);

        if (value === DESCRIPTION_CONVERTER_DELETE_VALUE) {
            delete filter[item.name];
        } else {
            Object.assign(filter, value);
        }
    } else if (
        item.editorTemplateName === 'Controls/filterPanelEditors:DateMenu' &&
        !item.editorOptions?.dateMenuItems &&
        !item.editorOptions?.items
    ) {
        filter[item.name] = getDatesByFilterItem(item);
    } else {
        filter[item.name] = item.value;
    }
}

function getDatesByFilterItem(filterItem: IFilterDescriptionItem): [Date, Date] | null {
    return getDates(filterItem);
}

/**
 * Получить фильтр по структуре
 * @param {Controls/interface:TFilter} filter
 * @param {Array<Controls/filter:IFilterItem>} filterDescription
 * @returns Object
 * @example
 * <pre>
 *     import {getFilterByFilterDescription} from 'Controls/filter';
 *
 *     const filterDescription = [{
 *        name: '',
 *        value: ['Gerasimov A.M.'],
 *        resetValue: []
 *     }];
 *
 *     const filter = getFilterByFilterDescription({}, filterDescription);
 *     ...
 * </pre>
 */
function getFilterByFilterDescription(
    filter: object = {},
    filterDescription: IFilterDescriptionItem[] = []
): TFilter {
    const resultFilter: Record<string, unknown> = { ...filter };

    filterDescription.forEach((item) => {
        const filterName = item.name;

        if (needAddValueToFilter(item)) {
            addValueToFilter(item, resultFilter, filterDescription);
        } else {
            delete resultFilter[filterName];
        }
    });

    return resultFilter;
}

function getChangedFilters(
    currentFilter: Record<string, unknown>,
    updatedFilter: Record<string, unknown>
): TFilter {
    const changedFilters: Record<string, unknown> = {};
    // changed
    for (const filterName in currentFilter) {
        if (currentFilter.hasOwnProperty(filterName)) {
            if (!isEqual(currentFilter[filterName], updatedFilter[filterName])) {
                changedFilters[filterName] = updatedFilter[filterName];
            }
        }
    }
    // added
    for (const filterName in updatedFilter) {
        if (updatedFilter.hasOwnProperty(filterName) && !currentFilter.hasOwnProperty(filterName)) {
            changedFilters[filterName] = updatedFilter[filterName];
        }
    }
    return changedFilters;
}

export interface IPrepareFilterConfig
    extends Omit<ISearchOptions, 'searchDelay'>,
        Pick<IFilterOptions, 'filter'>,
        IFilterHistoryOptions,
        IPrefetchOptions,
        IExpandedItemsOptions {
    filterDescription?: IFilterDescriptionItem[];
    /**
     * @deprecated Используйте filterDescription
     */
    filterButtonSource?: IFilterSourceItemOld[];
    saveToUrl?: boolean;
    propStorageId?: string;
    root?: TKey;
    /**
     * @deprecated Устарело. Не использовать.
     */
    historySaveMode?: string;
    listConfigStoreId?: string;
}

interface IFilterResult extends Omit<IFilterHistoryData, 'items'> {
    historyItems?: IFilterDescriptionItem[];
    filterDescription?: IFilterDescriptionItem[];
    filter: TFilter;
}

function prepareFilter(
    config: IPrepareFilterConfig,
    fabricId?: string
): Promise<IFilterResult | undefined> {
    const searchParam = config.searchParam;
    const resultConfig = { ...config };
    const id = config.listConfigStoreId || fabricId;
    let needPrepareSearchFilter = false;
    let filterPromise;
    let searchValue = config.searchValue || (id && getControllerState(id)?.searchValue) || '';

    if (id) {
        const listState = getStateFromUrl(id);
        if (listState?.historyItems) {
            config.historyItems = listState.historyItems;
        }
    }

    filterPromise = getFilterWithHistory(config);

    if (searchParam) {
        if (config.searchValueTrim) {
            searchValue = searchValue.trim();
        }
        needPrepareSearchFilter = Boolean(
            searchValue && searchValue.length >= (config.minSearchLength || 3)
        );

        if (!isLoaded('Controls/search')) {
            filterPromise = Promise.all([filterPromise, loadAsync('Controls/search')]).then(
                ([filterPromiseResult]) => filterPromiseResult
            );
        }
    }

    if (needPrepareSearchFilter && searchValue && typeof searchParam === 'string') {
        filterPromise = filterPromise.then((filterResult) => {
            return {
                ...filterResult,
                filter: prepareSearchFilter({
                    ...config,
                    ...filterResult,
                    searchParam,
                    searchValue,
                }),
                filterDescription: filterResult?.filterDescription ?? [],
            };
        });
    }

    filterPromise.catch((error) => {
        Logger.error(
            'Controls/filter/FilterDescription:prepareFilter - ошибка при подготовке фильтра для запроса',
            error
        );
        return resultConfig;
    });

    return filterPromise;
}

function wrapHistoryPromise<T>(historyPromise: Promise<T>): Promise<T> {
    const QUERY_PARAMS_LOAD_TIMEOUT = 5000;
    return wrapTimeout(historyPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
        Logger.info(
            'Controls/filter/FilterDescription:prepareFilter - Данные фильтрации не загрузились за 1 секунду'
        );
    }) as Promise<T>;
}

async function getFilterWithHistory(config: IPrepareFilterConfig): Promise<IFilterResult> {
    const { FilterDescription, FilterHistory, FilterLoader } =
        loadSync<typeof import('Controls/filter')>('Controls/filter');
    const filterDescriptionFromConfig = config.filterDescription ?? [];
    let filterDescription: IFilterDescriptionItem[];
    let historyPromise;
    let configurationPromise;

    filterDescription = FilterDescription.prepareFilterDescription(filterDescriptionFromConfig, []);
    const filterFromUrl = FilterDescription.getFilterFromURL(filterDescription, config.saveToUrl);

    if (filterFromUrl) {
        filterDescription = FilterDescription.mergeFilterDescriptions(
            filterDescription,
            filterFromUrl
        );
        historyPromise = Promise.resolve(null);
    } else if (config.historyItems) {
        filterDescription = FilterHistory.applyFilterDescriptionFromHistory(
            filterDescriptionFromConfig,
            config.filter,
            config.historyItems
        );
        historyPromise = Promise.resolve(
            loadAsync('Controls/HistoryStore').then(() => filterDescription)
        );
    } else if (config.historyId) {
        historyPromise = wrapHistoryPromise<IFilterDescriptionItem[] | undefined>(
            FilterHistory.getHistoryItems(
                config.historyId,
                filterDescriptionFromConfig,
                config.historySaveMode,
                config.prefetchParams
            ).then((historyData) => {
                return (filterDescription = FilterHistory.applyFilterDescriptionFromHistory(
                    filterDescriptionFromConfig,
                    config.filter,
                    historyData
                ));
            })
        );
    } else {
        historyPromise = Promise.resolve(null);
    }

    const valueConverterPromise = historyPromise.then(() => {
        if (filterDescription) {
            return FilterLoader.loadCallbacksByName(
                filterDescription,
                'descriptionToValueConverter'
            );
        }
    });

    if (config.propStorageId) {
        const propStorageId = config.propStorageId;
        // если история загрузится позже, она перетрет значения viewMode из конфигурации
        configurationPromise = historyPromise.then(() => {
            return FilterLoader.loadFilterConfiguration(propStorageId).then((userConfig) => {
                return (filterDescription = FilterDescription.applyFilterUserHistoryToDescription(
                    filterDescription,
                    userConfig
                ));
            });
        });
    }

    const [historyPromiseResult] = await Promise.all([
        historyPromise,
        configurationPromise,
        valueConverterPromise,
    ]);

    let historyItem;
    let filter = getFilterByFilterDescription(config.filter, filterDescription);

    if (config.prefetchSessionId && config.prefetchParams) {
        filter = FilterDescription.prepareFilterWithPrefetch(
            filter,
            config.prefetchParams,
            config.prefetchSessionId
        );
    }

    if (config.historyId && historyPromiseResult) {
        historyItem = FilterHistory.findItemInHistory(config.historyId, historyPromiseResult);
    }

    const historyResult = {
        historyItems: historyPromiseResult || [],
        filterDescription,
        filter,
    };
    let result;

    if (historyItem && isIFilterHistoryData(historyItem.data)) {
        result = getResult({
            ...getHistoryDataWithoutItems(historyItem.data),
            ...historyResult,
        });
    } else {
        result = historyResult;
    }

    return result;
}

const getResult = <T>(result: ValidateShape<T, IFilterResult>): IFilterResult => result;

function isIFilterHistoryData(
    historyData: IFilterHistoryData | IFilterDescriptionItem[]
): historyData is IFilterHistoryData {
    return Array.isArray(historyData);
}

function getHistoryDataWithoutItems(
    historyData: IFilterHistoryData
): Omit<IFilterHistoryData, 'items'> {
    const result: Omit<IFilterHistoryData, 'items'> & Partial<Pick<IFilterHistoryData, 'items'>> = {
        ...historyData,
    };
    delete result.items;
    return result;
}

function prepareSearchFilter(
    config: Omit<IPrepareFilterConfig, 'prefetchParams'> &
        Required<Pick<IPrepareFilterConfig, 'filter' | 'searchParam' | 'searchValue'>>
): TFilter {
    const { filter, searchParam, root, expandedItems } = config;

    return loadSync<typeof import('Controls/search')>(
        'Controls/search'
    ).FilterResolver.getFilterForSearch(
        {
            ...config,
            filter,
            searchParam,
            root: root as CrudEntityKey,
            expandedItems: expandedItems as CrudEntityKey[],
        },
        config.searchValue
    );
}

export default {
    getFilterByFilterDescription,
    getChangedFilters,
    getDatesByFilterItem,
    DESCRIPTION_CONVERTER_DELETE_VALUE,
    prepareFilter,
};
