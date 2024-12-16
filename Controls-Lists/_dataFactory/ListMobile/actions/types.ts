/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListMobileState } from '../interface/IListMobileState';

import type * as rpcEvents from './types/rpcEvents';
import type * as rpcWorker from './types/rpcWorker';
import type * as root from './types/root';

export type { rpcEvents, rpcWorker, root };

export type TAnyListMobileAction<TState extends IListMobileState = IListMobileState> =
    | TAbstractListActions.TAnyAbstractAction<TState>
    | root.TAnyRootAction
    | rpcEvents.TAnyRpcEventsAction
    | rpcWorker.TAnyRpcWorkerAction;
