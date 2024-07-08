/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';

export type TTarget = Element;

export type TUnobserveCallback = (notifyNull?: boolean) => void;

export type TOnResizeGlobalHandler = (
    entries: { name: Symbol; entry: ResizeObserverEntry }[]
) => void;

export interface IResizeObserverContext {
    observe: (name: Symbol, target: TTarget) => TUnobserveCallback;
    addGlobalHandler(handler: TOnResizeGlobalHandler): void;
    removeGlobalHandler(handler: TOnResizeGlobalHandler): void;
}

export const Context = React.createContext<IResizeObserverContext>(undefined);
Context.displayName = 'Controls/columnScrollReact:ResizeObserverContext';
