/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type {
    TAbstractAction,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';

import type { TListMobileActions } from '../actions';
import type { IListMobileState } from '../interface/IListMobileState';
import type { SourceController } from '../_sourceController/SourceController';
import type { VirtualCollection } from '../_virtualCollection/VirtualCollection';
import type { ScrollController } from '../_scrollController/ScrollController';
import type { TAbstractListMiddlewareContext } from 'Controls-DataEnv/abstractList';

export type TListMobileMiddlewareContext<
    TState extends IListMobileState = IListMobileState,
    TAction extends TAbstractAction =
        | TListMobileActions.TAnyListMobileAction<TState>
        | TAbstractAction,
> = TAbstractListMiddlewareContext<TState, TAction> & {
    readonly virtualCollection: VirtualCollection;
    readonly sourceController: SourceController;
    readonly scrollController: ScrollController;
};

export type TListMobileMiddlewareContextGetter<
    TState extends IListMobileState,
    TAction extends TAbstractAction =
        | TListMobileActions.TAnyListMobileAction<TState>
        | TAbstractAction,
> = TAbstractMiddlewareContextGetter<
    TState,
    TAction,
    TListMobileMiddlewareContext<TState, TAction>
>;
