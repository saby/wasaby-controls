import * as React from 'react';

//@ts-ignore;
const useMutableSource = React.unstable_useMutableSource;
//@ts-ignore;
const createMutableSource = React.unstable_createMutableSource;

export default function useSyncExternalStore<Store, State>(
    store: Store,
    getVersion: (store: Store) => number,
    getSnapshot: (store: Store) => State,
    subscribe: (store: Store, cb: Function) => Function
): State {
    const mutableSource = React.useMemo(() => {
        return createMutableSource(store, getVersion);
    }, [store]);
    return useMutableSource(mutableSource, getSnapshot, subscribe);
}
