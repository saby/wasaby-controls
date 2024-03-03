/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TState, TOnResizeGlobalHandler } from '../TState';

export type TRemoveGlobalHandlerAction = {
    type: 'removeGlobalHandler';
    handler: TOnResizeGlobalHandler;
};

export function removeGlobalHandler(state: TState, action: TRemoveGlobalHandlerAction): TState {
    const index = state.globalHandlers.indexOf(action.handler);
    if (index !== -1) {
        state.globalHandlers.splice(index, 1);
    }
    return state;
}
