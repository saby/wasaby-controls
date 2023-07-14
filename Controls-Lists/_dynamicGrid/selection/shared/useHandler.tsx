import * as React from 'react';

export function useHandler<T extends Function>(handler: T): T {
    const ref = React.useRef(handler);

    React.useLayoutEffect(() => {
        ref.current = handler;
    }, [handler]);

    return React.useCallback((...args: unknown[]) => {
        const cb = ref.current;
        return cb(...args);
    }, []) as unknown as T;
}
