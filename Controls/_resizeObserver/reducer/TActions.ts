/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TObserveAction, observe } from './actions/observe';
import { TUnobserveAction, unobserve } from './actions/unobserve';
import { TConnectAction, connect } from './actions/connect';
import { TDisconnectAction, disconnect } from './actions/disconnect';

import { TAddGlobalHandlerAction, addGlobalHandler } from './actions/addGlobalHandler';
import { TRemoveGlobalHandlerAction, removeGlobalHandler } from './actions/removeGlobalHandler';

export type TActions =
    | TObserveAction
    | TUnobserveAction
    | TConnectAction
    | TDisconnectAction
    | TAddGlobalHandlerAction
    | TRemoveGlobalHandlerAction;

export { observe, unobserve, connect, disconnect, addGlobalHandler, removeGlobalHandler };
