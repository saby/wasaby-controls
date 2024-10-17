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

/**
 * Тип действий функционала "Взаимодействие с панелью массовых операций", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/ccc545f6-e213-4e99-bd2c-41421c3068b6 Зона Kaizen
 */
export type TOperationsPanelActions =
    | operationsPanel.TOpenOperationsPanelAction
    | operationsPanel.TCloseOperationsPanelAction;
