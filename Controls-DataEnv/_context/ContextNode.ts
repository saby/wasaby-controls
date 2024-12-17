import {
    TDataConfigs,
    IDataConfig,
    IDataContextConfigs,
    DataConfigResolver,
} from 'Controls-DataEnv/dataFactory';
import type { IRouter } from 'Router/router';
import type { DataContext } from 'Controls-DataEnv/dataContext';
import ContextElement from './ContextElement';
import type { Slice } from 'Controls-DataEnv/slice';
import type { IContextNodeChange } from './interface';
import { logger } from 'Application/Env';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import type { Loader } from 'Controls-DataEnv/dataLoader';

interface IContextNodeProps {
    name: string;
    contextConfigs: IDataContextConfigs;
    parentNode: ContextNode | null;
    onChange: Function;
    onSnapshot: Function;
    dataContext: DataContext;
    router?: IRouter;
    getSlicesConfig?: Function;
    getSlicesConfigNode?: string;
}

interface IRelatedElements {
    elements: string[];
    nodes: string[];
}

function getSliceOrderByDependencies(configs: TDataConfigs): string[] {
    const entries = Object.entries(configs);
    const loadedSet = new Set();
    const sorted = [];

    while (entries.length) {
        const element = entries.shift();
        if (element) {
            const [configName, config] = element;
            const valuesDependencies = ContextElement.getValuesDependencies(config);

            if (valuesDependencies.every((item) => loadedSet.has(item))) {
                loadedSet.add(configName);
                sorted.push(configName);
            } else {
                entries.push([configName, config]);
            }
        }
    }

    return sorted;
}

function checkCircularDependencies(configs: TDataConfigs, name: string): void {
    Object.entries(configs).forEach(([key, config]) => {
        if (config.dataFactoryArguments?.sliceExtraValues) {
            const elementDeps = ContextElement.getValuesDependencies(config);
            elementDeps.forEach((dependency) => {
                const dependencyConfigDeps = ContextElement.getValuesDependencies(
                    configs[dependency]
                );
                if (dependencyConfigDeps.includes(key)) {
                    throw new Error(`В конфигурации фабрик данных существует циклическая зависимость.
                     В sliceExtraValues фабрики ${key} указана зависимость от ${dependency}. Узел ${name}`);
                }
            });
        }
    });
}

async function getLoader(): Promise<typeof Loader> {
    const module = await loadAsync<typeof import('Controls-DataEnv/dataLoader')>(
        'Controls-DataEnv/dataLoader'
    );
    return module.Loader;
}

export default class ContextNode {
    private _$configs: TDataConfigs = {};
    private readonly _$name: string;
    private _$data: Record<string, unknown>;
    private readonly _$parentNode: ContextNode | null;
    private readonly _$dataContext: DataContext;
    private _$elements: Record<string, ContextElement> = {};
    private _$props: IContextNodeProps;
    private _$contextConfigs: IContextNodeProps['contextConfigs'];
    private _$children: Map<string, ContextNode> = new Map();
    private _$elementOrder: string[] = [];
    private _$value: Record<string, Slice | unknown> = {};
    private _$relatedElements: Record<
        string,
        {
            nodes: string[];
            elements: string[];
        }
    > = {};

    constructor(props: IContextNodeProps) {
        this._$props = props;
        this._$contextConfigs = { ...this._$props.contextConfigs };
        this._$parentNode = props.parentNode || null;
        this._$name = this._$contextConfigs.name || props.name;
        this._onElementSnapshot = this._onElementSnapshot.bind(this);
        this._onChangeElement = this._onChangeElement.bind(this);
        this._$data = this._$contextConfigs.data || {};
        this._$dataContext = props.dataContext;
        this._$dataContext.addNode(this.getPath(false), this._$name, this._$data);
        this._$configs = this._getDataConfigs();
        checkCircularDependencies(this._$configs, props.name);
        this._initState();
    }

    private _createElementOrder(): void {
        this._$elementOrder = getSliceOrderByDependencies(this._$configs);
    }

    private getRelatedElements(contextConfigs: IDataContextConfigs): IRelatedElements {
        const relatedElements: IRelatedElements = {
            nodes: [],
            elements: [],
        };

        if ('configs' in contextConfigs) {
            relatedElements.elements = Object.keys(contextConfigs.configs);
        }

        if (contextConfigs.children) {
            relatedElements.nodes = Object.keys(contextConfigs.children);
        }

        return relatedElements;
    }

