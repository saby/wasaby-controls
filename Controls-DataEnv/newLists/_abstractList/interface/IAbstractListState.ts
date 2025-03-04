import * as IAbstractListStateParts from './IAbstractListStateParts';
import type { TViewMode } from 'Controls-DataEnv/interface';
import type { IStateThatShouldGoIntoViewLayer } from './IStateThatShouldGoIntoViewLayer';

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
        IAbstractListStateParts.IFilterPanelState,
        IAbstractListStateParts.IErrorState,
        IAbstractListStateParts.ISortingState,
        IAbstractListStateParts.ISearchState,
        IAbstractListStateParts.IHighlightState,
        IAbstractListStateParts.IBreadcrumbsState,
        IAbstractListStateParts.IColumnsState,
        IAbstractListStateParts.ITileState,
        IAbstractListStateParts.INavigationState,
        IAbstractListStateParts.IEmptyViewState,
        IStateThatShouldGoIntoViewLayer {
    /**
     * Режим отображения списка.
     * @default undefined
     */
    viewMode?: TViewMode;
    needShowStub: boolean;

    /**
     * @deprecated НЕ ИСПОЛЬЗОВАТЬ.
     * Флаг не поддерживается и будет удален, полагаться на него нельзя.
     */
    _disableAsyncValidation?: boolean;
}
