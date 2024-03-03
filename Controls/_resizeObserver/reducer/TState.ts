/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TTarget, TOnResizeGlobalHandler } from '../Context';
export { TOnResizeGlobalHandler };

export type TState = {
    globalHandlers: TOnResizeGlobalHandler[];
    observer: ResizeObserver;
    callback: ResizeObserverCallback;
    isConnected: boolean;
    targets: Map<TTarget, Symbol>;
};
