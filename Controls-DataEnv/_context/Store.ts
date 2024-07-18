import {
    IDataConfig,
    IDataConfigLoader,
    DataConfigResolver,
    TDataConfigs,
    IDataFactory,
} from 'Controls-DataEnv/dataFactory';
import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import ContextNode from './ContextNode';
import { STORE_ROOT_NODE_KEY } from './Constants';
import type { IStoreChange, IContextNodeChange } from './interface';
import { Logger } from 'UI/Utils';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import type { Loader } from 'Controls-DataEnv/dataLoader';
import { merge } from 'Types/object';

export interface IHierarchicalStoreProps extends IStoreProps {
    dataConfigs: IDataConfigsProp;
}

export interface IFlatStoreProps extends IStoreProps {
    configs: IDataConfigs;
    loadResults: TFlatLoadResults;
}

interface IStoreProps {
    router?: IRouter;
    getSlicesContextNodeName?: string;

    getSlicesConfig?(loadResults: TFlatLoadResults, currentState?: IStore): IDataConfigs;

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
    loadResults: THierarchicalLoadResults;
}

type IStore = Record<string, Slice | unknown>;

type IDataConfigs = Record<string, IDataConfig>;
type TLoadResult = unknown;
type TFlatLoadResults = Record<string, TLoadResult>;
type THierarchicalLoadResults = Record<string, Record<string, TLoadResult>>;

function isFlatStore(props: any): props is IFlatStoreProps {
    return !!props.configs;
}

interface IResolvedNodeConfig {
    dataConfigs: TDataConfigs;
    parentId?: string | null;
}

function resolveConfigsFromGetters(
    configGetters: IHierarchicalStoreProps['dataConfigs']['configs'],
    loadResults: IHierarchicalStoreProps['dataConfigs']['loadResults']
): Record<string, IResolvedNodeConfig> {
    const nodeConfigs: Record<string, IResolvedNodeConfig> = {};

    for (const [name, configGetter] of Object.entries(configGetters)) {
        if (configGetter.isAsyncConfigGetter) {
            Logger.warn(
                `Для создания корректного контекста getConfig модуля ${configGetter.configGetter} должен быть синхронный!`
            );
        }
        const dataConfigs = !configGetter.isAsyncConfigGetter
            ? DataConfigResolver.getConfigFromLoaderSync(configGetter)
            : DataConfigResolver.convertLoadResultsToFactory(loadResults[name]);

        nodeConfigs[name] = {
            dataConfigs,
            parentId: configGetter.parentId,
        };
    }

    return nodeConfigs;
}

function getNodePathWeight(startNode: string, nodes: Record<string, IResolvedNodeConfig>): number {
    let nodeName = startNode;
    let weight = 0;

    while (nodeName !== STORE_ROOT_NODE_KEY) {
        const currentNodeConfig = nodes[nodeName];

        if (currentNodeConfig.parentId) {
            weight += 1;
        }

        nodeName = currentNodeConfig.parentId || STORE_ROOT_NODE_KEY;
    }

    return weight;
}

async function getLoader(): Promise<typeof Loader> {
    const module = await loadAsync<typeof import('Controls-DataEnv/dataLoader')>(
        'Controls-DataEnv/dataLoader'
    );
    return module.Loader;
}

function contextElementNotExist(elementName: string, methodName: string): void {
    Logger.error(
        `RootContext:${methodName}::Элемент контекста с именем ${elementName} уже существует`
    );
}

function contextElementAlreadyExist(elementName: string, methodName: string): void {
    Logger.error(
        `RootContext:${methodName}::Элемент контекста с именем ${elementName} уже существует`
    );
}

function getContextConfigsFromFactory(
    config: IDataConfig,
    configKey: string,
    nodeName: string,
    loadResults: Record<string, unknown>,
    router?: IRouter
): {
    nodeConfigs: Record<string, IResolvedNodeConfig> | undefined;
    nodeLoadResults: IHierarchicalStoreProps['dataConfigs']['loadResults'] | undefined;
} {
    let nodeConfigs: Record<string, IResolvedNodeConfig> | undefined;
    let nodeLoadResults: IHierarchicalStoreProps['dataConfigs']['loadResults'] | undefined;

    const dataFactory = loadSync<IDataFactory>(config.dataFactoryName);
    let dataFactoryArguments = config.dataFactoryArguments;
    if (dataFactory.getContextConfig) {
        if (dataFactory.getDataFactoryArguments) {
            const dependenciesResults: Record<string, unknown> = {};
            if (config.dependencies) {
                config.dependencies.forEach((dependency) => {
                    dependenciesResults[dependency] = loadResults[dependency];
                });
            }
            dataFactoryArguments = dataFactory.getDataFactoryArguments(
                dataFactoryArguments,
                dependenciesResults,
                router
            );
        }
        const contextConfig = dataFactory.getContextConfig(
            loadResults[configKey],
            dataFactoryArguments
        );

        if (DataConfigResolver.isDataConfigs(contextConfig.configs)) {
            nodeConfigs = {
                [nodeName]: {
                    dataConfigs: contextConfig.configs,
                },
            };
            nodeLoadResults = {
                [nodeName]: contextConfig.loadResults,
            };
        } else {
            const configsFromFactories = resolveConfigsFromGetters(
                contextConfig.configs as IHierarchicalStoreProps['dataConfigs']['configs'],
                contextConfig.loadResults as IHierarchicalStoreProps['dataConfigs']['loadResults']
            );
            nodeLoadResults =
                contextConfig.loadResults as IHierarchicalStoreProps['dataConfigs']['loadResults'];
            nodeConfigs = configsFromFactories;
        }
    }
    return {
        nodeConfigs,
        nodeLoadResults,
    };
}

