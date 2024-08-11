/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { type IFilterItem } from 'Controls/filter';
import {
    IListSavedState,
    NewSourceController,
    SORTING_USER_PARAM_POSTFIX,
} from 'Controls/dataSource';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UICommon/Utils';
import { loadSavedConfig } from 'Controls/Application/SettingsController';
import { IBaseSourceConfig, TSortingOptionValue } from 'Controls/interface';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { PrefetchProxy } from 'Types/source';
import { IRouter } from 'Router/router';
import { IListDataFactoryLoadResult } from './_interface/IListDataFactory';
import { IListDataFactoryArguments, TSavedParams } from './_interface/IListDataFactoryArguments';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import { USER } from 'ParametersWebAPI/Scope';
import { URL } from 'Browser/Transport';
import { Serializer } from 'Types/serializer';
import { getConfigAfterLoadError } from './resources/error';
import { abstractLoadData, isNeedPrepareFilter } from '../AbstractList/abstractLoadData';
import { QUERY_PARAMS_LOAD_TIMEOUT } from '../AbstractList/loadData/constants';
import { getFilterModuleSync } from '../AbstractList/utils/getFilterModuleSync';
import { addPageDeps } from 'UI/Deps';

export { QUERY_PARAMS_LOAD_TIMEOUT, isNeedPrepareFilter };
const COUNT_FILTER_USER_PARAM_POSTFIX = '-countFilterValue';

export default async function loadData(
    config: IListDataFactoryArguments,
    dependenciesResults: {},
    Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    const loadDataTimeout = config.loadDataTimeout;
    let listSavedState: IListSavedState = {};

    if (config.listConfigStoreId) {
        listSavedState = getListState(config) || {};
        Object.assign(config, listSavedState);
    }

    const listState = getStateFromUrl(config.listConfigStoreId || fabricId);
    if (listState) {
        Object.assign(config, {
            historyItems: listState.filterDescription,
            root: listState.root,
            expandedItems: listState.expandedItems,
        });
    }

    const abstractLoadDataResult = await abstractLoadData(config);

    // Сохраненные параметры из истории или настроек аккаунта.
    const [savedParams, isHandledByUser] = await getSavedParams(config);

    const sorting = savedParams?.sorting || config.sorting;

    const order = savedParams?.order || config.order;

    // Поддерживаем новое поведение.
    // Если прикладная фабрика вернула в колбеке корень, то применяем его.
    // Раньше root null игнорировался и брался из параметров фабрики.
    const root =
        isHandledByUser && typeof savedParams.root !== 'undefined'
            ? savedParams.root
            : savedParams.root ?? config.root;
    const storedColumnsWidths = savedParams?.storedColumnsWidths || config.storedColumnsWidths;
    const countFilterValue = savedParams?.countFilterValue || config.countFilterValue;
    const filterDescription =
        abstractLoadDataResult?.filterDescription ||
        config.filterDescription ||
        config.filterButtonSource;

    const sourceController = getSourceController({
        ...config,
        root,
        sorting,
        filter: abstractLoadDataResult?.filter || config.filter,
        loadTimeout: loadDataTimeout,
    });
    const loadDataPromise = _loadData(
        config,
        sourceController,
        filterDescription,
        _clearResult || config.clearResult,
        abstractLoadDataResult?.historyItems,
        listSavedState.navigationSourceConfig
    );
    let loadFilterDescriptionPromise;

    if (filterDescription) {
        loadFilterDescriptionPromise = loadFilterDescriptionDeps(
            filterDescription,
            config,
            loadDataTimeout,
            countFilterValue
        );
    }

    return Promise.all([loadDataPromise, loadFilterDescriptionPromise]).then(
        ([dataResult, filterDescription]) => {
            return {
                ...dataResult,
                storedColumnsWidths,
                countFilterValue,
                operationsController: abstractLoadDataResult?.operationsController,
                filterDescription: filterDescription || dataResult.filterDescription,
                historyItems: abstractLoadDataResult?.historyItems,
                columns: abstractLoadDataResult?.columns || dataResult.columns,
                header: abstractLoadDataResult?.header || dataResult.header,
                order,
            };
        }
    );
}

