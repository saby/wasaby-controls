/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { TState } from '../TState';

export type TConnectAction = {
    type: 'connect';
};

export function connect(state: TState, action: TConnectAction): TState {
    if (!window || !window.ResizeObserver) {
        return state;
    }

    state.observer = new ResizeObserver(state.callback);
    state.targets.forEach((_, target) => {
        state.observer.observe(target);
    });
    state.isConnected = true;

    return state;
}
