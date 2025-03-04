import useCurrentContextLevelPath from 'Controls-DataEnv/_context/hooks/private/useCurrentContextLevelPath';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { CONTEXT_STORE_FIELD, STORE_ROOT_NODE_KEY } from 'Controls-DataEnv/_context/Constants';
import useSyncExternalStore from 'Controls-DataEnv/_context/hooks/private/useSyncExternalStore';
import HierarchyContext from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';

export default function useSliceInternal<T>(
    storeId: string,
    isObservingState: boolean = true
): T | undefined {
    const context = useContext(HierarchyContext);
    const store = context?.[CONTEXT_STORE_FIELD];
    const path = useCurrentContextLevelPath();
    const sliceRef = useRef<T>();

    const getSnapshot = useCallback(() => {
        let currentSlice: T;

        if (path) {
            currentSlice = store?.getElement(storeId, path) as T;
        } else {
            currentSlice = store?.getElement(storeId, [STORE_ROOT_NODE_KEY]) as T;
        }
        sliceRef.current = currentSlice;
        if (isObservingState) {
            //@ts-ignore
            return currentSlice?.state;
        } else {
            return currentSlice;
        }
    }, [path, storeId, store, context]);

    const subscribe = useCallback(
        (onChange: Function) => {
            if (store) {
                return store.subscribe(onChange) as () => void;
            } else {
                return () => {};
            }
        },
        [store]
    );

    const snapshot = useSyncExternalStore(subscribe, getSnapshot);

    return useMemo(() => {
        return storeId ? sliceRef.current : undefined;
    }, [snapshot]);
}
