import * as IAbstractListStateParts from './IAbstractListStateParts';
import type { TViewMode } from 'Controls-DataEnv/interface';

/**
 * Интерфейс состояния абстрактного списочного слайса.
 */
export interface IAbstractListState
    extends IAbstractListStateParts.ICoreState,
        IAbstractListStateParts.IItemsState,
        IAbstractListStateParts.ISelectionState,
        IAbstractListStateParts.IOperationsPanelState,
        IAbstractListStateParts.IActionsState,
        IAbstractListStateParts.IMarkerState,
        IAbstractListStateParts.IHierarchyState,
        IAbstractListStateParts.IFilterState,
        IAbstractListStateParts.IErrorState,
        IAbstractListStateParts.ISortingState,
        IAbstractListStateParts.ISearchState {
    /**
     * Режим отображения списка.
     * @default undefined
     */
    viewMode?: TViewMode;
}
