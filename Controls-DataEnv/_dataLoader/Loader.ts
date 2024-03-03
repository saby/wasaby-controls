import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { constants } from 'Env/Constants';
import { IDataFactory, IDataConfig, DataConfigResolver, callGetConfig } from '../dataFactory';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';
import { IRouter } from 'Router/router';
import type { IDataConfigLoader } from 'Controls-DataEnv/dataFactory';
//@ts-ignore;
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';

/**
 * Набор конфигураций фабрик данных
 */
export type TDataConfigs = Record<string, IDataConfig>;

interface IDataConfigLoadResult {
    type: string;

    [key: string]: unknown;
}

type TStartedLoaders = Record<string, Promise<unknown> | undefined>;
type TDependenciesResults = Record<string, unknown> | undefined;
type TLoadTimeout = number | null | undefined;

export type TConfigLoadResult = IDataConfigLoadResult | unknown;

export type TOldDataConfigs = Record<string, IOldDataConfig>;

export type TGetConfigResult = TDataConfigs | TOldDataConfigs;

export type TConfigGetterModule<TArguments = unknown> = {
    getConfig(args: TArguments): TGetConfigResult | Promise<TGetConfigResult>;
};

const SERVER_GET_CONFIG_TIMEOUT = 3000;
const CLIENT_GET_CONFIG_TIMEOUT = 15000;

const GET_CONFIG_TIMEOUT: number = constants.isServerSide
    ? SERVER_GET_CONFIG_TIMEOUT
    : CLIENT_GET_CONFIG_TIMEOUT;

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

const GLOBAL_ROOT_KEY = 'root';

function calculateMinOrder(configs: TDataConfigs): number {
    const orders = Object.values(configs).map((config: IDataConfig): number => {
        return config.dataFactoryCreationOrder || 0;
    });
    return Math.min.apply(null, orders);
}

async function loadModule<TModule>(moduleName: string): Promise<TModule | undefined> {
    try {
        const module = await loadAsync<TModule>(moduleName);
        addPageDeps([moduleName]);
        return module;
    } catch (error: unknown | undefined) {
        if (error instanceof Error) {
            Logger.error(
                `Controls-DataEnv/dataLoader::Ошибка при загрузке модуля ${moduleName}`,
                0,
                error
            );
        }
    }
}

export interface IGetConfigResult {
    dataConfigs: TDataConfigs;
    isAsyncConfigGetter: boolean;
    error?: Error;
}

async function loadConfigGetter(config: IDataConfigLoader): Promise<IGetConfigResult> {
    const module = await loadModule<TConfigGetterModule>(config.configGetter);
    let dataConfigs = {};
    let isAsyncConfigGetter = false;
    let error;

    if (!module) {
        throw new Error(
            `Controls-DataEnv/dataLoader:Loader.loadConfigGetter:: Не удалось загрузить модуль ${config.configGetter}`
        );
    } else {
        try {
            const getConfigResult = callGetConfig(module, config);
            isAsyncConfigGetter = !!getConfigResult.then;

            if (isAsyncConfigGetter) {
                dataConfigs = await wrapTimeout(getConfigResult, GET_CONFIG_TIMEOUT);
            } else {
                dataConfigs = getConfigResult;
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                Logger.error(
                    'Ошибка при получении конфигурации предзагрузки из ' +
                        `${config.configGetter}. \n Error: ${e}`
                );
                error = e;
            }
        }

        if (!DataConfigResolver.isOldDataFormat(dataConfigs)) {
            if (isAsyncConfigGetter) {
                Logger.warn(
                    `Controls-DataEnv/dataLoader:Loader.loadConfigGetter::Метод getConfig у модуля ${config.configGetter} должен быть синхронным!`
                );
            }
        } else {
            dataConfigs = DataConfigResolver.convertLoadResultsToFactory(
                dataConfigs as TOldDataConfigs
            ) as unknown as TDataConfigs;
        }
    }
    return {
        dataConfigs,
        isAsyncConfigGetter,
        error,
    };
}

interface ILoadDataConfigResultSerializable {
    configs: Record<string, IDataConfigLoader & { isAsyncConfigGetter: boolean }>;
}