    private _getDataConfigs(contextConfigs = this._$contextConfigs): TDataConfigs {
        if ('configs' in contextConfigs) {
            return contextConfigs.configs;
        } else if ('configGetter' in contextConfigs) {
            let dataConfigs: TDataConfigs;
            try {
                //@ts-ignore
                dataConfigs = !contextConfigs.isAsyncConfigGetter
                    ? DataConfigResolver.getConfigFromLoaderSync(
                          contextConfigs,
                          this._$dataContext,
                          this.getPath()
                      )
                    : DataConfigResolver.convertLoadResultsToFactory(contextConfigs.data as object);
            } catch (e) {
                dataConfigs = {};
                if (e instanceof Error) {
                    logger.error(
                        `Произошла ошибка при вызове метода getConfig из модуля ${contextConfigs.configGetter} ${e.message}`
                    );
                }
            }

            if (
                this._$props.getSlicesConfig &&
                this._$props.getSlicesConfigNode &&
                this._$name === this._$props.getSlicesConfigNode
            ) {
                const contextConfigsFromGetter = this._$props.getSlicesConfig(
                    this._$dataContext.getNodeData(this.getPath(true))
                );
                return {
                    ...dataConfigs,
                    ...contextConfigsFromGetter,
                };
            }
            return dataConfigs;
        }
        return {};
    }

    private _initState(): void {
        this._createElementOrder();

        this._$elementOrder.forEach((sliceName) => {
            this.addElement(sliceName, this._$data[sliceName], this._$configs[sliceName]);
        });

        if (this._$contextConfigs.children) {
            Object.entries(this._$contextConfigs.children).forEach(([childName, childConfig]) => {
                const childNode = new ContextNode({
                    contextConfigs: childConfig,
                    name: childName,
                    parentNode: this,
                    router: this._$props.router,
                    onChange: this._$props.onChange,
                    onSnapshot: this._$props.onSnapshot,
                    dataContext: this._$dataContext,
                    getSlicesConfigNode: this._$props.getSlicesConfigNode,
                    getSlicesConfig: this._$props.getSlicesConfig,
                });
                this._$children.set(childName, childNode);
            });
        }
    }

    protected _onElementSnapshot(
        changedElementName: string,
        elementPartialState: Record<string, unknown>
    ): void {
        const changes = this.getChanges({
            [changedElementName]: elementPartialState,
        });

        this._$props.onSnapshot(changes, this.getPath());
    }

    protected _onChangeElement(): void {
        this._$value = { ...this._$value };
        this._$props.onChange();
    }

    getParent(): ContextNode | null {
        return this._$parentNode;
    }

    getConfigs(): TDataConfigs {
        return this._$configs;
    }

    getState(): Record<string, ContextElement> {
        return this._$elements;
    }

    getValue(): Record<string, Slice | unknown> {
        return this._$value;
    }

    getPath(includeSelf: boolean = true): string[] {
        const path = includeSelf ? [this.getName()] : [];
        let node: ContextNode | null = this;

        while (node?.getParent()) {
            node = node?.getParent();
            if (node) {
                path.unshift(node.getName());
            }
        }

        return path;
    }

    getData(): Record<string, unknown> {
        const data: Record<string, unknown> = {};
        Object.entries(this._$elements).forEach(([elementName, element]) => {
            data[elementName] = element.getData();
        });
        return data;
    }

    getLoadResults(): Record<string, unknown> {
        return this._$data;
    }

    getLoadResult(name: string): unknown {
        let node: ContextNode | null = this;
        let hasLoadResultOnNode = this._$data.hasOwnProperty(name);
        let loadResult = this._$data[name];

        while (!hasLoadResultOnNode && node?.getParent()) {
            node = node?.getParent();
            const nodeLoadResults = node?.getLoadResults();
            hasLoadResultOnNode = !!nodeLoadResults?.hasOwnProperty(name);
            loadResult = nodeLoadResults?.[name];
        }

        return loadResult;
    }

    getName(): string {
        return this._$name;
    }

    getElement(name: string, deep: boolean = true): ContextElement | undefined {
        const element: ContextElement | undefined = this.getState()[name];

        if (!element && deep) {
            const parentNode: ContextNode | null = this.getParent();
            if (parentNode) {
                return parentNode.getElement(name, deep);
            }
        }

        return element;
    }

    getNodeByPath(path: string[]): ContextNode | null {
        const [firstPathItem] = path;
        let result: ContextNode | null = this.getChild(firstPathItem);

        for (let i = 1; i < path.length; i++) {
            if (result === undefined || result === null) {
                return null;
            }

            const name = path[i];

            result = result.getChild(name);
        }

        return result;
    }

    getChild(name: string): ContextNode | null {
        return this._$name === name ? this : this._$children.get(name) || null;
    }

