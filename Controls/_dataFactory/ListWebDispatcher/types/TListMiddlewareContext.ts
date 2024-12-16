/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractMiddlewareContextGetter } from 'Controls-DataEnv/dispatcher';
import type {
    TListActions,
    TListMiddlewareContext as TNewListMiddlewareContext,
} from 'Controls-DataEnv/list';
import type { IListState } from '../../interface/IListState';

export type TListMiddlewareContext = TNewListMiddlewareContext & {
    getAspects: () => unknown;
    getTrashBox: () => unknown;
    originalSliceSetState: (
        newState: Partial<IListState> | ((prevState: IListState) => Partial<IListState>)
    ) => void;
    originalSliceGetState: () => IListState;
    scheduleDispatch: (action: TListActions.TAnyListAction<IListState>) => void;
};

export type TListMiddlewareContextGetter = TAbstractMiddlewareContextGetter<
    IListState,
    TListActions.TAnyListAction<IListState>,
    TListMiddlewareContext
>;
