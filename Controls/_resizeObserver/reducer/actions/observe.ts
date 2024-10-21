/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
