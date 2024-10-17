import {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from '../../AbstractDispatcher/types/TAbstractMiddlewareContext';
import { TListAction } from './TListAction';
import { IListState } from '../../interface/IListState';
import type { IListAspects } from '../../AbstractList/_interface/IAspectTypes';
import type { Collection as ICollection } from 'Controls/display';
import type { ISnapshotsStore } from './ISnapshotsStore';

export type TGetStateStrategies = 'inner' | 'original';

export type TListMiddlewareContext<TAction extends TListAction = TListAction> =
    TAbstractMiddlewareContext<TAction> & {
        getState: (getStateStrategy?: TGetStateStrategies) => IListState;
        getAspects: () => IListAspects;
        getCollection: () => ICollection;
        getTrashBox: <T extends unknown = unknown>() => T;
        originalSliceSetState: (
            newState: Partial<IListState> | ((prevState: IListState) => Partial<IListState>)
        ) => void;

        snapshots: ISnapshotsStore;
    };

export type TListMiddlewareContextGetter = TAbstractMiddlewareContextGetter<
    TListAction,
    TListMiddlewareContext
>;
