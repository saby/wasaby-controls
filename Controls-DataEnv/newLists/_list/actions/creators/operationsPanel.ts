/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { operationsPanel } from '../types';
import type { IListState } from '../../interface/IListState';

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

export const complexUpdateOperationsPanel = (
    prevState: IListState,
    nextState: IListState
): operationsPanel.TComplexUpdateOperationsPanelAction => ({
    type: 'complexUpdateOperationsPanel',
    payload: {
        prevState,
        nextState,
    },
});
