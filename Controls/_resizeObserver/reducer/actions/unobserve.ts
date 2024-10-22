/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { TState } from '../TState';
import { TTarget } from '../../Context';

export type TUnobserveAction = {
    type: 'unobserve';
    target: TTarget;
};

export function unobserve(state: TState, action: TUnobserveAction): TState {
    if (state.targets.has(action.target)) {
        state.targets.delete(action.target);

        if (state.isConnected) {
            state.observer.unobserve(action.target);
        }
    }
    return state;
}
