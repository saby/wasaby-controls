import * as IAbstractListStateParts from './IAbstractListStateParts';
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
        IAbstractListStateParts.IGroupState,
        IStateThatShouldGoIntoViewLayer {
    /**
     *
     */
    needShowStub: boolean;

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
    _disableAsyncValidation?: boolean;
}
