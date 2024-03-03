import type { IExpandCollapseState } from 'Controls/expandCollapseListAspect';
import type { IItemsState } from 'Controls/itemsListAspect';
import type { IPathState } from 'Controls/pathListAspect';
import type { IFlatSelectionState } from 'Controls/flatSelectionAspect';
import type { IHierarchySelectionState } from 'Controls/hierarchySelectionAspect';
import type { IRootState } from 'Controls/rootListAspect';
import type { IMarkerState } from 'Controls/markerListAspect';

/**
 * Интерфейс состояния абстрактного списочного слайса.
 * @interface Controls/_dataFactory/AbstractList/_interface/IAbstractListSliceState
 * @public
 */
export type IAbstractListSliceState = IMarkerState &
    IPathState &
    IItemsState &
    (IFlatSelectionState | IHierarchySelectionState) &
    IRootState &
    IExpandCollapseState;