async function getSavedParams(
    args: IListDataFactoryArguments
): Promise<[savedParams: TSavedParams, isHandledByUser: boolean]> {
    const { rootHistoryId, propStorageId, parentProperty, onSavedParamsLoaded } = args;
    const paramsPromise = propStorageId ? loadParams(propStorageId) : undefined;
    const rootHistoryPromise =
        rootHistoryId && parentProperty ? RootHistoryUtils.restore(rootHistoryId) : undefined;
    const cbPromise =
        onSavedParamsLoaded && typeof onSavedParamsLoaded === 'string'
            ? loadAsync(onSavedParamsLoaded)
            : undefined;
    let isHandledByUser = false;

    const [paramsResult, historyResult] = await Promise.all([
        paramsPromise,
        rootHistoryPromise,
        cbPromise,
    ]);

    const loadedResult: TSavedParams = {
        ...(paramsResult
            ? {
                  sorting: paramsResult.sorting,
                  storedColumnsWidths: paramsResult.storedColumnsWidths,
                  countFilterValue: paramsResult.countFilterValue,
                  order: paramsResult.order,
              }
            : {}),
        ...(typeof historyResult !== 'undefined' ? { root: historyResult } : {}),
    };

    if (onSavedParamsLoaded) {
        const cb: Exclude<typeof onSavedParamsLoaded, string> =
            typeof onSavedParamsLoaded === 'string'
                ? loadSync(onSavedParamsLoaded)
                : onSavedParamsLoaded;

        const handled = cb(args, loadedResult);
        if (!handled) {
            Logger.warn(
                'Из прикладной функции обратного вызова onSavedParamsLoaded необходимо вернуть стейт.'
            );
        } else {
            loadedResult.root = handled.root;
            isHandledByUser = true;
        }
    }

    return [loadedResult, isHandledByUser];
}

