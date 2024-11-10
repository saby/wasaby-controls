import { IDataConfig, IDataConfigLoader, TDataConfigs } from 'Controls-DataEnv/dataFactory';
import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import ContextNode from './ContextNode';
import { STORE_ROOT_NODE_KEY } from './Constants';
import type { IStoreChange, IContextNodeChange } from './interface';
import { logger as Logger } from 'Application/Env';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import type { Loader } from 'Controls-DataEnv/dataLoader';
import { DataContext, IDataNode } from 'Controls-DataEnv/dataContext';
import ContextConfigStorage from './ContextConfigStorage';

export interface IHierarchicalStoreProps extends IStoreProps {
    dataConfigs: IDataConfigsProp;
}

export interface IFlatStoreProps extends IStoreProps {
    configs: TDataConfigs;
    loadResults: TFlatLoadResults;
}

interface IStoreProps {
    router?: IRouter;
    getSlicesContextNodeName?: string;

    getSlicesConfig?(loadResults: TFlatLoadResults, currentState?: IStore): TDataConfigs;

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

/**
 *
 */
export type IStore = Record<string, Slice | unknown>;
/**
 *
 */
export type TFlatLoadResults = Record<string, unknown>;
/**
 *
 */
export type THierarchicalLoadResults = Record<string, Record<string, unknown>>;

function isFlatStore(props: any): props is IFlatStoreProps {
    return !!props.configs;
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

/**
 * Хранилище данных со слайсами.
 * @private
 */
export default class StoreWithSlices {
    private _$props: IFlatStoreProps | IHierarchicalStoreProps;
    private _$nodes: Record<string, ContextNode> = {};
    private readonly _$dataContext: DataContext;
    private _$contextConfigStorage: ContextConfigStorage;

    constructor(props: IHierarchicalStoreProps | IFlatStoreProps) {
        this._$props = props;
        this._onDelayedCreateNodeElements = this._onDelayedCreateNodeElements.bind(this);
        this._onNodeSnapshot = this._onNodeSnapshot.bind(this);
        this._onChange = this._onChange.bind(this);

        this._$dataContext = new DataContext({
            data: [],
        });

        this._$contextConfigStorage = new ContextConfigStorage({
            //@ts-ignore
            router: props.router,
        });

        if (isFlatStore(props)) {
            this._$dataContext.addNode({
                id: STORE_ROOT_NODE_KEY,
                data: props.loadResults,
                parent: null,
            });
            this._$contextConfigStorage.addResolvedNode(
                STORE_ROOT_NODE_KEY,
                props.getSlicesConfig?.(this._$dataContext.getNodeData(STORE_ROOT_NODE_KEY)) ||
                    props.configs
            );
        } else {
            Object.entries(props.dataConfigs.configs).forEach(([nodeName, config]) => {
                this._$contextConfigStorage.addNodeConfig(nodeName, config);
                this._$dataContext.addNode({
                    id: nodeName,
                    data: props.dataConfigs.loadResults[nodeName],
                    parent: this._$contextConfigStorage.getParent(nodeName),
                });
            });
        }

        this._$contextConfigStorage.resolveNodeConfigs(this._$dataContext);

        if (props.getSlicesConfig && props.getSlicesContextNodeName) {
            this._$contextConfigStorage.mergeToNode(
                props.getSlicesContextNodeName,
                props.getSlicesConfig(
                    this._$dataContext.getNodeData(props.getSlicesContextNodeName)
                )
            );
        }

        this._$contextConfigStorage.getNodeOrder().forEach((nodeName) => {
            if (
                Object.keys(this._$contextConfigStorage.getNodeDataConfigs(nodeName)).length ||
                nodeName === STORE_ROOT_NODE_KEY
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
        const parentKey = this._$contextConfigStorage.getParent(name);

        return new ContextNode({
            name,
            onChange: this._onChange,
            configs: this._$contextConfigStorage.getNodeDataConfigs(name),
            loadResults: this._$dataContext.getNodeData(name),
            onSnapshot: this._onNodeSnapshot,
            parentNode: parentKey ? this._$nodes[parentKey] : null,
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

        this._$contextConfigStorage.getNodeOrder().forEach((nodeName: string) => {
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
        const currentNodeConfigs = this._$contextConfigStorage.getNodeDataConfigs(nodeName);
        const elementConfig = { ...currentNodeConfigs[elementName] };
        elementConfig.dataFactoryArguments = {
            ...elementConfig.dataFactoryArguments,
            ...dataFactoryArguments,
        };
        const reloadedConfigs = {
            [elementName]: elementConfig,
        };

        if (elementConfig.dependencies) {
            elementConfig.dependencies.forEach((dep) => {
                reloadedConfigs[dep] = currentNodeConfigs[dep];
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

        const replaceResult = this._$contextConfigStorage.replaceElementAtNode(
            nodeName,
            elementName,
            elementConfig,
            loadResult[elementName],
            this._$dataContext
        );

        this._$contextConfigStorage.resolveNodeConfigs(this._$dataContext);

        replaceResult.newNodes.forEach((newNode) => {
            this._$nodes[newNode] = this._createNode(newNode);
        });

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
        if (this._$nodes[nodeName]) {
            contextElementAlreadyExist(nodeName, 'createNode');
            return;
        }

        this._$contextConfigStorage.addNodeConfig(nodeName, {
            ...nodeConfig,
            isAsyncConfigGetter: false,
            isResolvedConfigGetter: false,
        });

        this._$dataContext.addNode({
            id: nodeName,
            data: loadResults,
            parent: nodeConfig.parentId,
        });

        this._$contextConfigStorage.resolveNodeConfigs(this._$dataContext);

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

        this._$dataContext.addToNode(elementNode, {
            [elementName]: loadResult,
        });

        node.addElement(elementName, loadResult, config);
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

    getDataContext(): DataContext {
        const data: IDataNode[] = [];
        Object.entries(this._$nodes).forEach(([nodeName, node]) => {
            data.push({
                id: nodeName,
                data: node.getData(),
                parent: node.getParent()?.getName(),
            });
        });
        return new DataContext({
            data,
        });
    }

    destroy() {
        Object.values(this._$nodes).forEach((contextNode) => {
            contextNode.destroy();
        });
        this._$nodes = {};
    }
}
