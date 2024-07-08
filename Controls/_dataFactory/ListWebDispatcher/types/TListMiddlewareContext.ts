import {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from '../../AbstractDispatcher/types/TAbstractMiddlewareContext';
import { TListAction } from './TListAction';
import { IListState } from '../../interface/IListState';
import type { IListAspects } from '../../AbstractList/_interface/IAspectTypes';
import type { Collection as ICollection } from 'Controls/display';
import type { ITrashBox } from '../actions/beforeApplyState';

export type TGetStateStrategies = 'inner' | 'original';

export type TListMiddlewareContext<TAction extends TListAction = TListAction> =
    TAbstractMiddlewareContext<TAction> & {
        getState: (getStateStrategy?: TGetStateStrategies) => IListState;
        getAspects: () => IListAspects;
        getCollection: () => ICollection;
        getTrashBox: () => ITrashBox;
        originalSliceSetState: (
            newState: Partial<IListState> | ((prevState: IListState) => Partial<IListState>)
        ) => void;
    };

export type TListMiddlewareContextGetter = TAbstractMiddlewareContextGetter<
    TListAction,
    TListMiddlewareContext
>;
