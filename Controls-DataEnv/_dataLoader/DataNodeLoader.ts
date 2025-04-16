import { DataContextAPI } from 'Controls-DataEnv/context';
import {
    callGetConfig,
    DataConfigResolver,
    IDataConfigLoader,
    TDataConfigs,
    TConfigGetterModule,
    TOldDataConfigs,
    isDataNodeConfigGetter,
    IDataNodeConfigs,
} from 'Controls-DataEnv/dataFactory';
import DataConfigsLoader from './DataConfigsLoader';
import { IRouter } from 'Router/router';
import { logger as Logger } from 'Application/Env';
//@ts-ignore;
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { GET_CONFIG_TIMEOUT } from './Constants';

import { loadModule, loadErrorHandler } from './utils';

export interface IDataNodeLoaderProps {
    config: IDataConfigLoader;
    dataContext: DataContextAPI;
    router: IRouter;
    loadTimeout: number | null | undefined;
    path?: string[];
}

export interface ILoadConfigGetterResult {
    dataConfigs: TDataConfigs;
    isAsyncConfigGetter: boolean;
    error?: Error;
}

export default class DataNodeLoader {
    private readonly _$config: IDataConfigLoader | IDataNodeConfigs;
    private readonly _$dataContext: DataContextAPI;
    private _$resolvedConfig: IDataConfigLoader & { isAsyncConfigGetter: boolean; error?: Error };
    private readonly _$router: IRouter;
    private readonly _$path: string[];
    private _$dataConfigs: TDataConfigs = {};
    private _$loadTimeout: number | null | undefined;
    private _$loader: DataConfigsLoader;

    constructor(props: IDataNodeLoaderProps) {
        this._$dataContext = props.dataContext;
        this._$config = props.config;
        this._$router = props.router;
        this._$path = props.path || [];
        this._$loadTimeout = props.loadTimeout;
    }

    private _checkDependencies(): boolean {
        return true;
    }

    async loadConfigGetter(): Promise<ILoadConfigGetterResult> {
        if (!this._checkDependencies()) {
            //todo
        }
        if (isDataNodeConfigGetter(this._$config)) {
            const module = await loadModule<TConfigGetterModule>(this._$config.configGetter);
            let dataConfigs = {};
            let isAsyncConfigGetter = false;
            let error;

            if (module) {
                try {
                    const getConfigResult = callGetConfig(
                        module,
                        this._$config,
                        this._$dataContext
                    );
                    isAsyncConfigGetter = !!getConfigResult.then;

                    if (isAsyncConfigGetter) {
                        dataConfigs = await wrapTimeout(getConfigResult, GET_CONFIG_TIMEOUT);
                    } else {
                        dataConfigs = getConfigResult;
                    }
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        error = e;
                    }
                    loadErrorHandler(
                        e,
                        `Ошибка при получении конфигурации предзагрузки из модуля ${this._$config.configGetter}`
                    );
                }

                if (!DataConfigResolver.isOldDataFormat(dataConfigs)) {
                    if (isAsyncConfigGetter) {
                        Logger.warn(
                            `Controls-DataEnv/dataLoader:Loader.loadConfigGetter::Метод getConfig у модуля ${this._$config.configGetter} должен быть синхронным!`
                        );
                    }
                } else {
                    dataConfigs = DataConfigResolver.convertLoadResultsToFactory(
                        dataConfigs as TOldDataConfigs
                    ) as unknown as TDataConfigs;
                }
            } else {
                error = new Error(
                    `Произошла ошибка при загрузке модуля ${this._$config.configGetter}. Узел контекста будет создан пустым`
                );
            }

            this._$dataConfigs = dataConfigs as TDataConfigs;
            this._$resolvedConfig = {
                isAsyncConfigGetter,
                error,
                ...this._$config,
            };

            return {
                dataConfigs,
                isAsyncConfigGetter,
                error,
            };
        } else {
            return Promise.reject('Передан неверный конфиг в loadConfigGetter');
        }
    }

    getName(): string {
        return this._$path.join(', ') || 'root';
    }

    async load(): Promise<Record<string, unknown>> {
        const loaderParams = {
            router: this._$router,
            data: this._$config.data,
            loadTimeout: this._$loadTimeout,
            configs: {},
            parent: this.getName(),
        };

        if ('configs' in this._$config) {
            loaderParams.configs = this._$config.configs;
        } else if ('configGetter' in this._$config) {
            const configGetterResult = await this.loadConfigGetter();

            if (configGetterResult.dataConfigs) {
                loaderParams.configs = configGetterResult.dataConfigs;
            }
        } else {
            return {};
        }

        this._$loader = new DataConfigsLoader(loaderParams);
        return this._$loader.load();
    }

    getDataConfigs(): TDataConfigs {
        return this._$dataConfigs;
    }

    getPendingContextElementsInfo(): string {
        return this._$loader?.getPendingContextElementsInfo() || '';
    }

    isReady(): boolean {
        return !this._$loader?.hasPendingContextElements();
    }

    getResolvedConfig(): typeof this._$resolvedConfig {
        return this._$resolvedConfig;
    }
}
