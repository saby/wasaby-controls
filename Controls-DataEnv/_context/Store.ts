import {
    IDataConfig,
    IDataConfigLoader,
    DataConfigResolver,
    TDataConfigs,
} from 'Controls-DataEnv/dataFactory';
import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import ContextNode from './ContextNode';
import { STORE_ROOT_NODE_KEY } from './Constants';
import type { IStoreChange, IContextNodeChange } from './interface';

interface IHierarchicalStoreProps extends IStoreProps {
    dataConfigs: IDataConfigsProp;
}

interface IFlatStoreProps extends IStoreProps {
    configs: IDataConfigs;
    loadResults: TFlatLoadResults;
}

interface IStoreProps {
    router?: IRouter;

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
    parentId?: string;
}

function resolveConfigsFromGetters(
    configGetters: IHierarchicalStoreProps['dataConfigs']['configs']
): Record<string, IResolvedNodeConfig> {
    const configs: Record<string, IResolvedNodeConfig> = {};

    for (const [name, configGetter] of Object.entries(configGetters)) {
        if (configGetter.isAsyncConfigGetter) {
            throw new Error(
                `Для создания контекста getConfig модуля ${configGetter.configGetter} должен быть синхронный!`
            );
        }
        configs[name] = {
            dataConfigs: DataConfigResolver.getConfigFromLoaderSync(configGetter),
            parentId: configGetter.parentId,
        };
    }

    return configs;
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

/**
 * Хранилище данных со слайсами.
 * @class Controls-DataEnv/_context/StoreWithSlices
 * @private
 */
export default class StoreWithSlices {
    private readonly _$nodesConfigs: Record<string, IResolvedNodeConfig> = {};
    private _$props: IFlatStoreProps | IHierarchicalStoreProps;
    private _$nodes: Record<string, ContextNode> = {};
    private _$nodeOrder: string[];
    private readonly _$loadResults: THierarchicalLoadResults = {};

    constructor(props: IFlatStoreProps);
    constructor(props: IHierarchicalStoreProps | IFlatStoreProps) {
        this._$props = props;
        this._onDelayedCreateNodeElements = this._onDelayedCreateNodeElements.bind(this);
        this._onNodeSnapshot = this._onNodeSnapshot.bind(this);
        this._onChange = this._onChange.bind(this);

        if (isFlatStore(props)) {
            this._$loadResults[STORE_ROOT_NODE_KEY] = props.loadResults;
            this._$nodesConfigs[STORE_ROOT_NODE_KEY] = {
                dataConfigs:
                    props.getSlicesConfig?.(this._$loadResults[STORE_ROOT_NODE_KEY]) ||
                    props.configs,
                parentId: STORE_ROOT_NODE_KEY,
            };
        } else {
            this._$nodesConfigs = resolveConfigsFromGetters(props.dataConfigs.configs);
            Object.values(this._$nodesConfigs).forEach((config) => {
                if (!config.parentId) {
                    config.parentId = STORE_ROOT_NODE_KEY;
                }
            });
            if (!this._$nodesConfigs[STORE_ROOT_NODE_KEY]) {
                this._$nodesConfigs[STORE_ROOT_NODE_KEY] = {};
            }
            if (!this._$loadResults[STORE_ROOT_NODE_KEY]) {
                this._$loadResults[STORE_ROOT_NODE_KEY] = {};
            }
            this._$loadResults = props.dataConfigs.loadResults;
        }

        const hierarchyPathWeights: Record<string, number> = {};

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
        const startNode = this._$nodes[startNodeName];
        return startNode?.getElement(elementName)?.getValue();
    }

    destroy() {
        Object.values(this._$nodes).forEach((contextNode) => {
            contextNode.destroy();
        });
        this._$nodes = {};
    }
}
