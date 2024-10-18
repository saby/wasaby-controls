/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { RecordSet } from 'Types/collection';

/**
 * Интерфейс состояния для работы с записями.
 */
export interface IItemsState {
    items: RecordSet;
    keyProperty: string;
}
