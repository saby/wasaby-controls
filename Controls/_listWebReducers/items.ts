/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TItemsChange, TMetaDataChange, ChangeAction } from 'Controls-DataEnv/abstractList';
import { TListMiddleware, ListActionCreators, TListActions } from 'Controls-DataEnv/list';
import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';
import { merge } from 'Types/object';
import { isEqualItems } from 'Controls/dataSource';

enum MetaDataChangeAction {
    REPLACE_META_DATA = 'r',
    MERGE_META_DATA = 'm',
}

export const items: TListMiddleware = ({ getState, setState, dispatch, getSkipSetCollection }) => {
    let actionArray: TListActions.items.TAnyItemsAction[] = [];
    return (next) => async (action) => {
        switch (action.type) {
            case 'replaceAllItems': {
                const { items: stateItems } = getState();
                const { items: payloadItems } = action.payload;

                const skipSetCollection = getSkipSetCollection();
                // FIXME: Не должно быть assign на замене рекордсета.
                //  Тем более, при живом диффере.
                if (!skipSetCollection && stateItems && isEqualItems(stateItems, payloadItems)) {
                    stateItems.assign(payloadItems);
                } else if (!skipSetCollection) {
                    setState({
                        items: payloadItems,
                    });
                }

                await dispatch(ListActionCreators.items.onAllItemsReplaced(payloadItems));
                break;
            }
            case 'replaceItems': {
                const { items: payloadItems, changeSource } = action.payload;

                await dispatch(ListActionCreators.itemActions.updateItemActionsMap());

                // В WEB списках RS сейчас всегда меняется изнутри, поэтому никакого вмерживания тут нет.
                if (changeSource === 'INTERNAL') {
                    break;
                }

                const { items: stateItems } = getState();

                if (stateItems) {
                    const recordSet = stateItems;
                    payloadItems.forEach((newItem, key) => {
                        const prevItem = recordSet.getRecordById(key);
                        const prevIndex = recordSet.getIndex(prevItem);
                        if (prevItem && prevIndex !== -1) {
                            recordSet.replace(newItem, prevIndex);
                        }
                    });
                    setState({ items: recordSet });
                }

                break;
            }
            case 'removeItems': {
                const { items: stateItems } = getState();
                const { keys, index, changeSource, reason } = action.payload;

                if (changeSource !== 'INTERNAL' && stateItems) {
                    const recordSet = stateItems;
                    keys.forEach((key) => {
                        const prevItem = recordSet.getRecordById(key);
                        if (prevItem) {
                            recordSet.remove(prevItem);
                        }
                    });
                    setState({ items: recordSet });
                }

                await dispatch(ListActionCreators.items.onItemsRemoved(index, keys, reason));
                break;
            }
            case 'prependItems': {
                const { items: stateItems } = getState();
                const { items: payloadItems, changeSource } = action.payload;

                await dispatch(ListActionCreators.itemActions.updateItemActionsMap());

                if (changeSource !== 'INTERNAL' && stateItems) {
                    const recordSet = stateItems;
                    payloadItems.forEach((item, key) => {
                        if (key === undefined) {
                            recordSet.add(item, 0);
                        } else {
                            const index = recordSet.getIndex(recordSet.getRecordById(key));
                            if (index === -1) {
                                recordSet.prepend([item]);
                            } else {
                                recordSet.add(item, index);
                            }
                        }
                    });
                    setState({ items: recordSet });
                }

                await dispatch(ListActionCreators.items.onItemsAdded());
                break;
            }
            case 'appendItems': {
                const { items: stateItems } = getState();
                const { items: payloadItems, changeSource } = action.payload;

                await dispatch(ListActionCreators.itemActions.updateItemActionsMap());

                if (changeSource !== 'INTERNAL' && stateItems) {
                    const recordSet = stateItems;
                    payloadItems.forEach((item, key) => {
                        if (key === undefined) {
                            recordSet.add(item, 0);
                        } else {
                            const index = recordSet.getIndex(recordSet.getRecordById(key));
                            if (index === -1) {
                                recordSet.append([item]);
                            } else {
                                recordSet.add(item, index + 1);
                            }
                        }
                    });
                    setState({ items: recordSet });
                }

                await dispatch(ListActionCreators.items.onItemsAdded());
                break;
            }
            case 'resetItems': {
                const { items: stateItems } = getState();
                const { newItems, oldItems, removedItemsIndex, changeSource } = action.payload;

                await dispatch(ListActionCreators.itemActions.updateItemActionsMap());

                if (changeSource !== 'INTERNAL' && stateItems) {
                    const recordSet = stateItems;
                    recordSet.clear();
                    recordSet.append(newItems);
                    setState({ items: recordSet });
                }

                await dispatch(
                    ListActionCreators.items.onItemsReset(newItems, oldItems, removedItemsIndex)
                );
                break;
            }
            case 'changeKeyProperty': {
                const { keyProperty } = action.payload;

                setState({
                    keyProperty,
                });
                break;
            }
            case 'replaceMetaData': {
                const { metaData } = action.payload;

                setState({
                    metaData,
                });
                break;
            }
            case 'mergeMetaData': {
                const { metaData } = action.payload;
                const { items: stateItems } = getState();

                const newMetaData = stateItems
                    ? merge(stateItems.getMetaData(), metaData)
                    : metaData;
                setState({ metaData: newMetaData });
                break;
            }
            case 'setItemsChanges': {
                const { itemsChanges } = action.payload;
                const currentItems = getState().items;

                if (currentItems) {
                    actionArray = convertCollectionChangesToDispatchObjects(
                        currentItems,
                        itemsChanges
                    );

                    for (const action of actionArray) {
                        await dispatch(action);
                    }
                    actionArray = [];
                }

                break;
            }
            case 'setMetaDataChanges': {
                const { metaDataChanges } = action.payload;
                actionArray = convertMetaDataChangesToDispatchObjects(metaDataChanges);
                for (const action of actionArray) {
                    await dispatch(action);
                }
                break;
            }
        }

        next(action);
    };
};

