/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
