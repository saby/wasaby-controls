/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TState } from '../TState';

export type TConnectAction = {
    type: 'connect';
};

export function connect(state: TState, action: TConnectAction): TState {
    state.observer = new ResizeObserver(state.callback);
    state.targets.forEach((_, target) => {
        state.observer.observe(target);
    });
    state.isConnected = true;
    return state;
}
