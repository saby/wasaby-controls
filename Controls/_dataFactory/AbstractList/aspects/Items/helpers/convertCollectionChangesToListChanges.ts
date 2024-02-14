import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';
import type { IItemsState, TItemsChange } from '../IItemsState';
import type { IListChange } from '../../../_interface/IListChanges';

import { FirstItemKeySymbol } from '../types/FirstItemKeySymbol';
import { ChangeAction } from '../IItemsState';
import { IListChangeName, IListChangeSource } from '../../../_interface/IListChanges';

function convertAdd(items: RecordSet, change: TItemsChange): IListChange[] {
    const addedItemsMap = new Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>();
    let appendKey: CrudEntityKey | typeof FirstItemKeySymbol;
    let changeName: IListChangeName.APPEND_ITEMS | IListChangeName.PREPEND_ITEMS;

    if (change.newItemsIndex === 0) {
        appendKey = FirstItemKeySymbol;
        changeName = IListChangeName.PREPEND_ITEMS;
    } else {
        appendKey = items.at(change.newItemsIndex - 1).getKey();
        changeName = IListChangeName.APPEND_ITEMS;
    }

    for (let i = change.newItemsIndex; i < change.newItemsIndex + change.newItems.length; i++) {
        addedItemsMap.set(appendKey, change.newItems[i]);
        appendKey = items.at(i).getKey();
    }

    return [
        {
            name: changeName,
            args: {
                items: addedItemsMap,
                changeSource: IListChangeSource.INTERNAL,
            },
        },
    ];
}

function convertRemove(items: RecordSet, change: TItemsChange): IListChange[] {
    return [
        {
            name: IListChangeName.REMOVE_ITEMS,
            args: {
                keys: change.removedItems.map((item) => item.getKey()),
                changeSource: IListChangeSource.INTERNAL,
            },
        },
    ];
}

function convertReplace(items: RecordSet, change: TItemsChange): IListChange[] {
    return [
        {
            name: IListChangeName.REPLACE_ITEMS,
            args: {
                items: new Map(
                    change.newItems.map((item, index) => [change.newItemsIndex + index, item])
                ),
                changeSource: IListChangeSource.INTERNAL,
            },
        },
    ];
}

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
    return collectionChanges.reduce((changes, change) => {
        changes.push(...convertChange(items, change));
        return changes;
    }, []);
}
