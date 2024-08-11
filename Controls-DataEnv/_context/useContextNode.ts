import HierarchySliceContext from './HierarchySliceContext/HierarchySliceContext';
import SliceContext from './FlatSliceContext/SliceContext';
import { useContext, useMemo } from 'react';
import { ISOLATED_ROOT_NAME_FIELD } from './Constants';
import {
    IDataConfig,
    IDataConfigLoader,
} from 'Controls-DataEnv/dataFactory';

/**
 * @public
 */
export interface IUsedContextNode {
    /**
     *
     */
    createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void>;
    /**
     *
     */
    createElement(elementName: string, config: IDataConfig): Promise<void>;
    /**
     *
     */
    createNodeSync(
        nodeName: string,
        nodeConfig: IDataConfigLoader,
        loadResults: Record<string, unknown>
    ): void;
    /**
     *
     */
    createElementSync(elementName: string, config: IDataConfig, loadResult: unknown): void;
    /**
     *
     */
    reloadElement(elementName: string, dataFactoryArguments: unknown): Promise<void>;
}

/**
 *
 */
export default function useContextNode(): IUsedContextNode {
    const dataContext = useContext(SliceContext);
    const rootContext = useContext(HierarchySliceContext);
    const isolatedNodeName: string = dataContext?.[ISOLATED_ROOT_NAME_FIELD] as unknown as string;
    const currentNode = rootContext.store.getNode(isolatedNodeName);

    return useMemo(() => {
        return {
            createElement(elementName: string, config: IDataConfig): Promise<void> {
                return rootContext.store.createElement(elementName, currentNode.getName(), config);
            },

            createNode(nodeName: string, nodeConfig: IDataConfigLoader): Promise<void> {
                const newNodeConfig = {
                    ...nodeConfig,
                    parentId: currentNode.getName(),
                };
                return rootContext.store.createNode(nodeName, newNodeConfig);
            },

            createElementSync(elementName: string, config: IDataConfig, loadResult: unknown): void {
                return rootContext.store.createElementSync(
                    elementName,
                    currentNode.getName(),
                    config,
                    loadResult
                );
            },

            createNodeSync(
                nodeName: string,
                nodeConfig: IDataConfigLoader,
                loadResults: Record<string, unknown>
            ): void {
                const newNodeConfig = {
                    ...nodeConfig,
                    parentId: currentNode.getName(),
                };
                return rootContext.store.createNodeSync(nodeName, newNodeConfig, loadResults);
            },

            reloadElement(
                elementName: string,
                dataFactoryArguments: IDataConfig['dataFactoryArguments']
            ): Promise<void> {
                return rootContext.store.reloadElement(
                    currentNode.getName(),
                    elementName,
                    dataFactoryArguments
                );
            },
        };
    }, [currentNode]);
}
