/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TState } from '../TState';

export type TDisconnectAction = {
    type: 'disconnect';
};

export function disconnect(state: TState, action: TDisconnectAction): TState {
    state.observer.disconnect();
    state.isConnected = false;
    state.targets.clear();
    return state;
}
