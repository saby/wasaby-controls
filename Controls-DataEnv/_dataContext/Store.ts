import { object } from 'Types/util';
import { relation, Model } from 'Types/entity';

interface IDataNode {
    data?: Record<string, unknown>;
    children?: Record<string, IDataNode>;
}

interface IDataContextProps {
    data: IDataNode;
}

export interface IDataContextAPI {
    /**
     * Метод для получения значения поля из контекста данных по пути
     * @example
     * function(dataContext: IDataContextAPI) {
     *     return dataContext.getValue(['Employee', 'Id']);
     * }
     * @param path
     */
    getValue(path: string[]): unknown | undefined;

    /**
     * Метод для получения объекта из контекста данных по типу
     * @example
     * function(dataContext: IDataContextAPI) {
     *     return dataContext.getObject('Employee');
     * }
     * @param type
     */
    getObject(type: string): Model | null;
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

function getTypedObjectFromNode(
    type: string,
    contextNodeData: Record<string, unknown>
): Model | undefined {
    let resultValue: Model | undefined;

    Object.keys(contextNodeData)
        .reverse()
        .forEach((fieldName) => {
            const currentValue = contextNodeData[fieldName];

            if (resultValue === undefined) {
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
        this._$dataTree.parseTree(props.data);
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
            parentNode.addChild(name, { data });
        } else {
            this._$dataTree.addChild({ data }, name);
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

    getField(currentNodePath: string[], findPath: string[]): unknown {
        let currentNode = this._$dataTree.findChild(currentNodePath);

        if (!currentNode) {
            return;
        } else {
            let hasNodeWithData = false;

            while (!hasNodeWithData && currentNode) {
                hasNodeWithData = !!currentNode.value.data?.hasOwnProperty(findPath[0]);
                if (!hasNodeWithData) {
                    currentNode = currentNode.parent;
                }
            }

            if (!hasNodeWithData) {
                return;
            } else if (currentNode) {
                let currentValue = currentNode.value.data;

                for (const pathPart of findPath) {
                    currentValue = object.getPropertyValue(currentValue, pathPart);
                }

                return currentValue;
            }
        }
    }

    getObject(type: string, contextNodePath: string[]): Model | null {
        let contextNode = this._$dataTree.findChild(contextNodePath);
        let typedObject: Model | null = null;

        if (!contextNode) {
            return null;
        } else {
            while (typedObject === null && contextNode) {
                typedObject = getTypedObjectFromNode(type, contextNode?.value?.data || {}) || null;
                if (!typedObject) {
                    contextNode = contextNode.parent;
                }
            }
            return typedObject;
        }
    }

    getAPI(currentNodePath: string[]): IDataContextAPI {
        return {
            getValue: (path: string[]): unknown => {
                return this.getField(currentNodePath, path);
            },

            getObject: (type: string): Model | null => {
                return this.getObject(type, currentNodePath);
            },
        };
    }
}
