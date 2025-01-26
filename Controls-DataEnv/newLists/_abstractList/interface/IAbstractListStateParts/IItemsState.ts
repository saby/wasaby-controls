import type { RecordSet } from 'Types/collection';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';

/**
 * Интерфейс состояния для работы с записями в списке с любым типом интерактора(web/mobile).
 */
export interface IItemsState {
    items: RecordSet;
    keyProperty: string;
    hasMoreStorage: IHasMoreStorage;
    metaData: unknown;
}
