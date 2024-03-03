/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
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
