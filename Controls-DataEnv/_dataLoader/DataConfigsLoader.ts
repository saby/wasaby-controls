import { TDataConfigs, IDataConfig, DataConfigResolver } from 'Controls-DataEnv/dataFactory';
import { IRouter } from 'Router/router';
import DataFactoryLoader from './DataFactoryLoader';
import { TLoadTimeout } from './interface';

export interface IDataNodeLoaderProps {
    configs: TDataConfigs;
    data?: Record<string, unknown>;
    router?: IRouter;
    loadTimeout?: TLoadTimeout;
}

function validateConfigs(configs: TDataConfigs): string[] {
    const errors: string[] = [];
    Object.entries(configs).forEach(([key, config]): void => {
        const dependencies = DataConfigResolver.calcAllDependencies(config, 'load');
        if (dependencies) {
            const missedLoaders: string[] = [];
            const circularDependencies: string[] = [];
            dependencies.forEach((dependency: string) => {
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

/**
 * Класс загрузчик данных
 * @public
 */
export default class DataConfigsLoader {
    private readonly _$configs: TDataConfigs = {};
    private readonly _$router?: IRouter;
    private readonly _$loadTimeout: TLoadTimeout;
    private readonly _$elements: Record<string, DataFactoryLoader> = {};
    private readonly _$validateErrors: string[] = [];
    private _$data: Record<string, unknown> | undefined;

    private async _callLoader(config: IDataConfig, name: string): Promise<unknown> {
        let dependencies = {};
        const allDeps = DataConfigResolver.calcAllDependencies(config, 'load');

        if (allDeps) {
            dependencies = await this._loadDependencies(allDeps);
        }

        if (!this._$elements[name]) {
            this._$elements[name] = new DataFactoryLoader({
                config,
                router: this._$router,
                dependencies,
                name,
                loadTimeout: this._$loadTimeout,
                data: this._$data?.[name],
            });
        }

        return this._$elements[name].load();
    }

    private async _loadDependencies(dependencies: string[]): Promise<Record<string, unknown>> {
        const promises: Promise<unknown>[] = [];
        const loadDependenciesResult: Record<string, unknown> = {};

        dependencies.forEach((dependency, index) => {
            const depLoadPromise: Promise<unknown> = this._callLoader(
                this._$configs[dependency],
                dependency
            );

            depLoadPromise.then((loadResult) => {
                // Для совместимости, т.к. зависимости получают так же по индексу массива
                loadDependenciesResult[index] = loadResult;
                loadDependenciesResult[dependency] = loadResult;
            });
            promises.push(depLoadPromise);
        });

        await Promise.all(promises);

        return loadDependenciesResult;
    }

    constructor(props: IDataNodeLoaderProps) {
        this._$configs = props.configs;
        this._$router = props.router;
        this._$validateErrors = validateConfigs(this._$configs);
        this._$data = props.data;
        this._$loadTimeout = props.loadTimeout;
    }

    async load(): Promise<Record<string, unknown>> {
        if (this._$validateErrors.length) {
            return Promise.reject(this._$validateErrors.join(', '));
        }

        const result: Record<string, unknown> = {};
        const loadPromises = this.loadEvery();
        const promises = [];

        for (const [key, loadPromise] of Object.entries(loadPromises)) {
            promises.push(
                loadPromise.then((loadResult: unknown) => {
                    result[key] = loadResult;
                })
            );
        }

        await Promise.all(promises);
        return result;
    }

    loadEvery(): Record<string, Promise<unknown>> {
        const loadResult: Record<string, Promise<unknown>> = {};

        Object.entries(this._$configs).forEach(([key, config]) => {
            loadResult[key] = this._callLoader(config, key);
        });

        return loadResult;
    }
}
