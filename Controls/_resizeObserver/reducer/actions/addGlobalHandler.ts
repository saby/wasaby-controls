/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
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
