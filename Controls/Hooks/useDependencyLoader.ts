import * as React from 'react';
import { DependencyTimer } from 'Controls/popup';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

export interface IUseDependencyLoaderResult {
    onMouseEnter: React.MouseEventHandler;
    onMouseLeave: React.MouseEventHandler;
}

const { useCallback, useRef, useEffect } = React;

export function useDependencyLoader(dependencies: string[]): IUseDependencyLoaderResult {
    const depsTimerRef = useRef<DependencyTimer>();
    const depsLoadingPromiseRef = useRef<Promise<unknown>>();

    const loadDependencies = useCallback(() => {
        if (!depsLoadingPromiseRef.current) {
            depsLoadingPromiseRef.current = Promise.all(
                dependencies.map((dep) => {
                    return loadAsync(dep);
                })
            );
        }
    }, []);

    const onMouseEnter = useCallback(() => {
        if (!depsTimerRef.current) {
            depsTimerRef.current = new DependencyTimer();
        }
        depsTimerRef.current.start(loadDependencies);
    }, []);

    const onMouseLeave = useCallback(() => {
        depsTimerRef.current?.stop();
    }, []);

    useEffect(() => {
        return () => {
            depsTimerRef.current?.stop();
            depsTimerRef.current = null;
        };
    }, []);
    return {
        onMouseEnter,
        onMouseLeave,
    };
}
