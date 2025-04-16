import type { operationsPanel } from '../types';

/**
 * Конструктор действия, для сброса режима выбора через ПМО.
 */
export const resetSelectionViewMode = (): operationsPanel.TResetSelectionViewModeAction => ({
    type: 'resetSelectionViewMode',
    payload: {},
});
