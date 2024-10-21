/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';

/**
 * Тип действия, для комплексного обновления записей.
 */
export type TComplexUpdateItemsAction = TAbstractComplexUpdateAction<'Items'>;

/**
 * Тип действий функционала "Работа с рекордсетом записей", доступные в WEB списке.
 */
export type TAnyItemsAction = TComplexUpdateItemsAction;
