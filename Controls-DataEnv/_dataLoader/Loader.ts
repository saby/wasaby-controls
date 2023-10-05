import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { constants } from 'Env/Constants';
import { TKey } from 'Controls-DataEnv/interface';
import { IDataFactory, IDataConfig, DataConfigResolver } from '../dataFactory';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';
import { IRouter } from 'Router/router';

/**
 * Набор конфигураций фабрик данных
 */
export type TDataConfigs = Record<TKey, IDataConfig>;

interface IDataConfigLoadResult {
    type: string;

    [key: string]: unknown;
}

export type TConfigLoadResult = IDataConfigLoadResult | unknown;

export type TLoaderConfig = {
    configGetter: string;
    configGetterArguments?: Record<string, unknown>;
    dependencies: string[];
};

export type TOldDataConfigs = Record<string, IOldDataConfig>;

export type TGetConfigResult = TDataConfigs | TOldDataConfigs;

export type TConfigGetterModule<TArguments = unknown> = {
    getConfig(args: TArguments): TGetConfigResult | Promise<TGetConfigResult>;
};

export type TAfterLoadCallback = (loadResult: unknown) => void;

export interface IOldDataConfig {
    type: 'custom' | 'list' | 'area';
    dependencies?: string[];
    afterLoadCallback?: string;
    loadDataTimeout?: number;
    loadTimeout?: number;

    [key: string]: unknown;
}

const DEFAULT_LOAD_TIMEOUT = 10000;

const COMPATIBLE_FACTORIES = {
    list: 'Controls/dataFactory:CompatibleList',
    custom: 'Controls-DataEnv/dataFactory:CompatibleCustom',
    area: 'Controls-DataEnv/dataFactory:CompatibleArea',
};

const GLOBAL_ROOT_KEY = 'root';

function calculateMinOrder(configs: TDataConfigs): number {
    const orders = Object.values(configs).map((config: IDataConfig): number => {
        return config.dataFactoryCreationOrder || 0;
    });
    return Math.min.apply(null, orders);
}

function isDataFactoryFormat(dataConfig: TGetConfigResult): boolean {
    return Object.values(dataConfig).every((config) => {
        return config.hasOwnProperty('dataFactoryName');
    });
}

function convertToDataConfig(oldConfigs: TOldDataConfigs): TDataConfigs {
    const result: TDataConfigs = {};

    Object.entries(oldConfigs).forEach(([key, config]) => {
        const factoryArgs = config;
        const type = config.type || 'list';
        result[key] = {
            dataFactoryName: COMPATIBLE_FACTORIES[type],
            dataFactoryArguments: {
                ...factoryArgs,
                loadDataTimeout: factoryArgs.loadDataTimeout || factoryArgs.loadTimeout,
            },
            dependencies: config.dependencies,
            afterLoadCallback: config.afterLoadCallback,
        };
    });

    return result;
}

async function loadModule<TModule>(moduleName: string): Promise<TModule> {
    try {
        const module = await loadAsync<TModule>(moduleName);
        addPageDeps([moduleName]);
        return module;
    } catch (error) {
        Logger.error(
            `Controls-DataEnv/dataLoader::Ошибка при загрузке модуля ${moduleName}`,
            0,
            error
        );
        return error;
    }
}

async function loadConfigGetter(config: TLoaderConfig): Promise<{
    dataConfigs: TDataConfigs;
    isAsyncConfigGetter: boolean;
}> {
    const module = await loadModule<TConfigGetterModule>(config.configGetter);
    let dataConfigs;
    let isAsyncConfigGetter;

    if (!module.getConfig) {
        throw new Error(
            `Controls-DataEnv/dataLoader:Loader.loadConfigGetter::У модуля ${config.configGetter} отсутствует обязательный метод getConfig`
        );
    } else {
        const getConfigResult = module.getConfig(config.configGetterArguments);
        isAsyncConfigGetter = !!getConfigResult.then;

        if (isAsyncConfigGetter) {
            dataConfigs = await getConfigResult;
        } else {
            dataConfigs = getConfigResult;
        }

        if (isDataFactoryFormat(dataConfigs)) {
            if (isAsyncConfigGetter) {
                throw new Error(
                    `Controls-DataEnv/dataLoader:Loader.loadConfigGetter::Метод getConfig у модуля ${config.configGetter} должен быть синхронным, загрузка с асинхронным getConfig невозможна`
                );
            }
        } else {
            dataConfigs = convertToDataConfig(dataConfigs as TOldDataConfigs);
        }
    }
    return {
        dataConfigs,
        isAsyncConfigGetter,
    };
}

