/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
