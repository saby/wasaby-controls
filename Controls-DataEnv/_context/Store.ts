import { TKey } from 'Controls-DataEnv/interface';
import { IDataConfig, IDataFactory, Custom } from 'Controls-DataEnv/dataFactory';
import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IStoreWithSlicesProps {
    loadResults: ILoadResults;
    configs: IDataConfigs;
    router?: IRouter;

    getSlicesConfig?(loadResults: ILoadResults, currentState?: IStore): IDataConfigs;

    onChange(store: IStore): void;
}

type IStore = Record<TKey, Slice | unknown>;

type IDataConfigs = Record<TKey, IDataConfig>;
type ILoadResults = {
    [key in keyof IDataConfigs]: unknown;
};

function resolveDataFactoryArguments(
    dataFactory: IDataFactory,
    config: IDataConfig,
    loadResults: ILoadResults,
    Router: IRouter
): IDataConfig['dataFactoryArguments'] {
    if (!dataFactory.getDataFactoryArguments) {
        return config.dataFactoryArguments;
    }
    const dependenciesResults = {};
    if (config.dependencies) {
        config.dependencies.forEach((dependenciesName) => {
            dependenciesResults[dependenciesName] = loadResults[dependenciesName];
        });
    }
    return dataFactory.getDataFactoryArguments(
        config.dataFactoryArguments,
        dependenciesResults,
        Router
    );
}

function isSimpleResult(config: IDataConfig): boolean {
    const customSliceNames = [
        'Controls/dataFactory:Custom',
        'Controls-DataEnv/dataFactory:Custom',
        'Controls-DataEnv/dataFactory:CompatibleCustom',
    ];
    return customSliceNames.includes(config.dataFactoryName);
}

const COMPATIBLE_TYPE_TO_INTERFACE = {
    list: '[IListSlice]',
};
/**
 * Хранилище данных со слайсами.
 * @class Controls-DataEnv/_context/StoreWithSlices
 * @private
 */
export default class StoreWithSlices {
    protected _configs: IDataConfigs = {};
    protected _props: IStoreWithSlicesProps;
    protected _state: IStore = {};
    private _updaters: Record<string, Slice['setState']> = {};
    private _slicesOrder: string[] = [];
    private _sliceExtraValues: Record<
        string,
        IDataConfig['dataFactoryArguments']['sliceExtraValues']
    > = {};
    protected store: {
        data: Record<string, unknown>;
        controllers: Record<string, Function>;
    } = {
        data: {},
        controllers: {},
    };

    constructor(props: IStoreWithSlicesProps) {
        this._props = props;
        this._configs = props.getSlicesConfig
            ? props.getSlicesConfig(props.loadResults)
            : props.configs;
        this._initSlicesInStore(props.loadResults, this._configs, props.router);
    }

    private _updateStore(): void {
        Object.entries(this._state).forEach(([key, value]) => {
            if (value instanceof Object && value['[ISlice]']) {
                this.store.data[key] = (value as Slice).state;
            }
        });
    }

    private _resolveOrderWithSliceDependencies(configs: IDataConfigs): string[] {
        const dependencies = Object.keys(configs);
        dependencies.sort((configName1: string, configName2) => {
            const config1 = configs[configName1];
            if (config1.dataFactoryArguments?.sliceExtraValues) {
                const configDeps = this._resolveDependencies(
                    config1.dataFactoryArguments.sliceExtraValues
                );
                if (configDeps.includes(configName2)) {
                    return 1;
                } else {
                    return -1;
                }
            }
            return 1;
        });
        return dependencies;
    }

