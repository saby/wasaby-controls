import type { IAbstractListState } from 'Controls-DataEnv/abstractList';
import type * as IListStateParts from './IListStateParts';

/**
 * Интерфейс состояния списочного слайса.
 */
export interface IListState
    extends IAbstractListState,
        IListStateParts.ISourceState,
        IListStateParts.ISearchState,
        IListStateParts.IOperationsPanelState,
        IListStateParts.IBreadcrumbsState {}
