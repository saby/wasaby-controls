import * as React from 'react';

export type TResizeEventHandler = (width: number) => void;

export function useWidthResizeObserver<TRefTarget extends Element>(callback: TResizeEventHandler) {
    const ref = React.useRef<TRefTarget>(null);

    React.useLayoutEffect(() => {
        const element = ref?.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            const width = entries[0].borderBoxSize
                ? entries[0].borderBoxSize[0].inlineSize
                : entries[0].contentRect.width;

            callback(
                Number.isInteger(width) ? width : (entries[0].target as HTMLDivElement).offsetWidth
            );
        });

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [callback, ref]);

    return ref;
}
