/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    AbstractListActionCreators,
    ChangeAction,
    TAbstractListActions,
    TAbstractListMiddleware,
    TItemsChange,
} from 'Controls-DataEnv/abstractList';
import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';
import { merge } from 'Types/object';
import { isEqualItems } from 'Controls/dataSource';

export const items: TAbstractListMiddleware = ({
    getState,
    setState,
    dispatch,
    getSkipSetCollection,
}) => {
    let actionArray: TAbstractListActions.items.TAnyItemsAction[] = [];

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

                await dispatch(AbstractListActionCreators.items.onAllItemsReplaced(payloadItems));
                break;
            }
            case 'replaceItems': {
                const { items: payloadItems, changeSource } = action.payload;

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
                await dispatch(AbstractListActionCreators.items.onItemsReplaced());
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

                await dispatch(
                    AbstractListActionCreators.items.onItemsRemoved(index, keys, reason)
                );
                break;
            }
            case 'prependItems': {
                const { items: stateItems } = getState();
                const { items: payloadItems, changeSource } = action.payload;

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

                await dispatch(AbstractListActionCreators.items.onItemsAdded());
                break;
            }
            case 'appendItems': {
                const { items: stateItems } = getState();
                const { items: payloadItems, changeSource } = action.payload;

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

                await dispatch(AbstractListActionCreators.items.onItemsAdded());
                break;
            }
            case 'resetItems': {
                const { items: stateItems, viewCommands } = getState();
                const { newItems, oldItems, removedItemsIndex, changeSource } = action.payload;

                if (changeSource !== 'INTERNAL' && stateItems) {
                    const recordSet = stateItems;
                    recordSet.clear();
                    recordSet.append(newItems);
                    setState({ items: recordSet });
                }

                setState({ viewCommands: [...viewCommands, 'resetScroll'] });

                await dispatch(
                    AbstractListActionCreators.items.onItemsReset(
                        newItems,
                        oldItems,
                        removedItemsIndex
                    )
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

                    for (const innerAction of actionArray) {
                        await dispatch(innerAction);
                    }
                    actionArray = [];
                }

                break;
            }
        }

        next(action);
    };
};

function convertAdd(
    rs: RecordSet,
    change: TItemsChange
): TAbstractListActions.items.TAnyItemsAction[] {
    const addedItemsMap = new Map<CrudEntityKey | undefined, Model>();
    let appendKey: CrudEntityKey | undefined;
    let reducerName;

    if (change.newItemsIndex === 0) {
        appendKey = undefined;
        reducerName = AbstractListActionCreators.items.prependItems;
    } else {
        appendKey = rs.at(change.newItemsIndex - 1).getKey();
        reducerName = AbstractListActionCreators.items.appendItems;
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
): TAbstractListActions.items.TAnyItemsAction[] {
    return [
        AbstractListActionCreators.items.removeItems(
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
): TAbstractListActions.items.TAnyItemsAction[] {
    return [
        AbstractListActionCreators.items.replaceItems(
            new Map(change.newItems.map((item, index) => [change.newItemsIndex + index, item])),
            change.changeSource ?? 'INTERNAL'
        ),
    ];
}

function convertReset(
    _: RecordSet,
    change: TItemsChange
): TAbstractListActions.items.TAnyItemsAction[] {
    return [
        AbstractListActionCreators.items.resetItems(
            change.newItems,
            change.removedItems,
            change.removedItemsIndex,
            change.changeSource ?? 'INTERNAL'
        ),
    ];
}

function convertChange(
    rs: RecordSet,
    change: TItemsChange
): TAbstractListActions.items.TAnyItemsAction[] {
    switch (change.action) {
        case ChangeAction.ACTION_RESET: {
            return convertReset(rs, change);
        }
        case ChangeAction.ACTION_CHANGE: {
            // TODO
            return [];
        }
        case ChangeAction.ACTION_ADD: {
            return convertAdd(rs, change);
        }
        case ChangeAction.ACTION_REMOVE: {
            return convertRemove(rs, change);
        }
        case ChangeAction.ACTION_MOVE:
        case ChangeAction.ACTION_REPLACE: {
            return convertReplace(rs, change);
        }
    }
}

function convertCollectionChangesToDispatchObjects(
    rs: RecordSet,
    collectionChanges: TItemsChange[]
): TAbstractListActions.items.TAnyItemsAction[] {
    let result: TAbstractListActions.items.TAnyItemsAction[] = [];
    if (collectionChanges && collectionChanges.length > 0) {
        try {
            result = collectionChanges.reduce((changes, change) => {
                changes.push(...convertChange(rs, change));
                return changes;
            }, [] as TAbstractListActions.items.TAnyItemsAction[]);
        } catch (e) {
            result = [];
        }
    }
    return result;
}
