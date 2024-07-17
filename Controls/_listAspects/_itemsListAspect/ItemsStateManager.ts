import { Collection as ICollection, ISourceCollection } from 'Controls/display';
import type { IHasMoreStorage, Tree } from 'Controls/baseTree';
import type { Direction, TKey } from 'Controls/interface';
import type { Model } from 'Types/entity';
import type { RecordSet } from 'Types/collection';

import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import { IListChange, ListChangeNameEnum } from '../_abstractListAspect/common/ListChanges';
import { isEqual, merge } from 'Types/object';
import { isEqualItems, RecordSetChange, RecordSetChangeType } from 'Controls/dataSource';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { convertCollectionChangesToListChanges } from './helpers/convertCollectionChangesToListChanges';
import { convertMetaDataChangesToListChanges } from './helpers/convertMetaDataChangesToListChanges';
import {
    ChangeAction,
    copyItemsState,
    IItemsState,
    MetaDataChangeAction,
    TItemsChange,
    TMetaDataChange,
} from './IItemsState';
import {
    AppendItemsChangeName,
    FirstItemKeySymbol,
    IHasMoreChange,
    ListChangeSourceEnum,
    PrependItemsChangeName,
    RemoveItemsChangeName,
    ReplaceAllItemsChangeName,
    ReplaceItemsChangeName,
} from './TItemsChanges';

function toArray<T>(display: RecordSet<T>): Model<T>[] {
    const result: Model<T>[] = [];
    display.each((item) => {
        result.push(item);
    });
    return result;
}

export class ItemsStateManager extends AbstractAspectStateManager<IItemsState> {
    private _lastItemsChanges: IItemsState['itemsChanges'];
    private _lastMetaDataChanges: IItemsState['metaDataChanges'];
    private _skipSetCollection: boolean;

    // TODO. Удалить после разработки слоя совместимости с BaseControl
    disableSetCollection() {
        this._skipSetCollection = true;
    }

    resolveChanges(prevState: IItemsState, nextState: IItemsState): IListChange[] {
        const changes: IListChange[] = [];
        if ('items' in nextState && prevState.items !== nextState.items) {
            this._lastItemsChanges = undefined;
            changes.push({
                name: ReplaceAllItemsChangeName,
                args: {
                    items: nextState.items,
                },
            });
        } else if (nextState.itemsChanges && nextState.itemsChanges.length) {
            changes.push(
                ...convertCollectionChangesToListChanges(nextState.items, nextState.itemsChanges)
            );
            this._lastItemsChanges = nextState.itemsChanges;
        } else {
            this._lastItemsChanges = undefined;
        }
        if (nextState.metaDataChanges && nextState.metaDataChanges.length) {
            changes.push(...convertMetaDataChangesToListChanges(nextState.metaDataChanges));
            this._lastMetaDataChanges = nextState.metaDataChanges;
        }
        if (
            nextState.hasMoreStorage &&
            !isEqual(prevState.hasMoreStorage, nextState.hasMoreStorage)
        ) {
            changes.push({
                name: ListChangeNameEnum.SET_HAS_MORE,
                args: {
                    hasMoreStorage: nextState.hasMoreStorage,
                },
            });
        }

        // TODO: Надо совещание, услышать мнение, это про групповые изменения.
        const extraChanges: IListChange[] = [];

        if (changes.length && isLoaded('Controls/listAspects')) {
            const markerAspectClass =
                loadSync<typeof import('Controls/listAspects')>(
                    'Controls/listAspects'
                )._MarkerStateManager;

            const markerChanges = markerAspectClass.resolveChangesOnItemsChange(
                prevState,
                nextState,
                changes
            );
            if (markerChanges) {
                extraChanges.push(...markerChanges);
            }
        }

        if (changes.length && isLoaded('Controls/listAspects')) {
            const expandCollapseAspectClass =
                loadSync<typeof import('Controls/listAspects')>(
                    'Controls/listAspects'
                )._ExpandCollapseStateManager;

            const expandCollapseChanges = expandCollapseAspectClass.resolveChangesOnItemsChange(
                prevState,
                nextState,
                changes
            );
            if (expandCollapseChanges) {
                extraChanges.push(...expandCollapseChanges);
            }
        }

        return [...changes, ...extraChanges];
    }

