import type { Collection as ICollection } from 'Controls/display';
import type { Tree as ITreeCollection } from 'Controls/baseTree';
import type { IItemsState } from './IItemsState';
import type { IListChange } from '../../_interface/IListChanges';
import type { TCollectionType } from '../../_interface/IAbstractListSliceTypes';

import { convertCollectionChangesToListChanges } from './helpers/convertCollectionChangesToListChanges';
import { IListChangeName, IListChangeSource } from '../../_interface/IListChanges';
import { AbstractAspectStateManager } from '../abstract/AbstractAspectStateManager';
import { FirstItemKeySymbol } from './types/FirstItemKeySymbol';

export { FirstItemKeySymbol };

export class ItemsStateManager extends AbstractAspectStateManager<IItemsState> {
    private _lastItemsChanges: IItemsState['itemsChanges'];

    resolveChanges(prevState: IItemsState, nextState: IItemsState): IListChange[] {
        const changes: IListChange[] = [];
        if ('items' in nextState && prevState.items !== nextState.items) {
            this._lastItemsChanges = undefined;
            changes.push({
                name: IListChangeName.REPLACE_ALL_ITEMS,
                args: {
                    items: nextState.items.getRawData(),
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
        return changes;
    }

    getNextState(state: IItemsState, changes: IListChange[]): IItemsState {
        return {
            items: state.items,
            itemsChanges: this._lastItemsChanges,
        };
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[]
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.REPLACE_ALL_ITEMS: {
                    const recordSet = collection.getSourceCollection();
                    recordSet.assign(change.args.items);
                    const parentProperty = (
                        collection as unknown as ITreeCollection
                    )?.getParentProperty?.();
                    if (
                        parentProperty &&
                        recordSet.getFormat().getFieldIndex(parentProperty) === -1
                    ) {
                        // TODO. Скоро бекенд будет отдавать recordSet в строгом формате и проблема уйдёт
                        // Иногда поле [parentProperty] отсутствует в format-е recordSet-а, из-за этого данные теряются
                        recordSet.addField({
                            name: parentProperty,
                            type: 'string',
                        });
                    }
                    break;
                }
                case IListChangeName.REPLACE_ITEMS: {
                    if (change.args.changeSource === IListChangeSource.INTERNAL) {
                        break;
                    }
                    const recordSet = collection.getSourceCollection();
                    change.args.items.forEach((newItem, key) => {
                        const prevItem = recordSet.getRecordById(key);
                        if (prevItem) {
                            recordSet.replace(newItem, recordSet.getIndex(prevItem));
                        }
                    });
                    break;
                }
                case IListChangeName.REMOVE_ITEMS: {
                    if (change.args.changeSource === IListChangeSource.INTERNAL) {
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
                case IListChangeName.PREPEND_ITEMS: {
                    if (change.args.changeSource === IListChangeSource.INTERNAL) {
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
                case IListChangeName.APPEND_ITEMS: {
                    if (change.args.changeSource === IListChangeSource.INTERNAL) {
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
            }
        }
    }
}

export function itemsStateManagerFactory(
    collectionType: TCollectionType,
    state: IItemsState
): ItemsStateManager {
    return new ItemsStateManager();
}
