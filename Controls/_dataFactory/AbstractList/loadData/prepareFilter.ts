import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';
import type { IFilterItem } from 'Controls/filter';
import type { TColumns, THeader } from 'Controls/baseGrid';
import type { TFilter } from 'Controls/interface';
import { getFilterModuleSync } from '../utils/getFilterModuleSync';
import { QUERY_PARAMS_LOAD_TIMEOUT } from './constants';
import { Logger } from 'UICommon/Utils';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

export interface IFilterResult {
    historyItems?: IFilterItem[];
    columns?: TColumns;
    header?: THeader;
    filterDescription: IFilterItem[];
    filter: TFilter;
}

interface IFilterHistoryLoaderResult {
    filterButtonSource: IFilterItem[];
    filter: TFilter;
    historyItems: IFilterItem[];
}

export function prepareFilterIfNeed(config: IListDataFactoryArguments) {
    return isNeedPrepareFilter(config) ? prepareFilter(config) : undefined;
}

export function isNeedPrepareFilter(loadDataConfig: IListDataFactoryArguments): boolean {
    return !!(
        loadDataConfig.filterDescription ||
        loadDataConfig.filterButtonSource ||
        loadDataConfig.searchParam
    );
}

function prepareFilter(config: IListDataFactoryArguments): Promise<IFilterResult> {
    const searchParam = config.searchParam;
    const resultConfig = { ...config };
    let needPrepareSearchFilter = false;
    let filterPromise: Promise<IFilterResult>;
    let searchValue = config.searchValue || '';

    if (config.filterHistoryLoader instanceof Function) {
        filterPromise = getFilterWithHistoryFromLoader(config);
    } else {
        if (isLoaded('Controls/filter')) {
            filterPromise = getFilterWithHistory(config);
        } else {
            filterPromise = loadAsync('Controls/filter').then(() => {
                return getFilterWithHistory(config);
            });
        }
    }

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

    if (needPrepareSearchFilter) {
        filterPromise = filterPromise.then((filterPromiseResult) => {
            return {
                ...filterPromiseResult,
                filter: prepareSearchFilter({ ...config, ...filterPromiseResult, searchValue }),
            };
        });
    }

    filterPromise.catch((error) => {
        Logger.error('DataLoader: ошибка при подготовке фильтра для запроса', this, error);
        return resultConfig;
    });

    return filterPromise;
}

function getFilterWithHistoryFromLoader(config: IListDataFactoryArguments): Promise<IFilterResult> {
    const historyLoader = config
        .filterHistoryLoader(config.filterButtonSource, config.historyId)
        .then((result: IFilterHistoryLoaderResult) => {
            const filter = result.filter || config.filter;
            const { FilterDescription, FilterHistory } = getFilterModuleSync();
            let filterDescription = FilterDescription.prepareFilterDescription(
                result.filterButtonSource || config.filterButtonSource
            );

            if (result.historyItems) {
                filterDescription = FilterHistory.applyFilterDescriptionFromHistory(
                    filterDescription,
                    filter,
                    result.historyItems
                );
            }

            return {
                ...result,
                filterDescription,
                filter: getFilterModuleSync().FilterCalculator.getFilterByFilterDescription(
                    filter,
                    filterDescription
                ),
            };
        });

    return wrapHistoryPromise(historyLoader);
}

function wrapHistoryPromise<T>(historyPromise: Promise<T>): Promise<T> {
    return wrapTimeout(historyPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
        Logger.info('Controls/dataSource:loadData: Данные фильтрации не загрузились за 1 секунду');
    });
}

function getFilterWithHistory(config: IListDataFactoryArguments): Promise<IFilterResult> {
    const { FilterHistory, FilterDescription, FilterCalculator, FilterLoader } =
        getFilterModuleSync();
    const filterDescriptionFromConfig = config.filterDescription || config.filterButtonSource;
    let filterDescription: IFilterItem[];
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
        historyPromise = Promise.resolve(filterDescription);
    } else if (config.historyId) {
        historyPromise = wrapHistoryPromise<IFilterItem[] | undefined>(
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
        // если история загрузится позже, она перетрет значения viewMode из конфигурации
        configurationPromise = historyPromise.then(() => {
            return FilterLoader.loadFilterConfiguration(config.propStorageId).then((userConfig) => {
                return (filterDescription = FilterDescription.applyFilterUserHistoryToDescription(
                    filterDescription,
                    userConfig
                ));
            });
        });
    }

    return Promise.all([historyPromise, configurationPromise, valueConverterPromise]).then(
        ([historyPromiseResult]) => {
            let historyItem;
            let filter = FilterCalculator.getFilterByFilterDescription(
                config.filter,
                filterDescription
            );

            if (config.prefetchSessionId && config.prefetchParams) {
                filter = FilterDescription.prepareFilterWithPrefetch(
                    filter,
                    config.prefetchParams,
                    config.prefetchSessionId
                );
            }

            if (config.historyId && historyPromiseResult) {
                historyItem = getFilterModuleSync().FilterHistory.findItemInHistory(
                    config.historyId,
                    historyPromiseResult,
                    config.prefetchParams
                );
            }

            return {
                ...historyItem?.data,
                historyItems: historyPromiseResult?.items || historyPromiseResult || [],
                filterDescription,
                filter,
            };
        }
    );
}

function prepareSearchFilter(config: IListDataFactoryArguments): TFilter {
    return loadSync<typeof import('Controls/search')>(
        'Controls/search'
    ).FilterResolver.getFilterForSearch(config, config.searchValue);
}
