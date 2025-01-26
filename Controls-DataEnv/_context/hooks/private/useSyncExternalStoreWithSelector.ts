import useSyncExternalStore from './useSyncExternalStore';
import isEqualDefaultFn from './isEqualFn';
import { useRef, useMemo, useEffect } from 'react';

export default function useSyncExternalStoreWithSelector<Store, State, Selection>(
    store: Store,
    getVersion: (store: Store) => number,
    getSnapshot: () => State,
    subscribe: (store: Store, cb: Function) => Function,
    selector: (snapshot: State) => Selection,
    isEqualFn: (a: Selection, b: Selection) => boolean = isEqualDefaultFn<Selection>
) {
    const instRef = useRef<
        | {
              hasValue: true;
              value: Selection;
          }
        | {
              hasValue: false;
              value: null;
          }
        | null
    >(null);
    //@ts-ignore
    let inst;
    if (instRef.current === null) {
        inst = {
            hasValue: false,
            value: null,
        };
        //@ts-ignore;
        instRef.current = inst;
    } else {
        inst = instRef.current;
    }

    const [getSelection] = useMemo(() => {
        // Track the memoized state using closure variables that are local to this
        // memoized instance of a getSnapshot function. Intentionally not using a
        // useRef hook, because that state would be shared across all concurrent
        // copies of the hook/component.
        let hasMemo = false;
        //@ts-ignore;
        let memoizedSnapshot;
        //@ts-ignore;
        let memoizedSelection: Selection;
        const memoizedSelector = (nextSnapshot: State) => {
            if (!hasMemo) {
                // The first time the hook is called, there is no memoized result.
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                const nextSelection = selector(nextSnapshot);
                if (isEqualFn !== undefined) {
                    // Even if the selector has changed, the currently rendered selection
                    // may be equal to the new selection. We should attempt to reuse the
                    // current value if possible, to preserve downstream memoizations.
                    //@ts-ignore
                    if (inst.hasValue) {
                        //@ts-ignore
                        const currentSelection = inst.value;
                        if (isEqualFn(currentSelection, nextSelection)) {
                            memoizedSelection = currentSelection;
                            return currentSelection;
                        }
                    }
                }
                memoizedSelection = nextSelection;
                return nextSelection;
            }

            // We may be able to reuse the previous invocation's result.
            //@ts-ignore;
            const prevSnapshot: State = memoizedSnapshot;
            //@ts-ignore;
            const prevSelection: Selection = memoizedSelection;

            if (Object.is(prevSnapshot, nextSnapshot)) {
                // The snapshot is the same as last time. Reuse the previous selection.
                return prevSelection;
            }

            // The snapshot has changed, so we need to compute a new selection.
            const nextSelection = selector(nextSnapshot);

            // If a custom isEqual function is provided, use that to check if the data
            // has changed. If it hasn't, return the previous selection. That signals
            // to React that the selections are conceptually equal, and we can bail
            // out of rendering.
            if (isEqualFn !== undefined && isEqualFn(prevSelection, nextSelection)) {
                // The snapshot still has changed, so make sure to update to not keep
                // old references alive
                memoizedSnapshot = nextSnapshot;
                return prevSelection;
            }

            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;
            return nextSelection;
        };
        const getSnapshotWithSelector = () => memoizedSelector(getSnapshot());
        return [getSnapshotWithSelector];
    }, [getSnapshot, selector, isEqualFn]);

    const value = useSyncExternalStore<Store, State>(store, getVersion, getSelection, subscribe);

    useEffect(() => {
        //@ts-ignore;
        inst.hasValue = true;
        //@ts-ignore;
        inst.value = value;
    }, [value]);

    return value;
}
