/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import { operationsPanel } from 'Controls-DataEnv/newLists/_list/actions/types';

// Экспорты для публичных типов.
export type TOpenOperationsPanelAction =
    TAbstractListActions.operationsPanel.TOpenOperationsPanelAction;
export type TCloseOperationsPanelAction =
    TAbstractListActions.operationsPanel.TCloseOperationsPanelAction;
// Экспорты для публичных типов.

export type TSetSelectionViewModeAction = TAbstractAction<
    'setSelectionViewMode',
    {
        viewMode: IListState['selectionViewMode'];
    }
>;

export type TResetSelectionViewModeAction = TAbstractAction<'resetSelectionViewMode', {}>;

export type TUpdateOperationsSelectionAction = TAbstractAction<'updateOperationsSelection', {}>;

export type TComplexUpdateOperationsPanelAction = TAbstractComplexUpdateAction<'OperationsPanel'>;

export type TAnyOperationsPanelAction =
    | TAbstractListActions.operationsPanel.TAnyOperationsPanelAction
    | operationsPanel.TSetSelectionViewModeAction
    | operationsPanel.TResetSelectionViewModeAction
    | operationsPanel.TUpdateOperationsSelectionAction
    | operationsPanel.TComplexUpdateOperationsPanelAction;
