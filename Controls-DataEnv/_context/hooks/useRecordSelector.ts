import { Record as EntityRecord } from 'Types/entity';
import { useCallback, useRef, useEffect } from 'react';
import useSyncExternalStore from './private/useSyncExternalStore';

export type TRecordSelector = (record: EntityRecord) => unknown;

export default function useRecordSelector(
    record: EntityRecord,
    selector: TRecordSelector,
    deps: any[] = []
) {
    const stateChanged = useRef<boolean>(true);
    const lastState = useRef<any>();
    const onStateChanged = useCallback(() => {
        stateChanged.current = true;
        onChangeRef.current?.();
    }, []);
    const firstRenderRef = useRef(true);
    const onChangeRef = useRef<Function>();
    const unsubscribeRef = useRef<Function>();
    const unsubscribe = useCallback(() => {
        unsubscribeRef.current?.();
    }, []);

    const stableSelector = useCallback(
        (selector: string) => {
            return selector;
        },
        [record, selector, ...deps]
    );

    const subscribe = useCallback(
        (onChange: Function) => {
            onChangeRef.current = onChange;
            return unsubscribe;
        },
        [stableSelector]
    );

    const getSnapshot = useCallback(() => {
        let state;
        if (firstRenderRef.current) {
            record.startObserveSession();
            state = selector(record);
            unsubscribeRef.current = record.endObserveSession(onStateChanged);
        } else if (stateChanged.current) {
            state = selector(record);
        }
        stateChanged.current = false;
        lastState.current = state;

        return lastState.current;
    }, [stableSelector]);

    useEffect(() => {
        firstRenderRef.current = false;
    }, []);

    return useSyncExternalStore(subscribe, getSnapshot);
}
