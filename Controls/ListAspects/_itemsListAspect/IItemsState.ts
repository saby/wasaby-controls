import type { Model } from 'Types/entity';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { TListChangeSource } from './TItemsChanges';
import type { IStateWithItems } from 'Controls/abstractListAspect';

import { copyStateWithItems } from 'Controls/abstractListAspect';

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
    changeSource?: TListChangeSource;
};

export enum MetaDataChangeAction {
    REPLACE_META_DATA = 'r',
    MERGE_META_DATA = 'm',
}

export type TMetaDataChange = {
    action: MetaDataChangeAction;
    metaData: unknown;
};

export interface IItemsState extends IStateWithItems {
    hasMoreStorage?: IHasMoreStorage;
    itemsChanges?: TItemsChange[];
    metaDataChanges?: TMetaDataChange[];
}

export function copyItemsState({
    hasMoreStorage,
    itemsChanges,
    metaDataChanges,
    ...state
}: IItemsState): IItemsState {
    return {
        ...copyStateWithItems(state),
        hasMoreStorage,
        itemsChanges,
        metaDataChanges,
    };
}