    protected _initSlicesInStore(data: ILoadResults, configs: IDataConfigs, Router: IRouter) {
        const loadingQueues = {};
        const loadedFactories = {};
        this._slicesOrder = this._resolveOrderWithSliceDependencies(configs);
        const onChange = () => {
            this._state = this._createStoreObject(this._state);
            this._updateStore();
            this._props.onChange(this._state);
        };
        Object.entries(configs).forEach(([key, config]) => {
            const loadResult = data[key];
            if (config) {
                if (loadResult instanceof Promise) {
                    const queue = config.dataFactoryCreationOrder || 0;
                    if (!loadingQueues[queue]) {
                        loadingQueues[queue] = [];
                    }
                    loadingQueues[queue].push({
                        loadResult,
                        config,
                        key,
                    });
                } else {
                    loadedFactories[key] = loadResult;
                }
            }
        });
        Object.keys(loadingQueues).forEach((key) => {
            const queue = parseInt(key, 10);
            if (loadingQueues[queue]?.length) {
                const currentQueue = loadingQueues[queue];
                const loadingPromises = currentQueue.map((loadingQueue) => {
                    return loadingQueue.loadResult;
                });
                Promise.all(loadingPromises).then((queueLoadResults) => {
                    const loadResultsMap = {};
                    queueLoadResults.forEach((loadResult, index) => {
                        const currentLoader = currentQueue[index];
                        loadResultsMap[currentLoader.key] = loadResult;
                    });
                    const configsForQueue =
                        this._props.getSlicesConfig?.(loadResultsMap, this._state) || this._configs;
                    this._configs = {
                        ...this._configs,
                        ...configsForQueue,
                    };
                    this._initSlicesInStore(loadResultsMap, this._configs, Router);
                    onChange();
                });
            }
        });
        this._initSlices(loadedFactories, configs, onChange, Router);
        this._state = this._createStoreObject(this._state);
    }

    protected _resolveDependencies(
        sliceExtraValues: IDataConfig['dataFactoryArguments']['sliceExtraValues']
    ): string[] {
        return Object.values(sliceExtraValues).map(([sliceName]) => {
            return sliceName;
        });
    }

    private _addSliceToStore(name: string, slice: Slice): void {
        this._state[name] = slice;
        this._updaters[name] = slice.setState;
        this.store.data[name] = slice.state;
        this.store.controllers[name] = getSliceController(slice);
        const sliceSetStateObserver = (newSlicePartialState) => {
            const newStorePartialState = {
                [name]: newSlicePartialState,
            };
            this.setState(newStorePartialState);
        };
        Object.defineProperty(slice, 'setState', {
            get(): any {
                return sliceSetStateObserver;
            },
        });
    }

    protected _resolveExtraValues(
        sliceExtraValues: IDataConfig['dataFactoryArguments']['sliceExtraValues'],
        slices: IStore
    ): Record<string, unknown> {
        const properties = {};
        Object.entries(sliceExtraValues).forEach(([propName, [sliceName, depProperty]]) => {
            properties[propName] = (slices[sliceName] as Slice).state[depProperty];
        });
        return properties;
    }

    protected _initSlices(
        loadResults: ILoadResults,
        configs: IDataConfigs = {},
        storeChangedCallback: Function,
        Router: IRouter
    ) {
        Object.entries(configs).forEach(([key, config]) => {
            const loadResult = loadResults[key];
            // надо разобраться как строиться по конфигам, передают конфиги с пустыми loadResults и ожидают, что контекста не будет
            if (
                this._state.hasOwnProperty(key) ||
                (!loadResult && !this._props.getSlicesConfig) ||
                loadResult instanceof Promise
            ) {
                return;
            }
            if (!isSimpleResult(configs[key])) {
                if (config.dataFactoryArguments?.sliceExtraValues) {
                    const dependencies = this._resolveDependencies(
                        config.dataFactoryArguments.sliceExtraValues
                    );
                    const depLoadResults = {};
                    const depConfigs = {};
                    dependencies.forEach((dependency) => {
                        if (!this._state[dependency]) {
                            depLoadResults[dependency] = loadResults[dependency];
                            depConfigs[dependency] = configs[dependency];
                        }
                        this._initSlices(depLoadResults, depConfigs, storeChangedCallback, Router);
                    });
                    const slice = this._createSlice(
                        key,
                        loadResult,
                        loadResults,
                        config,
                        storeChangedCallback,
                        Router
                    );
                    this._addSliceToStore(key, slice);
                } else if (!this._state[key]) {
                    const slice = this._createSlice(
                        key,
                        loadResult,
                        loadResults,
                        config,
                        storeChangedCallback,
                        Router
                    );
                    this._addSliceToStore(key, slice);
                }
            } else {
                this._state[key] = loadResult;
            }
        });
    }

