import type { IListDataFactoryArguments } from 'Controls-DataEnv/list';

import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import {
    DataSet,
    getControllerState as getStateFromMemory,
    getStateFromUrl,
    ISourceControllerOptions,
    NewSourceController,
} from 'Controls/dataSource';
import { PrefetchProxy, DataSet as TypesDataSet } from 'Types/source';
import { RecordSet } from 'Types/collection';

import type { TLoadDataResult } from './types/TLoadDataResult';

import { getConfigAfterLoadError } from './utils/getConfigAfterLoadError';
import { prepareFilterForQuery } from './utils/filter';
import { loadUserParams, ISavedParamsResult, loadColumnsWidths } from './utils/userParams';

async function getFilterModule(): Promise<typeof import('Controls/filter')> {
    return loadAsync('Controls/filter');
}

/**
 * Функция для загрузки данных списка
 * */
export async function listDataLoader(
    config: IListDataFactoryArguments,
    clearResult?: boolean,
    fabricId?: string
): Promise<TLoadDataResult> {
    // Загрузка статики, не влияющей на загрузку данных
    const staticPromises: Promise<unknown>[] = [];

    const filterDescription = config.filterDescription;
    if (filterDescription && Array.isArray(filterDescription)) {
        staticPromises.push(
            getFilterModule().then(({ FilterLoader }) =>
                FilterLoader.loadFilterTemplates(
                    filterDescription,
                    config.editorsViewMode,
                    config.searchParam
                )
            )
        );
    }

    // Загрузка параметров, которые не влияют на загрузку данных
    let columnWidthPromise: Promise<string[] | undefined>;

    if (config.propStorageId) {
        columnWidthPromise = loadColumnsWidths(config.propStorageId);
    }

    // Получение параметров из URL и из оперативной памяти
    const stateFromPage = {};
    if (config.listConfigStoreId) {
        Object.assign(
            stateFromPage,
            getStateFromMemory(config.listConfigStoreId, config.listConfigStorePropsNames) || {}
        );
    }

    const urlStateId = config.listConfigStoreId || fabricId;
    if (urlStateId) {
        Object.assign(stateFromPage, getStateFromUrl(urlStateId));
    }
    Object.assign(config, stateFromPage);

    // Загрузка параметров для запроса (сортировка, корень и т.д.)
    const dataParamsPromise = loadUserParams(config).then((userParams) => {
        return { ...userParams, ...stateFromPage };
    });

    // Загрузка фильтров
    let filterPromise;

    if (config.filterDescription || (config.searchParam && config.searchValue)) {
        filterPromise = getFilterModule().then(({ FilterCalculator }) =>
            FilterCalculator.prepareFilter(config)
        );
    }

    return Promise.all([dataParamsPromise, filterPromise]).then(
        async ([dataParamsResult, filterResult]) => {
            // Загрузка данных для списка
            const loadResult = loadItems(config, dataParamsResult, filterResult);

            // Загрузка данных для редакторов фильтров
            let filterDataPromise;

            if (config.filterDescription) {
                const filterDescriptionCfg = config.filterDescription;
                filterDataPromise = getFilterModule().then(({ FilterLoader }) => {
                    return FilterLoader.loadFilterDescriptionDeps(
                        filterResult?.filterDescription || filterDescriptionCfg,
                        config,
                        dataParamsResult.countFilterValue || config.countFilterValue
                    );
                });
            }

            const [loadItemsResult, filterLoadDataResult] = await Promise.all([
                loadResult,
                filterDataPromise,
            ]);

            // Дожидаемся загрузки статики, потому что данные могут загрузиться быстрее
            const [storedColumnsWidths] = await Promise.all([columnWidthPromise, staticPromises]);

            return getLoadResult(
                config,
                loadItemsResult,
                dataParamsResult,
                storedColumnsWidths,
                {
                    ...filterResult,
                    filterDescription: filterLoadDataResult || filterResult?.filterDescription,
                },
                clearResult
            );
        }
    );
}

