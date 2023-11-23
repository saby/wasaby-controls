import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';

// TODO: Экспортировать в типах этот тип и использовать его тут.
export enum ChangeAction {
    ACTION_ADD = 'a',
    ACTION_REMOVE = 'rm',
    ACTION_CHANGE = 'ch',
    ACTION_REPLACE = 'rp',
    ACTION_MOVE = 'm',
    ACTION_RESET = 'rs',
}

export type TItemsChange = {
    action: ChangeAction;
    newItems: Model[];
    newItemsIndex: number;
    removedItems: Model[];
    removedItemsIndex: number;
    reason?: string;
    changedPropertyItems?: object;
};

export type IItemsState = {
    items: RecordSet;

    itemsChanges?: TItemsChange[];
};
