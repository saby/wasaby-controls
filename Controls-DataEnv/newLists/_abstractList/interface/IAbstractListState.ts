/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractSelectionState } from './IState/IAbstractSelectionState';
import type { IAbstractMarkerState } from './IState/IAbstractMarkerState';
import type { IHierarchyState } from './IState/IHierarchyState';
import type { IItemsState } from './IState/IItemsState';

import type { Collection as ICollection } from 'Controls/display';
import type { TViewMode } from 'Controls-DataEnv/interface';

/**
 * Интерфейс состояния абстрактного списочного слайса.
 */
export interface IAbstractListState
    extends IItemsState,
        IAbstractSelectionState,
        IAbstractMarkerState,
        IHierarchyState {
    collection: ICollection;
    viewMode?: TViewMode;
}
