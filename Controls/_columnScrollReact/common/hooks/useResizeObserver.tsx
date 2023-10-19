import * as React from 'react';

export type TResizeEventHandler = (entry: ResizeObserverEntry) => void;

export default function useResizeObserver<TRefTarget extends Element>(
    callback: TResizeEventHandler
) {
    const ref = React.useRef<TRefTarget>(null);

    React.useLayoutEffect(() => {
        const element = ref?.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            callback(entries[0]);
        });

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [callback, ref]);

    return ref;
}
