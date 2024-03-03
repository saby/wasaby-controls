import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';
import type { IListChange } from 'Controls/abstractListAspect';

import { ChangeAction, IItemsState, TItemsChange } from '../IItemsState';
import {
    AppendItemsChangeName,
    PrependItemsChangeName,
    RemoveItemsChangeName,
    ReplaceItemsChangeName,
    TAppendItemsChangeName,
    TPrependItemsChangeName,
    ListChangeSourceEnum,
    FirstItemKeySymbol,
} from '../TItemsChanges';

function convertAdd(items: RecordSet, change: TItemsChange): IListChange[] {
    const addedItemsMap = new Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>();
    let appendKey: CrudEntityKey | typeof FirstItemKeySymbol;
    let changeName: TAppendItemsChangeName | TPrependItemsChangeName;

    if (change.newItemsIndex === 0) {
        appendKey = FirstItemKeySymbol;
        changeName = PrependItemsChangeName;
    } else {
        appendKey = items.at(change.newItemsIndex - 1).getKey();
        changeName = AppendItemsChangeName;
    }

    for (const newItem of change.newItems) {
        addedItemsMap.set(appendKey, newItem);
        appendKey = newItem.getKey();
    }

    return [
        {
            name: changeName,
            args: {
                items: addedItemsMap,
                changeSource: change.changeSource ?? ListChangeSourceEnum.INTERNAL,
            },
        },
    ];
}

function convertRemove(_items: RecordSet, change: TItemsChange): IListChange[] {
    return [
        {
            name: RemoveItemsChangeName,
            args: {
                keys: change.removedItems.map((item) => item.getKey()),
                index: change.removedItemsIndex,
                changeSource: change.changeSource ?? ListChangeSourceEnum.INTERNAL,
                reason: change.reason,
            },
        },
    ];
}

function convertReplace(_items: RecordSet, change: TItemsChange): IListChange[] {
    return [
        {
            name: ReplaceItemsChangeName,
            args: {
                items: new Map(
                    change.newItems.map((item, index) => [change.newItemsIndex + index, item])
                ),
                changeSource: change.changeSource ?? ListChangeSourceEnum.INTERNAL,
            },
        },
    ];
}

// TODO: Нужна дока и добавить в документ, зачем мы так сделали, почему на 2 разбили?
function convertReset(items: RecordSet, change: TItemsChange): IListChange[] {
    return [...convertRemove(items, change), ...convertAdd(items, change)];
}

function convertChange(items: RecordSet, change: TItemsChange): IListChange[] {
    switch (change.action) {
        case ChangeAction.ACTION_RESET: {
            return convertReset(items, change);
        }
        case ChangeAction.ACTION_CHANGE: {
            // TODO
            return [];
        }
        case ChangeAction.ACTION_ADD: {
            return convertAdd(items, change);
        }
        case ChangeAction.ACTION_REMOVE: {
            return convertRemove(items, change);
        }
        case ChangeAction.ACTION_MOVE:
        case ChangeAction.ACTION_REPLACE: {
            return convertReplace(items, change);
        }
    }
}

export function convertCollectionChangesToListChanges(
    items: RecordSet,
    collectionChanges: IItemsState['itemsChanges']
): IListChange[] {
    if (collectionChanges instanceof Array) {
        return collectionChanges.reduce((changes, change) => {
            changes.push(...convertChange(items, change));
            return changes;
        }, [] as IListChange[]);
    }
    return [];
}
