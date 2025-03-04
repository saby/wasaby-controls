import * as React from 'react';

export function useHandler<T extends Function>(handler: T, deps?: React.DependencyList): T {
    const ref = React.useRef(handler);

    React.useLayoutEffect(() => {
        ref.current = handler;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return React.useCallback((...args: unknown[]) => ref.current?.(...args), []) as unknown as T;
}

export function useHandlerSafe<
    TArgs extends unknown[],
    TRes extends unknown,
    TCallback extends (...args: TArgs) => TRes,
>(
    cb: TCallback,
    extractor: (...args: unknown[]) => TArgs | undefined,
    deps?: React.DependencyList
): (...args: TArgs) => TRes | void {
    return useHandler((...args) => {
        const rightArgs = extractor(...args);
        if (rightArgs) {
            return cb(...rightArgs);
        }
    }, deps);
}
