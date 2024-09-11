/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
