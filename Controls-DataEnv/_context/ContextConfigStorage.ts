import {
    DataConfigResolver,
    IDataConfigLoader,
    IDataFactory,
    TDataConfigs,
} from 'Controls-DataEnv/dataFactory';
import { DataContext } from 'Controls-DataEnv/dataContext';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IRouter } from 'Router/_private/Router/Router';
import { merge } from 'Types/object';

export type IResolvedDataConfigLoader = IDataConfigLoader & {
    isAsyncConfigGetter: boolean;
    /**
     * configGetter предзагружен внешней сущностью
     */
    isResolvedConfigGetter: boolean;
};

export type IResolvedDataNode = {
    dataConfigs: TDataConfigs;
    parentId?: string | null;
};

const STORE_ROOT_NODE_KEY = 'root';

interface IContextConfigStorageProps {
    router?: IRouter;
}

function getNodeDepth(
    startNode: string,
    configs: Record<
        string,
        {
            parentId?: string | null;
        }
    >
): number {
    let nodeName = startNode;
    let weight = 0;

    while (nodeName !== STORE_ROOT_NODE_KEY) {
        const currentNodeConfig = configs[nodeName];

        if (currentNodeConfig.parentId) {
            weight += 1;
        }

        nodeName = currentNodeConfig.parentId || STORE_ROOT_NODE_KEY;
    }

    return weight;
}

function changeRoot(
    newRoot: string,
    configs: Record<string, IDataConfigLoader>,
    loadResults: Record<string, Record<string, unknown>>
): void {
    const needChangeParentOnNodes = newRoot !== STORE_ROOT_NODE_KEY;
    if (needChangeParentOnNodes) {
        if (loadResults.hasOwnProperty(STORE_ROOT_NODE_KEY)) {
            loadResults[newRoot] = loadResults[STORE_ROOT_NODE_KEY];
            delete loadResults[STORE_ROOT_NODE_KEY];
        }

        if (configs.hasOwnProperty(STORE_ROOT_NODE_KEY)) {
            configs[newRoot] = configs[STORE_ROOT_NODE_KEY];
            delete configs[STORE_ROOT_NODE_KEY];
        }
    }

    Object.entries(configs).forEach(([newNodeName, config]) => {
        if (
            newNodeName !== newRoot &&
            (config.parentId === STORE_ROOT_NODE_KEY || !config.parentId)
        ) {
            config.parentId = newRoot;
        }
    });
}

export default class ContextConfigStorage {
    private _$resolvedConfigs: Record<string, IResolvedDataNode> = {};
    private _$configs: Record<string, IResolvedDataConfigLoader> = {};
    private readonly _$router: IRouter | undefined;

    constructor(props: IContextConfigStorageProps) {
        this._$router = props.router;
    }

    addNodeConfig(name: string, nodeConfig: IResolvedDataConfigLoader) {
        const parent =
            !nodeConfig.parentId && name !== STORE_ROOT_NODE_KEY
                ? STORE_ROOT_NODE_KEY
                : nodeConfig.parentId;
        this._$configs[name] = { ...nodeConfig };
        this._$configs[name].parentId = parent;
    }

    addResolvedNode(name: string, dataConfigs: TDataConfigs): void {
        this._$resolvedConfigs[name] = {
            dataConfigs,
            parentId: STORE_ROOT_NODE_KEY,
        };
    }

    mergeToNode(name: string, configs: TDataConfigs): void {
        const node = this._$resolvedConfigs[name] || {
            dataConfigs: {},
            parentId: this._$resolvedConfigs[name].parentId ?? STORE_ROOT_NODE_KEY,
        };
        merge(node.dataConfigs, configs);
        this._$resolvedConfigs[name] = node;
    }

