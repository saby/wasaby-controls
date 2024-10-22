import HierarchySliceContext from 'Controls-DataEnv/_context/HierarchySliceContext/HierarchySliceContext';
import { useContext, useMemo, useRef } from 'react';
import { IDataConfig, IDataConfigLoader, IDataContextConfigs } from 'Controls-DataEnv/dataFactory';
import NodeContext from './ISolatedNodeContext';

/**
 * @private
 */
interface IUsedContextNode {
    hasChildren(name: string): boolean;

    createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void>;

    createElement(elementName: string, config: IDataConfig): Promise<void>;

    createNodeSync(nodeName: string, nodeConfig: IDataContextConfigs): void;

    createElementSync(elementName: string, config: IDataConfig, loadResult: unknown): void;

    reloadElement(elementName: string, dataFactoryArguments: unknown): Promise<void>;

    /**
     * Метод для получения плоского списка элементов с текущего узла до корня
     * НЕ ИСПОЛЬЗОВАТЬ
     */
    unsafe__getElementsByTree(): Record<string, unknown> | undefined;
}

/**
 * Хук для получения данных из контекста
 * @private
 */
export default function useContextNode(): IUsedContextNode {
    const rootContext = useContext(HierarchySliceContext);
    const nodeContext = useContext(NodeContext);
    const contextRef = useRef(rootContext);
    contextRef.current = rootContext;

    return useMemo(() => {
        return {
            hasChildren(name: string): boolean {
                if (nodeContext?.path) {
                    const childrenPath = [...nodeContext.path, name];
                    return !!contextRef.current?.store.getNodeByPath(childrenPath);
                }
                return false;
            },
            createElement(elementName: string, config: IDataConfig): Promise<void> {
                return contextRef.current.store.createElement(
                    nodeContext.path,
                    elementName,
                    config
                );
            },

            createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void> {
                const newNodeConfig = {
                    ...nodeConfig,
                };
                return contextRef.current.store.createNode(
                    nodeContext.path,
                    nodeName,
                    newNodeConfig
                );
            },

            unsafe__getElementsByTree(): Record<string, unknown> {
                let result: Record<string, unknown> = {};

                if (nodeContext.path) {
                    result = {};
                    let currentNode = contextRef.current.store.getNodeByPath(nodeContext.path);
                    const levels = [];
                    while (currentNode) {
                        levels.push(currentNode.getValue());
                        currentNode = currentNode.getParent();
                    }
                    if (levels.length) {
                        levels.reverse().forEach((levelSlices) => {
                            result = {
                                ...result,
                                ...levelSlices,
                            };
                        });
                    }
                }

                return result;
            },

            createElementSync(elementName: string, config: IDataConfig, loadResult: unknown): void {
                return contextRef.current.store.createElementSync(
                    nodeContext.path,
                    elementName,
                    config,
                    loadResult
                );
            },

            createNodeSync(nodeName: string, nodeConfig: IDataContextConfigs): void {
                const newNodeConfig = {
                    ...nodeConfig,
                };
                return contextRef.current.store.createNodeSync(
                    nodeContext.path,
                    nodeName,
                    newNodeConfig
                );
            },

            reloadElement(
                elementName: string,
                dataFactoryArguments: IDataConfig['dataFactoryArguments']
            ): Promise<void> {
                return contextRef.current.store.reloadElement(
                    nodeContext.path,
                    elementName,
                    dataFactoryArguments
                );
            },
        };
    }, [nodeContext]);
}
