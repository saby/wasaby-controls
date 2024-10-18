import * as React from 'react';
import HierarchySliceContext from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';
import NodeContext from 'Controls-DataEnv/_context/contexts/ISolatedNodeContext';
import SliceContext from 'Controls-DataEnv/_context/contexts/SliceContext';
import { CONTEXT_STORE_FIELD } from 'Controls-DataEnv/_context/Constants';

const DEFAULT_LAYOUT_VALUE = {};

function DataLayoutProvider(
    props: {
        dataLayoutId?: string;
        children: React.ReactElement;
    },
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const rootContext = React.useContext(HierarchySliceContext);
    const isolatedContext = React.useContext(NodeContext);

    const path = React.useMemo(() => {
        if (props.dataLayoutId) {
            if (isolatedContext.path) {
                return [...isolatedContext.path, props.dataLayoutId];
            }
        } else {
            return isolatedContext.path;
        }
        return [props.dataLayoutId];
    }, [props.dataLayoutId, isolatedContext]);

    const contextNodeValue = rootContext[CONTEXT_STORE_FIELD].getNodeByPath(path)?.getValue();

    const isolatedContextValue = React.useMemo(() => {
        return {
            dataLayoutId: props.dataLayoutId || '',
            //Если ноды нет контексте, но ее пытаются получить, то добавляем ее в путь, чтобы узлы ниже были с правильным путем
            path: contextNodeValue ? path : isolatedContext.path,
        };
    }, [path, props.dataLayoutId]);
    return (
        <NodeContext.Provider value={isolatedContextValue}>
            <SliceContext.Provider value={contextNodeValue || DEFAULT_LAYOUT_VALUE}>
                {React.cloneElement(props.children, forwardedRef ? { ref: forwardedRef } : {})}
            </SliceContext.Provider>
        </NodeContext.Provider>
    );
}

export default React.forwardRef(DataLayoutProvider);