interface ILoadDataConfigResult {
    dataConfigs: Record<string, TDataConfigs>;
    configs: Record<string, TLoaderConfig & { isAsyncConfigGetter }>;
}

export type ILoadedDataConfigsResult = ILoadDataConfigResult & {
    loadResults: Record<string, Record<string, unknown>>;
};

async function loadDataConfigs(
    configGetters: Record<string, TLoaderConfig>
): Promise<ILoadDataConfigResult> {
    const dataConfigsPromises = [];
    const result: ILoadDataConfigResult = {
        dataConfigs: {},
        configs: {},
    };

    for (const [key, configGetter] of Object.entries(configGetters)) {
        dataConfigsPromises.push(
            loadConfigGetter(configGetter).then(({ dataConfigs, isAsyncConfigGetter }) => {
                result.dataConfigs[key] = dataConfigs;
                result.configs[key] = { ...configGetters[key], ...{ isAsyncConfigGetter } };
            })
        );
    }
    await Promise.all(dataConfigsPromises);

    return result;
}

function getLoadTimeout(loadConfig: IDataConfig): number {
    return (
        loadConfig.dataFactoryArguments?.loadDataTimeout ||
        (constants.isServerSide ? DEFAULT_LOAD_TIMEOUT : null)
    );
}

function loadDependencies(
    dependencies: string[],
    startedLoaders: Record<string, Promise<any>>,
    configs: TDataConfigs,
    loadTimeout: number
): Promise<any> {
    const promises = [];
    const loadDependenciesResult = {};
    dependencies.forEach((dependency, index) => {
        let depLoadPromise;
        if (startedLoaders[dependency]) {
            depLoadPromise = startedLoaders[dependency];
        } else {
            depLoadPromise = callLoaderWithDependencies(
                dependency,
                configs[dependency],
                configs,
                startedLoaders,
                loadTimeout
            );
        }

        depLoadPromise.then((loadResult) => {
            // Для совместимости, т.к. зависимости получают так же по индексу массива
            loadDependenciesResult[index] = loadResult;
            loadDependenciesResult[dependency] = loadResult;
        });
        promises.push(depLoadPromise);
    });
    return Promise.all(promises).then(() => {
        return loadDependenciesResult;
    });
}

function getDataFactoryArguments(
    dataFactory: IDataFactory,
    config: IDataConfig,
    dependenciesResults: Record<string, unknown>,
    loadTimeout: number
): unknown {
    let dataFactoryArguments = { ...config.dataFactoryArguments };

    if (dataFactory.getDataFactoryArguments) {
        dataFactoryArguments = dataFactory.getDataFactoryArguments(
            dataFactoryArguments,
            dependenciesResults
        );
    }
    if (loadTimeout && !dataFactoryArguments?.loadDataTimeout) {
        dataFactoryArguments.loadDataTimeout = loadTimeout;
    }
    const extraValues = dataFactoryArguments.loaderExtraValues;
    if (extraValues) {
        const properties = {};
        extraValues.forEach(({ propName, dependencyName, dependencyPropName, prepare }) => {
            const valueFromSlice = dependenciesResults[dependencyName][dependencyPropName];
            if (prepare) {
                properties[propName] = prepare(valueFromSlice);
            } else {
                properties[propName] = valueFromSlice;
            }
        });
        dataFactoryArguments = { ...dataFactoryArguments, ...properties };
    }

    return dataFactoryArguments;
}

async function loadDataFromFactory(
    key: string,
    config: IDataConfig,
    dependenciesResults: Record<string, unknown>,
    loadTimeout: number,
    Router: IRouter
): Promise<unknown> {
    const dataFactory = await loadModule<IDataFactory>(config.dataFactoryName);
    let loadResult;
    const dataFactoryArguments = getDataFactoryArguments(
        dataFactory,
        config,
        dependenciesResults,
        loadTimeout
    );
    try {
        loadResult = await dataFactory.loadData(dataFactoryArguments, dependenciesResults, Router);
    } catch (error) {
        Logger.error(
            `Controls-DataEnv/dataLoader:Loader.loadDataFactory: Произошла ошибка во время выполнения метода loadData у фабрики ${config.dataFactoryName} с ключом ${key}
             и параметрами ${config.dataFactoryArguments}`,
            0,
            error
        );
        loadResult = error;
    }

    if (config.afterLoadCallback) {
        const afterLoadCallback = await loadModule<TAfterLoadCallback>(config.afterLoadCallback);
        callAfterLoadCallback(key, afterLoadCallback, loadResult);
    }

    return loadResult;
}

