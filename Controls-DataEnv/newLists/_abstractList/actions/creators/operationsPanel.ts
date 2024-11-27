import type { operationsPanel } from '../types';

/**
 * Конструктор действия, для открытия панели массовых операций.
 * @function
 * @return operationsPanel.TOpenOperationsPanelAction
 */
export const openOperationsPanel = (): operationsPanel.TOpenOperationsPanelAction => ({
    type: 'openOperationsPanel',
    payload: {},
});

/**
 * Конструктор действия, для закрытия панели массовых операций.
 * @function
 * @return operationsPanel.TCloseOperationsPanelAction
 */
export const closeOperationsPanel = (): operationsPanel.TCloseOperationsPanelAction => ({
    type: 'closeOperationsPanel',
    payload: {},
});
