/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    ControllerClass as FilterController,
    IFilterControllerOptions,
    IFilterItem,
} from 'Controls/filter';
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
import { PrefetchProxy, CrudEntityKey } from 'Types/source';
import { IRouter } from 'Router/router';
import { IListDataFactoryLoadResult } from './_interface/IListDataFactory';
import { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import { USER } from 'ParametersWebAPI/Scope';

const QUERY_PARAMS_LOAD_TIMEOUT = 5000;

interface IFilterHistoryLoaderResult {
    filterButtonSource: IFilterItem[];
    filter: TFilter;
    historyItems: IFilterItem[];
}

interface IFilterResult {
    historyItems: IFilterItem[];
    controller: FilterController;
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
    let filterController: FilterController;
    let filterHistoryItems;
    let paramsPromise;
    let filterPromise;
    let listSavedState: IListSavedState = {};
    let rootHistoryPromise;

    if (config.listConfigStoreId) {
        listSavedState = getListState(config) || {};
        Object.assign(config, listSavedState);
    }

    if (isNeedPrepareFilter(config)) {
        if (config.filterHistoryLoader instanceof Function) {
            filterPromise = getFilterControllerWithHistoryFromLoader(config);
        } else {
            if (isLoaded('Controls/filter')) {
                filterPromise = getFilterControllerWithFilterHistory(config);
            } else {
                filterPromise = loadAsync('Controls/filter').then(() => {
                    return getFilterControllerWithFilterHistory(config);
                });
            }
        }

        filterPromise
            .then(({ controller, historyItems }) => {
                filterController = config.filterController = controller;
                filterHistoryItems = historyItems;
            })
            .catch((error) => {
                filterController = getFilterController(config as IFilterControllerOptions);
                Logger.error('DataLoader: ошибка при подготовке фильтра для запроса', this, error);
            });
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
    ]).then(
        ([, paramsPromiseResult, operationsController, , rootFromHistory]: [
            TFilter,
            ISortingOptions,
            any,
            void,
            CrudEntityKey
        ]) => {
            const sorting = paramsPromiseResult?.sorting || config.sorting;
            const root = rootFromHistory !== undefined ? rootFromHistory : config.root;
            const storedColumnsWidths =
                paramsPromiseResult?.storedColumnsWidths || config.storedColumnsWidths;
            let loadFilterDataPromise;
            const sourceController = getSourceController({
                ...config,
                root,
                sorting,
                filter: filterController ? filterController.getFilter() : config.filter,
                loadTimeout: loadDataTimeout,
            });
            const loadDataPromise = _loadData(
                config,
                sourceController,
                filterController,
                filterHistoryItems,
                operationsController,
                _clearResult || config.clearResult,
                listSavedState.navigationSourceConfig
            );
            const filterDescription = filterController?.getFilterButtonItems();
            let loadCallbacksPromise;

            if (filterDescription) {
                if (
                    !!config.filterDescription &&
                    getFilterModule().FilterLoader.isNeedLoadFilterDescriptionData(
                        filterDescription
                    )
                ) {
                    loadFilterDataPromise = getFilterModule()
                        .FilterLoader.loadFilterDescriptionData(
                            filterDescription,
                            config.editorsViewMode,
                            loadDataTimeout
                        )
                        .then(() => {
                            filterController.applyFilterDescriptionFromHistory(filterDescription);
                        });
                }

                loadCallbacksPromise = loadFilterCallbacks(filterDescription);
            }
            const loadPromises = [loadDataPromise];
            if (loadFilterDataPromise) {
                loadPromises.push(loadFilterDataPromise);
            }
            if (loadCallbacksPromise) {
                loadPromises.push(loadCallbacksPromise);
            }
            return Promise.all(loadPromises).then(([dataResult]) => {
                return {
                    ...dataResult,
                    storedColumnsWidths,
                    type: 'list',
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
    // loadSavedConfig(sorting) - для совместимости, удаляю в 23.7000
    const sortingUserParamId = propStorageId + SORTING_USER_PARAM_POSTFIX;
    let paramsPromise = Promise.all([
        loadSavedConfig(propStorageId, ['sorting', 'storedColumnsWidths']),
        USER.load([sortingUserParamId]),
    ]).then(([{ sorting, storedColumnsWidths }, userParams]) => {
        const sortingSavedInUserParams = userParams.get(sortingUserParamId);
        let resultSorting;

        if (sortingSavedInUserParams) {
            resultSorting = JSON.parse(sortingSavedInUserParams);
        } else {
            if (sorting) {
                USER.set(sortingUserParamId, JSON.stringify(sorting));
            }
            resultSorting = sorting;
        }

        return {
            sorting: resultSorting,
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
    filterController: FilterController,
    historyItems: IFilterItem[],
    operationsController: OperationsController,
    _clearResult: boolean = false,
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
                        getLoadResult(
                            config,
                            sourceController,
                            filterController,
                            historyItems,
                            operationsController,
                            _clearResult
                        )
                    );
                });
        } else {
            resolve(
                getLoadResult(
                    config,
                    sourceController,
                    filterController,
                    historyItems,
                    operationsController
                )
            );
        }
    }).then((result: IListDataFactoryLoadResult) => {
        const filterController = result.filterController;
        const loadedData = result.data;

        if (!result.source && result.historyItems) {
            result.sourceController.setFilter(result.filter);
        }
        if (loadedData && filterController) {
            filterController.handleDataLoad(loadedData);

            // ссессия кэша известна только после загрузки данных
            // поэтому и ссессия кэша в фильтр попадает после загрузки
            if (config.prefetchParams) {
                result.sourceController.setFilter(filterController.getFilter());
            }
        }
        return result;
    });
}

function isNeedPrepareFilter(loadDataConfig: IListDataFactoryArguments): boolean {
    return !!(
        loadDataConfig.filterDescription ||
        loadDataConfig.filterButtonSource ||
        loadDataConfig.searchValue
    );
}

function getFilterControllerWithHistoryFromLoader(
    config: IListDataFactoryArguments
): Promise<IFilterResult> {
    const historyLoader = config
        .filterHistoryLoader(config.filterButtonSource, config.historyId)
        .then((result: IFilterHistoryLoaderResult) => {
            const controller = getFilterController({
                ...config,
                ...result,
            } as IFilterControllerOptions);

            if (result.historyItems) {
                controller.applyFilterDescriptionFromHistory(result.historyItems);
            }
            return {
                controller,
                ...result,
            };
        });

    return wrapHistoryPromise(historyLoader);
}

function getFilterModule(): typeof import('Controls/filter') {
    return loadSync<typeof import('Controls/filter')>('Controls/filter');
}

function loadFilterCallbacks(filterDescription: IFilterItem[]): Promise<Function[]> {
    return getFilterModule().loadCallbacks(filterDescription);
}

function isFilterCallbacksLoaded(filterDescription: IFilterItem[]): boolean {
    return getFilterModule().isCallbacksLoaded(filterDescription);
}

function wrapHistoryPromise(historyPromise: Promise<IFilterResult>): Promise<IFilterResult> {
    return wrapTimeout(historyPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
        Logger.info('Controls/dataSource:loadData: Данные фильтрации не загрузились за 1 секунду');
    });
}

function getFilterControllerWithFilterHistory(
    config: IListDataFactoryArguments
): Promise<IFilterResult> {
    const controller = getFilterController(config as IFilterControllerOptions);
    let historyPromise;
    let configurationPromise;

    if (config.historyId || config.historyItems) {
        if (isFilterCallbacksLoaded(controller.getFilterButtonItems())) {
            historyPromise = config.historyItems || controller.loadFilterItemsFromHistory();
        } else {
            historyPromise = loadFilterCallbacks(controller.getFilterButtonItems()).then(() => {
                return config.historyItems || controller.loadFilterItemsFromHistory();
            });
        }

        if (historyPromise instanceof Promise) {
            historyPromise = wrapHistoryPromise(historyPromise);
        }
    }

    if (config.propStorageId) {
        // если история загрузится позже, она перетрет значения viewMode из конфигурации
        if (historyPromise instanceof Promise) {
            configurationPromise = historyPromise.then(() => {
                return controller.loadFilterConfiguration(config.propStorageId);
            });
        } else {
            configurationPromise = controller.loadFilterConfiguration(config.propStorageId);
        }
    }

    return Promise.all([historyPromise, configurationPromise]).then(([historyPromiseResult]) => {
        if (config.historyItems && historyPromiseResult) {
            controller.applyFilterDescriptionFromHistory(historyPromiseResult);
        }
        // TODO удалить после полного перехода на фильтрацию через слайсы
        // сейчас требуется, чтобы структура фильтра в опциях контроллера совпадала со структурой,
        // которая передаётся в опции Browser'a, иначе при синхронизации может портиться структура в контроллере
        if (typeof config.filterButtonSource !== 'function' && config.task1186685666) {
            controller.update({
                ...config,
                filterButtonSource: controller.getFilterButtonItems(),
            } as IFilterControllerOptions);
        }
        return {
            controller,
            historyItems: historyPromiseResult
                ? historyPromiseResult.items || historyPromiseResult
                : [],
        };
    });
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

function getLoadResult(
    config: IListDataFactoryArguments,
    sourceController: NewSourceController,
    filterController: FilterController,
    historyItems?: IFilterItem[],
    operationsController?: OperationsController,
    _clearResult: boolean = false
): IListDataFactoryLoadResult {
    const filterDescription = filterController?.getFilterButtonItems();
    let loadResult = {
        sourceController,
        filterController,
        historyItems,
        source: config.source
            ? new PrefetchProxy({
                  target: config.source,
                  data: {
                      query: sourceController.getLoadError() || sourceController.getItems(),
                  },
              })
            : undefined,
        data: sourceController.getItems(),
        items: sourceController.getItems(),
        error: sourceController.getLoadError(),
        filter: sourceController.getFilter(),
        sorting: sourceController.getSorting() as TSortingOptionValue,
        collapsedGroups: sourceController.getCollapsedGroups(),
        operationsController,
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

export function getFilterController(options: IFilterControllerOptions): FilterController {
    if (options.filterController) {
        return options.filterController;
    }

    const controllerClass =
        loadSync<typeof import('Controls/filter')>('Controls/filter').ControllerClass;

    return new controllerClass({
        prefetchParams: options.prefetchParams,
        prefetchSessionId: options.prefetchSessionId,
        filter: options.filter,
        useStore: options.useStore,
        filterButtonSource: options.filterButtonSource,
        filterDescription: options.filterDescription,
        historyItems: options.historyItems,
        historyId: options.historyId,
        searchValue: options.searchValue,
        searchParam: options.searchParam,
        minSearchLength: options.minSearchLength,
        parentProperty: options.parentProperty,
        historySaveCallback: options.historySaveCallback,
    });
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
