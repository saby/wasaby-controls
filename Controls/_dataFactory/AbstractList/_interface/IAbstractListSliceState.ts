import type { IMarkerState } from '../aspects/Marker/IMarkerState';
import type { IPathState } from '../aspects/Path/IPathState';
import type { ISelectionState } from '../aspects/Selection/ISelectionState';
import type { IItemsState } from '../aspects/Items/IItemsState';
import type { IRootState } from '../aspects/Root/IRootState';
import type { IExpandCollapseState } from '../aspects/ExpandCollapse/IExpandCollapseState';

/**
 * Интерфейс состояния абстрактного списочного слайса.
 * @interface Controls/_dataFactory/AbstractList/_interface/IAbstractListSliceState
 * @public
 */
export type IAbstractListSliceState = IMarkerState &
    IPathState &
    IItemsState &
    ISelectionState &
    IRootState &
    IExpandCollapseState;
