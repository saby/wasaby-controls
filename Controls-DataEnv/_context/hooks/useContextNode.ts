import HierarchySliceContext from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';
import { useContext, useMemo, useRef } from 'react';
import {
    IDataConfig,
    IDataConfigLoader,
    IDataContextConfigs,
    TDataConfigs,
} from 'Controls-DataEnv/dataFactory';
import NodeContext from '../contexts/ISolatedNodeContext';
import { CONTEXT_STORE_FIELD, CONTEXT_NODE_PATH } from '../Constants';

export interface IUsedContextNode {
    [CONTEXT_NODE_PATH]: string[];

    hasChildren(name: string): boolean;

    createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void>;

    createElement(elementName: string, config: IDataConfig): Promise<void>;

    createNodeSync(nodeName: string, nodeConfig: IDataContextConfigs, silent?: boolean): void;

    updateElements(configs: TDataConfigs, loadResults: Record<string, unknown>): void;

    update(nodeConfigs: IDataContextConfigs): void;

    createElementSync(elementName: string, config: IDataConfig, loadResult: unknown): void;

    reloadElement(
        elementName: string,
        dataFactoryArguments: unknown,
        isReloadDeps?: boolean
    ): Promise<void>;

    destroy(): void;

    unsafe__getElementsByTree(): Record<string, unknown> | undefined;
}

export default function useContextNode(): IUsedContextNode {
    const rootContext = useContext(HierarchySliceContext);
    const nodeContext = useContext(NodeContext);
    const storeRef = useRef(rootContext?.[CONTEXT_STORE_FIELD]);
    storeRef.current = rootContext?.[CONTEXT_STORE_FIELD];

    return useMemo<IUsedContextNode>(() => {
        return {
            [CONTEXT_NODE_PATH]: nodeContext.path,
            hasChildren(name: string): boolean {
                if (nodeContext?.path) {
                    const childrenPath = [...nodeContext.path, name];
                    return !!storeRef.current.getNodeByPath(childrenPath);
                }
                return false;
            },
            createElement(elementName: string, config: IDataConfig): Promise<void> {
                return storeRef.current.createElement(nodeContext.path, elementName, config);
            },

            async createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void> {
                const newNodeConfig = {
                    ...nodeConfig,
                };
                return storeRef.current.createNode(nodeContext.path, nodeName, newNodeConfig);
            },

            createElementSync(elementName: string, config: IDataConfig, loadResult: unknown): void {
                return storeRef.current.createElementSync(
                    nodeContext.path,
                    elementName,
                    config,
                    loadResult
                );
            },

            createNodeSync(name: string, nodeConfig: IDataContextConfigs, silent?: boolean): void {
                const newNodeConfig = {
                    ...nodeConfig,
                };
                return storeRef.current.createNodeSync(
                    nodeContext.path,
                    name,
                    newNodeConfig,
                    silent
                );
            },

            updateElements(configs: TDataConfigs, loadResults: Record<string, unknown>): void {
                return storeRef.current.updateNodeElements(nodeContext.path, configs, loadResults);
            },

            update(nodeConfigs: IDataContextConfigs) {
                return storeRef.current.updateNode(nodeContext.path, nodeConfigs);
            },

            destroy() {
                storeRef.current.destroyNode(nodeContext.path);
            },

            async reloadElement(
                elementName: string,
                dataFactoryArguments: IDataConfig['dataFactoryArguments'],
                isReloadDeps: boolean
            ): Promise<void> {
                return storeRef.current.reloadElement(
                    nodeContext.path,
                    elementName,
                    dataFactoryArguments,
                    isReloadDeps
                );
            },

            unsafe__getElementsByTree(): Record<string, unknown> {
                let result: Record<string, unknown> = {};

                if (nodeContext.path) {
                    result = {};
                    let currentNode = storeRef.current.getNodeByPath(nodeContext.path);
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
        };
    }, [nodeContext]);
}
