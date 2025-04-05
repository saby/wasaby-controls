import { object } from 'Types/util';
import { relation, Model } from 'Types/entity';

interface IDataNode {
    data?: Record<string, unknown>;
    children?: Record<string, IDataNode>;
}

interface IDataContextProps {
    data: IDataNode;
}

/**
 * @public
 * Интерфейс объекта контекста данных
 */
export interface ISerializedDataNode {
    /**
     * Имя поля контекста
     */
    name: string;
    /**
     * Значение
     */
    value: Model;
}

type TFindObjectCallback = (name: string, data: IDataNode['data']) => Model | null;

/**
 * Методы для взаимодействия с контекстом данных
 * @public
 */
export interface IDataContextAPI {
    /**
     * Метод для получения значения поля из контекста данных по пути
     * @example
     * function(dataContext: IDataContextAPI) {
     *     return dataContext.getValue(['Employee', 'Id']);
     * }
     * @param name Имя поля для поиска
     * @param [path] Путь до объекта для поиска
     */
    getValue(name: string, path?: string[]): unknown | undefined;

    /**
     * Метод для получения объекта из контекста данных по типу
     * @example
     * function(dataContext: IDataContextAPI) {
     *     return dataContext.getObject('Employee');
     * }
     * @param name
     */
    getObject(name: string): Model | null;

    /**
     * Метод для сериализации текущего состояния контекста данных
     */
    serialize(): ISerializedDataNode[];
}

function getFieldNameByType(field: Model, type: string): string | undefined {
    const format = field.getFormat();
    let result: string | undefined;

    format.forEach((fieldFormat) => {
        const fieldName = fieldFormat.getName();
        const fieldValue = field.get(fieldName);

        if (fieldValue instanceof Model && fieldValue.getTypeName() === type) {
            result = fieldName;
        }
    });

    return result;
}

function getObjectByType(
    type: string,
    contextNodeData: Record<string, unknown> = {}
): Model | null {
    let resultValue: Model | null = null;

    Object.keys(contextNodeData)
        .reverse()
        .forEach((fieldName) => {
            const currentValue = contextNodeData[fieldName];

            if (resultValue === null) {
                if (currentValue instanceof Model) {
                    if (currentValue.getTypeName() === type) {
                        resultValue = currentValue;
                    } else {
                        const typedFieldNameFromCurrentObject = getFieldNameByType(
                            currentValue,
                            type
                        );
                        if (typedFieldNameFromCurrentObject) {
                            resultValue = currentValue.get(typedFieldNameFromCurrentObject);
                        }
                    }
                }
            }
        });

    return resultValue;
}

function getObjectByName(
    name: string,
    contextNodeData: Record<string, unknown> = {}
): Model | null {
    let resultValue: Model | null = null;

    if (contextNodeData.hasOwnProperty(name) && contextNodeData[name] instanceof Model) {
        resultValue = contextNodeData[name] as unknown as Model;
    }

    return resultValue;
}

function getObjectWithField(
    name: string,
    contextNodeData: Record<string, unknown> = {}
): Model | null {
    let resultValue: Model | null = null;

    for (const value of Object.values(contextNodeData)) {
        if (value instanceof Model && value.has(name)) {
            resultValue = value;
            break;
        }
    }

    return resultValue;
}

/**
 * Контекст данных
 * @public
 */
export default class DataContext {
    private readonly _$dataTree: relation.Tree<IDataNode> = new relation.Tree<IDataNode>({
        keyProperty: 'id',
        parentProperty: 'parent',
        childrenProperty: 'children',
    });

    get contextValue(): Record<string, any> {
        return this._$dataTree.toObject();
    }

    constructor(props: IDataContextProps) {
        //@ts-ignore;
        this.buildTree(props.data);
    }

    buildTree(nodeConfigs: IDataNode[]): void {
        //@ts-ignore;
        this._$dataTree.parseTree(nodeConfigs);
    }

    addElement(nodeName: string, elementName: string, value: unknown): void {
        const node = this._$dataTree.getChild(nodeName);

        if (node) {
            node.addChild(elementName, value as IDataNode);
        }
    }

