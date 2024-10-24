/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { IListSearchState } from './IState/IListSearchState';
import type { IListOperationsPanelState } from './IState/IListOperationsPanelState';
import type { IListSourceState } from './IState/IListSourceState';
import type { IFilterPanelState } from './IState/IFilterPanelState';

/**
 * Интерфейс состояния списочного слайса.
 */
export interface IListState
    extends IAbstractListState,
        IListSearchState,
        IListOperationsPanelState,
        IListSourceState,
        IFilterPanelState {}
