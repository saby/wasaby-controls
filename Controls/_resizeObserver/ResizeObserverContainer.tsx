/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import {
    ContextProvider,
    TResizeObserverContextProviderProps,
    TOnResizeHandler,
} from './ContextProvider';
import { Context } from './Context';

export { TOnResizeHandler };
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
