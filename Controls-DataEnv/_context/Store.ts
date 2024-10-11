import { IDataConfig, IDataConfigLoader, IDataContextConfigs } from 'Controls-DataEnv/dataFactory';
import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import ContextNode from './ContextNode';
import { STORE_ROOT_NODE_KEY } from './Constants';
import type { IContextNodeChange } from './interface';
import { logger as Logger } from 'Application/Env';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import type { Loader } from 'Controls-DataEnv/dataLoader';
import { DataContext } from 'Controls-DataEnv/dataContext';
import { relation } from 'Types/entity';

export interface IHierarchicalStoreProps extends IStoreProps {
    dataConfigs: IDataConfigsProp;
}

export interface IFlatStoreProps extends IStoreProps {
    configs: IDataConfigs;
    loadResults: TFlatLoadResults;
}

interface IStoreProps {
    router: IRouter;
    getSlicesContextNodeName?: string;

    getSlicesConfig?(loadResults: TFlatLoadResults, currentState?: IStore): IDataConfigs;

    onChange(store: IStore): void;
}

export interface IDataConfigsProp {
    contextConfigs?: IDataContextConfigs;
    /**
     * Конфигурации фабрик данных.
     * @example
     * <pre class="brush: js">
     *    const configs = {
     *        firstConfig: {
     *            dataFactoryName: '...',
     *            dataFactoryArguments: {}
     *        },
     *        secondConfig: {
     *            dataFactoryName: '...',
     *            dataFactoryArguments: {}
     *        }
     *    };
     * </pre>
     */
    configs?: Record<string, IDataConfigLoader & { isAsyncConfigGetter: boolean }>;
    /**
     * Результаты загрузки данных.
     * @remark Каждому результату должен соответствовать конфиг.
     * @see {@link configs}
     */
    loadResults?: Record<string, Record<string, unknown>>;
}

type IStore = Record<string, Slice | unknown>;

type IDataConfigs = Record<string, IDataConfig>;
type TLoadResult = unknown;
type TFlatLoadResults = Record<string, TLoadResult>;

function isFlatStore(props: any): props is IFlatStoreProps {
    return !!props.configs;
}

function contextElementAlreadyExist(elementName: string, methodName: string): void {
    Logger.error(
        `RootContext:${methodName}::Элемент контекста с именем ${elementName} уже существует`
    );
}

async function getLoader(): Promise<typeof Loader> {
    const module = await loadAsync<typeof import('Controls-DataEnv/dataLoader')>(
        'Controls-DataEnv/dataLoader'
    );
    return module.Loader;
}

/**
 * Хранилище данных со слайсами.
 * @private
 */
export default class StoreWithSlices {
    private _$props: IFlatStoreProps | IHierarchicalStoreProps;
    private _$value: ContextNode;
    private readonly _$dataContext: DataContext;

    constructor(props: IHierarchicalStoreProps | IFlatStoreProps) {
        this._$props = props;
        this._onContextSnapshot = this._onContextSnapshot.bind(this);
        this._onChange = this._onChange.bind(this);
        let contextConfigs: IDataContextConfigs;

        if (isFlatStore(props)) {
            contextConfigs = {
                configs: props.getSlicesConfig?.(props.loadResults) || props.configs,
                data: props.loadResults,
            };
        } else if (props.dataConfigs.configs && props.dataConfigs.loadResults) {
            const tree = new relation.Tree<any>({
                parentProperty: 'parentId',
                childrenProperty: 'children',
                keyProperty: 'name',
            });
            Object.entries(props.dataConfigs.configs).forEach(([name, value]) => {
                if (!value.parentId && name !== 'root') {
                    value.parentId = 'root';
                }
                value.data = props.dataConfigs.loadResults?.[name] || {};
            });
            if (!props.dataConfigs.configs[STORE_ROOT_NODE_KEY]) {
                // @ts-ignore
                props.dataConfigs.configs[STORE_ROOT_NODE_KEY] = {};
            }
            let contextObj;
            if (Object.keys(props.dataConfigs.configs).length === 1) {
                contextObj = props.dataConfigs.configs;
            } else {
                tree.parseTree(props.dataConfigs.configs);
                contextObj = tree.toObject();
            }

            contextConfigs = contextObj[STORE_ROOT_NODE_KEY] || {};
        } else {
            // @ts-ignore;
            contextConfigs = props.dataConfigs.contextConfigs || props.dataConfigs;
        }

        this._$dataContext = new DataContext({
            data: {},
        });

        this._$value = new ContextNode({
            name: STORE_ROOT_NODE_KEY,
            contextConfigs: contextConfigs.hasOwnProperty(STORE_ROOT_NODE_KEY)
                ? //@ts-ignore
                  contextConfigs[STORE_ROOT_NODE_KEY]
                : contextConfigs,
            router: props.router,
            parentNode: null,
            dataContext: this._$dataContext,
            onSnapshot: this._onContextSnapshot,
            onChange: this._onChange,
            getSlicesConfig: props.getSlicesConfig,
            getSlicesConfigNode: props.getSlicesContextNodeName,
        });
    }

