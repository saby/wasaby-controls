/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { FilterDescription, type IFilterItem } from 'Controls/filter';
import {
    NewSourceController,
    IListSavedState,
    SORTING_USER_PARAM_POSTFIX,
} from 'Controls/dataSource';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UI/Deps';
import { IActionOptions } from 'Controls/actions';
import { Logger } from 'UICommon/Utils';
import { loadSavedConfig } from 'Controls/Application/SettingsController';
import {
    ISortingOptions,
    TSortingOptionValue,
    TFilter,
    IBaseSourceConfig,
} from 'Controls/interface';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { PrefetchProxy, CrudEntityKey, SbisService } from 'Types/source';
import { IRouter } from 'Router/router';
import { IListDataFactoryLoadResult } from './_interface/IListDataFactory';
import { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import { USER } from 'ParametersWebAPI/Scope';
import { URL } from 'Browser/Transport';
import { Serializer } from 'Types/serializer';
import type { TColumns } from 'Controls/grid';
import { loadAspects } from '../AbstractList/aspectsFactory';
import { query } from 'Application/Env';
import { RecordSet } from 'Types/collection';

const QUERY_PARAMS_LOAD_TIMEOUT = 5000;

interface IFilterHistoryLoaderResult {
    filterButtonSource: IFilterItem[];
    filter: TFilter;
    historyItems: IFilterItem[];
}

interface IFilterResult {
    historyItems?: IFilterItem[];
    columns?: TColumns;
    filterDescription: IFilterItem[];
    filter: TFilter;
}

interface ILoadParamsResult {
    sorting?: TSortingOptionValue;
    storedColumnsWidths?: string[];
}

export default function loadData(
    config: IListDataFactoryArguments,
    dependenciesResults: {},
    Router: IRouter,
    _clearResult?: boolean
): Promise<IListDataFactoryLoadResult> {
    const loadDataTimeout = config.loadDataTimeout;
    let paramsPromise;
    let filterPromise;
    let listSavedState: IListSavedState = {};
    let rootHistoryPromise;
    const newSliceEnvPromises = [loadAspects(true)];

    if (config.collectionType) {
        newSliceEnvPromises.push(
            loadAsync('Controls/marker'),
            loadAsync('Controls/multiselection')
        );
    }

    if (config.listConfigStoreId) {
        listSavedState = getListState(config) || {};
        Object.assign(config, listSavedState);

        const listState = getStateFromUrl(config.listConfigStoreId);
        if (listState) {
            Object.assign(config, {
                historyItems: listState.filterDescription,
                root: listState.root,
                expandedItems: listState.expandedItems,
            });
            cleanUrl(Router);
        }
    }

    if (isNeedPrepareFilter(config)) {
        filterPromise = prepareFilter(config);
    }

    if (config.propStorageId) {
        paramsPromise = loadParams(config.propStorageId);
    }

    if (config.rootHistoryId && config.parentProperty) {
        rootHistoryPromise = RootHistoryUtils.restore(config.rootHistoryId);
    }

    let listActionsPromise;
    if (config.listActions && typeof config.listActions === 'string') {
        listActionsPromise = loadListActions(config.listActions);
    }
    const operationsPromise = getOperationsController(config);

    return Promise.all([
        filterPromise,
        paramsPromise,
        operationsPromise,
        listActionsPromise,
        rootHistoryPromise,
        Promise.all(newSliceEnvPromises).then(() => void 0),
    ]).then(
        ([filterPromiseResult, paramsPromiseResult, operationsController, , rootFromHistory]: [
            IFilterResult,
            ISortingOptions,
            any,
            void,
            CrudEntityKey,
            void
        ]) => {
            const sorting = paramsPromiseResult?.sorting || config.sorting;
            const root = rootFromHistory !== undefined ? rootFromHistory : config.root;
            const storedColumnsWidths =
                paramsPromiseResult?.storedColumnsWidths || config.storedColumnsWidths;
            let loadFilterDataPromise;
            const filterDescription =
                filterPromiseResult?.filterDescription ||
                config.filterDescription ||
                config.filterButtonSource;
            const sourceController = getSourceController({
                ...config,
                root,
                sorting,
                filter: filterPromiseResult?.filter || config.filter,
                loadTimeout: loadDataTimeout,
            });
            const loadDataPromise = _loadData(
                config,
                sourceController,
                filterDescription,
                _clearResult || config.clearResult,
                filterPromiseResult?.historyItems,
                listSavedState.navigationSourceConfig
            );
            let loadFilterCallbacksPromise;
            let loadFilterEditorsPromise;
            let loadFilterPanelExtendedItemsPromise;
            let loadFilterDataAndCallbacksPromise;
            if (filterDescription) {
                if (
                    !!config.filterDescription &&
                    getFilterModule().FilterLoader.isNeedLoadFilterDescriptionData(
                        filterDescription
                    )
                ) {
                    loadFilterDataPromise =
                        getFilterModule().FilterLoader.loadFilterDescriptionData(
                            filterDescription,
                            config.editorsViewMode,
                            loadDataTimeout
                        );

                    if (
                        filterDescription.find((filter) => filter.viewMode === 'extended') &&
                        !isLoaded('Controls/filterPanelExtendedItems')
                    ) {
                        loadFilterPanelExtendedItemsPromise = getFilterPanelExtendedItems();
                    }
                }

                loadFilterCallbacksPromise = loadFilterCallbacks(filterDescription);
                loadFilterEditorsPromise = loadFilterEditors(
                    filterDescription,
                    config.editorsViewMode,
                    config.searchParam
                );

                if (filterDescription.find((filter) => !!filter.filterVisibilityCallback)) {
                    loadFilterDataAndCallbacksPromise = Promise.all([
                        loadFilterDataPromise,
                        loadFilterCallbacksPromise,
                    ]).then(([loadedFilterDescription]) => {
                        getFilterModule().FilterDescription.callVisibilityCallbackOnFilterDescription(
                            loadedFilterDescription || filterDescription,
                            config.filter
                        );
                    });
                }
            }
            const loadPromises = [loadDataPromise];
            if (loadFilterDataAndCallbacksPromise) {
                loadPromises.push(loadFilterDataAndCallbacksPromise);
            }
            if (loadFilterDataPromise) {
                loadPromises.push(loadFilterDataPromise);
            }
            if (loadFilterCallbacksPromise) {
                loadPromises.push(loadFilterCallbacksPromise);
            }
            if (loadFilterEditorsPromise) {
                loadPromises.push(loadFilterEditorsPromise);
            }

            if (loadFilterPanelExtendedItemsPromise) {
                loadPromises.push(loadFilterPanelExtendedItemsPromise);
            }
            return Promise.all(loadPromises).then(([dataResult]) => {
                return {
                    ...dataResult,
                    storedColumnsWidths,
                    operationsController,
                    historyItems: filterPromiseResult?.historyItems,
                    columns: filterPromiseResult?.columns || dataResult.columns,
                };
            });
        }
    );
}

function loadListActions(listActionsModule: string): Promise<unknown> {
    return loadAsync(listActionsModule).then((listActions: IActionOptions[]) => {
        addPageDeps([listActionsModule]);
        if (listActions) {
            const modules = [];
            const modulesLoading = [];
            listActions.forEach((actionCfg) => {
                if (actionCfg.actionName) {
                    modules.push(actionCfg.actionName);
                    modulesLoading.push(loadAsync(actionCfg.actionName));
                }
            });
            if (modulesLoading.length) {
                return Promise.all(modulesLoading).then(() => {
                    addPageDeps(modules);
                });
            }
        }
    });
}

function loadParams(propStorageId): Promise<ILoadParamsResult> {
    const sortingUserParamId = propStorageId + SORTING_USER_PARAM_POSTFIX;
    let paramsPromise = Promise.all([
        loadSavedConfig(propStorageId, ['storedColumnsWidths']),
        USER.load([sortingUserParamId]),
    ]).then(([{ storedColumnsWidths }, userParams]) => {
        const sortingSavedInUserParams = userParams.get(sortingUserParamId);
        let sorting;

        if (sortingSavedInUserParams) {
            sorting = JSON.parse(sortingSavedInUserParams);
        }

        return {
            sorting,
            storedColumnsWidths,
        };
    });
    paramsPromise = wrapTimeout(paramsPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
        Logger.info('Controls/dataSource:loadData: Параметры не загрузились за 1 секунду');
    });

    return paramsPromise;
}

