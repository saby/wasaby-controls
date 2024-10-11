/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { default as NewSourceController, IControllerState } from 'Controls/_dataSource/Controller';
import { ControllerClass as FilterController } from 'Controls/filterOld';
import { Guid } from 'Types/entity';
// eslint-disable-next-line deprecated-anywhere
import { ControllerClass as SearchController } from 'Controls/searchDeprecated';
import Storage from './DataLoader/Storage';
import { ILoadDataConfig } from './DataLoader/interface/ILoadDataConfig';
import { ILoadDataResult } from './DataLoader/interface/ILoadDataResult';
import { IDataConfig } from 'Controls/dataFactory';
import { TKey } from 'Controls/interface';
import { Loader } from 'Controls-DataEnv/dataLoader';

export interface IDataLoaderOptions {
    loadDataConfigs?: ILoadDataConfig[];
}

const COMPATIBLE_MAP_TYPE = {
    list: 'Controls/dataFactory:CompatibleList',
    custom: 'Controls-DataEnv/dataFactory:CompatibleCustom',
    area: 'Controls-DataEnv/dataFactory:CompatibleArea',
};

type IDataConfigs = Record<TKey, IDataConfig>;

type TLoadResult = ILoadDataResult | TCustomResult | boolean;
export type TCustomResult = unknown;
export type TLoadersConfigsMap = IDataConfigs;
export type TLoadResultMap = Record<string, TLoadResult>;

export default class DataLoader {
    private _loadedConfigStorage: Storage = new Storage();
    private _loadDataConfigs: TLoadersConfigsMap[] | TLoadersConfigsMap;
    private _originLoadDataConfigs: TLoadersConfigsMap[];

    constructor(options: IDataLoaderOptions = {}) {
        if (options.loadDataConfigs instanceof Array) {
            this._originLoadDataConfigs = options.loadDataConfigs || [];
            this._loadDataConfigs = this._getConfigsWithKeys(this._originLoadDataConfigs);
            this._loadDataConfigs.forEach((config, index) => {
                // Сеттим оригинальные конфиги, чтобы в SourceController не попал id, если его не задавали
                this._loadedConfigStorage.set(this._originLoadDataConfigs[index], config.id);
            });
        } else {
            this._loadDataConfigs = options.loadDataConfigs || {};
            Object.keys(this._loadDataConfigs).forEach((key) => {
                this._loadedConfigStorage.set(this._loadDataConfigs[key], key);
            });
        }
    }

    load<T extends ILoadDataResult>(
        sourceConfigs?: TLoadersConfigsMap[] | TLoadersConfigsMap = this._loadDataConfigs,
        loadTimeout?: number,
        Router?: object
    ): Promise<IDataConfigs> {
        const configs = this._loadersCompatibility(sourceConfigs);
        return Loader.load(configs, loadTimeout, Router).then((results) => {
            Object.entries(results).forEach(([key, result]) => {
                this._loadedConfigStorage.set(result, key);
            });
            if (sourceConfigs instanceof Array) {
                return Object.values(results);
            }
            return results;
        });
    }

    loadEvery(
        sourceConfigs?: TLoadersConfigsMap[] | TLoadersConfigsMap = this._loadDataConfigs,
        loadTimeout?: number,
        Router: object
    ): any {
        const configs = this._loadersCompatibility(sourceConfigs);
        const loadResults = Loader.loadEvery(configs, loadTimeout, Router);
        if (sourceConfigs instanceof Array) {
            const results = [];
            sourceConfigs.forEach((config, key) => {
                results.push(loadResults[key]);
            });
        }
        return loadResults;
    }

    private _loadersCompatibility(
        sourceConfigs: TLoadersConfigsMap[] | TLoadersConfigsMap
    ): IDataConfigs {
        const configs = {};
        if (sourceConfigs instanceof Array) {
            sourceConfigs.forEach((config, key) => {
                const configKey = config.key || config.id || key;
                configs[configKey] = this._normalizeConfig(config);
            });
        } else {
            Object.entries(sourceConfigs).forEach(([key, config]) => {
                configs[key] = this._normalizeConfig(config);
            });
        }
        return configs;
    }

    private _normalizeConfig(config: TLoadersConfigsMap): IDataConfig {
        const factoryArgs = config.dataFactoryArguments || config;
        return {
            dataFactoryName:
                config.dataFactoryName ||
                (config.type ? COMPATIBLE_MAP_TYPE[config.type] : COMPATIBLE_MAP_TYPE.list),
            dataFactoryArguments: {
                ...factoryArgs,
                loadDataTimeout: factoryArgs.loadDataTimeout || factoryArgs.loadTimeout,
            },
            dataFactoryArgumentsGetter: config.dataFactoryArgumentsGetter,
            dependencies: config.dependencies,
            afterLoadCallback: config.afterLoadCallback,
        };
    }

    private _getConfigsWithKeys(configs: TLoadersConfigsMap[]): TLoadersConfigsMap[] {
        return configs.map((config) => {
            return {
                // config.id может быть 0 поэтому проверяем именно на null и undefined
                id: config.id ?? Guid.create(),
                ...config,
            };
        });
    }

    getSourceController(id?: string): NewSourceController {
        return this._loadedConfigStorage.getSourceController(id);
    }

    updateState(key: string, value: object): void {
        if (value && typeof value === 'object' && value['[ISlice]']) {
            this._loadedConfigStorage.set(value.state, key);
        } else {
            this._loadedConfigStorage.set(value, key);
        }
    }

    setSourceController(id: string, sourceController: NewSourceController): void {
        return this._loadedConfigStorage.setSourceController(id, sourceController);
    }

    getFilterController(id?: string): FilterController {
        return this._loadedConfigStorage.getFilterController(id);
    }

    setFilterController(id: string, filterController: FilterController): void {
        return this._loadedConfigStorage.setFilterController(id, filterController);
    }

    getSearchController(id?: string): Promise<SearchController> {
        return this._loadedConfigStorage.getSearchController(id);
    }

    getSearchControllerSync(id?: string): SearchController {
        return this._loadedConfigStorage.getSearchControllerSync(id);
    }

    getState(): Record<string, IControllerState> {
        const state = {};
        this._loadedConfigStorage.each((config, id) => {
            let currentState = config;
            if (currentState?.sourceController) {
                currentState = {
                    type: 'list',
                    ...currentState,
                    ...currentState.sourceController.getState(),
                };
            }
            state[id] = currentState;
        });
        return state;
    }

    destroy(): void {
        this._loadedConfigStorage.destroy();
    }

    each(callback: Function): void {
        this._loadedConfigStorage.each((config: ILoadDataResult, id) => {
            callback(config, id);
        });
    }

    getStorage(): Storage {
        return this._loadedConfigStorage;
    }
}
