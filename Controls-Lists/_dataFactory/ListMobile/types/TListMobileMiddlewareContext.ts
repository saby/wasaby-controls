/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type {
    TAbstractAction,
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';

import type { Collection as ICollection } from 'Controls/display';

import type { TListMobileActions } from '../actions';
import type { IListMobileState } from '../interface/IListMobileState';
import type { SourceController } from '../_sourceController/SourceController';
import type { VirtualCollection } from '../_virtualCollection/VirtualCollection';
import type { ScrollController } from '../_scrollController/ScrollController';
import type { EventsToActionsConverter } from '../EventsToActionsConverter';

export type TListMobileMiddlewareContext = TAbstractMiddlewareContext<
    IListMobileState,
    TListMobileActions.TAnyListMobileAction | TAbstractAction
> & {
    readonly collection: ICollection;
    readonly virtualCollection: VirtualCollection;
    readonly sourceController: SourceController;
    readonly scrollController: ScrollController;

    readonly eventsToActionsConverter: EventsToActionsConverter;

    readonly scheduleDispatch: (action: TListMobileActions.TAnyListMobileAction) => void;
};

export type TListMobileMiddlewareContextGetter = TAbstractMiddlewareContextGetter<
    IListMobileState,
    TListMobileActions.TAnyListMobileAction | TAbstractAction,
    TListMobileMiddlewareContext
>;