function _loadData(
    config: IListDataFactoryArguments,
    sourceController: NewSourceController,
    filterDescription: IFilterItem[],
    _clearResult: boolean = false,
    historyItems?: IFilterItem[],
    navigationSourceConfig?: IBaseSourceConfig
): Promise<IListDataFactoryLoadResult> {
    return new Promise((resolve) => {
        if (config.source) {
            sourceController
                .reload(navigationSourceConfig, true)
                .catch((error) => {
                    return error;
                })
                .finally(() => {
                    resolve(
                        getLoadResult(config, sourceController, filterDescription, _clearResult)
                    );
                });
        } else {
            resolve(getLoadResult(config, sourceController, filterDescription));
        }
    }).then((result: IListDataFactoryLoadResult) => {
        if (!result.source && historyItems) {
            result.sourceController.setFilter(result.filter);
        }
        return result;
    });
}

export function isNeedPrepareFilter(loadDataConfig: IListDataFactoryArguments): boolean {
    return !!(
        loadDataConfig.filterDescription ||
        loadDataConfig.filterButtonSource ||
        (loadDataConfig.searchValue && loadDataConfig.searchParam)
    );
}

function getFilterWithHistoryFromLoader(config: IListDataFactoryArguments): Promise<IFilterResult> {
    const historyLoader = config
        .filterHistoryLoader(config.filterButtonSource, config.historyId)
        .then((result: IFilterHistoryLoaderResult) => {
            const filter = result.filter || config.filter;
            const { FilterDescription, FilterHistory } = getFilterModule();
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
                filter: getFilterModule().FilterCalculator.getFilterByFilterDescription(
                    filter,
                    filterDescription
                ),
            };
        });

    return wrapHistoryPromise(historyLoader);
}

