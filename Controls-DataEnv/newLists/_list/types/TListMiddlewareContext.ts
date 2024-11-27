import type {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';
import type { TListActions } from '../actions';
import type { IListState } from '../interface/IListState';
import type { ISnapshotsStore } from './ISnapshotsStore';

/**
 * Тип контекста любого промежуточного слоя в WEB списке.
 * @author Родионов Е.А.
 */
export type TListMiddlewareContext = TAbstractMiddlewareContext<
    IListState,
    TListActions.TAnyListAction
> & {
    readonly snapshots: ISnapshotsStore;
};

/**
 * Тип геттера контекста любого промежуточного слоя в WEB списке.
 * @author Родионов Е.А.
 */
export type TListMiddlewareContextGetter = TAbstractMiddlewareContextGetter<
    IListState,
    TListActions.TAnyListAction,
    TListMiddlewareContext
>;