/**
 * Хранилище данных со слайсами.
 * @class Controls-DataEnv/_context/StoreWithSlices
 * @private
 */
export default class StoreWithSlices {
    private _$nodesConfigs: Record<string, IResolvedNodeConfig> = {};
    private _$props: IFlatStoreProps | IHierarchicalStoreProps;
    private _$nodes: Record<string, ContextNode> = {};
    private _$nodeOrder: string[];
    private _$loadResults: THierarchicalLoadResults = {};

    private _addContextConfigsFromFactory(
        nodesConfigs: Record<string, IResolvedNodeConfig>,
        loadResults: IHierarchicalStoreProps['dataConfigs']['loadResults']
    ): void {
        let resolvedNodeConfigs = { ...nodesConfigs };
        let resolvedLoadResults: IHierarchicalStoreProps['dataConfigs']['loadResults'] = {
            ...loadResults,
        };

        Object.entries(nodesConfigs).forEach(([key, nodeConfig]) => {
            Object.entries(nodeConfig.dataConfigs).forEach(([configKey, config]) => {
                const factoryContextConfigs = getContextConfigsFromFactory(
                    config,
                    configKey,
                    key,
                    resolvedLoadResults[key],
                    this._$props.router
                );

                if (factoryContextConfigs.nodeLoadResults && factoryContextConfigs.nodeConfigs) {
                    resolvedLoadResults = merge(
                        resolvedLoadResults,
                        factoryContextConfigs.nodeLoadResults
                    );
                    resolvedNodeConfigs = merge(
                        resolvedNodeConfigs,
                        factoryContextConfigs.nodeConfigs
                    );
                }
            });
        });

        this._$loadResults = resolvedLoadResults;
        this._$nodesConfigs = resolvedNodeConfigs;
    }

    constructor(props: IHierarchicalStoreProps | IFlatStoreProps) {
        this._$props = props;
        this._onDelayedCreateNodeElements = this._onDelayedCreateNodeElements.bind(this);
        this._onNodeSnapshot = this._onNodeSnapshot.bind(this);
        this._onChange = this._onChange.bind(this);

        if (isFlatStore(props)) {
            this._$loadResults[STORE_ROOT_NODE_KEY] = { ...props.loadResults };
            this._$nodesConfigs[STORE_ROOT_NODE_KEY] = {
                dataConfigs:
                    props.getSlicesConfig?.(this._$loadResults[STORE_ROOT_NODE_KEY]) ||
                    props.configs,
                parentId: STORE_ROOT_NODE_KEY,
            };
        } else {
            this._$loadResults = { ...props.dataConfigs.loadResults };
            this._$nodesConfigs = resolveConfigsFromGetters(
                props.dataConfigs.configs,
                props.dataConfigs.loadResults
            );

            if (!this._$nodesConfigs[STORE_ROOT_NODE_KEY]) {
                this._$nodesConfigs[STORE_ROOT_NODE_KEY] = {
                    dataConfigs: {},
                    parentId: null,
                };
            }
            if (!this._$loadResults[STORE_ROOT_NODE_KEY]) {
                this._$loadResults[STORE_ROOT_NODE_KEY] = {};
            }
            if (props.getSlicesConfig && props.getSlicesContextNodeName) {
                let getterNodeConfigs =
                    this._$nodesConfigs[props.getSlicesContextNodeName]?.dataConfigs || {};
                getterNodeConfigs = {
                    ...getterNodeConfigs,
                    ...props.getSlicesConfig(this._$loadResults[props.getSlicesContextNodeName]),
                };
                this._$nodesConfigs[props.getSlicesContextNodeName].dataConfigs = getterNodeConfigs;
            }
        }

        this._addContextConfigsFromFactory(this._$nodesConfigs, this._$loadResults);

        const hierarchyPathWeights: Record<string, number> = {};

        Object.entries(this._$nodesConfigs).forEach(([key, config]) => {
            if (!config.parentId && key !== STORE_ROOT_NODE_KEY) {
                config.parentId = STORE_ROOT_NODE_KEY;
            }
        });

        Object.keys(this._$nodesConfigs).forEach((currentRoot) => {
            hierarchyPathWeights[currentRoot] = getNodePathWeight(currentRoot, this._$nodesConfigs);
        });

        this._$nodeOrder = Object.keys(hierarchyPathWeights).sort((node1Key, node2Key) => {
            return hierarchyPathWeights[node1Key] - hierarchyPathWeights[node2Key];
        });

        this._$nodeOrder.forEach((nodeName) => {
            const nodeConfigs = this._$nodesConfigs[nodeName].dataConfigs;
            if (
                nodeName === STORE_ROOT_NODE_KEY ||
                (nodeConfigs && Object.keys(nodeConfigs).length)
            ) {
                this._$nodes[nodeName] = this._createNode(nodeName);
            }
        });
    }

