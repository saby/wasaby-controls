/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';

export type TOpenOperationsPanelAction =
    TAbstractListActions.operationsPanel.TOpenOperationsPanelAction;
export type TCloseOperationsPanelAction =
    TAbstractListActions.operationsPanel.TCloseOperationsPanelAction;

export type TSetSelectionViewModeAction = TAbstractAction<
    'setSelectionViewMode',
    {
        viewMode: IListState['selectionViewMode'];
    }
>;

export type TResetSelectionViewModeAction = TAbstractAction<'resetSelectionViewMode', {}>;

export type TUpdateOperationsSelectionAction = TAbstractAction<'updateOperationsSelection', {}>;

export type TUpdateOperationsPanelAction = TAbstractAction<
    'updateOperationsPanel',
    {
        prevState: IListState;
        isVisible: boolean | undefined;
        selectionVisibility: IListState['multiSelectVisibility'];
    }
>;
