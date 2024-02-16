/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TState, TOnResizeGlobalHandler } from './reducer/TState';
import {
    TActions,
    observe,
    unobserve,
    connect,
    disconnect,
    addGlobalHandler,
    removeGlobalHandler,
} from './reducer/TActions';
import * as React from 'react';
import { TTarget } from './Context';

export { TState, TOnResizeGlobalHandler };

export function contextReducer(state: TState, action: TActions): TState {
    switch (action.type) {
        case 'observe':
            return observe(state, action);
        case 'unobserve':
            return unobserve(state, action);
        case 'connect':
            return connect(state, action);
        case 'disconnect':
            return disconnect(state, action);
        case 'addGlobalHandler':
            return addGlobalHandler(state, action);
        case 'removeGlobalHandler':
            return removeGlobalHandler(state, action);
    }
}

export function useContextReducer() {
    return React.useReducer(
        contextReducer,
        {
            globalHandlers: [],
            observer: undefined,
            callback: undefined,
            isConnected: false,
            targets: new Map<TTarget, Symbol>(),
        },
        (args) => {
            return {
                ...args,
                callback: (entries) => {
                    const mapped = entries.map((e) => {
                        return {
                            name: args.targets.get(e.target),
                            entry: e,
                        };
                    });
                    args.globalHandlers.forEach((handler) => {
                        handler(mapped);
                    });
                },
            };
        }
    );
}
