/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { TState, TOnResizeGlobalHandler } from '../TState';

export type TAddGlobalHandlerAction = {
    type: 'addGlobalHandler';
    handler: TOnResizeGlobalHandler;
};

export function addGlobalHandler(state: TState, action: TAddGlobalHandlerAction): TState {
    if (state.globalHandlers.indexOf(action.handler) === -1) {
        state.globalHandlers.push(action.handler);
    }
    return state;
}
