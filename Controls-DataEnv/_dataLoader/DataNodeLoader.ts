import { DataContext } from 'Controls-DataEnv/dataContext';
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
    dataContext: DataContext;
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
    private readonly _$dataContext: DataContext;
    private _$resolvedConfig: IDataConfigLoader & { isAsyncConfigGetter: boolean; error?: Error };
    private readonly _$router: IRouter;
    private readonly _$path: string[];
    private _$dataConfigs: TDataConfigs = {};
    private _$loadTimeout: number | null | undefined;

    private _checkDependencies(): boolean {
        return true;
    }

    constructor(props: IDataNodeLoaderProps) {
        this._$dataContext = props.dataContext;
        this._$config = props.config;
        this._$router = props.router;
        this._$path = props.path || [];
        this._$loadTimeout = props.loadTimeout;
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

            if (!module) {
                throw new Error(
                    `Controls-DataEnv/dataLoader:Loader.loadConfigGetter:: Не удалось загрузить модуль ${this._$config.configGetter}`
                );
            } else {
                try {
                    const getConfigResult = callGetConfig(
                        module,
                        this._$config,
                        this._$dataContext,
                        this._$path
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
                        'Ошибка при получении конфигурации предзагрузки из ' +
                            `${this._$config.configGetter}. \n Error: ${e}`
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

    async load(): Promise<Record<string, unknown>> {
        if ('configs' in this._$config) {
            return new DataConfigsLoader({
                configs: this._$config.configs,
                router: this._$router,
                data: this._$dataContext.hasNode(this._$path)
                    ? this._$dataContext.getNodeData(this._$path)
                    : undefined,
                loadTimeout: this._$loadTimeout,
            }).load();
        } else if ('configGetter' in this._$config) {
            const configGetterResult = await this.loadConfigGetter();

            if (configGetterResult.dataConfigs) {
                return new DataConfigsLoader({
                    configs: configGetterResult.dataConfigs,
                    router: this._$router,
                    data: this._$dataContext.hasNode(this._$path)
                        ? this._$dataContext.getNodeData(this._$path)
                        : undefined,
                    loadTimeout: this._$loadTimeout,
                }).load();
            }
        }

        return Promise.reject(new Error('В DataNode передана неверная конфигурация фабрик'));
    }

    getDataConfigs(): TDataConfigs {
        return this._$dataConfigs;
    }

    getResolvedConfig(): typeof this._$resolvedConfig {
        return this._$resolvedConfig;
    }
}
