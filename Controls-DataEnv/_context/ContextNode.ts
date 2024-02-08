import { TDataConfigs, IDataConfig } from 'Controls-DataEnv/dataFactory';
import type { IRouter } from 'Router/router';
import ContextElement from './ContextElement';
import type { Slice } from 'Controls-DataEnv/slice';
import { STORE_ROOT_NODE_KEY } from './Constants';
import type { IContextNodeChange } from './interface';

interface IContextNodeProps {
    name: string;
    configs: TDataConfigs;
    parentNode: ContextNode | null;
    loadResults: Record<string, unknown>;
    onChange: Function;
    onSnapshot: Function;
    router?: IRouter;

    onDelayedCreateElements(
        nodeChangedName: string,
        elementsLoadResults: Record<string, unknown>
    ): TDataConfigs | undefined;
}

const DEFAULT_CREATION_ORDER = 0;

function getSliceOrderByDependencies(configs: TDataConfigs): string[] {
    const entries = Object.entries(configs);
    const loadedSet = new Set();
    const sorted = [];

    while (entries.length) {
        const [configName, config] = entries.shift();
        const valuesDependencies = ContextElement.getValuesDependencies(config);

        if (valuesDependencies.every((item) => loadedSet.has(item))) {
            loadedSet.add(configName);
            sorted.push(configName);
        } else {
            entries.push([configName, config]);
        }
    }

    return sorted;
}

function validateDependencies(props: IContextNodeProps): void {
    const isAllDepsInCurrentRoot = ContextNode.isAllDepsInCurrentRoot(props.configs);

    if (!isAllDepsInCurrentRoot && props.name === STORE_ROOT_NODE_KEY) {
        throw new Error(
            'DataContextStore::У слайсов в глобальной ноде контекста есть зависимости, которых нет на текущем уровне иерархии, т.к выше нее никого нет, то создание стора невозможно'
        );
    }
}

export default class ContextNode {
    private _$elements: Record<string, ContextElement> = {};
    private _$props: IContextNodeProps;
    private _$elementOrder: string[] = [];
    private _$configs: TDataConfigs = {};
    private _$value: Record<string, Slice | unknown> = {};
    private _$name: string;
    private readonly _$elementQueueCreation: Record<
        number,
        {
            configs: IContextNodeProps['configs'];
            loadResults: IContextNodeProps['loadResults'];
            pendingPromises: Promise<unknown>[];
        }
    >;
    private readonly _$parentNode: ContextNode | null;
    private readonly _$loadResults: IContextNodeProps['loadResults'];

    constructor(props: IContextNodeProps) {
        validateDependencies(props);
        this._$props = props;
        this._$loadResults = props.loadResults;
        this._$parentNode = props.parentNode || null;
        this._$name = props.name;
        this._$elementQueueCreation = {};
        this._onSnapshot = this._onSnapshot.bind(this);
        this._onChangeElement = this._onChangeElement.bind(this);

        const queues: number[] = [];

        Object.entries(props.configs).forEach(([name, config]) => {
            const queue = config.dataFactoryCreationOrder || DEFAULT_CREATION_ORDER;

            if (!queues.includes(queue)) {
                queues.push(queue);
            }

            this._$elementQueueCreation[queue] = this._$elementQueueCreation[queue] || {
                configs: {},
                loadResults: {},
            };
            this._$elementQueueCreation[queue].configs[name] = config;
            this._$elementQueueCreation[queue].loadResults[name] = this._$loadResults[name];
        });

        queues.sort();

        queues.forEach((queue) => {
            const queueElement = this._$elementQueueCreation[queue];
            queueElement.pendingPromises = [];

            Object.entries(queueElement.loadResults).forEach(([name, loadResult]) => {
                if (loadResult instanceof Promise) {
                    const pendingPromise = loadResult.then((result) => {
                        queueElement.loadResults[name] = result;
                    });
                    queueElement.pendingPromises.push(pendingPromise);
                    delete queueElement.loadResults[name];
                    delete queueElement.configs[name];
                }
            });

            if (queueElement.pendingPromises.length) {
                Promise.all(queueElement.pendingPromises).then(() => {
                    queueElement.configs =
                        this._$props.onDelayedCreateElements(
                            this.getName(),
                            queueElement.loadResults
                        ) || queueElement.configs;
                    this._createStateNode(queueElement.configs, queueElement.loadResults);
                });
            }

            this._createStateNode(queueElement.configs, queueElement.loadResults);
        });
    }

    private _createElementOrder(): void {
        this._$elementOrder = getSliceOrderByDependencies(this._$configs);
    }

    private _createStateNode(
        configs: IContextNodeProps['configs'],
        loadResults: IContextNodeProps['loadResults']
    ): Record<string, ContextElement> {
        const state: Record<string, ContextElement> = this._$elements;
        this._$configs = {
            ...this._$configs,
            ...configs,
        };
        this._createElementOrder();

        this._$elementOrder.forEach((sliceName) => {
            const element =
                state[sliceName] ||
                this.createElement(sliceName, loadResults[sliceName], configs[sliceName]);
            this._$value[sliceName] = element.getValue();
            state[sliceName] = element;
        });

        return state;
    }

    protected _onSnapshot(
        changedElementName: string,
        elementPartialState: Record<string, unknown>
    ): void {
        const nodeSnapshot = {
            [changedElementName]: elementPartialState,
        };

        this._$props.onSnapshot(this.getName(), { ...nodeSnapshot });
    }

    protected _onChangeElement(): void {
        this._$value = { ...this._$value };
        this._$props.onChange();
    }

    getParent(): ContextNode | null {
        return this._$parentNode;
    }

    getState(): Record<string, ContextElement> {
        return this._$elements;
    }

    getValue(): Record<string, Slice | unknown> {
        return this._$value;
    }

    getLoadResults(): Record<string, unknown> {
        return this._$loadResults;
    }

    getLoadResult(name: string): unknown {
        let node: ContextNode | null = this;
        let hasLoadResultOnNode = this._$loadResults.hasOwnProperty(name);
        let loadResult = this._$loadResults[name];

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

    getElement(name: string): ContextElement {
        let node: ContextNode | null = this;
        let element: ContextElement | undefined = node.getState()[name];

        while (!element && node?.getParent()) {
            node = node?.getParent();
            element = node?.getState()[name];
        }

        return element;
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

    createElement(name: string, loadResult: unknown, config: IDataConfig): ContextElement {
        return new ContextElement({
            name,
            onChange: this._onChangeElement,
            onSnapshot: this._onSnapshot,
            config,
            loadResult,
            parentNode: this,
        });
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
