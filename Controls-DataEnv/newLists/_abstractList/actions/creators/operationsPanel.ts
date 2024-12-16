import type { operationsPanel } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для открытия панели массовых операций.
 * @function
 * @return operationsPanel.TOpenOperationsPanelAction
 */
export const openOperationsPanel = (): operationsPanel.TOpenOperationsPanelAction =>
    aCreator('openOperationsPanel');

/**
 * Конструктор действия, для закрытия панели массовых операций.
 * @function
 * @return operationsPanel.TCloseOperationsPanelAction
 */
export const closeOperationsPanel = (): operationsPanel.TCloseOperationsPanelAction =>
    aCreator('closeOperationsPanel');
