import type {
    TAbstractAction,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';
import type { Direction } from 'Controls-DataEnv/listTypes';
import {
    TAbstractListActions,
    TAbstractListMiddlewareContext,
} from 'Controls-DataEnv/abstractList';
import type { TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';
import type { TListActions } from '../actions';
import type { IListState } from '../interface/IListState';
import type { ISnapshotsStore } from './ISnapshotsStore';
import type { TMiddlewaresPropsForMigrationToDispatcher } from '../actions/types/complexUpdate';

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
    originalSliceGetState: () => TState;
    getTrashBox: () => {
        _propsForMigrationToDispatcher: TMiddlewaresPropsForMigrationToDispatcher<TState> | null;
    };
    onDataLoaded(
        _items: RecordSet,
        _direction: Direction,
        nextState: TState
    ): Partial<TState> | Promise<Partial<TState>>;
    onNodeDataLoaded(
        _items: RecordSet,
        _key: TKey,
        _direction: Direction,
        nextState: TState
    ): Partial<TState> | Promise<Partial<TState>>;
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
