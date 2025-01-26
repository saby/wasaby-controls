import useCurrentContextLevelPath from 'Controls-DataEnv/_context/hooks/private/useCurrentContextLevelPath';
import useSyncExternalStoreWithSelector from 'Controls-DataEnv/_context/hooks/private/useSyncExternalStoreWithSelector';
import { useCallback, useContext } from 'react';
import HierarchyContext from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';
import { CONTEXT_STORE_FIELD } from 'Controls-DataEnv/_context/Constants';

/**
 * Хук для получения значения из контекста данных
 * @private
 * @param selector
 */
export default function useSelector<State = unknown, Selection = unknown>(
    selector: (state: State) => Selection
): Selection {
    const currentContextNode = useCurrentContextLevelPath();
    const context = useContext(HierarchyContext);
    const store = context?.[CONTEXT_STORE_FIELD];
    const getSnapshot = useCallback(() => {
        return store?.getElementsFromPath(currentContextNode, true);
    }, [context, store, currentContextNode]);

    const subscribe = useCallback(
        (source, onChange: Function) => {
            if (source) {
                return source.subscribe(onChange);
            } else {
                return () => {
                    return null;
                };
            }
        },
        [store]
    );

    const getVersion = useCallback(
        (source) => {
            if (source) {
                return source.getVersion();
            }
        },
        [store, currentContextNode]
    );

    return useSyncExternalStoreWithSelector<any, any, any>(
        store,
        getVersion,
        getSnapshot,
        subscribe,
        selector
    );
}
