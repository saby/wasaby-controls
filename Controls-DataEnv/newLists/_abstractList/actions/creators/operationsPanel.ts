/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
