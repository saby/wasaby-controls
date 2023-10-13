/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { ContextProvider, TResizeObserverContextProviderProps } from './ContextProvider';
import { Context } from './Context';

export type TResizeObserverContainerProps = TResizeObserverContextProviderProps;

function ResizeObserverConsumerContainer({
    children,
    onResize,
}: TResizeObserverContainerProps): JSX.Element {
    const ctx = React.useContext(Context);

    React.useLayoutEffect(() => {
        ctx.addGlobalHandler(onResize);
        return () => {
            ctx.removeGlobalHandler(onResize);
        };
    }, [onResize]);

    return children;
}

function ResizeObserverContainerWrapper(props: TResizeObserverContainerProps): JSX.Element {
    const ctx = React.useContext(Context);
    if (ctx) {
        return <ResizeObserverConsumerContainer {...props} />;
    } else {
        return <ContextProvider {...props} />;
    }
}

const ResizeObserverContainerMemo = React.memo(ResizeObserverContainerWrapper);
export default ResizeObserverContainerMemo;
