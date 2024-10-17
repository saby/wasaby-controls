/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';
import type { operationsPanel } from '../types';
import type { IListState } from '../../interface/IListState';

export const openOperationsPanel = AbstractListActionCreators.operationsPanel.openOperationsPanel;
export const closeOperationsPanel = AbstractListActionCreators.operationsPanel.closeOperationsPanel;

export const setSelectionViewMode = (
    viewMode: IListState['selectionViewMode']
): operationsPanel.TSetSelectionViewModeAction => ({
    type: 'setSelectionViewMode',
    payload: { viewMode },
});

export const resetSelectionViewMode = (): operationsPanel.TResetSelectionViewModeAction => ({
    type: 'resetSelectionViewMode',
    payload: {},
});

export const updateOperationsSelection = (): operationsPanel.TUpdateOperationsSelectionAction => ({
    type: 'updateOperationsSelection',
    payload: {},
});

export const updateOperationsPanel = (
    prevState: IListState,
    isVisible: boolean | undefined,
    selectionVisibility: IListState['multiSelectVisibility']
): operationsPanel.TUpdateOperationsPanelAction => ({
    type: 'updateOperationsPanel',
    payload: {
        prevState,
        isVisible,
        selectionVisibility,
    },
});

export type TOperationsPanelActions =
    | operationsPanel.TOpenOperationsPanelAction
    | operationsPanel.TCloseOperationsPanelAction
    | operationsPanel.TSetSelectionViewModeAction
    | operationsPanel.TResetSelectionViewModeAction
    | operationsPanel.TUpdateOperationsSelectionAction
    | operationsPanel.TUpdateOperationsPanelAction;