function callAfterLoadCallback(
    id: string,
    callback: TAfterLoadCallback,
    loadResult: unknown
): void {
    try {
        callback(loadResult);
    } catch (error) {
        Logger.error(
            `DataLoader: Ошибка вызова afterLoadCallback в загрузчике ${id}`,
            void 0,
            error
        );
    }
}

function validateConfigs(
    configs: TDataConfigs,
    loadedFactories?: Record<string, unknown>
): string[] {
    const errors = [];
    Object.entries(configs).forEach(([key, config]): void => {
        const dependencies = DataConfigResolver.calcAllDependencies(config, 'load');
        if (dependencies) {
            const missedLoaders = [];
            const circularDependencies = [];
            dependencies.forEach((dependency: string) => {
                if (loadedFactories?.[dependency]) {
                    return;
                } else if (!configs.hasOwnProperty(dependency)) {
                    missedLoaders.push(dependency);
                } else {
                    const depConfig = configs[dependency];
                    if (depConfig.dependencies?.includes(key)) {
                        circularDependencies.push(dependency);
                    }
                }
            });
            if (missedLoaders.length) {
                errors.push(
                    `Отсутствуют фабрики с ключами ${missedLoaders.join(
                        ', '
                    )}, указанные в зависимостях для загрузчика ${key}`
                );
            }
            if (circularDependencies.length) {
                errors.push(
                    `У фабрики с ключом ${key} найдены циклические зависимости ${circularDependencies.join(
                        ', '
                    )}`
                );
            }
        }
    });
    return errors;
}

function callLoaderWithDependencies(
    key: string,
    config: IDataConfig,
    configs: TDataConfigs,
    startedLoaders: Record<string, Promise<unknown>>,
    loadTimeout: number,
    Router?: IRouter
): Promise<any> {
    const dependencies = DataConfigResolver.calcAllDependencies(config, 'load');
    if (dependencies.length) {
        return loadDependencies(dependencies, startedLoaders, configs, loadTimeout).then(
            (results) => {
                return callLoader(key, configs[key], startedLoaders, results, loadTimeout, Router);
            }
        );
    } else {
        return callLoader(key, configs[key], startedLoaders, undefined, loadTimeout, Router);
    }
}

function load(
    configs: TDataConfigs,
    loadTimeout: number,
    Router: IRouter,
    loadedDependencies?: Record<string, Promise<unknown>>
): Record<string, Promise<TConfigLoadResult>> {
    const loadConfigs: TDataConfigs = {};
    Object.keys(configs).forEach((loaderKey) => {
        const config = { ...configs[loaderKey] };
        config.dataFactoryArguments = config.dataFactoryArguments || {};
        loadConfigs[loaderKey] = config;
    });
    const startedLoaders = { ...loadedDependencies };
    const loadResult = {};
    Object.entries(loadConfigs).forEach(([key, config]) => {
        const timeout = loadTimeout || getLoadTimeout(config);
        loadResult[key] = callLoaderWithDependencies(
            key,
            config,
            loadConfigs,
            startedLoaders,
            timeout,
            Router
        );
    });
    return loadResult;
}

async function loadData(
    configs: TDataConfigs,
    loadTimeout?: number,
    Router?: IRouter,
    loadedDependencies?: Record<string, Promise<unknown>>
): Promise<Record<keyof TDataConfigs, unknown>> {
    const validateErrors = validateConfigs(configs, loadedDependencies);
    if (validateErrors.length) {
        return Promise.reject(validateErrors.join(', '));
    } else {
        const loadResults = load(configs, loadTimeout, Router, loadedDependencies);
        return new Promise((resolve, reject) => {
            const result = {};
            const promises = [];
            const minLoadOrder = calculateMinOrder(configs);
            Object.keys(loadResults).forEach((key) => {
                const dataFactoryCreationOrder = configs[key]?.dataFactoryCreationOrder || 0;
                if (dataFactoryCreationOrder === minLoadOrder) {
                    promises.push(
                        loadResults[key].then((loaderResult) => {
                            result[key] = loaderResult;
                        })
                    );
                } else {
                    result[key] = loadResults[key];
                }
            });
            Promise.all(promises)
                .then(() => {
                    resolve(result);
                })
                .catch(reject);
        });
    }
}