async function loadItems(
    config: IListDataFactoryArguments,
    dataParams: ISavedParamsResult,
    filterResult: Awaited<
        ReturnType<(typeof import('Controls/filter').FilterCalculator)['prepareFilter']>
    >
): Promise<RecordSet | Error | void> {
    if (config.items) {
        return Promise.resolve(config.items);
    }
    if (!config.source) {
        return Promise.resolve();
    }
    const dataSetProps = {
        ...config,
        ...dataParams,
        ...filterResult,
        expandedItems: dataParams.expandedItems || config.expandedItems,
        pagination: config.navigation,
        fields: config.selectFields,
    };
    const navConfig = config.listConfigStoreId
        ? getStateFromMemory(config.listConfigStoreId)?.navigationSourceConfig
        : undefined;

    dataSetProps.filter = await prepareFilterForQuery({
        ...dataSetProps,
        nextRoot: dataSetProps.root,
    });

    const dataSet = new DataSet(dataSetProps);

    return dataSet.load(navConfig).catch((error) => error);
}

async function getLoadResult(
    config: IListDataFactoryArguments,
    dataResult: RecordSet | Error | void,
    paramsResult: ISavedParamsResult,
    storedColumnsWidths: string[] | undefined,
    filterResult?: Partial<
        Awaited<ReturnType<(typeof import('Controls/filter').FilterCalculator)['prepareFilter']>>
    >,
    _clearResult: boolean = false
): Promise<TLoadDataResult> {
    let loadResult: TLoadDataResult = {
        type: 'list',
        source: config.source
            ? new PrefetchProxy({
                  target: config.source,
                  data: {
                      // Надо удалять PrefetchProxy из результатов загрузки
                      query: dataResult as unknown as TypesDataSet,
                  },
              })
            : undefined,
        filter: filterResult?.filter || config.filter || {},
        storedColumnsWidths,
        root: config.root,
        ...paramsResult,
    };

    if (config.filterDescription) {
        const resultDescription = filterResult?.filterDescription || config.filterDescription;

        if (Array.isArray(config.filterDescription)) {
            const { FilterLoader } = await getFilterModule();
            loadResult.filterDescription = FilterLoader.clearItemsCallbacks(resultDescription);
        } else {
            loadResult.filterDescription = resultDescription;
        }
        loadResult.historyItems = filterResult?.historyItems;
    }

    let dataResultMetaData: ReturnType<RecordSet['getMetaData']> | undefined;

    if (dataResult instanceof RecordSet) {
        loadResult.items = dataResult;
        loadResult.data = dataResult;
        dataResultMetaData = dataResult.getMetaData();
    }

    if (config.nodeHistoryId && config.parentProperty) {
        loadResult.expandedItems = paramsResult.expandedItems;
    }
    if (config.rootHistoryId && config.parentProperty) {
        loadResult.root =
            dataResultMetaData && 'correctRoot' in dataResultMetaData
                ? dataResultMetaData.correctRoot
                : paramsResult.root;
    }

    if (!_clearResult) {
        const configToMerge = {
            ...config,
            sliceExtraValues: null,
            loaderExtraValues: null,
        };
        loadResult = {
            ...configToMerge,
            ...loadResult,
        };

        // TODO надо сначала удалить использования в саггесте, меню, фильтрах (редактор списка), списке
        const sourceController = getSourceController({
            ...loadResult,
            source: config.source,
            error: dataResult instanceof Error ? dataResult : undefined,
            items: undefined,
        });
        loadResult.sourceController = sourceController;
        if (loadResult.items) {
            loadResult.sourceController.setItemsAfterLoad(loadResult.items);
        }
    }

    if (dataResult instanceof Error) {
        return getConfigAfterLoadError(loadResult, dataResult, {
            root: config.root,
        });
    } else {
        return Promise.resolve(loadResult);
    }
}

function getSourceController(
    options: ISourceControllerOptions & { sourceController?: NewSourceController }
): NewSourceController {
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
