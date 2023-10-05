/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';

export type TTarget = Element;

export type TUnobserveCallback = (notifyNull?: boolean) => void;

export interface IResizeObserverContext {
    observe: (name: string, target: TTarget) => TUnobserveCallback;
}

export const ResizeObserverContext = React.createContext<IResizeObserverContext>(undefined);
ResizeObserverContext.displayName = 'Controls/columnScrollReact:ResizeObserverContext';