    private _onDelayedCreateNodeElements(
        changedNodeName: string,
        elementsLoadResults: TFlatLoadResults
    ): TDataConfigs | undefined {
        return this._$props.getSlicesConfig?.(
            elementsLoadResults,
            this._$nodes[changedNodeName].getValue()
        );
    }

    private _createNode(name: string): ContextNode {
        const nodeConfigs = this._$nodesConfigs[name];
        return new ContextNode({
            name,
            onChange: this._onChange,
            configs: nodeConfigs.dataConfigs || {},
            loadResults: this._$loadResults[name] || {},
            onSnapshot: this._onNodeSnapshot,
            parentNode: nodeConfigs.parentId ? this._$nodes[nodeConfigs.parentId] : null,
            onDelayedCreateElements: this._onDelayedCreateNodeElements,
        });
    }

    protected _onNodeSnapshot(changedNodeName: string, changedNodeValue: IContextNodeChange): void {
        const storeChangesState: IStoreChange = {};
        storeChangesState[changedNodeName] = changedNodeValue;

        this.setState(storeChangesState);
    }

    setState(partialStoreChanges: IStoreChange): void {
        const storeChangesState: IStoreChange = {};

        Object.entries(partialStoreChanges).forEach(([changedNodeName, changedNodeValue]) => {
            const changedNode = this._$nodes[changedNodeName];
            storeChangesState[changedNodeName] = changedNode.getChanges(changedNodeValue);
            Object.entries(this._$nodes).forEach(([nodeName, node]) => {
                Object.entries(node.getState()).forEach(([elementName, element]) => {
                    if (element.hasDependencyFromNode(changedNodeName)) {
                        const dependencyNodeStateChange: IContextNodeChange = {};
                        const dependencyElementExtraValues = element.getExtraValues();

                        dependencyElementExtraValues?.forEach((depExtraValue) => {
                            if (depExtraValue.dependencyName === changedNodeName) {
                                dependencyNodeStateChange[elementName] =
                                    dependencyNodeStateChange[elementName] || {};
                                dependencyNodeStateChange[elementName][depExtraValue.propName] =
                                    storeChangesState[depExtraValue.dependencyName][
                                        depExtraValue.dependencyName
                                    ];
                            }
                        });

                        storeChangesState[nodeName] = storeChangesState[nodeName] || {};
                        storeChangesState[nodeName] = node.getChanges(dependencyNodeStateChange);
                    }
                });
            });
        });

        this._$nodeOrder.forEach((nodeName: string) => {
            const nodeValue = storeChangesState[nodeName];

            if (nodeValue) {
                this._$nodes[nodeName].setState(nodeValue);
            }
        });
    }

    async reloadElement(
        nodeName: string,
        elementName: string,
        dataFactoryArguments: IDataConfig['dataFactoryArguments'] = {}
    ): Promise<void> {
        const node = this._$nodes[nodeName];

        if (!node) {
            throw new Error(
                `Узел контекста ${nodeName}  не найден при попытке перезагрузить слайс ${elementName}`
            );
        }

        const currentElement = node.getElement(elementName, false);

        if (!currentElement) {
            throw new Error(
                `В узле контекста ${nodeName} не найден элемент ${elementName} попытке его перезагрузить`
            );
        }

        const loader = await getLoader();
        const currentNodeConfigs = this._$nodesConfigs[nodeName];
        const elementConfig = currentNodeConfigs.dataConfigs[elementName];
        elementConfig.dataFactoryArguments = {
            ...elementConfig.dataFactoryArguments,
            ...dataFactoryArguments,
        };
        const reloadedConfigs = {
            [elementName]: elementConfig,
        };

        if (elementConfig.dependencies) {
            elementConfig.dependencies.forEach((dep) => {
                reloadedConfigs[dep] = currentNodeConfigs.dataConfigs[dep];
            });
        }
        const loadResult = await loader.load(reloadedConfigs);

        if (elementConfig.dependencies) {
            elementConfig.dependencies.forEach((reloadedElementDep) => {
                this._createElement(
                    reloadedElementDep,
                    nodeName,
                    reloadedConfigs[reloadedElementDep],
                    loadResult[reloadedElementDep]
                );
            });
        }

        this._createElement(elementName, nodeName, elementConfig, loadResult[elementName]);
        this._onChange();
    }