interface ILoadDataConfigResult {
    configs: Record<
        string,
        IDataConfigLoader & { isAsyncConfigGetter: boolean; configError?: Error }
    >;
    dataConfigs: Record<string, TDataConfigs>;
}

/**
 * Результат загрузки
 */
export type ILoadedDataConfigsResult = ILoadDataConfigResultSerializable & {
    loadResults: Record<string, Record<string, unknown>>;
    dataConfigs?: Record<string, TDataConfigs>;
};

async function loadDataConfigs(
    configGetters: Record<string, IDataConfigLoader>
): Promise<ILoadDataConfigResult> {
    const dataConfigsPromises = [];
    const result: ILoadDataConfigResult = {
        dataConfigs: {},
        configs: {},
    };

    for (const [key, configGetter] of Object.entries(configGetters)) {
        dataConfigsPromises.push(
            loadConfigGetter(configGetter).then(({ dataConfigs, isAsyncConfigGetter, error }) => {
                result.dataConfigs[key] = dataConfigs;
                result.configs[key] = {
                    ...configGetters[key],
                    ...{ isAsyncConfigGetter, configError: error },
                };
            })
        );
    }
    await Promise.all(dataConfigsPromises);

    return result;
}

function getLoadTimeout(loadConfig: IDataConfig): number | null {
    return (
        loadConfig.dataFactoryArguments?.loadDataTimeout ||
        (constants.isServerSide ? DEFAULT_LOAD_TIMEOUT : null)
    );
}

