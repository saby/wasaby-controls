import * as React from 'react';
import { IResizeObserverContext, ResizeObserverContext, TTarget } from './ResizeObserverContext';
import { useHandler } from 'Controls/Hooks/useHandler';

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

export type TResizeObserverContainerProps = {
    children: JSX.Element;
    onResize: (entries: { name: string; entry: ResizeObserverEntry }[]) => void;
};

type TState = {
    observer: ResizeObserver;
    callback: ResizeObserverCallback;
    isConnected: boolean;
    targets: Map<TTarget, string>;
};

type TActions =
    | {
          type: 'observe';
          name: string;
          target: TTarget;
      }
    | {
          type: 'unobserve';
          target: TTarget;
      }
    | {
          type: 'connect';
      }
    | {
          type: 'disconnect';
      };

function stateReducer(state: TState, action: TActions): TState {
    switch (action.type) {
        case 'observe':
            if (!state.targets.has(action.target)) {
                state.targets.set(action.target, action.name);

                if (state.isConnected) {
                    state.observer.observe(action.target);
                }
            }
            return state;
        case 'unobserve':
            if (state.targets.has(action.target)) {
                state.targets.delete(action.target);

                if (state.isConnected) {
                    state.observer.unobserve(action.target);
                }
            }
            return state;
        case 'connect':
            state.observer = new ResizeObserver(state.callback);
            state.targets.forEach((_, target) => {
                state.observer.observe(target);
            });
            state.isConnected = true;
            return state;
        case 'disconnect':
            state.observer.disconnect();
            state.isConnected = false;
            state.targets.clear();
            return state;
    }
}

function ResizeObserverContainer(props: TResizeObserverContainerProps): JSX.Element {
    const onResizeUserHandler = useHandler(props.onResize);
    const [, dispatch] = React.useReducer(
        stateReducer,
        {
            observer: undefined,
            callback: undefined,
            isConnected: false,
            targets: new Map<TTarget, string>(),
        },
        (args) => {
            return {
                ...args,
                callback: (entries) => {
                    onResizeUserHandler(
                        entries.map((e) => {
                            return {
                                name: args.targets.get(e.target),
                                entry: e,
                            };
                        })
                    );
                },
            };
        }
    );

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

    const observe = React.useCallback<IResizeObserverContext['observe']>((name, target) => {
        dispatch({
            type: 'observe',
            name,
            target,
        });

        return (notifyNull: boolean) => {
            dispatch({
                type: 'unobserve',
                target,
            });
            if (notifyNull) {
                onResizeUserHandler([
                    {
                        name,
                        entry: GET_DETACHED_ENTRY(target),
                    },
                ]);
            }
        };
    }, []);

    const contextValue = React.useMemo(() => ({ observe }), []);

    return (
        <ResizeObserverContext.Provider value={contextValue}>
            {props.children}
        </ResizeObserverContext.Provider>
    );
}

const ResizeObserverContainerMemo = React.memo(ResizeObserverContainer);
export default ResizeObserverContainerMemo;
