import type { RecordSet } from 'Types/collection';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';
import type { Model } from 'Types/entity';

/**
 * Тип изменения RecordSet'a.
 */
export enum ChangeAction {
    ACTION_ADD = 'a',
    ACTION_REMOVE = 'rm',
    ACTION_CHANGE = 'ch',
    ACTION_REPLACE = 'rp',
    ACTION_MOVE = 'm',
    ACTION_RESET = 'rs',
}

/**
 * Источник изменений RecordSet'a: снаруже или извне.
 */
export type TListChangeSource = 'INTERNAL' | 'EXTERNAL';

/**
 * Изменения(сырые) RecordSet'a.
 */
export type TItemsChange = {
    action: ChangeAction;
    newItems: Model[];
    newItemsIndex: number;
    removedItems: Model[];
    removedItemsIndex: number;
    reason?: string;
    changedPropertyItems?: object;
    changeSource?: TListChangeSource;
};

/**
 * Интерфейс состояния для работы с записями в списке с любым типом интерактора(web/mobile).
 */
export interface IItemsState {
    /**
     * Данные списка.
     */
    items?: RecordSet;
    keyProperty: string;
    hasMoreStorage: IHasMoreStorage;
    metaData?: unknown;
}
