/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TState } from '../TState';
import { TTarget } from '../../Context';

export type TObserveAction = {
    type: 'observe';
    name: Symbol;
    target: TTarget;
};

export function observe(state: TState, action: TObserveAction): TState {
    if (!state.targets.has(action.target)) {
        state.targets.set(action.target, action.name);

        if (state.isConnected) {
            state.observer.observe(action.target);
        }
    }
    return state;
}
