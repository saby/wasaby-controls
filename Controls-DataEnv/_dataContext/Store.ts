import { object } from 'Types/util';

const STORE_ROOT_KEY = 'root';

interface IDataNode {
    id: string;
    parent?: string | null;
    data: Record<string, unknown>;
}

interface IDataContextProps {
    data: IDataNode[];
}

const STORE_ROOT_NODE_KEY = 'root';

function initRootIfNeed(data: IDataNode[]): IDataNode[] {
    return data.map((element) => {
        const resolvedElement = { ...element };
        if (!resolvedElement.parent) {
            resolvedElement.parent = STORE_ROOT_KEY;
        }
        return resolvedElement;
    });
}

function getNode(name: string, data: IDataNode[]): IDataNode | undefined {
    return data.find((dataElement) => {
        return dataElement.id === name;
    });
}

function getNodeDepth(startNode: string, nodes: IDataNode[]): number {
    let nodeName = startNode;
    let weight = 0;

    while (nodeName !== STORE_ROOT_NODE_KEY) {
        const currentNode = nodes.find((el) => {
            return el.id === nodeName;
        });

        if (currentNode?.parent) {
            weight += 1;
            nodeName = currentNode.parent || STORE_ROOT_NODE_KEY;
        }
    }

    return weight;
}

export default class DataContext {
    private readonly _data: IDataContextProps['data'];
    private _currentNode: string;

    get contextValue(): Record<string, any> {
        const nodesDepth: Record<string, number> = {};
        const value = {};
        this._data.forEach((dataNode) => {
            nodesDepth[dataNode.id] = getNodeDepth(dataNode.id, this._data);
        });

        const sortedNodes = Object.keys(nodesDepth).sort((node1Key, node2Key) => {
            return nodesDepth[node1Key] - nodesDepth[node2Key];
        });

        sortedNodes.forEach(() => {
            //TODO
        });

        return value;
    }

    constructor(props: IDataContextProps) {
        this._data = initRootIfNeed(props.data);
        this._currentNode = STORE_ROOT_KEY;
    }

    addElement(nodeName: string, elementName: string, value: unknown): void {
        const node = getNode(nodeName, this._data);

        if (node) {
            node.data[elementName] = value;
        }
    }

    addNode(nodeElement: IDataNode): void {
        this._data.push(nodeElement);
    }

    addToNode(name: string, data: IDataNode['data']): void {
        const node = getNode(name, this._data);

        if (node) {
            node.data = {
                ...node.data,
                ...data,
            };
        }
    }

    merge(newData: Record<string, Record<string, unknown>>, parentCallback: Function): void {
        Object.entries(newData || {}).forEach(([nodeName, data]) => {
            const currentNode = getNode(nodeName, this._data);

            if (currentNode) {
                currentNode.data = {
                    ...currentNode.data,
                    ...data,
                };
            } else {
                this.addNode({
                    id: nodeName,
                    data,
                    parent: parentCallback(nodeName),
                });
            }
        });
    }

    getNodeData(name: string): Record<string, unknown> {
        const node = getNode(name, this._data);

        if (!node) {
            throw new Error(`В контексте данных узел с именем ${name} не найден`);
        }

        return node.data || {};
    }

    setCurrentNode(nodeName: string): void {
        const node = getNode(nodeName, this._data);

        if (!node) {
            throw new Error(
                `DataContext::Установка курсора на узел ${nodeName} невозможна, узел не найден в контексте данных`
            );
        } else {
            this._currentNode = nodeName;
        }
    }

    get(path: string[] = []): unknown {
        let hasNodeWithData = false;
        let node;
        let searchNode = this._currentNode;

        while (!hasNodeWithData || searchNode !== null) {
            node = getNode(searchNode, this._data) as IDataNode;
            hasNodeWithData = node.data.hasOwnProperty(path[0]);
            searchNode = node.parent as string;
        }

        if (!hasNodeWithData) {
            return;
        } else if (node) {
            let currentValue = node.data;

            for (const pathPart of path) {
                currentValue = object.getPropertyValue(currentValue, pathPart);
            }

            return currentValue;
        }
    }
}