function loadParams(
    propStorageId: string
): Promise<Pick<TSavedParams, 'sorting' | 'storedColumnsWidths' | 'countFilterValue' | 'order'>> {
    const sortingUserParamId = propStorageId + SORTING_USER_PARAM_POSTFIX;
    const countFilterUserParamId = propStorageId + COUNT_FILTER_USER_PARAM_POSTFIX;
    const orderUserParamId = propStorageId + '-order';
    let paramsPromise = Promise.all([
        loadSavedConfig(propStorageId, ['storedColumnsWidths']),
        USER.load([sortingUserParamId, countFilterUserParamId, orderUserParamId]),
    ]).then(([{ storedColumnsWidths }, userParams]) => {
        const sortingSavedInUserParams = userParams.get(sortingUserParamId);
        const countFilterValueParams = userParams.get(countFilterUserParamId);
        const orderSavedInUserParams = userParams.get(orderUserParamId);
        let sorting;
        let countFilterValue;
        let order;

        if (sortingSavedInUserParams) {
            sorting = JSON.parse(sortingSavedInUserParams);
        }

        if (countFilterValueParams) {
            countFilterValue = JSON.parse(countFilterValueParams, new Serializer().deserialize);
        }

        if (orderSavedInUserParams) {
            order = JSON.parse(orderSavedInUserParams);
        }

        return {
            sorting,
            storedColumnsWidths,
            countFilterValue,
            order,
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
        if (config.source && !config.items) {
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

function getFilterPanelExtendedItems(): Promise<
    typeof import('Controls/filterPanelExtendedItems')
> {
    return loadAsync<typeof import('Controls/filterPanelExtendedItems')>(
        'Controls/filterPanelExtendedItems'
    );
}

function loadFilterCallbacks(filterDescription: IFilterItem[]): Promise<Function[]> | void {
    // нужно всегда добавлять callback'и в зависимость страницы, даже если они все загружены
    // потому что на СП они будут в кэше, а на клиенте их уже не будет
    return getFilterModuleSync().loadCallbacks(filterDescription);
}

function loadFilterEditors(
    filterDescription: IFilterItem[],
    editorsViewMode?: string,
    searchParam?: string
): Promise<Function> | void {
    return getFilterModuleSync().loadEditorTemplateName(
        filterDescription,
        editorsViewMode,
        searchParam
    );
}

function getListState(config: IListDataFactoryArguments): IListSavedState | void {
    const dataSourceLib = loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
    return dataSourceLib.getControllerState(config.listConfigStoreId);
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
): Promise<IListDataFactoryLoadResult> {
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

    if (loadResult.error) {
        return getConfigAfterLoadError(loadResult, loadResult.error, {
            root: config.root,
        }) as Promise<IListDataFactoryLoadResult>;
    } else {
        return Promise.resolve(loadResult);
    }
}

function loadFilterDescriptionDeps(
    filterDescription: IFilterItem[],
    config: IListDataFactoryArguments,
    loadDataTimeout?: number,
    countFilterValue?: unknown
): Promise<IFilterItem[] | void> {
    const { FilterLoader, FilterDescription } = getFilterModuleSync();
    let loadFilterDataPromise;
    let loadFilterPanelExtendedItemsPromise;
    let loadFilterDataAndCallbacksPromise;

    const loadFilterCallbacksPromise = loadFilterCallbacks(filterDescription);
    const { countFilterValueConverter, editorsViewMode } = config;
    let countFilterPromise;
    if (typeof countFilterValueConverter === 'string') {
        countFilterPromise = loadAsync(countFilterValueConverter);
        addPageDeps([countFilterValueConverter]);
    }

    if (
        !!config.filterDescription &&
        FilterLoader.isNeedLoadFilterDescriptionData(filterDescription)
    ) {
        loadFilterDataPromise = Promise.all([loadFilterCallbacksPromise, countFilterPromise]).then(
            () => {
                const filterDescr = FilterDescription.isFilterDescriptionChanged(filterDescription)
                    ? FilterDescription.callFilterChangedCallbackOnFilterDescription(
                          filterDescription,
                          config.filter
                      )
                    : filterDescription;
                const filterDescriptionWithFilterCount = FilterDescription.applyFilterCounter(
                    countFilterValue,
                    filterDescr,
                    config
                );
                return FilterLoader.loadFilterDescriptionData(
                    filterDescriptionWithFilterCount,
                    editorsViewMode,
                    loadDataTimeout,
                    false,
                    'panel'
                );
            }
        );

        if (
            FilterLoader.isNeedLoadExtendedItemsTemplate(filterDescription, editorsViewMode) &&
            !isLoaded('Controls/filterPanelExtendedItems')
        ) {
            loadFilterPanelExtendedItemsPromise = getFilterPanelExtendedItems();
        }
    }

    const loadFilterEditorsPromise = loadFilterEditors(
        filterDescription,
        editorsViewMode,
        config.searchParam
    );

    if (filterDescription.find((filter) => !!filter.filterVisibilityCallback)) {
        loadFilterDataAndCallbacksPromise = Promise.all([
            loadFilterDataPromise,
            loadFilterCallbacksPromise,
        ]).then(([loadedFilterDescription]) => {
            FilterDescription.callVisibilityCallbackOnFilterDescription(
                loadedFilterDescription || filterDescription,
                config.filter
            );
            return loadedFilterDescription;
        });
    }

    return Promise.all([
        loadFilterDataPromise,
        loadFilterPanelExtendedItemsPromise,
        loadFilterCallbacksPromise,
        loadFilterEditorsPromise,
        loadFilterDataAndCallbacksPromise,
    ]).then(([filterDescription]) => filterDescription);
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