function loadDependencies(
    dependencies: string[],
    startedLoaders: TStartedLoaders,
    configs: TDataConfigs,
    loadTimeout: TLoadTimeout
): Promise<Record<string, unknown>> {
    const promises: Promise<unknown>[] = [];
    const loadDependenciesResult: Record<string, unknown> = {};
    dependencies.forEach((dependency, index) => {
        let depLoadPromise: Promise<unknown>;
        if (startedLoaders[dependency]) {
            depLoadPromise = startedLoaders[dependency] as Promise<unknown>;
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
    dependenciesResults: TDependenciesResults,
    loadTimeout: TLoadTimeout
): IDataConfig['dataFactoryArguments'] {
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
        const properties: Record<string, unknown> = {};
        extraValues.forEach(({ propName, dependencyName, dependencyPropName, prepare }) => {
            let valueFromSlice: Record<string, unknown> | unknown =
                dependenciesResults?.[dependencyName];

            if (valueFromSlice instanceof Object) {
                valueFromSlice = (valueFromSlice as Record<string, unknown>)[dependencyPropName];
            }

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
    dependenciesResults: TDependenciesResults,
    loadTimeout: TLoadTimeout,
    Router?: IRouter
): Promise<unknown> {
    const dataFactory = await loadModule<IDataFactory>(config.dataFactoryName);
    let loadResult;

    if (!dataFactory) {
        throw new Error(`Не удалось загрузить фабрику ${config.dataFactoryName}`);
    }

    const dataFactoryArguments: IDataConfig['dataFactoryArguments'] = getDataFactoryArguments(
        dataFactory,
        config,
        dependenciesResults,
        loadTimeout
    );

    try {
        loadResult = await dataFactory.loadData(dataFactoryArguments, dependenciesResults, Router);
    } catch (error: unknown) {
        if (error instanceof Error) {
            Logger.error(
                `Controls-DataEnv/dataLoader:Loader.loadDataFactory: Произошла ошибка во время выполнения метода loadData у фабрики ${config.dataFactoryName} с ключом ${key}
             и параметрами ${config.dataFactoryArguments} ${error.message}`,
                0,
                error
            );
        }
        loadResult = error;
    }

    if (config.afterLoadCallback) {
        const afterLoadCallback = await loadModule<TAfterLoadCallback>(config.afterLoadCallback);
        if (!afterLoadCallback) {
            Logger.error(
                `Не удалось загрузить модуль afterLoadCallback ${config.afterLoadCallback}`
            );
        } else {
            callAfterLoadCallback(key, afterLoadCallback, loadResult);
        }
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            Logger.error(
                `DataLoader: Ошибка вызова afterLoadCallback в загрузчике ${id}`,
                void 0,
                error
            );
        }
    }
}

function validateConfigs(
    configs: TDataConfigs,
    loadedFactories?: Record<string, unknown>
): string[] {
    const errors: string[] = [];
    Object.entries(configs).forEach(([key, config]): void => {
        const dependencies = DataConfigResolver.calcAllDependencies(config, 'load');
        if (dependencies) {
            const missedLoaders: string[] = [];
            const circularDependencies: string[] = [];
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
    startedLoaders: TStartedLoaders,
    loadTimeout: TLoadTimeout,
    Router?: IRouter
): Promise<unknown> {
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
    loadTimeout: TLoadTimeout,
    Router?: IRouter,
    loadedDependencies?: Record<string, Promise<unknown>>
): Record<string, Promise<TConfigLoadResult>> {
    const loadConfigs: TDataConfigs = {};
    Object.keys(configs).forEach((loaderKey) => {
        const config = { ...configs[loaderKey] };
        config.dataFactoryArguments = config.dataFactoryArguments || {};
        loadConfigs[loaderKey] = config;
    });
    const startedLoaders = { ...loadedDependencies };
    const loadResult: Record<string, Promise<unknown>> = {};
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
            const result: Record<string, unknown> = {};
            const promises: Promise<unknown>[] = [];
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
    startedLoaders: TStartedLoaders,
    dependenciesResults?: TDependenciesResults,
    loadTimeout?: number | null,
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
        loadTimeout?: number | null,
        Router?: IRouter
    ): Record<string, Promise<TConfigLoadResult>> {
        return load(configs, loadTimeout, Router);
    }

    /**
     * Метод загрузки данных по модулям, которые экспортируют метод getConfig.
     * @param {Record<TKey, IDataConfigLoader>} configGetters Набор фабрик данных
     * @param {Number} [loadTimeout] - общий таймаут для загрузки данных
     * @param {IRouter} [Router] - Роутер.
     * @param {boolean} [returnsDataConfigs] - Флаг для получения конфигураций фабрик из геттеров (ВАЖНО: конфигурация фабрик данных чаще всего не сериализуется)
     */
    static async loadByConfigs(
        configGetters: Record<string, IDataConfigLoader>,
        loadTimeout?: number,
        Router?: IRouter,
        returnsDataConfigs?: boolean
    ): Promise<ILoadedDataConfigsResult> {
        const configGettersResults = await loadDataConfigs(configGetters);
        const loadDataPromises = [];
        let rootLoadingPromise: Record<string, Promise<unknown>>;
        const loadResults: ILoadedDataConfigsResult = {
            configs: {},
            loadResults: {},
        };
        const rootConfig = configGettersResults.dataConfigs[GLOBAL_ROOT_KEY];
        const rootDeps = DataConfigResolver.resolveRootDeps(
            configGettersResults.dataConfigs,
            'load'
        );

        if (rootConfig) {
            rootLoadingPromise = DataLoader.loadEvery(rootConfig, loadTimeout, Router);
        }

        for (const [key, dataConfigs] of Object.entries(configGettersResults.dataConfigs)) {
            const loadedRootResults: Record<string, Promise<unknown>> = {};
            if (rootDeps[key]?.length) {
                rootDeps[key].forEach((rootDep) => {
                    loadedRootResults[rootDep] = rootLoadingPromise[rootDep];
                });
            }
            loadDataPromises.push(
                loadData(dataConfigs, loadTimeout, Router, loadedRootResults)
                    .then((loadResult) => {
                        loadResults.loadResults[key] = loadResult;
                    })
                    .catch((err: Error) => {
                        Logger.error(
                            `Controls-DataEnv/dataLoader::Произошла ошибка при загрузке данных геттера ${key} ${err.message}`,
                            this,
                            err
                        );
                        return err;
                    })
            );
        }

        await Promise.all(loadDataPromises);
        loadResults.configs = configGettersResults.configs;

        if (returnsDataConfigs) {
            loadResults.dataConfigs = configGettersResults.dataConfigs;
        }

        return loadResults;
    }
}