    async reloadElement(
        elementName: string,
        dataFactoryArguments: IDataConfig['dataFactoryArguments']
    ): Promise<void> {
        const currentElement = this._$elements[elementName];

        if (!currentElement) {
            throw new Error(
                `В узле контекста ${this.getName()} не найден элемент ${elementName} попытке его перезагрузить`
            );
        }

        const loader = await getLoader();
        const currentNodeConfigs = this.getConfigs();
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
                this.addElement(
                    reloadedElementDep,
                    loadResult[reloadedElementDep],
                    reloadedConfigs[reloadedElementDep]
                );
            });
        }

        this.addElement(elementName, loadResult[elementName], elementConfig);
        this._$props.onChange();
    }

    setState(nodePartialState: IContextNodeChange = {}): void {
        this._$elementOrder.forEach((elementName) => {
            const elementValue = nodePartialState[elementName];

            if (elementValue) {
                this._$elements[elementName].setState(elementValue);
            }
        });
        this._$value = { ...this._$value };
    }

    updateElements(configs: TDataConfigs, loadResults: Record<string, unknown>): void {
        Object.entries(configs).forEach(([name, config]) => {
            this.addElement(name, loadResults[name], config);
        });
    }

    update(configs: IDataContextConfigs): void {
        if ('configs' in configs) {
            this.updateElements(configs.configs, configs.data || {});
        }

        if (configs.children) {
            Object.entries(configs.children).forEach(([childName, childConfig]) => {
                const currentChildren = this._$children.get(childName);

                if (currentChildren) {
                    currentChildren.update(childConfig);
                } else {
                    this.addChild(childName, childConfig);
                }
            });
        }
    }

    updateRelatedConfigs(configs: IDataContextConfigs, elementName: string): void {
        const relatedElements = this.getRelatedElements(configs);
        const currentRelatedElements = this._$relatedElements[elementName];

        if (!currentRelatedElements) {
            this.update(configs);
        } else {
            relatedElements.nodes.forEach((relatedNode) => {
                if (configs.children?.[relatedNode]) {
                    this.addChild(relatedNode, configs.children[relatedNode]);
                }
            });

            const removedNodes = currentRelatedElements.nodes.filter((nodeName) => {
                return !relatedElements.nodes.includes(nodeName);
            });

            removedNodes.forEach((remNode) => {
                this._$children.get(remNode)?.destroy();
                this._$children.delete(remNode);
            });
            if ('configs' in configs || 'configGetter' in configs) {
                const dataConfigs = this._getDataConfigs(configs);
                this.updateElements(dataConfigs, configs.data || {});
            }
        }

        this._$relatedElements[elementName] = relatedElements;
    }

    addElement(name: string, loadResult: unknown, config: IDataConfig): void {
        if (this._$elements[name]) {
            this._$elements[name].destroy();
        }

        this._$configs[name] = config;
        this._$data[name] = loadResult;

        const element = new ContextElement({
            name,
            onChange: this._onChangeElement,
            onSnapshot: this._onElementSnapshot,
            config,
            loadResult,
            parentNode: this,
        });

        if (element.hasContextConfigs()) {
            const contextConfig = element.getContextConfigs();

            if (contextConfig) {
                this.updateRelatedConfigs(contextConfig, element.getName());
            }
        }

        this._$elements[name] = element;
        this._$value[name] = this._$elements[name].getValue();
        this._$value = { ...this._$value };

        this._createElementOrder();
    }

    addChild(name: string, nodeConfig: IDataContextConfigs): void {
        if (this._$children.get(name)) {
            this._$children.get(name)?.destroy();
        }
        const node = new ContextNode({
            router: this._$props.router,
            parentNode: this,
            contextConfigs: { ...nodeConfig },
            name,
            onChange: this._$props.onChange,
            onSnapshot: this._$props.onSnapshot,
            dataContext: this._$dataContext,
        });

        this._$children.set(name, node);
    }

    getChanges(changes: IContextNodeChange): IContextNodeChange {
        const nextState: IContextNodeChange = { ...changes };

        Object.entries(changes).forEach(([changedElementName, elementChanges]) => {
            Object.entries(this._$elements).forEach(([elementName, nodeElement]) => {
                const elementExtraValues = nodeElement.getExtraValues();

                if (elementExtraValues) {
                    elementExtraValues.forEach((sliceExtraValue) => {
                        if (
                            sliceExtraValue.dependencyName === changedElementName &&
                            elementChanges.hasOwnProperty(sliceExtraValue.dependencyPropName)
                        ) {
                            let newValue: unknown =
                                elementChanges[sliceExtraValue.dependencyPropName];
                            if (sliceExtraValue.prepare) {
                                newValue = sliceExtraValue.prepare(newValue);
                            }
                            nextState[elementName] = nextState[elementName] || {};
                            nextState[elementName][sliceExtraValue.propName] = newValue;
                        }
                    });
                }
            });
        });

        return nextState;
    }

    destroy(): void {
        Object.values(this._$elements).forEach((contextElement) => {
            contextElement.destroy();
        });

        if (this._$children.size) {
            this._$children.forEach((value) => {
                value.destroy();
            });
            this._$children.clear();
        }
    }

    static getDependencies(nodeConfigs: Record<string, IDataConfig>): string[] {
        const nodeDependencies: string[] = [];

        Object.values(nodeConfigs).forEach((elementConfig) => {
            const elementDeps = ContextElement.getDependencies(elementConfig);
            elementDeps.forEach((elementDependency) => {
                if (!nodeDependencies.includes(elementDependency)) {
                    nodeDependencies.push(elementDependency);
                }
            });
        });

        return nodeDependencies;
    }

    static isAllDepsInCurrentRoot(configs: Record<string, IDataConfig>): boolean {
        const nodeElementsNames = Object.keys(configs);
        const nodeDependencies = ContextNode.getDependencies(configs);

        return nodeDependencies.every((elementDependency) => {
            return nodeElementsNames.includes(elementDependency);
        });
    }
}
