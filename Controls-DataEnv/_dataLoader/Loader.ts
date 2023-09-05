import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { constants } from 'Env/Constants';
import { TKey } from 'Controls-DataEnv/interface';
import { IDataFactory, IDataConfig } from '../dataFactory';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';
import { IRouter } from 'Router/router';

export type TDataConfigs = Record<TKey, IDataConfig>;

interface IDataConfigLoadResult {
    type: string;
    [key: string]: unknown;
}

export type TConfigLoadResult = IDataConfigLoadResult | unknown;

const DEFAULT_LOAD_TIMEOUT = 10000;
const DEBUG_DEFAULT_LOAD_TIMEOUT = 30000;

function calculateMinOrder(configs: TDataConfigs): number {
    const orders = Object.values(configs).map((config: IDataConfig): number => {
        return config.dataFactoryCreationOrder || 0;
    });
    return Math.min.apply(null, orders);
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
    static load(
        configs: TDataConfigs,
        loadTimeout?: number,
        Router?: IRouter
    ): Promise<Record<keyof TDataConfigs, unknown>> {
        const validateErrors = DataLoader._validateConfigs(configs);
        if (validateErrors.length) {
            return Promise.reject(validateErrors.join(', '));
        } else {
            const loadResults = DataLoader._load(configs, loadTimeout, Router);
            return new Promise((resolve, reject) => {
                const result = {};
                const promises = [];
                const minLoadOrder = calculateMinOrder(configs);
                Object.keys(loadResults).forEach((key) => {
                    const dataFactoryCreationOrder = configs[key].dataFactoryCreationOrder || 0;
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

    /**
     * Метод, который возвращает результирующие промисы каждого загрузчика, не дожидаясь их загрузки.
     * @param {Record<TKey, Controls-DataEnv/_dataFactory/interface/IDataConfig>} configs Набор фабрик данных
     * @param {Number} loadTimeout - общий таймаут для загрузки данных
     * @param {IRouter} [Router] - Роутер.
     */
    static loadEvery(
        configs: TDataConfigs,
        loadTimeout?: number,
        Router?: IRouter
    ): Record<string, Promise<TConfigLoadResult>> {
        return DataLoader._load(configs, loadTimeout, Router);
    }

    private static _getLoadTimeout(loadConfig: IDataConfig): number {
        return (
            loadConfig.dataFactoryArguments?.loadDataTimeout ||
            (constants.isProduction ? DEFAULT_LOAD_TIMEOUT : DEBUG_DEFAULT_LOAD_TIMEOUT)
        );
    }

    private static _callLoaderWithDependencies(
        key: string,
        config: IDataConfig,
        configs: TDataConfigs,
        startedLoaders: Record<string, Promise<any>>,
        loadTimeout: number,
        Router?: IRouter
    ): Promise<any> {
        if (config.dependencies) {
            return this._loadDependencies(
                config.dependencies,
                startedLoaders,
                configs,
                loadTimeout
            ).then((results) => {
                return this._callLoader(key, configs[key], startedLoaders, results, loadTimeout);
            });
        } else {
            return this._callLoader(
                key,
                configs[key],
                startedLoaders,
                undefined,
                loadTimeout,
                Router
            );
        }
    }

    private static _load(
        configs: TDataConfigs,
        loadTimeout: number,
        Router: IRouter
    ): Record<string, Promise<TConfigLoadResult>> {
        const loadConfigs = {};
        Object.keys(configs).forEach((loaderKey) => {
            const config = { ...configs[loaderKey] };
            config.dataFactoryArguments = config.dataFactoryArguments || {};
            loadConfigs[loaderKey] = config;
        });
        const startedLoaders = {};
        const loadResult = {};
        Object.entries(loadConfigs).forEach(([key, config]) => {
            const timeout = loadTimeout || DataLoader._getLoadTimeout(config);
            loadResult[key] = this._callLoaderWithDependencies(
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

    private static _loadDependencies(
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
                depLoadPromise = this._callLoaderWithDependencies(
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

    private static _loadDataFactory(dataFactoryName: string): Promise<IDataFactory> {
        if (isLoaded(dataFactoryName)) {
            addPageDeps([dataFactoryName]);
            return Promise.resolve(loadSync(dataFactoryName) as IDataFactory);
        } else {
            return loadAsync(dataFactoryName).then((dataFactory: IDataFactory) => {
                addPageDeps([dataFactoryName]);
                return dataFactory;
            });
        }
    }

    private static _callLoader(
        id: string,
        config: IDataConfig,
        startedLoaders: Record<string, Promise<Record<TKey, unknown> | Error>>,
        dependenciesResults?: Record<string, Promise<Record<TKey, unknown> | Error>>,
        loadTimeout?: number,
        Router?: IRouter
    ): Promise<Record<TKey, unknown> | Error> {
        if (!config.dataFactoryName) {
            return Promise.reject('Не задана фабрика данных');
        } else {
            if (!startedLoaders[id]) {
                startedLoaders[id] = DataLoader._loadDataFactory(config.dataFactoryName)
                    .then((dataFactory) => {
                        let dataFactoryArguments = config.dataFactoryArguments;
                        if (dataFactory.getDataFactoryArguments) {
                            dataFactoryArguments = dataFactory.getDataFactoryArguments(
                                dataFactoryArguments,
                                dependenciesResults
                            );
                        }
                        if (loadTimeout && !dataFactoryArguments?.loadDataTimeout) {
                            dataFactoryArguments.loadDataTimeout = loadTimeout;
                        }
                        return dataFactory
                            .loadData(dataFactoryArguments, dependenciesResults, Router)
                            .then((result) => {
                                if (config.afterLoadCallback) {
                                    if (isLoaded(config.afterLoadCallback)) {
                                        DataLoader._callAfterLoadCallback(
                                            id,
                                            loadSync(config.afterLoadCallback),
                                            result
                                        );
                                    } else {
                                        return loadAsync(config.afterLoadCallback).then(
                                            (callback: Function) => {
                                                DataLoader._callAfterLoadCallback(
                                                    id,
                                                    callback,
                                                    result
                                                );
                                                return result;
                                            }
                                        );
                                    }
                                }
                                return result;
                            });
                    })
                    .catch((error) => {
                        Logger.error(
                            `Ошибка загрузки фабрики ${config.dataFactoryName} c ключом ${id}`,
                            this,
                            error
                        );
                        return error;
                    });
            }
            return startedLoaders[id];
        }
    }

    private static _validateConfigs(configs: TDataConfigs): string[] {
        const errors = [];
        Object.entries(configs).forEach(([key, config]): void => {
            if (config.dependencies) {
                const missedLoaders = [];
                const circularDependencies = [];
                config.dependencies.forEach((dependency: string) => {
                    if (!configs.hasOwnProperty(dependency)) {
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
                        `Отсутствуют загрузчики с ключами ${missedLoaders.join(
                            ', '
                        )}, указанные в зависимостях для загрузчика ${key}`
                    );
                }
                if (circularDependencies.length) {
                    errors.push(
                        `У загрузчика с ключом ${key} найдены циклические зависимости ${circularDependencies.join(
                            ', '
                        )}`
                    );
                }
            }
        });
        return errors;
    }

    private static _callAfterLoadCallback(
        id: string,
        callback: Function,
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
}
