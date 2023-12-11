/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
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