    resolveDataGetter(name: string, dataContext: DataContext): TDataConfigs {
        const config = this._$configs[name];
        const dataConfigs = !config.isAsyncConfigGetter
            ? DataConfigResolver.getConfigFromLoaderSync(config, dataContext)
            : DataConfigResolver.convertLoadResultsToFactory(dataContext.getNodeData(name));
        const newDataConfigs: TDataConfigs = {};
        const newNodeFactories = Object.keys(dataConfigs);
        const currentNodeFactories = Object.keys(this._$resolvedConfigs[name]?.dataConfigs || {});

        newNodeFactories.forEach((newFactory) => {
            if (!currentNodeFactories.includes(newFactory)) {
                newDataConfigs[newFactory] = dataConfigs[newFactory];
            }
        });

        this._$resolvedConfigs[name] = {
            dataConfigs: merge(this._$resolvedConfigs[name]?.dataConfigs || {}, { ...dataConfigs }),
            parentId: config.parentId,
        };

        return newDataConfigs;
    }

    getParent(node: string): string | null {
        return this._$configs[node]?.parentId || this._$resolvedConfigs[node]?.parentId || null;
    }

    getNodeDataConfigs(name: string): TDataConfigs {
        return this._$resolvedConfigs[name].dataConfigs || {};
    }

    getNodeOrder(): string[] {
        const nodesDepth: Record<string, number> = {};

        Object.keys(this._$resolvedConfigs).forEach((currentRoot) => {
            nodesDepth[currentRoot] = getNodeDepth(currentRoot, this._$resolvedConfigs);
        });

        return Object.keys(nodesDepth).sort((node1Key, node2Key) => {
            return nodesDepth[node1Key] - nodesDepth[node2Key];
        });
    }

    resolveDataGetters(dataContext: DataContext) {
        const unresolvedNodes: Record<string, IDataConfigLoader> = {};

        const resolvedConfigs = Object.keys(this._$resolvedConfigs);

        Object.entries(this._$configs).forEach(([name, config]) => {
            if (!resolvedConfigs.includes(name)) {
                unresolvedNodes[name] = config;
            }
        });

        while (Object.keys(unresolvedNodes).length) {
            Object.entries(unresolvedNodes).forEach(([nodeName, nodeConfig]) => {
                //@ts-ignore
                this.addNodeConfig(nodeName, nodeConfig);
                const resolvedDataConfigs = this.resolveDataGetter(nodeName, dataContext);
                delete unresolvedNodes[nodeName];

                Object.entries(resolvedDataConfigs).forEach(([configName, config]) => {
                    const dataFactory = loadSync<IDataFactory>(config.dataFactoryName);
                    let dataFactoryArguments = config.dataFactoryArguments;
                    if (dataFactory.getContextConfig) {
                        if (dataFactory.getDataFactoryArguments) {
                            const dependenciesResults: Record<string, unknown> = {};
                            if (config.dependencies) {
                                config.dependencies.forEach((dependency) => {
                                    dependenciesResults[dependency] =
                                        dataContext.getNodeData(nodeName)[dependency];
                                });
                            }
                            dataFactoryArguments = dataFactory.getDataFactoryArguments(
                                dataFactoryArguments,
                                dependenciesResults,
                                this._$router
                            );
                        }
                        const contextConfig = dataFactory.getContextConfig(
                            dataContext.getNodeData(nodeName)[configName],
                            dataFactoryArguments
                        );

                        if (DataConfigResolver.isDataConfigs(contextConfig.configs)) {
                            dataContext.addToNode(nodeName, contextConfig.loadResults);
                            merge(
                                this._$resolvedConfigs[nodeName].dataConfigs,
                                contextConfig.configs
                            );
                        } else {
                            changeRoot(
                                nodeName,
                                contextConfig.configs,
                                contextConfig.loadResults as Record<string, Record<string, unknown>>
                            );

                            dataContext.merge(
                                contextConfig.loadResults as Record<
                                    string,
                                    Record<string, unknown>
                                >,
                                (nodeName: string): string | undefined => {
                                    return (contextConfig.configs[nodeName] as IDataConfigLoader)
                                        .parentId;
                                }
                            );

                            Object.entries(contextConfig.configs).forEach(
                                ([unresolvedNode, unresolvedConfig]) => {
                                    unresolvedNodes[unresolvedNode] = unresolvedConfig;
                                }
                            );
                        }
                    }
                });
            });
        }
    }
}
