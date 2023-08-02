/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    ControllerClass as FilterController,
    IFilterControllerOptions,
    IFilterItem,
} from 'Controls/filter';
import { NewSourceController, IListSavedState } from 'Controls/dataSource';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UICommon/Utils';
import { loadSavedConfig } from 'Controls/Application/SettingsController';
import {
    ISortingOptions,
    TSortingOptionValue,
    TFilter,
    IBaseSourceConfig,
} from 'Controls/interface';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { IProperty } from 'Controls/propertyGrid';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { isEqual } from 'Types/object';
import { PrefetchProxy } from 'Types/source';
import { IRouter } from 'Router/router';
import { IListDataFactoryLoadResult } from './_interface/IListDataFactory';
import { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';

const QUERY_PARAMS_LOAD_TIMEOUT = 5000;
export const FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD = [
    'Controls/filterPanel:ListEditor',
    'Controls/filterPanel:LookupEditor',
];

interface IFilterHistoryLoaderResult {
    filterButtonSource: IFilterItem[];
    filter: TFilter;
    historyItems: IFilterItem[];
}

interface IFilterResult {
    historyItems: IFilterItem[];
    controller: FilterController;
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
        filterPromise = wrapTimeout(filterPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
            Logger.info(
                'Controls/dataSource:loadData: Данные фильтрации не загрузились за 1 секунду'
            );
        });
    }

    if (config.propStorageId) {
        paramsPromise = loadSavedConfig(config.propStorageId, ['sorting', 'storedColumnsWidths']);
        paramsPromise = wrapTimeout(paramsPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
            Logger.info('Controls/dataSource:loadData: Параметры не загрузились за 1 секунду');
        });
    }
    const operationsPromise =
        config.operationsController && config.task1186833531
            ? Promise.resolve(config.operationsController)
            : loadAsync('Controls/operations').then((operations) => {
                  return new operations.ControllerClass({});
              });

    return Promise.all([filterPromise, paramsPromise, operationsPromise]).then(
        ([, paramsPromiseResult, operationsController]: [TFilter, ISortingOptions, any]) => {
            const sorting = paramsPromiseResult?.sorting || config.sorting;
            const storedColumnsWidths =
                paramsPromiseResult?.storedColumnsWidths || config.storedColumnsWidths;
            let loadFilterDataPromise;
            const sourceController = getSourceController({
                ...config,
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
                _clearResult,
                listSavedState.navigationSourceConfig
            );
            const filterDescription = filterController?.getFilterButtonItems();
            let loadCallbacksPromise;

            if (filterDescription) {
                if (!!config.filterDescription && isNeedLoadFilterData(filterDescription)) {
                    loadFilterDataPromise = loadFilterData(
                        filterDescription,
                        config.editorsViewMode,
                        loadDataTimeout
                    ).then(() => {
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

function loadFilterData(
    filterSource: IFilterItem[],
    editorsViewMode: string,
    loadDataTimeout?: number
): Promise<IFilterItem[] | IProperty[]> {
    const filterStructure = prepareFilterSource(filterSource, editorsViewMode);
    return loadAsync<typeof import('Controls/dataFactory')>('Controls/dataFactory').then(
        ({ PropertyGrid }) => {
            return PropertyGrid.loadData({
                typeDescription: filterStructure as IProperty[],
                loadDataTimeout,
            }) as unknown as Promise<IFilterItem[] | IProperty[]>;
        }
    );
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

function isNeedLoadFilterData(filterSource: IFilterItem[]): boolean {
    return filterSource.some((item: IFilterItem) => {
        return needPrepareFilterItem(item);
    });
}

function needPrepareFilterItem({ type, editorTemplateName, viewMode }: IFilterItem): boolean {
    return (
        (type === 'list' || FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD.includes(editorTemplateName)) &&
        // frequent фильтры строятся по textValue, для них данные запрашивать не надо
        viewMode !== 'frequent'
    );
}

function prepareFilterSource(description: IFilterItem[], editorsViewMode: string): IFilterItem[] {
    const getFilter = (
        { editorOptions, value }: IFilterItem,
        filter: TFilter,
        propertyChanged: boolean
    ): TFilter => {
        const resultFilter = filter || {};
        if (propertyChanged && editorsViewMode !== 'popupCloudPanelDefault') {
            resultFilter[editorOptions.keyProperty] = Array.isArray(value) ? value : [value];
        }
        if (editorOptions.historyId) {
            resultFilter._historyIds = [editorOptions.historyId];
        }
        return resultFilter;
    };
    return description.map((property) => {
        const editorTemplateName = property.editorTemplateName;
        if (needPrepareFilterItem(property)) {
            const propertyChanged = !isEqual(property.value, property.resetValue);
            const isListEditor = editorTemplateName === 'Controls/filterPanel:ListEditor';
            let filter;

            // Загрузку записей, даже если параметр фильтра не изменён, надо делать только для редактора
            // в виде списка, например для lookup'a ничего загружать не надо
            if (propertyChanged || isListEditor || property.type === 'list') {
                filter = getFilter(property, property.editorOptions.filter, propertyChanged);
                if (isListEditor) {
                    property.type = 'list';
                }
                property.editorOptions.filter = filter;
                property.editorOptions.sourceController?.setFilter(filter);
            }
        }
        return property;
    });
}

function getFilterControllerWithHistoryFromLoader(
    config: IListDataFactoryArguments
): Promise<IFilterResult> {
    return config
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
}

function loadFilterCallbacks(filterDescription: IFilterItem[]): Promise<Function[]> {
    return loadSync<typeof import('Controls/filter')>('Controls/filter').loadCallbacks(
        filterDescription
    );
}

function isFilterCallbacksLoaded(filterDescription: IFilterItem[]): boolean {
    return loadSync<typeof import('Controls/filter')>('Controls/filter').isCallbacksLoaded(
        filterDescription
    );
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
        if (config.historyItems) {
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
    if (config.filterDescription) {
        loadResult.filterDescription = filterDescription;
        // TODO BROWSER! filterButtonSource опция для совместимости с Browser'ом
    } else if (config.filterButtonSource) {
        loadResult.filterButtonSource = filterDescription;
    }
    return loadResult;
}

export function getFilterController(options: IFilterControllerOptions): FilterController {
    const controllerClass =
        loadSync<typeof import('Controls/filter')>('Controls/filter').ControllerClass;
    return options.filterController || new controllerClass({ ...options });
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