function getFilterModule(): typeof import('Controls/filter') {
    return loadSync<typeof import('Controls/filter')>('Controls/filter');
}

function getFilterPanelExtendedItems(): Promise<
    typeof import('Controls/filterPanelExtendedItems')
> {
    return loadAsync<typeof import('Controls/filterPanelExtendedItems')>(
        'Controls/filterPanelExtendedItems'
    );
}

function prepareSearchFilter(config: IListDataFactoryArguments): TFilter {
    return loadSync<typeof import('Controls/search')>(
        'Controls/search'
    ).FilterResolver.getFilterForSearch(config, config.searchValue);
}

function loadFilterCallbacks(filterDescription: IFilterItem[]): Promise<Function[]> | void {
    // нужно всегда добавлять callback'и в зависимость страницы, даже если они все загружены
    // потому что на СП они будут в кэше, а на клиенте их уже не будет
    return getFilterModule().loadCallbacks(filterDescription);
}

function loadFilterEditors(
    filterDescription: IFilterItem[],
    editorsViewMode?: string,
    searchParam?: string
): Promise<Function> | void {
    return getFilterModule().loadEditorTemplateName(
        filterDescription,
        editorsViewMode,
        searchParam
    );
}

function wrapHistoryPromise<T>(historyPromise: Promise<T>): Promise<T> {
    return wrapTimeout(historyPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
        Logger.info('Controls/dataSource:loadData: Данные фильтрации не загрузились за 1 секунду');
    });
}

function getFilterWithHistory(config: IListDataFactoryArguments): Promise<IFilterResult> {
    const { FilterHistory, FilterDescription, FilterCalculator, FilterLoader } = getFilterModule();
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
        if (filterDescription && FilterDescription.isFilterDescriptionChanged(filterDescription)) {
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

            if (config.historyId && historyPromiseResult) {
                historyItem = getFilterModule().FilterHistory.findItemInHistory(
                    config.historyId,
                    historyPromiseResult,
                    config.prefetchParams
                );
            }

            return {
                historyItems: historyPromiseResult?.items || historyPromiseResult || [],
                columns: historyItem?.data?.columns,
                filterDescription,
                filter: FilterCalculator.getFilterByFilterDescription(
                    config.filter,
                    filterDescription
                ),
            };
        }
    );
}

function getOperationsController(config: IListDataFactoryArguments): Promise<OperationsController> {
    return config.operationsController && config.task1186833531
        ? Promise.resolve(config.operationsController)
        : loadAsync('Controls/operations').then((operations) => {
              return new operations.ControllerClass({});
          });
}

function getListState(config: IListDataFactoryArguments): IListSavedState | void {
    const dataSourceLib = loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
    return dataSourceLib.getControllerState(config.listConfigStoreId);
}

function cleanUrl(Router): void {
    const state = Router.maskResolver.calculateQueryHref({ ...query.get, listParams: undefined });

    Router.history.replaceState({
        state,
    });
}

function getStateFromUrl(id: string) {
    const urlFilter = URL.getQueryParam('listParams');
    if (urlFilter) {
        const applicationSerializer = new Serializer();
        let urlConfig;
        try {
            urlConfig = JSON.parse(
                decodeURIComponent(urlFilter),
                applicationSerializer.deserialize
            );
            return urlConfig?.[id];
        } catch (error) {
            Logger.warn('В url передан невалидный параметр listParams, он не будет применен');
            return null;
        }
    }
}

