import { FunctionComponent, useState, useCallback, useMemo } from 'react';
import { IHotKey } from '../interface/IHotKey';
import { IHotKeyObserver } from '../interface/IHotKeyObserver';
import { HotKeysContext, IHotKeysContext } from './HotKeysContext';

export const ContextProvider: FunctionComponent = function ({ children }) {
    const [observers, setObservers] = useState<Set<IHotKeyObserver>>(new Set());

    const register = useCallback(
        (newObserver: IHotKeyObserver) => {
            const newObservers = new Set(observers).add(newObserver);
            setObservers(newObservers);
        },
        [observers]
    );

    const unregister = useCallback(
        (newObserver: IHotKeyObserver) => {
            const newObservers = new Set(observers);
            newObservers.delete(newObserver);
            setObservers(newObservers);
        },
        [observers]
    );

    const dispatch = useCallback(
        (hotKey: IHotKey) => {
            observers.forEach((observer) => {
                const actionId = observer.canExecute(hotKey);
                if (actionId) {
                    observer.execute(actionId);
                }
            });
        },
        [observers]
    );

    const contextValue: IHotKeysContext = useMemo(() => {
        return { observers, register, unregister, dispatch };
    }, [observers, register, unregister, dispatch]);

    return <HotKeysContext.Provider value={contextValue}>{children}</HotKeysContext.Provider>;
};