    addNode(parentPath: string[], name: string, data?: Record<string, unknown>): void {
        const parentNode = this._$dataTree.findChild(parentPath);

        if (parentNode) {
            if (parentNode.hasChild(name)) {
                parentNode.deleteChild(name);
            }
            parentNode.addChild(name, { data });
        } else {
            if (this._$dataTree.hasChild(name)) {
                this._$dataTree.getChild(name).value = data || {};
            } else {
                this._$dataTree.addChild({ data }, name);
            }
        }
    }

    addToNode(name: string[], data: IDataNode['data']): void {
        const node = this._$dataTree.findChild(name);

        if (node) {
            node.value.data = {
                ...node.value.data,
                ...data,
            };
        }
    }

    getNodeData(path: string[]): Record<string, unknown> {
        const node = this._$dataTree.findChild(path);

        if (!node) {
            throw new Error(`В контексте данных узел с именем ${path} не найден`);
        }

        return node.value.data || {};
    }

    hasNode(path: string[]): boolean {
        return !!this._$dataTree.findChild(path);
    }

    removeElement(elementName: string, nodePath: string[]): void {
        const node = this._$dataTree.findChild(nodePath);

        if (node) {
            const data = node.value.data;

            if (data && data[elementName]) {
                delete data[elementName];
            }
        }
    }

    removeNode(nodePath: string[]): void {
        const node = this._$dataTree.findChild(nodePath);
        if (node) {
            const parent = node.parent;
            if (parent) {
                parent.deleteChild(nodePath[nodePath.length - 1]);
            } else {
                node.value.data = undefined;
            }
        }
    }

    getObject(startContextNode: relation.ITreeItem<IDataNode>, name: string): Model | null {
        return (
            this.findObject(startContextNode, name, getObjectByName) ||
            this.findObject(startContextNode, name, getObjectByType)
        );
    }

    findField(
        startContextNode: relation.ITreeItem<IDataNode>,
        name: string,
        findPath?: string[]
    ): unknown {
        const path = [...(findPath || [])];
        if (name && !findPath) {
            const objectWithName = this.findObject(startContextNode, name, getObjectWithField);
            if (objectWithName) {
                return objectWithName.get(name);
            }
        } else if (findPath?.length) {
            const objectName = findPath[0];
            const objectWithTypeOrName = this.getObject(startContextNode, objectName);

            if (!objectWithTypeOrName) {
                return;
            } else {
                path.push(name);
                path.shift();
                return object.extractValue(objectWithTypeOrName, path);
            }
        }
    }

    findObject(
        startContextNode: relation.ITreeItem<IDataNode>,
        name: string,
        callback: TFindObjectCallback
    ): Model | null {
        let resultObject: Model | null = null;
        let contextNode = startContextNode;

        while (resultObject === null && contextNode) {
            resultObject = callback(name, contextNode?.value?.data || {}) || null;
            if (!resultObject) {
                contextNode = contextNode.parent as unknown as relation.ITreeItem<IDataNode>;
            }
        }

        return resultObject;
    }

    serialize(startContextNode: relation.ITreeItem<IDataNode>): ISerializedDataNode[] {
        const result: ISerializedDataNode[] = [];
        let currentNode: relation.ITreeItem<IDataNode> | null = startContextNode;

        while (currentNode) {
            const nodeValue = currentNode.value.data as Record<string, unknown>;

            Object.keys(nodeValue)
                .reverse()
                .forEach((valueKey) => {
                    const value = nodeValue[valueKey];

                    if (value instanceof Model && value.getTypeName() !== 'record') {
                        result.push({
                            name: valueKey,
                            value,
                        });
                    }
                });

            currentNode = currentNode?.parent || null;
        }

        return result;
    }

    getAPI(currentNodePath: string[]): IDataContextAPI {
        const currentNode = this._$dataTree.findChild(currentNodePath);
        return {
            getValue: (name: string, path?: string[]): unknown => {
                if (!currentNode) {
                    return undefined;
                }

                return this.findField(currentNode, name, path);
            },

            getObject: (name: string): Model | null => {
                if (!currentNode) {
                    return null;
                }

                return this.getObject(currentNode, name);
            },

            serialize: (): ISerializedDataNode[] => {
                if (!currentNode) {
                    return [];
                }

                return this.serialize(currentNode);
            },
        };
    }
}