function convertAdd(items: RecordSet, change: TItemsChange): TListActions.items.TAnyItemsAction[] {
    const addedItemsMap = new Map<CrudEntityKey | undefined, Model>();
    let appendKey: CrudEntityKey | undefined;
    let reducerName;

    if (change.newItemsIndex === 0) {
        appendKey = undefined;
        reducerName = ListActionCreators.items.prependItems;
    } else {
        appendKey = items.at(change.newItemsIndex - 1).getKey();
        reducerName = ListActionCreators.items.appendItems;
    }

    for (const newItem of change.newItems) {
        addedItemsMap.set(appendKey, newItem);
        appendKey = newItem.getKey();
    }

    return [reducerName(addedItemsMap, change.changeSource ?? 'INTERNAL')];
}

function convertRemove(
    _items: RecordSet,
    change: TItemsChange
): TListActions.items.TAnyItemsAction[] {
    return [
        ListActionCreators.items.removeItems(
            change.removedItems.map((item) => item.getKey()),
            change.removedItemsIndex,
            change.changeSource ?? 'INTERNAL',
            change.reason
        ),
    ];
}

function convertReplace(
    _items: RecordSet,
    change: TItemsChange
): TListActions.items.TAnyItemsAction[] {
    return [
        ListActionCreators.items.replaceItems(
            new Map(change.newItems.map((item, index) => [change.newItemsIndex + index, item])),
            change.changeSource ?? 'INTERNAL'
        ),
    ];
}

function convertReset(_: RecordSet, change: TItemsChange): TListActions.items.TAnyItemsAction[] {
    return [
        ListActionCreators.items.resetItems(
            change.newItems,
            change.removedItems,
            change.removedItemsIndex,
            change.changeSource ?? 'INTERNAL'
        ),
    ];
}

function convertChange(
    items: RecordSet,
    change: TItemsChange
): TListActions.items.TAnyItemsAction[] {
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

function convertCollectionChangesToDispatchObjects(
    items: RecordSet,
    collectionChanges: TItemsChange[]
): TListActions.items.TAnyItemsAction[] {
    let result: TListActions.items.TAnyItemsAction[] = [];
    if (collectionChanges && collectionChanges.length > 0) {
        try {
            result = collectionChanges.reduce((changes, change) => {
                changes.push(...convertChange(items, change));
                return changes;
            }, [] as TListActions.items.TAnyItemsAction[]);
        } catch (e) {
            result = [];
        }
    }
    return result;
}

export const convertMetaDataChangesToDispatchObjects = (
    metaDataChanges: TMetaDataChange[]
): TListActions.items.TAnyItemsAction[] => {
    const result: TListActions.items.TAnyItemsAction[] = [];
    for (const { action, metaData } of metaDataChanges) {
        switch (action) {
            case MetaDataChangeAction.REPLACE_META_DATA: {
                result.push(ListActionCreators.items.replaceMetaData(metaData));
                break;
            }
            case MetaDataChangeAction.MERGE_META_DATA: {
                result.push(ListActionCreators.items.mergeMetaData(metaData));
                break;
            }
        }
    }
    return result;
};
