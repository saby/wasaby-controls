import * as React from 'react';
import NodeContext from 'Controls-DataEnv/_context/contexts/ISolatedNodeContext';
import SliceContext from 'Controls-DataEnv/_context/contexts/SliceContext';
import { useCallback, useContext } from 'react';
import useSyncExternalStore from 'Controls-DataEnv/_context/hooks/private/useSyncExternalStore';
import useCurrentContextLevelPath from 'Controls-DataEnv/_context/hooks/private/useCurrentContextLevelPath';
import HierarchyContext from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';
import { CONTEXT_STORE_FIELD } from 'Controls-DataEnv/_context/Constants';

const DEFAULT_LAYOUT_VALUE = {};

function DataLayoutProvider(
    props: {
        dataLayoutId?: string;
        children: React.ReactElement;
        attrs?: unknown;
    },
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const context = useContext(HierarchyContext);
    const store = context?.[CONTEXT_STORE_FIELD];
    const currentContextLevelPath = useCurrentContextLevelPath();

    const path = React.useMemo(() => {
        if (props.dataLayoutId) {
            if (currentContextLevelPath) {
                return [...currentContextLevelPath, props.dataLayoutId];
            }
        } else {
            return currentContextLevelPath;
        }
        return [props.dataLayoutId];
    }, [props.dataLayoutId, currentContextLevelPath]);

    const hasNode = React.useMemo(() => {
        return !!store?.getNodeByPath(path);
    }, [path, store, context]);

    const isolatedContextValue = React.useMemo(() => {
        return {
            dataLayoutId: props.dataLayoutId || '',
            //Если ноды нет контексте, но ее пытаются получить, то добавляем ее в путь, чтобы узлы ниже были с правильным путем
            path: hasNode ? path : currentContextLevelPath,
        };
    }, [path, props.dataLayoutId, currentContextLevelPath, hasNode]);

    const getSnapshot = useCallback(
        (currentStore) => {
            return currentStore?.getNodeByPath(isolatedContextValue.path)?.getValue();
        },
        [isolatedContextValue.path, context]
    );

    const subscribe = useCallback((source, onChange: Function) => {
        if (source) {
            return source.subscribe(onChange);
        } else {
            return () => {
                return null;
            };
        }
    }, []);

    const getVersion = useCallback((source) => {
        return source?.getVersion();
    }, []);

    const contextNodeValue = useSyncExternalStore(store, getVersion, getSnapshot, subscribe);

    const childrenProps = React.useMemo(() => {
        const resultProps: Record<string, unknown> = {};

        if (forwardedRef) {
            resultProps.ref = forwardedRef;
        }
        if (props.attrs) {
            resultProps.attrs = props.attrs;
        }

        return resultProps;
    }, [forwardedRef, props.attrs]);
    return (
        <NodeContext.Provider value={isolatedContextValue}>
            <SliceContext.Provider value={contextNodeValue || DEFAULT_LAYOUT_VALUE}>
                {React.cloneElement(props.children, childrenProps)}
            </SliceContext.Provider>
        </NodeContext.Provider>
    );
}

export default React.forwardRef(DataLayoutProvider);
