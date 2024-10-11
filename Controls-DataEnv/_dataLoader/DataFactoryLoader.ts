import { IDataConfig, IDataFactory } from 'Controls-DataEnv/dataFactory';
import { IRouter } from 'Router/router';
import { loadErrorHandler, loadModule } from './utils';
import { TLoadTimeout, TDependenciesResults } from './interface';
import { constants } from 'Env/Constants';

export type TAfterLoadCallback = (loadResult: unknown) => void;

export interface IElementLoaderProps {
    config: IDataConfig;
    router?: IRouter;
    loadTimeout: TLoadTimeout;
    name: string;
    dependencies: TDependenciesResults;
    errorHandler?: Function;
    data?: unknown;
}

const DEFAULT_LOAD_TIMEOUT = 10000;

function getLoadTimeout(loadConfig: IDataConfig): TLoadTimeout {
    return (
        loadConfig.dataFactoryArguments?.loadDataTimeout ||
        (constants.isServerSide ? DEFAULT_LOAD_TIMEOUT : null)
    );
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

function errorHandler(e: unknown, message: string): void {
    loadErrorHandler(e, message);
}

export default class DataFactoryLoader {
    private readonly _$config: IDataConfig;
    private readonly _$router?: IRouter;
    private readonly _$loadTimeout: TLoadTimeout;
    private readonly _$name: string;
    private readonly _$dependencies: TDependenciesResults;
    private readonly _$errorHandler: Function;
    private _loadPromise: Promise<unknown>;
    private readonly _$data: unknown;

    constructor(props: IElementLoaderProps) {
        this._$config = { ...props.config };
        this._$config.dataFactoryArguments = this._$config.dataFactoryArguments || {};
        this._$router = props.router;
        this._$loadTimeout = props.loadTimeout || getLoadTimeout(this._$config);
        this._$name = props.name;
        this._$dependencies = props.dependencies;
        this._$errorHandler = props.errorHandler || errorHandler;
        this._$data = props.data;
    }

    private async _load(): Promise<unknown> {
        const dataFactory = await loadModule<IDataFactory>(this._$config.dataFactoryName);
        let loadResult;

        if (!dataFactory) {
            throw new Error(`Не удалось загрузить фабрику ${this._$config.dataFactoryName}`);
        }
        try {
            if (this._$data !== undefined) {
                loadResult = this._$data;
            } else {
                const dataFactoryArguments: IDataConfig['dataFactoryArguments'] =
                    getDataFactoryArguments(
                        dataFactory,
                        this._$config,
                        this._$dependencies,
                        this._$loadTimeout
                    );

                loadResult = await dataFactory.loadData(
                    dataFactoryArguments,
                    this._$dependencies,
                    this._$router,
                    false,
                    this._$name
                );
                if (this._$config.afterLoadCallback) {
                    const afterLoadCallback = await loadModule<TAfterLoadCallback>(
                        this._$config.afterLoadCallback
                    );
                    if (!afterLoadCallback) {
                        this._$errorHandler(
                            new Error(
                                `Не удалось загрузить модуль afterLoadCallback ${this._$config.afterLoadCallback}`
                            )
                        );
                    } else {
                        this._callAfterLoadCallback(this._$name, afterLoadCallback, loadResult);
                    }
                }
            }
        } catch (error: unknown) {
            this._$errorHandler(
                error,
                `Controls-DataEnv/dataLoader:Loader.loadDataFactory: Произошла ошибка во время выполнения метода loadData у фабрики ${this._$config.dataFactoryName} с ключом ${this._$name}
             и параметрами ${this._$config.dataFactoryArguments}`
            );
            loadResult = error;
        }

        return loadResult;
    }

    private _callAfterLoadCallback(
        id: string,
        callback: TAfterLoadCallback,
        loadResult: unknown
    ): void {
        try {
            callback(loadResult);
        } catch (error: unknown) {
            this._$errorHandler(
                error,
                `DataLoader: Ошибка вызова afterLoadCallback в загрузчике ${id}`
            );
        }
    }

    isLoading(): boolean {
        return !!this._loadPromise;
    }

    async load(): Promise<unknown> {
        if (!this.isLoading()) {
            this._loadPromise = this._load();
        }

        return this._loadPromise;
    }
}
