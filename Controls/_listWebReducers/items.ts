/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';

import { TItemsChange, TMetaDataChange, ChangeAction } from 'Controls-DataEnv/abstractList';
import { IListState, TListActions } from 'Controls-DataEnv/list';
import type { TKey } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';
import { isEqual, merge } from 'Types/object';
import { isEqualItems } from 'Controls/dataSource';

enum MetaDataChangeAction {
    REPLACE_META_DATA = 'r',
    MERGE_META_DATA = 'm',
}

export const items: TListMiddleware = ({
    getState,
    setState,
    dispatch,
    getCollection,
    getSkipSetCollection,
}) => {
    let actionArray: TListActions.items.TAnyItemsAction[] = [];
    let prevStateMarkedKey: TKey | undefined;
    return (next) => async (action) => {
        switch (action.type) {
            case 'replaceAllItems': {
                const { items: stateItems, markedKey } = getState();
                const { items: payloadItems } = action.payload;
                prevStateMarkedKey = markedKey;

                await dispatch(ListWebActions.itemActions.updateItemActionsMap());

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

                await dispatch(
                    ListWebActions.items.onAllItemsReplaced(payloadItems, prevStateMarkedKey)
                );
                break;
            }
            case 'replaceItems': {
                const { items: payloadItems, changeSource } = action.payload;

                await dispatch(ListWebActions.itemActions.updateItemActionsMap());

                // В WEB списках RS сейчас всегда меняется изнутри, поэтому никакого вмерживания тут нет.
                if (changeSource === 'INTERNAL') {
                    break;
                }

                const { items: stateItems } = getState();

                const recordSet = stateItems;
                payloadItems.forEach((newItem, key) => {
                    const prevItem = recordSet.getRecordById(key);
                    const prevIndex = recordSet.getIndex(prevItem);
                    if (prevItem && prevIndex !== -1) {
                        recordSet.replace(newItem, prevIndex);
                    }
                });
                setState({ items: recordSet });

                break;
            }
            case 'removeItems': {
                const { items: stateItems, markedKey } = getState();
                const { keys, index, changeSource, reason } = action.payload;
                prevStateMarkedKey = markedKey;

                await dispatch(ListWebActions.items.handleRemovedItems(keys, reason));

                if (changeSource !== 'INTERNAL') {
                    const recordSet = stateItems;
                    keys.forEach((key) => {
                        const prevItem = recordSet.getRecordById(key);
                        if (prevItem) {
                            recordSet.remove(prevItem);
                        }
                    });
                    setState({ items: recordSet });
                }

                await dispatch(
                    ListWebActions.items.onItemsRemoved(
                        index,
                        keys,
                        actionArray,
                        prevStateMarkedKey
                    )
                );
                break;
            }
            case 'prependItems': {
                const { items: stateItems, markedKey } = getState();
                const { items: payloadItems, changeSource } = action.payload;
                prevStateMarkedKey = markedKey;

                await dispatch(ListWebActions.itemActions.updateItemActionsMap());

                if (changeSource !== 'INTERNAL') {
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

                await dispatch(ListWebActions.items.onItemsAdded(actionArray, prevStateMarkedKey));
                break;
            }
            case 'appendItems': {
                const { items: stateItems, markedKey } = getState();
                const { items: payloadItems, changeSource } = action.payload;
                prevStateMarkedKey = markedKey;

                await dispatch(ListWebActions.itemActions.updateItemActionsMap());

                if (changeSource !== 'INTERNAL') {
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

                await dispatch(ListWebActions.items.onItemsAdded(actionArray, prevStateMarkedKey));
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

                const newMetaData = merge(stateItems.getMetaData(), metaData);
                setState({ metaData: newMetaData });
                break;
            }
            case 'complexUpdateItems': {
                // TODO: временное решение. Поправится с поддержкой всех коллекций
                if (!getCollection()) {
                    break;
                }

                const { prevState, nextState } = action.payload;
                if (nextState.items && prevState.items !== nextState.items) {
                    await dispatch(
                        ListWebActions.items.handleItemsChanged(prevState.items, nextState.items)
                    );

                    await dispatch(ListWebActions.items.replaceAllItems(nextState.items));
                } else if (nextState.itemsChanges?.length) {
                    actionArray = convertCollectionChangesToDispatchObjects(
                        nextState.items,
                        nextState.itemsChanges
                    );

                    if (actionArray.length) {
                        await dispatch(
                            ListWebActions.items.handleItemsChanged(
                                prevState.items,
                                nextState.items
                            )
                        );
                    }

                    for (const action of actionArray) {
                        await dispatch(action);
                    }
                    actionArray = [];
                }

                if (nextState.metaDataChanges?.length) {
                    const actionArray = convertMetaDataChangesToDispatchObjects(
                        nextState.metaDataChanges
                    );
                    for (const action of actionArray) {
                        await dispatch(action);
                    }
                }

                if (
                    nextState.hasMoreStorage &&
                    !isEqual(prevState.hasMoreStorage, nextState.hasMoreStorage)
                ) {
                    await dispatch(
                        ListWebActions.source.updateHasMoreStorage(
                            nextState,
                            nextState.hasMoreStorage
                        )
                    );
                }

                if (nextState.keyProperty !== prevState.keyProperty) {
                    await dispatch(ListWebActions.items.changeKeyProperty(nextState.keyProperty));
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
        reducerName = ListWebActions.items.prependItems;
    } else {
        appendKey = items.at(change.newItemsIndex - 1).getKey();
        reducerName = ListWebActions.items.appendItems;
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
        ListWebActions.items.removeItems(
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
        ListWebActions.items.replaceItems(
            new Map(change.newItems.map((item, index) => [change.newItemsIndex + index, item])),
            change.changeSource ?? 'INTERNAL'
        ),
    ];
}

// TODO: Нужна дока и добавить в документ, зачем мы так сделали, почему на 2 разбили?
function convertReset(
    items: RecordSet,
    change: TItemsChange
): TListActions.items.TAnyItemsAction[] {
    return [...convertRemove(items, change), ...convertAdd(items, change)];
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
    collectionChanges: IListState['itemsChanges']
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
                result.push(ListWebActions.items.replaceMetaData(metaData));
                break;
            }
            case MetaDataChangeAction.MERGE_META_DATA: {
                result.push(ListWebActions.items.mergeMetaData(metaData));
                break;
            }
        }
    }
    return result;
};
