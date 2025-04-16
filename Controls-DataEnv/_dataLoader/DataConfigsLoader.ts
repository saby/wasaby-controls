import { TDataConfigs, IDataConfig, DataConfigResolver } from 'Controls-DataEnv/dataFactory';
import { IRouter } from 'Router/router';
import DataFactoryLoader from './DataFactoryLoader';
import { TLoadTimeout } from './interface';

export interface IDataNodeLoaderProps {
    configs: TDataConfigs;
    data?: Record<string, unknown>;
    router?: IRouter;
    loadTimeout?: TLoadTimeout;
    parent: string;
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
    private readonly _$pendingElements: Record<string, DataFactoryLoader> = {};
    private readonly _$validateErrors: string[] = [];
    private readonly _$data: Record<string, unknown> | undefined;
    private readonly _$parent: string;

    constructor(props: IDataNodeLoaderProps) {
        this._$configs = props.configs;
        this._$router = props.router;
        this._$validateErrors = validateConfigs(this._$configs);
        this._$data = props.data;
        this._$loadTimeout = props.loadTimeout;
        this._$parent = props.parent;
    }

    private async _callLoader(config: IDataConfig, name: string): Promise<unknown> {
        let dependencies = {};
        const allDeps = DataConfigResolver.calcAllDependencies(config, 'load');

        if (!!allDeps.length) {
            dependencies = await this._loadDependencies(allDeps);
        }

        if (!this._$pendingElements[name]) {
            this._$pendingElements[name] = new DataFactoryLoader({
                config,
                router: this._$router,
                dependencies,
                parent: this._$parent,
                name,
                loadTimeout: this._$loadTimeout,
                data: this._$data?.[name],
            });
        }

        return this._$pendingElements[name].load();
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

    getPendingContextElementsInfo(): string {
        const pendingElementsKeys = Object.keys(this._$pendingElements);

        if (pendingElementsKeys.length > 0) {
            return pendingElementsKeys
                .map((name, index) => {
                    const pendingLoader = this._$pendingElements[name];

                    return `${index}. Название зависшей фабрики: ${pendingLoader.getDataFactoryName()}
Ключ в конфигурации контекста: ${pendingLoader.getName()}`;
                })
                .join('\n');
        }

        return '';
    }

    hasPendingContextElements(): boolean {
        return Object.keys(this._$pendingElements).length > 0;
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
                    delete this._$pendingElements[key];
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
