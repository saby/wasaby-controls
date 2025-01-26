import type {
    TAbstractAction,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';
import type { TListActions } from '../actions';
import type { IListState } from '../interface/IListState';
import type { ISnapshotsStore } from './ISnapshotsStore';
import {
    _private_TMiddlewaresPropsForMigrationToDispatcher,
    TAbstractListActions,
    TAbstractListMiddlewareContext,
} from 'Controls-DataEnv/abstractList';

/**
 * Тип контекста любого промежуточного слоя в WEB списке.
 * @author Родионов Е.А.
 */
export type TListMiddlewareContext<
    TState extends IListState = IListState,
    TAction extends TAbstractAction =
        | TListActions.TAnyListAction<TState>
        | TAbstractListActions.TAnyAbstractListAction<TState>,
> = TAbstractListMiddlewareContext<TState, TAction> & {
    readonly snapshots: ISnapshotsStore;
    originalSliceSetState: (
        newState: Partial<TState> | ((prevState: TState) => Partial<TState>)
    ) => void;
    originalSliceGetState: () => TState;
    getTrashBox: () => {
        _propsForMigrationToDispatcher: _private_TMiddlewaresPropsForMigrationToDispatcher;
    };
    scheduleDispatch: (action: TAction) => void;
};

/**
 * Тип геттера контекста любого промежуточного слоя в WEB списке.
 * @author Родионов Е.А.
 */
export type TListMiddlewareContextGetter<
    TState extends IListState = IListState,
    TAction extends TAbstractAction =
        | TListActions.TAnyListAction<TState>
        | TAbstractListActions.TAnyAbstractListAction<TState>,
> = TAbstractMiddlewareContextGetter<TState, TAction, TListMiddlewareContext<TState, TAction>>;