    protected _onContextSnapshot(
        changedNodeValue: IContextNodeChange,
        changedNodePath: string[]
    ): void {
        const changedNode = this.getNodeByPath(changedNodePath);

        if (changedNode) {
            changedNode.setState(changedNodeValue);
        }
    }

    setState(): void {
        this._$value.setState();
    }

    getNodeValueByPath(path: string[]): Record<string, Slice | unknown> | null {
        return this._$value.getNodeByPath(path)?.getValue() || null;
    }

    async reloadElement(
        nodePath: string[],
        elementName: string,
        dataFactoryArguments: IDataConfig['dataFactoryArguments'] = {}
    ): Promise<void> {
        const node = this._$value.getNodeByPath(nodePath);

        if (!node) {
            throw new Error(
                `Узел контекста ${nodePath.join(
                    '. '
                )}  не найден при попытке перезагрузить слайс ${elementName}`
            );
        }
        return node.reloadElement(elementName, dataFactoryArguments);
    }

    async createNode(
        nodePath: string[],
        nodeName: string,
        nodeConfig: IDataConfigLoader
    ): Promise<void> {
        const loader = await getLoader();
        const nodeElement = this._$value.getNodeByPath(nodePath);

        if (nodeElement) {
            const dataLoadResults = await loader.loadByConfigs(
                {
                    [nodeName]: nodeConfig,
                },
                undefined,
                this._$props.router,
                true
            );

            this.createNodeSync(
                nodePath,
                nodeName,
                nodeConfig,
                dataLoadResults.loadResults[nodeElement.getName()]
            );
        }
    }

    createNodeSync(
        nodePath: string[],
        nodeName: string,
        nodeConfig: IDataConfigLoader,
        loadResults: Record<string, unknown>
    ): void {
        const nodeElement = this._$value.getNodeByPath(nodePath);
        if (!nodeElement) {
            contextElementAlreadyExist(nodeName, 'createNode');
            return;
        }

        nodeElement.addChild(nodeName, nodeConfig, loadResults);

        this._onChange();
    }

    async createElement(
        nodePath: string[],
        elementName: string,
        config: IDataConfig
    ): Promise<void> {
        const loader = await getLoader();
        const loadedResult = await loader.load(
            { [elementName]: config },
            undefined,
            this._$props.router
        );
        this.createElementSync(nodePath, elementName, config, loadedResult);
    }

    createElementSync(
        nodePath: string[],
        elementName: string,
        config: IDataConfig,
        loadResult: unknown
    ): void {
        const nodeElement = this._$value.getNodeByPath(nodePath);
        if (nodeElement) {
            nodeElement.addElement(elementName, loadResult, config);
            this._onChange();
        }
    }

    _onChange(): void {
        this._$props.onChange({});
    }

    getState(node: string = STORE_ROOT_NODE_KEY): Record<string, Slice | unknown> {
        return this._$value.getNodeByPath([node])?.getValue() || {};
    }

    getElement(elementName: string, startNodePath: string[]): Slice | unknown {
        const node = this.getNodeByPath(startNodePath);
        if (node) {
            return node.getElement(elementName)?.getValue();
        }
    }

    getNodeByPath(path: string[]): ContextNode | null {
        return this._$value.getNodeByPath(path);
    }

    getNode(nodeName: string): ContextNode {
        const node = this.getNodeByPath([nodeName]) || this.getNodeByPath([STORE_ROOT_NODE_KEY]);
        return node as ContextNode;
    }

    getDataContext(): DataContext {
        return new DataContext({
            data: {},
        });
    }

    destroy() {
        this._$value.destroy();
    }
}
