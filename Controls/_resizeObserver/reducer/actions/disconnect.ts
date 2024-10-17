/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