    async createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void> {
        const loader = await getLoader();

        const dataLoadResults = await loader.loadByConfigs(
            {
                [nodeName]: nodeConfig,
            },
            undefined,
            this._$props.router,
            true
        );

        this.createNodeSync(nodeName, nodeConfig, dataLoadResults.loadResults[nodeName]);
    }

    createNodeSync(
        nodeName: string,
        nodeConfig: IDataConfigLoader,
        loadResults: Record<string, unknown>
    ): void {
        const nodeConfigs = resolveConfigsFromGetters(
            {
                [nodeName]: {
                    isAsyncConfigGetter: false,
                    isResolvedConfigGetter: false,
                    ...nodeConfig,
                },
            },
            {
                [nodeName]: loadResults,
            }
        );

        if (this._$nodes[nodeName]) {
            contextElementAlreadyExist(nodeName, 'createNode');
            return;
        }

        this._$nodesConfigs[nodeName] = nodeConfigs[nodeName];

        this._$loadResults = {
            ...this._$loadResults,
            [nodeName]: loadResults,
        };

        this._$nodes[nodeName] = this._createNode(nodeName);
        this._onChange();
    }

    async createElement(
        elementName: string,
        elementNode: string,
        config: IDataConfig
    ): Promise<void> {
        const loader = await getLoader();
        const loadedResult = await loader.load(
            { [elementName]: config },
            undefined,
            this._$props.router
        );
        this.createElementSync(elementName, elementNode, config, loadedResult);
    }

    createElementSync(
        elementName: string,
        elementNode: string,
        config: IDataConfig,
        loadResult: unknown
    ): void {
        this._createElement(elementName, elementNode, config, loadResult);
        this._onChange();
    }

    _createElement(
        elementName: string,
        elementNode: string,
        config: IDataConfig,
        loadResult: unknown
    ): void {
        const node = this._$nodes[elementNode];

        if (!node) {
            contextElementNotExist(elementName, 'createElementSync');
            return;
        }

        this._$loadResults[elementNode][elementName] = loadResult;

        node.addElement(elementName, loadResult, config);
        const elementContextConfigs = getContextConfigsFromFactory(
            config,
            elementName,
            elementNode,
            this._$loadResults[elementNode],
            this._$props.router
        );

        if (elementContextConfigs.nodeConfigs && elementContextConfigs.nodeLoadResults) {
            this._$nodesConfigs = merge(this._$nodesConfigs, elementContextConfigs.nodeConfigs);
            this._$loadResults = merge(this._$loadResults, elementContextConfigs.nodeLoadResults);
            Object.entries(elementContextConfigs.nodeConfigs).forEach(([nodeKey, nodeConfig]) => {
                if (this._$nodes[nodeKey]) {
                    Object.entries(nodeConfig.dataConfigs).forEach(([configKey, config]) => {
                        this._$nodes[nodeKey].addElement(
                            configKey,
                            elementContextConfigs.nodeLoadResults?.[nodeKey]?.[configKey],
                            config
                        );
                    });
                } else {
                    this._$nodes[nodeKey] = this._createNode(nodeKey);
                }
            });
        }
    }

    _onChange(): void {
        this._$props.onChange(this.getValue());
    }

    getState(node: string = STORE_ROOT_NODE_KEY): Record<string, Slice | unknown> {
        return this._$nodes[node]?.getValue();
    }

    getValue(): Record<string, Record<string, Slice | unknown>> {
        const value: Record<string, Record<string, Slice | unknown>> = {};

        Object.entries(this._$nodes).forEach(([, node]) => {
            value[node.getName()] = node.getValue();
        });

        return value;
    }

    getElementValueFromNode(elementName: string, startNodeName: string): Slice | unknown {
        const startNode = this.getNode(startNodeName);
        return startNode?.getElement(elementName)?.getValue();
    }

    getNode(nodeName: string): ContextNode {
        return this._$nodes[nodeName] || this._$nodes[STORE_ROOT_NODE_KEY];
    }

    destroy() {
        Object.values(this._$nodes).forEach((contextNode) => {
            contextNode.destroy();
        });
        this._$nodes = {};
    }
}
