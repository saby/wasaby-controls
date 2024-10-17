/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';

/**
 * Тип действия, для открытия панели массовых операций.
 */
export type TOpenOperationsPanelAction = TAbstractAction<'openOperationsPanel', {}>;

/**
 * Тип действия, для закрытия панели массовых операций.
 */
export type TCloseOperationsPanelAction = TAbstractAction<'closeOperationsPanel', {}>;
