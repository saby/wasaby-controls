import { IDataConfigLoader, TDataConfigs } from 'Controls-DataEnv/dataFactory';
import { relation } from 'Types/entity';
import { IRouter } from 'Router/router';
import { DataContext } from 'Controls-DataEnv/dataContext';
import DataNodeLoader from 'Controls-DataEnv/_dataLoader/DataNodeLoader';
import { TLoadTimeout } from 'Controls-DataEnv/_dataLoader/interface';

const treeOptions: relation.ITreeOptions = {
    keyProperty: 'id',
    parentProperty: 'parentId',
    childrenProperty: 'children',
};

export type IDataContextConfigs = IDataConfigLoader & {
    data?: Record<string, unknown>;
    children?: Record<string, IDataContextConfigs>;
};

export interface IDataContextLoaderProps {
    configs: IDataContextConfigs;
    router?: IRouter;
    loadTimeout?: TLoadTimeout;
}

type TCompatibleContextTreeElement = IDataConfigLoader & { id: string };

function buildContextTreeFromFlatObject(
    configGetters: Record<string, IDataConfigLoader>
): TCompatibleContextTreeElement[] {
    const resultTree: TCompatibleContextTreeElement[] = [];

    Object.entries(configGetters).forEach(([key, nodeValue]) => {
        resultTree.push({
            id: key,
            ...nodeValue,
        });
    });

    return resultTree;
}

/**
 * @public
 */
export interface ILoadDataConfigResultSerializable {
    configs: Record<
        string,
        IDataConfigLoader & { isAsyncConfigGetter: boolean } & { error?: Error }
    >;
}

/**
 * Результат загрузки
 */
export type ILoadedDataConfigsResult = ILoadDataConfigResultSerializable & {
    /**
     *
     */
    loadResults: Record<string, Record<string, unknown>>;
    /**
     *
     */
    dataConfigs?: Record<string, TDataConfigs>;
};

/**
 * Класс загрузчик данных
 * @public
 */
export default class DataContextLoader {
    private readonly _$configs: IDataContextLoaderProps['configs'];
    private readonly _$tree: relation.Tree<IDataContextConfigs>;
    private readonly _loadPromises = new Map<string, Promise<Record<string, unknown>>>();
    private readonly _$nodes = new Map<string, DataNodeLoader>();
    private readonly _$loadTimeout: IDataContextLoaderProps['loadTimeout'];

    private _$dataContext: DataContext = new DataContext({
        data: {},
    });

    private _$router: IRouter;

    private async _loadNode(
        config: IDataConfigLoader,
        name: string,
        node: relation.ITreeItem<IDataContextConfigs>
    ): Promise<Record<string, unknown>> {
        const path = node.getPath(true);
        const parentPath = node.getPath(false);
        this._$dataContext.addNode(parentPath, name, node.value.data);

        const loader = new DataNodeLoader({
            config,
            dataContext: this._$dataContext,
            router: this._$router,
            path,
            loadTimeout: this._$loadTimeout,
        });
        this._$nodes.set(path.toString(), loader);
        const nodeResult = await loader.load();

        if (this._$dataContext.hasNode(path)) {
            this._$dataContext.addToNode(path, nodeResult);
        } else {
            this._$dataContext.addNode(parentPath, name, nodeResult);
        }
        node.value.data = nodeResult;

        return nodeResult;
    }

    private _findDependencyNode(
        startNode: relation.ITreeItem,
        dependency: string
    ): relation.ITreeItem | undefined {
        let currentNode = startNode.parent;
        let dependencyNode;

        while (currentNode && !dependencyNode) {
            if (currentNode?.value?.configs?.hasOwnProperty(dependency)) {
                dependencyNode = currentNode;
            }
            currentNode = currentNode.parent;
        }

        return dependencyNode;
    }

    constructor(props: IDataContextLoaderProps) {
        this._$configs = props.configs;
        this._$tree = new relation.Tree<IDataContextConfigs>(treeOptions);
        this._$loadTimeout = props.loadTimeout;
        //@ts-ignore
        this._$tree.parseTree(this._$configs);
        //@ts-ignore
        this._$router = props.router;
    }

    async load(): Promise<IDataContextConfigs> {
        this._$tree.each(async (value, nodeName, node) => {
            const currentNodePath = node.getPath(true).join(', ');
            if (value.dependencies?.length) {
                const depPromises: Promise<Record<string, unknown>>[] = [];
                value.dependencies.forEach((dependencyName: string) => {
                    const dependencyNode = this._findDependencyNode(node, dependencyName);
                    if (!dependencyNode) {
                        //todo Error
                    } else {
                        const dependencyNodePath = dependencyNode.getPath(true).join(', ');
                        if (this._loadPromises.has(dependencyNodePath)) {
                            //@ts-ignore;
                            depPromises.push(this._loadPromises.get(dependencyNodePath));
                        } else {
                            const loadPromise = this._loadNode(value, nodeName, node);
                            depPromises.push(loadPromise);
                            this._loadPromises.set(currentNodePath, loadPromise);
                        }
                    }
                });
                const loadPromise = Promise.all(depPromises).then(() => {
                    return this._loadNode(value, nodeName, node);
                });
                this._loadPromises.set(currentNodePath, loadPromise);
            } else {
                this._loadPromises.set(currentNodePath, this._loadNode(value, nodeName, node));
            }
        });
        const loadPromises = [];
        for (const loadPromise of this._loadPromises.values()) {
            loadPromises.push(loadPromise);
        }

        await Promise.all(loadPromises);
        this._loadPromises.clear();

        return this._$tree.toObject();
    }

    async loadCompatible(
        configGetters: Record<string, IDataConfigLoader>,
        withDataConfigs?: boolean
    ): Promise<ILoadedDataConfigsResult> {
        const compatibleConfigs = buildContextTreeFromFlatObject(configGetters);
        //@ts-ignore
        this._$tree.parseTree(compatibleConfigs);

        await this.load();
        const loadResults: Record<string, Record<string, unknown>> = {};
        const dataConfigs: Record<string, TDataConfigs> = {};
        const configs: ILoadedDataConfigsResult['configs'] = {};

        this._$tree.each((value, nodeName, node) => {
            const loader = this._$nodes.get(node.getPath(true).toString());
            loadResults[nodeName] = value.data;
            if (loader) {
                configs[nodeName] = loader?.getResolvedConfig();

                if (withDataConfigs) {
                    dataConfigs[nodeName] = loader?.getDataConfigs() || {};
                }
            }
        });

        return {
            loadResults,
            dataConfigs,
            configs,
        };
    }

    getDataContext(): DataContext {
        return this._$dataContext;
    }
}