async function callLoader(
    id: string,
    config: IDataConfig,
    startedLoaders: Record<string, Promise<unknown>>,
    dependenciesResults?: Record<string, Promise<Record<TKey, unknown> | Error>>,
    loadTimeout?: number,
    Router?: IRouter
): Promise<unknown> {
    if (!config.dataFactoryName) {
        return Promise.reject(`Не задана фабрика данных в конфигурации с ключом ${id}`);
    } else {
        if (!startedLoaders[id]) {
            startedLoaders[id] = loadDataFromFactory(
                id,
                config,
                dependenciesResults,
                loadTimeout,
                Router
            );
        }
        return startedLoaders[id];
    }
}

/**
 * Класс загрузчика данных.
 * @class Controls-DataEnv/_dataLoader/Loader
 * @public
 */

export default class DataLoader {
    /**
     * Метод загрузки данных
     * @param {Record<TKey, Controls-DataEnv/_dataFactory/interface/IDataConfig>} configs Набор фабрик данных
     * @param {Number} loadTimeout - общий таймаут для загрузки данных
     * @param {IRouter} [Router] - Роутер.
     */
    static async load(
        configs: TDataConfigs,
        loadTimeout?: number,
        Router?: IRouter
    ): Promise<Record<keyof TDataConfigs, unknown>> {
        return loadData(configs, loadTimeout, Router);
    }

    /**
     * Метод, который возвращает результирующие промисы метода загрузки каждой фабрики данных, не дожидаясь их завершения.
     * @param {Record<TKey, Controls-DataEnv/_dataFactory/interface/IDataConfig>} configs Набор фабрик данных
     * @param {Number} [loadTimeout] - общий таймаут для загрузки данных
     * @param {IRouter} [Router] - Роутер.
     */
    static loadEvery(
        configs: TDataConfigs,
        loadTimeout?: number,
        Router?: IRouter
    ): Record<string, Promise<TConfigLoadResult>> {
        return load(configs, loadTimeout, Router);
    }

    /**
     * Метод загрузки данных по модулям, которые экспортируют метод getConfig.
     * @param {Record<TKey, TLoaderConfig>} configGetters Набор фабрик данных
     * @param {Number} [loadTimeout] - общий таймаут для загрузки данных
     * @param {IRouter} [Router] - Роутер.
     */
    static async loadByConfigs(
        configGetters: Record<string, TLoaderConfig>,
        loadTimeout?: number,
        Router?: IRouter
    ): Promise<ILoadedDataConfigsResult> {
        const configGettersResults = await loadDataConfigs(configGetters);
        const loadDataPromises = [];
        const loadResults: ILoadedDataConfigsResult = {
            configs: {},
            dataConfigs: {},
            loadResults: {},
        };
        const rootConfig = configGettersResults.dataConfigs[GLOBAL_ROOT_KEY];
        const rootDeps = DataConfigResolver.resolveRootDeps(
            configGettersResults.dataConfigs,
            'load'
        );

        if (rootConfig) {
            loadResults[GLOBAL_ROOT_KEY] = DataLoader.loadEvery(rootConfig, loadTimeout, Router);
        }

        for (const [key, dataConfig] of Object.entries(configGettersResults.dataConfigs)) {
            const loadedRootResults = {};
            if (rootDeps[key]?.length) {
                rootDeps[key].forEach((rootDep) => {
                    loadedRootResults[rootDep] = loadResults[GLOBAL_ROOT_KEY][rootDep];
                });
            }
            loadDataPromises.push(
                loadData(dataConfig, loadTimeout, Router, loadedRootResults).then((loadResult) => {
                    loadResults.loadResults[key] = loadResult;
                })
            );
        }

        await Promise.all(loadDataPromises);
        loadResults.configs = configGettersResults.configs;
        loadResults.dataConfigs = configGettersResults.dataConfigs;

        return loadResults;
    }
}