function getLoadResult(
    config: IListDataFactoryArguments,
    sourceController: NewSourceController,
    filterDescription: IFilterItem[],
    _clearResult: boolean = false
): IListDataFactoryLoadResult {
    const items = sourceController.getItems();
    //TODO Нужно в 2100 вернуть и добавить проверку только если поля есть в формате
    /*
    const errorModule = 'Controls/dataFactory:List::loadData';
    const buildDataEnvError = (loadingSource: SbisService) => {
        return `Списочный метод: ${loadingSource.getBinding().query}
                Endpoint: ${loadingSource.getEndpoint()}
                Фильтр: ${config.filter}`;
    };

    if (
        items instanceof RecordSet &&
        config.parentProperty &&
        config.source instanceof SbisService &&
        items.getKeyProperty()
    ) {
        const itemsFormat = items.getFormat();
        const keyProperty =
            items.getKeyProperty() || config.keyProperty || config.source.getKeyProperty();

        const parentPropertyIndex = itemsFormat.getFieldIndex(config.parentProperty);
        const keyPropertyIndex = itemsFormat.getFieldIndex(keyProperty);

        if (parentPropertyIndex === -1) {
            Logger.error(
                `${errorModule}::Указан parentProperty ${
                    config.parentProperty
                } которого нет в формате рекордсета. ${buildDataEnvError(config.source)}`
            );
        } else if (keyPropertyIndex === -1) {
            Logger.error(
                `${errorModule}::Не найден keyProperty ${keyProperty} в формате рекордсета . ${buildDataEnvError(
                    config.source
                )}`
            );
        } else {
            const parentPropertyFormat = itemsFormat.at(parentPropertyIndex);
            const keyPropertyFormat = itemsFormat.at(keyPropertyIndex);

            if (parentPropertyFormat.getType() !== keyPropertyFormat.getType()) {
                Logger.error(
                    `${errorModule}::Не совпадает тип поля keyProperty ${keyProperty} и parentProperty ${
                        config.parentProperty
                    } в формате рекордсета . ${buildDataEnvError(config.source)}`
                );
            }
        }
    }*/

    let loadResult = {
        type: 'list',
        sourceController,
        source: config.source
            ? new PrefetchProxy({
                  target: config.source,
                  data: {
                      query: sourceController.getLoadError() || sourceController.getItems(),
                  },
              })
            : undefined,
        data: items,
        items,
        error: sourceController.getLoadError(),
        filter: sourceController.getFilter(),
        sorting: sourceController.getSorting() as TSortingOptionValue,
        collapsedGroups: sourceController.getCollapsedGroups(),
    };

    if (!_clearResult) {
        loadResult = { ...config, ...loadResult };
    }

    if (config.nodeHistoryId && config.parentProperty) {
        loadResult.expandedItems = sourceController.getExpandedItems();
    }
    if (config.rootHistoryId && config.parentProperty) {
        loadResult.root = sourceController.getRoot();
    }
    if (config.filterDescription) {
        loadResult.filterDescription = filterDescription;
        // TODO BROWSER! filterButtonSource опция для совместимости с Browser'ом
    } else if (config.filterButtonSource) {
        loadResult.filterButtonSource = filterDescription;
    }
    return loadResult;
}

function prepareFilter(config: IListDataFactoryArguments): Promise<IFilterResult> {
    const searchParam = config.searchParam;
    const needPrepareSearchFilter =
        searchParam && config.searchValue && searchParam.length >= (config.minSearchLength || 3);
    const resultConfig = { ...config };
    let filterPromise: Promise<IFilterResult>;

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

    if (needPrepareSearchFilter) {
        const searchPromise = isLoaded('Controls/search')
            ? Promise.resolve()
            : loadAsync('Controls/search');
        filterPromise = Promise.all([filterPromise, searchPromise]).then(
            ([filterPromiseResult]) => {
                return {
                    ...filterPromiseResult,
                    filter: prepareSearchFilter({ ...config, ...filterPromiseResult }),
                };
            }
        );
    }

    filterPromise.catch((error) => {
        Logger.error('DataLoader: ошибка при подготовке фильтра для запроса', this, error);
        return resultConfig;
    });

    return filterPromise;
}

export function getSourceController(options: IListDataFactoryArguments): NewSourceController {
    let sourceController;

    if (options.sourceController) {
        sourceController = options.sourceController;
        sourceController.updateOptions(options);
    } else {
        const controllerClass =
            loadSync<typeof import('Controls/dataSource')>(
                'Controls/dataSource'
            ).NewSourceController;
        sourceController = new controllerClass(options);
    }

    return sourceController;
}
