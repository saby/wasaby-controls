import { TKey } from 'Controls-DataEnv/interface';
import {
    IDataConfig,
    IDataFactory,
    Custom,
    IDataConfigLoader,
    DataConfigResolver,
} from 'Controls-DataEnv/dataFactory';
import { Slice, AbstractSlice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IStoreWithSlicesProps {
    loadResults?: ILoadResults;
    configs?: IDataConfigs;
    router?: IRouter;
    dataConfigs?: IDataConfigsProp;

    getSlicesConfig?(loadResults: ILoadResults, currentState?: IStore): IDataConfigs;

    onChange(store: IStore): void;
}

export interface IDataConfigsProp {
    configs: Record<
        string,
        IDataConfigLoader & {
            isAsyncConfigGetter: boolean;
            /**
             * configGetter предзагружен внешней сущностью
             */
            isResolvedConfigGetter: boolean;
        }
    >;
    loadResults: Record<string, unknown>;
}

interface IStoreNode {
    orderUpdates: string[];
    updaters: Record<string, Function>;
    state: Record<string, Slice>;
    configs: IDataConfigs;
    name: string;
    sliceExtraValues: Record<string, IDataConfig['dataFactoryArguments']['sliceExtraValues']>;
    rootDeps: string[];
}

type IStore = Record<TKey, Slice | unknown>;

type IDataConfigs = Record<TKey, IDataConfig>;
type TLoadResult = unknown;
type ILoadResults = Record<string, TLoadResult | Record<string, TLoadResult>>;

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

function resolveConfigsFromGetters(
    configGetters: IStoreWithSlicesProps['dataConfigs']['configs']
): Record<string, IDataConfigs> {
    const configs = {};

    for (const [name, configGetter] of Object.entries(configGetters)) {
        if (configGetter.isAsyncConfigGetter) {
            throw new Error(
                `Для создания контекста getConfig модуля ${configGetter.configGetter} должен быть синхронный!`
            );
        }
        configs[name] = DataConfigResolver.getConfigFromLoaderSync(configGetter);
    }

    return configs;
}

/**
 * Хранилище данных со слайсами.
 * @class Controls-DataEnv/_context/StoreWithSlices
 * @private
 */
export default class StoreWithSlices {
    private _configs: Record<string, IDataConfigs> = {};
    private _props: IStoreWithSlicesProps;
    private _nodes: Record<string, IStoreNode> = {};

    constructor(props: IStoreWithSlicesProps) {
        this._props = props;
        if (props.configs || props.getSlicesConfig) {
            this._configs.root = props.getSlicesConfig?.(props.loadResults) || props.configs;
        } else if (this._props.dataConfigs) {
            const gettersConfigs = resolveConfigsFromGetters(this._props.dataConfigs.configs);
            this._configs = {
                ...this._configs,
                ...gettersConfigs,
            };
        }

        if (this._configs.hasOwnProperty('root')) {
            this._createNode('root');
        }
        Object.keys(this._configs).forEach((rootName) => {
            this._createNode(rootName);
        });
    }

    private _createNode(name: string) {
        if (!this._nodes[name]) {
            const rootDeps = DataConfigResolver.resolveRootDeps(this._configs, 'slice');

            this._nodes[name] = {
                state: {},
                updaters: {},
                orderUpdates: [],
                configs: this._configs[name],
                name,
                sliceExtraValues: {},
                rootDeps: rootDeps?.[name],
            };
            this._initSlicesInStore(
                this._props.dataConfigs
                    ? this._props.dataConfigs.loadResults[name]
                    : this._props.loadResults,
                this._configs[name],
                this._props.router,
                this._nodes[name]
            );
        }
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

    protected _initSlicesInStore(
        data: ILoadResults,
        configs: IDataConfigs,
        Router: IRouter,
        node: IStoreNode
    ) {
        const loadingQueues = {};
        const loadedFactories = {};
        node.orderUpdates = this._resolveOrderWithSliceDependencies(configs);
        const onChange = () => {
            node.state = this._createStoreObject(node.state);
            this._props.onChange(node.state);
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
                        this._props.getSlicesConfig?.(loadResultsMap, node.state) || node.configs;
                    node.configs = {
                        ...node.configs,
                        ...configsForQueue,
                    };
                    this._initSlicesInStore(loadResultsMap, node.configs, Router, node);
                    onChange();
                });
            }
        });
        this._initSlices(loadedFactories, configs, onChange, Router, node);
        node.state = this._createStoreObject(node.state);
    }

    protected _resolveDependencies(
        sliceExtraValues: IDataConfig['dataFactoryArguments']['sliceExtraValues']
    ): string[] {
        return sliceExtraValues.map((extraValue) => {
            return extraValue.dependencyName;
        });
    }

    private _addSliceToStore(name: string, slice: Slice, node: IStoreNode): void {
        node.state[name] = slice;
        node.updaters[name] = slice.setState;
        const sliceSetStateObserver = (newSlicePartialState) => {
            const newStorePartialState = {
                [name]: newSlicePartialState,
            };
            this.setState(newStorePartialState, node);
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
        sliceExtraValues.forEach(({ propName, dependencyPropName, dependencyName, prepare }) => {
            const extraValuesNode = slices.hasOwnProperty(dependencyName)
                ? slices
                : this._nodes.root.state;
            let value = (extraValuesNode[dependencyName] as Slice).state[dependencyPropName];
            if (prepare) {
                value = prepare(value);
            }
            properties[propName] = value;
        });
        return properties;
    }

    protected _initSlices(
        loadResults: ILoadResults,
        configs: IDataConfigs = {},
        storeChangedCallback: Function,
        Router: IRouter,
        node: IStoreNode
    ) {
        Object.entries(configs).forEach(([key, config]) => {
            const loadResult = loadResults[key];
            // надо разобраться как строиться по конфигам, передают конфиги с пустыми loadResults и ожидают, что контекста не будет
            if (
                node.state.hasOwnProperty(key) ||
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
                        if (!node.state[dependency] && this._nodes.root?.state?.[dependency]) {
                            depLoadResults[dependency] = loadResults[dependency];
                            depConfigs[dependency] = configs[dependency];
                        }
                        this._initSlices(
                            depLoadResults,
                            depConfigs,
                            storeChangedCallback,
                            Router,
                            node
                        );
                    });
                    const slice = this._createSlice(
                        key,
                        loadResult,
                        loadResults,
                        config,
                        storeChangedCallback,
                        Router,
                        node
                    );
                    this._addSliceToStore(key, slice, node);
                } else if (!node.state[key]) {
                    const slice = this._createSlice(
                        key,
                        loadResult,
                        loadResults,
                        config,
                        storeChangedCallback,
                        Router,
                        node
                    );
                    this._addSliceToStore(key, slice, node);
                }
            } else {
                node.state[key] = loadResult;
            }
        });
    }

    private _createStoreObject(state: IStore): IStore {
        const descriptors = Object.getOwnPropertyDescriptors(state);
        return Object.create(
            {
                getStoreData: getStoreData.bind(null, state),
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
        Router: IRouter,
        node: IStoreNode
    ): Slice {
        const dataFactory = loadSync<IDataFactory>(config.dataFactoryName);
        const sliceCtr = dataFactory.slice || Custom.slice;
        const sliceConstructor = sliceCtr.prototype.constructor;
        const abstractSliceConstructor = AbstractSlice.prototype.constructor;
        if (sliceConstructor === abstractSliceConstructor) {
            throw new Error(`Controls-DataEnv/context.createSlice::slice с именем ${name} не будет создан.
             В качестве слайса у фабрики ${config.dataFactoryName} задан абстрактный класс Controls-DataEnv/slice:AbstractSlice.
             Создание экземпляра абстрактного класса невозможно. Используйте Controls-DataEnv/slice:Slice`);
        }
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
                node.state
            );
            dataFactoryArguments = { ...dataFactoryArguments, ...extraValues };
            node.sliceExtraValues[name] = config.dataFactoryArguments.sliceExtraValues;
        }
        return new sliceCtr({
            config: dataFactoryArguments,
            loadResult: isValueSimpleObject ? { ...loadResult } : loadResult,
            onChange: changedCallback,
        });
    }

    private _setExtraValuesToUpdate(
        stateForUpdate: Record<string, unknown>,
        node: IStoreNode,
        sliceChanges: object,
        changedSliceName: string
    ) {
        Object.entries(node.sliceExtraValues).forEach(([sliceName, sliceExtraValues]) => {
            sliceExtraValues.forEach((sliceExtraValue) => {
                if (
                    sliceExtraValue.dependencyName === changedSliceName &&
                    sliceChanges.hasOwnProperty(sliceExtraValue.dependencyPropName)
                ) {
                    let newValue = sliceChanges[sliceExtraValue.dependencyPropName];
                    if (sliceExtraValue.prepare) {
                        newValue = sliceExtraValue.prepare(newValue);
                    }
                    stateForUpdate[sliceName] = stateForUpdate[sliceName] || {};
                    stateForUpdate[sliceName][sliceExtraValue.propName] = newValue;
                }
            });
        });
    }

    private _resolveStateForUpdate(
        partialState: Record<string, object>,
        changedNode: IStoreNode
    ): Record<string, object> {
        const stateForUpdate = { [changedNode.name]: { ...partialState } };
        Object.entries(partialState).forEach(([changedSliceName, partialChangedSliceState]) => {
            const storeValue = changedNode.state[changedSliceName];
            if (isSlice(storeValue)) {
                this._setExtraValuesToUpdate(
                    stateForUpdate[changedNode.name],
                    changedNode,
                    partialChangedSliceState,
                    changedSliceName
                );
                const rootChanged = changedNode.name === 'root';
                if (rootChanged) {
                    for (const [, storeNode] of Object.entries(this._nodes)) {
                        if (storeNode.rootDeps?.includes(changedSliceName)) {
                            stateForUpdate[storeNode.name] = stateForUpdate[storeNode.name] || {};
                            this._setExtraValuesToUpdate(
                                stateForUpdate[storeNode.name],
                                storeNode,
                                partialChangedSliceState,
                                changedSliceName
                            );
                        }
                    }
                }
            }
        });
        return stateForUpdate;
    }

    getState(node: string = 'root'): Record<string, Slice> {
        return this._nodes[node]?.state;
    }

    getValue(): Record<string, Record<string, Slice>> {
        const value = {};

        Object.entries(this._nodes).forEach(([key, node]) => {
            value[node.name] = node.state;
        });

        return value;
    }

    setState(partialState: Record<string, object>, node: IStoreNode = this._nodes.root): void {
        const stateForUpdate = this._resolveStateForUpdate(partialState, node);
        Object.entries(stateForUpdate).forEach(([changedNodeName, changedState]) => {
            this._nodes[changedNodeName].orderUpdates.forEach((changedSliceName) => {
                if (changedState[changedSliceName]) {
                    const changedNode = this._nodes[changedNodeName];
                    const partialStateSlice = stateForUpdate[changedNodeName][changedSliceName];
                    const storeValue = changedNode.state[changedSliceName];
                    if (isSlice(storeValue)) {
                        changedNode.updaters[changedSliceName].call(storeValue, partialStateSlice);
                    } else {
                        changedNode.state[changedSliceName] = partialStateSlice;
                    }
                }
            });
        });
    }

    destroy() {
        Object.values(this._nodes).forEach((nodeValue) => {
            Object.values(nodeValue.state).forEach((stateValue) => {
                if (isSlice(stateValue)) {
                    (stateValue as Slice).destroy();
                }
            });
        });
        this._nodes = null;
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

function isSlice(value: unknown): boolean {
    return value instanceof Object && value['[ISlice]'];
}
