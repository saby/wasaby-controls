/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { IResizeObserverContext, Context, TTarget } from './Context';
import { useContextReducer } from './ContextReducer';

const GET_DETACHED_ENTRY = (target: TTarget): ResizeObserverEntry => {
    const contentRectValue = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        y: 0,
        x: 0,
    };

    return {
        target,
        borderBoxSize: [
            {
                inlineSize: 0,
                blockSize: 0,
            },
        ],
        contentBoxSize: [
            {
                inlineSize: 0,
                blockSize: 0,
            },
        ],
        contentRect: {
            ...contentRectValue,
            toJSON: () => JSON.stringify(contentRectValue),
        },
    };
};

export type TOnResizeHandler = (entries: { name: Symbol; entry: ResizeObserverEntry }[]) => void;
export type TResizeObserverContextProviderProps = {
    children: JSX.Element;
    onResize?: TOnResizeHandler;
};

export function ContextProvider({
    onResize,
    children,
}: TResizeObserverContextProviderProps): JSX.Element {
    const [, dispatch] = useContextReducer();

    React.useLayoutEffect(() => {
        dispatch({
            type: 'addGlobalHandler',
            handler: onResize,
        });
        return () => {
            dispatch({
                type: 'removeGlobalHandler',
                handler: onResize,
            });
        };
    }, [onResize]);

    React.useLayoutEffect(() => {
        dispatch({
            type: 'connect',
        });
        return () => {
            dispatch({
                type: 'disconnect',
            });
        };
    }, []);

    const observe = React.useCallback<IResizeObserverContext['observe']>(
        (name, target) => {
            dispatch({
                type: 'observe',
                name,
                target,
            });

            return (notifyNull?: boolean) => {
                dispatch({
                    type: 'unobserve',
                    target,
                });
                if (notifyNull) {
                    onResize([
                        {
                            name,
                            entry: GET_DETACHED_ENTRY(target),
                        },
                    ]);
                }
            };
        },
        [onResize]
    );

    const addGlobalHandler = React.useCallback<IResizeObserverContext['addGlobalHandler']>(
        (handler) => {
            dispatch({
                type: 'addGlobalHandler',
                handler,
            });
        },
        []
    );
    const removeGlobalHandler = React.useCallback<IResizeObserverContext['removeGlobalHandler']>(
        (handler) => {
            dispatch({
                type: 'removeGlobalHandler',
                handler,
            });
        },
        []
    );

    const contextValue = React.useMemo(
        () => ({ observe, addGlobalHandler, removeGlobalHandler }),
        []
    );

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

const ResizeObserverContextProviderMemo = React.memo(ContextProvider);
export default ResizeObserverContextProviderMemo;