    private _createStoreObject(state: IStore): IStore {
        const descriptors = Object.getOwnPropertyDescriptors(state);
        return Object.create(
            {
                getStoreData: getStoreData.bind(null, state),
                store: this.store,
            },
            descriptors
        );
    }

    protected _createSlice(
        name: string,
        loadResult,
        loadResults,
        config,
        changedCallback: Function,
        Router: IRouter
    ): Slice {
        const dataFactory = loadSync<IDataFactory>(config.dataFactoryName);
        const sliceCtr = dataFactory.slice || Custom.slice;
        let extraValues = {};
        let dataFactoryArguments = resolveDataFactoryArguments(
            dataFactory,
            config,
            loadResults,
            Router
        );
        const isValueSimpleObject =
            loadResult?.constructor === Object &&
            Object.getPrototypeOf(loadResult) === Object.prototype;
        if (config.dataFactoryArguments?.sliceExtraValues) {
            extraValues = this._resolveExtraValues(
                config.dataFactoryArguments.sliceExtraValues,
                this._state
            );
            dataFactoryArguments = { ...dataFactoryArguments, ...extraValues };
            this._sliceExtraValues[name] = config.dataFactoryArguments.sliceExtraValues;
        }
        return new sliceCtr({
            config: dataFactoryArguments,
            loadResult: isValueSimpleObject ? { ...loadResult } : loadResult,
            onChange: changedCallback,
        });
    }

    private _resolveStateForUpdate(partialState: Record<string, object>): Record<string, object> {
        const stateForUpdate = { ...partialState };
        Object.entries(partialState).forEach(([changedSliceName, partialChangedSliceState]) => {
            const storeValue = this._state[changedSliceName];
            if (isSlice(storeValue)) {
                Object.entries(this._sliceExtraValues).forEach(([sliceName, sliceExtraValues]) => {
                    Object.entries(sliceExtraValues).forEach(
                        ([propName, [extraSliceName, extraPropName]]) => {
                            if (
                                extraSliceName === changedSliceName &&
                                partialChangedSliceState.hasOwnProperty(extraPropName)
                            ) {
                                stateForUpdate[sliceName] = stateForUpdate[sliceName] || {};
                                stateForUpdate[sliceName][propName] =
                                    partialChangedSliceState[extraPropName];
                            }
                        }
                    );
                });
            }
        });
        return stateForUpdate;
    }

    getState(): IStore {
        return this._state;
    }

    setState(partialState: Record<string, object>): void {
        const stateForUpdate = this._resolveStateForUpdate(partialState);
        this._slicesOrder.forEach((name) => {
            if (stateForUpdate[name]) {
                const partialStateSlice = stateForUpdate[name];
                const storeValue = this._state[name];
                if (isSlice(storeValue)) {
                    this._updaters[name].call(storeValue, partialStateSlice);
                } else {
                    this._state[name] = partialStateSlice;
                }
            }
        });
    }

    destroy() {
        Object.values(this._state).forEach((stateValue) => {
            if (isSlice(stateValue)) {
                (stateValue as Slice).destroy();
            }
        });
        this._state = null;
        this._updaters = null;
        this._props = null;
        this.store = null;
    }
}

function getStoreData(
    state: Record<TKey, Slice>,
    storeId: TKey | TKey[],
    firstOfType?: string
): Slice | Record<TKey, Slice> {
    if (storeId instanceof Array) {
        const result = {};
        Object.entries(state).forEach(([key, value]) => {
            if (storeId.includes(key)) {
                result[key] = value;
            }
        });
        return result;
    } else if (storeId !== null && storeId !== undefined) {
        return state[storeId];
    } else if (firstOfType) {
        return Object.values(state).find((value) => {
            return value?.[COMPATIBLE_TYPE_TO_INTERFACE[firstOfType]];
        });
    }
}

function getSliceController(slice: Slice): Record<string, Function> {
    const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(slice));
    const controller = {};
    properties.forEach((name) => {
        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(slice), name);
        if (
            descriptor &&
            !descriptor.get &&
            typeof descriptor.value === 'function' &&
            name !== 'constructor' &&
            !name.startsWith('_')
        ) {
            controller[name] = slice[name];
        }
    });
    return controller;
}

function isSlice(value: unknown): boolean {
    return value instanceof Object && value['[ISlice]'];
}