    getNextState(state: IItemsState, changes: IListChange[]): IItemsState {
        const nextState = copyItemsState({
            ...state,
            itemsChanges: this._lastItemsChanges,
            metaDataChanges: this._lastMetaDataChanges,
        });

        let lastSetHasMoreChange: IHasMoreChange | undefined;

        for (const change of changes) {
            switch (change.name) {
                case ReplaceAllItemsChangeName: {
                    if (
                        !this._skipSetCollection &&
                        !(state.items && isEqualItems(state.items, change.args.items))
                    ) {
                        nextState.items = change.args.items;
                    }
                    break;
                }
                case ListChangeNameEnum.SET_HAS_MORE: {
                    lastSetHasMoreChange = change;
                    break;
                }
            }
        }

        if (lastSetHasMoreChange) {
            nextState.hasMoreStorage = lastSetHasMoreChange.args.hasMoreStorage;
        }

        return nextState;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[]
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case ReplaceAllItemsChangeName: {
                    // TODO. Удалить после разработки слоя совместимости с BaseControl
                    if (!this._skipSetCollection) {
                        const recordSet = collection.getSourceCollection();
                        const newItems = change.args.items;

                        // FIXME: Не должно быть assign на замене рекордсета.
                        //  Тем более, при живом диффере.
                        if (recordSet && isEqualItems(recordSet, newItems)) {
                            recordSet.assign(newItems);
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            collection.setCollection(newItems as unknown as ISourceCollection<any>);
                        }
                    }
                    break;
                }
                case ReplaceItemsChangeName: {
                    if (change.args.changeSource === ListChangeSourceEnum.INTERNAL) {
                        break;
                    }
                    const recordSet = collection.getSourceCollection();
                    change.args.items.forEach((newItem, key) => {
                        const prevItem = recordSet.getRecordById(key);
                        const prevIndex = recordSet.getIndex(prevItem);
                        if (prevItem && prevIndex !== -1) {
                            recordSet.replace(newItem, prevIndex);
                        }
                    });
                    break;
                }
                case RemoveItemsChangeName: {
                    if (change.args.changeSource === ListChangeSourceEnum.INTERNAL) {
                        break;
                    }
                    const recordSet = collection.getSourceCollection();
                    change.args.keys.forEach((key) => {
                        const prevItem = recordSet.getRecordById(key);
                        if (prevItem) {
                            recordSet.remove(prevItem);
                        }
                    });
                    break;
                }
                case PrependItemsChangeName: {
                    if (change.args.changeSource === ListChangeSourceEnum.INTERNAL) {
                        break;
                    }
                    const recordSet = collection.getSourceCollection();
                    change.args.items.forEach((item, key) => {
                        if (key === FirstItemKeySymbol) {
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
                    break;
                }
                case AppendItemsChangeName: {
                    if (change.args.changeSource === ListChangeSourceEnum.INTERNAL) {
                        break;
                    }
                    const recordSet = collection.getSourceCollection();
                    change.args.items.forEach((item, key) => {
                        if (key === FirstItemKeySymbol) {
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
                    break;
                }
                case ListChangeNameEnum.SET_HAS_MORE: {
                    // На вебе коллекция не готова перестраивать свои подвалы и заголовки узлов в правильные моменты.
                    // https://online.sbis.ru/opendoc.html?guid=afb227d2-a39b-415c-9372-e3eb9abc91b1&client=3
                    (collection as unknown as Tree).setHasMoreStorage?.(
                        change.args.hasMoreStorage,
                        collection.isThinInteractor()
                    );
                    break;
                }
                case ListChangeNameEnum.REPLACE_META_DATA: {
                    const recordSet = collection.getSourceCollection();
                    recordSet.setMetaData(change.args.metaData);
                    break;
                }
                case ListChangeNameEnum.MERGE_META_DATA: {
                    const recordSet = collection.getSourceCollection();
                    recordSet.setMetaData(merge(recordSet.getMetaData(), change.args.metaData));
                    break;
                }
            }
        }
    }

    calculateItemsChanges(addItemsSteps: RecordSetChange[]): {
        itemsChanges: TItemsChange[];
        metaDataChanges: TMetaDataChange[];
    } {
        const itemsChanges: TItemsChange[] = [];
        const metaDataChanges: TMetaDataChange[] = [];
        // let count = prevItems.getCount();
        for (const { type, params } of addItemsSteps) {
            switch (type) {
                case RecordSetChangeType.APPEND_ITEMS: {
                    const [, , prevItems, newItems] = params;
                    itemsChanges.push({
                        action: ChangeAction.ACTION_ADD,
                        newItemsIndex: prevItems.getCount(),
                        newItems: toArray(newItems),
                        removedItemsIndex: 0,
                        removedItems: [],
                        changeSource: ListChangeSourceEnum.EXTERNAL,
                    });
                    break;
                }
                case RecordSetChangeType.PREPEND_ITEMS: {
                    const [, , , newItems] = params;
                    itemsChanges.push({
                        action: ChangeAction.ACTION_ADD,
                        newItemsIndex: 0,
                        newItems: toArray(newItems),
                        removedItemsIndex: 0,
                        removedItems: [],
                        changeSource: ListChangeSourceEnum.EXTERNAL,
                    });
                    break;
                }
                case RecordSetChangeType.REMOVE_ITEMS: {
                    const [_, removedItemsIndex, removedItems] = params;
                    itemsChanges.push({
                        action: ChangeAction.ACTION_REMOVE,
                        newItemsIndex: 0,
                        newItems: [],
                        removedItemsIndex,
                        removedItems,
                        changeSource: ListChangeSourceEnum.EXTERNAL,
                    });
                    break;
                }
                case RecordSetChangeType.SET_META_DATA: {
                    const [_, metaData] = params;
                    metaDataChanges.push({
                        action: MetaDataChangeAction.REPLACE_META_DATA,
                        metaData,
                    });
                    break;
                }
                case RecordSetChangeType.MERGE_ITEMS: {
                    const [_, metaData] = params;
                    metaDataChanges.push({
                        action: MetaDataChangeAction.MERGE_META_DATA,
                        metaData,
                    });
                    break;
                }
            }
        }
        return {
            itemsChanges,
            metaDataChanges,
        };
    }

    calculateHasMoreStorage(
        hasMoreStorage: IHasMoreStorage | undefined,
        newItems: RecordSet,
        direction: Direction,
        parent: TKey
    ) {
        const more = newItems.getMetaData().more;

        return {
            ...hasMoreStorage,
            [`${parent}`]: {
                backward:
                    direction === 'up'
                        ? Boolean(more?.up ?? more?.backward ?? more)
                        : hasMoreStorage?.[`${parent}`]?.backward ?? false,
                forward:
                    direction === 'down'
                        ? Boolean(more?.down ?? more?.forward ?? more)
                        : hasMoreStorage?.[`${parent}`]?.forward ?? false,
            },
        };
    }
}

export function itemsStateManagerFactory(): ItemsStateManager {
    return new ItemsStateManager();
}