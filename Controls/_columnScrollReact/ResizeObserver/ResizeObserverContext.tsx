import * as React from 'react';

export type TTarget = Element;

export type TUnobserveCallback = (notifyNull?: boolean) => void;

export interface IResizeObserverContext {
    observe: (name: string, target: TTarget) => TUnobserveCallback;
}

export const ResizeObserverContext = React.createContext<IResizeObserverContext>(undefined);
ResizeObserverContext.displayName = 'Controls/columnScrollReact:ResizeObserverContext';
