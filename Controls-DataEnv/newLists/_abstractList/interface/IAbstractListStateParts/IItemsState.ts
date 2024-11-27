import type { RecordSet } from 'Types/collection';

/**
 * Интерфейс состояния для работы с записями в списке с любым типом интерактора(web/mobile).
 */
export interface IItemsState {
    items: RecordSet;
    keyProperty: string;
}
