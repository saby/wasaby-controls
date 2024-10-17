/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';

/**
 * Тип действия, для сброса текущего поиска.
 */
export type TResetSearchAction = TAbstractAction<'resetSearch', {}>;
