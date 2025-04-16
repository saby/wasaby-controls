import { IDataConfigLoader, TDataConfigs, IDataContextConfigs } from 'Controls-DataEnv/dataFactory';
import { relation, Model } from 'Types/entity';
import { IRouter } from 'Router/router';
import { DataContextAPI, IDataContextField } from 'Controls-DataEnv/context';
import DataNodeLoader from 'Controls-DataEnv/_dataLoader/DataNodeLoader';
import { TLoadTimeout } from 'Controls-DataEnv/_dataLoader/interface';
import { loadErrorHandler } from './utils';

const treeOptions: relation.ITreeOptions = {
    keyProperty: 'id',
    parentProperty: 'parentId',
    childrenProperty: 'children',
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

function findElement(name: string, context: IDataContextField[]): IDataContextField | undefined {
    return context.find((item) => item.name === name);
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
    private readonly _loadPromises: Map<string, Promise<Record<string, unknown>>> = new Map<
        string,
        Promise<Record<string, unknown>>
    >();
    private readonly _$contextNodes: Map<string, DataNodeLoader> = new Map<
        string,
        DataNodeLoader
    >();
    private readonly _$loadTimeout: IDataContextLoaderProps['loadTimeout'];

    private _$context: IDataContextField[] = [];

    private _$router: IRouter;

    constructor(props: IDataContextLoaderProps) {
        this._$configs = props.configs;
        this._$tree = new relation.Tree<IDataContextConfigs>(treeOptions);
        this._$loadTimeout = props.loadTimeout;
        //@ts-ignore
        this._$tree.parseTree(this._$configs);
        //@ts-ignore
        this._$router = props.router;
    }

    private async _loadNode(
        config: IDataConfigLoader,
        node: relation.ITreeItem<IDataContextConfigs>
    ): Promise<Record<string, unknown>> {
        const path = node.getPath(true);
        this._addToContext(node.value.data || {});

        const loader = new DataNodeLoader({
            config,
            dataContext: new DataContextAPI(this._$context),
            router: this._$router,
            path,
            loadTimeout: this._$loadTimeout,
        });
        this._$contextNodes.set(path.toString(), loader);
        const nodeResult = await loader.load();
        this._addToContext(nodeResult, true);
        node.value.data = nodeResult;
        //@ts-ignore расширить интерфейс IDataContextConfigs
        node.value.isAsyncConfigGetter = !!loader.getResolvedConfig()?.isAsyncConfigGetter;

        return nodeResult;
    }

    //TODO удалить костыль с replace https://online.sbis.ru/opendoc.html?guid=6617c70a-0606-4577-ba7d-6a960929c45f&client=3
    private _addToContext(nodeResult: Record<string, unknown>, replace: boolean = false) {
        Object.entries(nodeResult).forEach(([name, value]) => {
            if (value instanceof Model && value.getTypeName() !== 'record') {
                const element = findElement(name, this._$context);
                if (replace && element) {
                    element.value = value;
                } else {
                    this._$context.unshift({
                        name,
                        value,
                    });
                }
            }
        });
    }

    private _findDependencyNode(
        startNode: relation.ITreeItem,
        dependency: string
    ): relation.ITreeItem | undefined {
        let currentNode = startNode.parent;
        let dependencyNode;

        while (currentNode && !dependencyNode) {
            if (
                currentNode.name === dependency ||
                currentNode?.value?.configs?.hasOwnProperty(dependency)
            ) {
                dependencyNode = currentNode;
            }
            currentNode = currentNode.parent;
        }

        return dependencyNode;
    }

    async load(): Promise<IDataContextConfigs> {
        this._$tree.each(async (value, _nodeName, node) => {
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
                            const loadPromise = this._loadNode(value, node);
                            depPromises.push(loadPromise);
                            this._loadPromises.set(currentNodePath, loadPromise);
                        }
                    }
                });
                const loadPromise = Promise.all(depPromises).then(() => {
                    return this._loadNode(value, node);
                });
                this._loadPromises.set(currentNodePath, loadPromise);
            } else {
                this._loadPromises.set(currentNodePath, this._loadNode(value, node));
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
            const loader = this._$contextNodes.get(node.getPath(true).toString());
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

    getPendingPromisesInfo(): string {
        const pendingContextNodes = Array.from(this._$contextNodes.values()).filter(
            (node) => !node.isReady()
        );

        if (pendingContextNodes.length > 0) {
            const errorMessages = pendingContextNodes.map(
                (node) =>
                    `Узел контекста, в котором завис промис: ${node.getName()}, 
Элементы, которые зависли во время загрузки: 
${node.getPendingContextElementsInfo()}`
            );

            return errorMessages.join('\n');
        }

        return '';
    }

    logPendingPromises(): void {
        const pendingPromisesInfo = this.getPendingPromisesInfo();
        if (pendingPromisesInfo) {
            loadErrorHandler(
                new Error(
                    `Во время загрузки данных остались незавершенные промисы загрузки:\n${pendingPromisesInfo}\n`
                ),
                'Controls-DataEnv/dataLoader:DataContextLoader:'
            );
        }
    }
}
