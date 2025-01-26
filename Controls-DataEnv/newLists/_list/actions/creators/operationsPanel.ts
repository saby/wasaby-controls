import type { operationsPanel } from '../types';
import type { IListState } from '../../interface/IListState';

/**
 * Конструктор действия, для установки режима отображения выбора через ПМО.
 */
export const setSelectionViewMode = (
    viewMode: IListState['selectionViewMode']
): operationsPanel.TSetSelectionViewModeAction => ({
    type: 'setSelectionViewMode',
    payload: { viewMode },
});

/**
 * Конструктор действия, для сброса режима выбора через ПМО.
 */
export const resetSelectionViewMode = (): operationsPanel.TResetSelectionViewModeAction => ({
    type: 'resetSelectionViewMode',
    payload: {},
});

/**
 * Конструктор действия, для обновления состояния выделения в ПМО.
 */
export const updateOperationsSelection = (): operationsPanel.TUpdateOperationsSelectionAction => ({
    type: 'updateOperationsSelection',
    payload: {},
});

/**
 * Конструктор действия, для комплексного обновления ПМО.
 */
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
