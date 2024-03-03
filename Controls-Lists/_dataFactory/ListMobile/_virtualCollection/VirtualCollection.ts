import type { Collection as ICollection } from 'Controls/display';
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import type { IListChange } from 'Controls/abstractListAspect';

import { Model, Record as SbisRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ListChangeNameEnum } from 'Controls/abstractListAspect';
import { ListChangeSourceEnum, FirstItemKeySymbol } from 'Controls/itemsListAspect';
import {
    ExternalCollectionItemKeys,
    IExternalCollectionItem,
    IExternalDecoratedModel,
    IExternalSelectStatus,
    IStompEventByType,
    IStompEventType,
} from '../_interface/IExternalTypes';

/**
 * Класс реализующий расчет универсальных ListChange-s, с учетом сдвига ключей при работе с индексами.
 * @class Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection
 * @see Controls-Lists
 * @private
 */
export class VirtualCollection {
    protected _keys: CrudEntityKey[];
    protected _expandedKeys: Set<CrudEntityKey>;
    protected _selectedKeys: Map<CrudEntityKey, IExternalSelectStatus>;
    protected _markedKey: CrudEntityKey | undefined;
    protected _hasMoreStorage?: IHasMoreStorage;
    protected _changes: IListChange[];
    protected _recordSet: RecordSet;
    protected _root: CrudEntityKey | null;

    protected _prepareItem(
        record: SbisRecord<IExternalCollectionItem>
    ): Model<IExternalDecoratedModel> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const format: any[] = [];
        const rawData: Record<string, unknown> = {};

        record.getFormat(true).each((recordField) => {
            const name = recordField.getName() as keyof IExternalCollectionItem;
            const type = recordField.getType();

            const value = record.get(name);
            if (name === 'origin') {
                const origin = value as SbisRecord;
                origin.getFormat(true).each((originField) => {
                    const originFieldName = originField.getName();
                    format.push({
                        name: originFieldName,
                        type: originField.getType(),
                    });
                    rawData[originFieldName] = origin.get(originFieldName);
                });
            } else if (name in ExternalCollectionItemKeys) {
                const replacedName =
                    ExternalCollectionItemKeys[name as keyof typeof ExternalCollectionItemKeys];
                rawData[replacedName] = value;
                format.push({
                    name: replacedName,
                    type,
                });
            } else {
                rawData[name] = value;
                format.push({
                    name,
                    type,
                });
            }
        });

        return new Model({
            format,
            rawData,
            keyProperty: ExternalCollectionItemKeys.ident,
        });
    }

    protected _expandKey(key: CrudEntityKey): void {
        if (key != null && !this._expandedKeys.has(key)) {
            this._changes.push({
                name: ListChangeNameEnum.EXPAND,
                args: {
                    keys: [key],
                },
            });
        }
        this._expandedKeys.add(key);
    }

    protected _collapseKey(key: CrudEntityKey): void {
        if (key != null && this._expandedKeys.has(key)) {
            this._changes.push({
                name: ListChangeNameEnum.COLLAPSE,
                args: {
                    keys: [key],
                },
            });
        }
        this._expandedKeys.delete(key);
    }

    protected _select(key: CrudEntityKey, value: IExternalSelectStatus): void {
        if (!this._selectedKeys.has(key) && value === IExternalSelectStatus.UNSET) {
            this._selectedKeys.set(key, value);
            return;
        }
        if (this._selectedKeys.get(key) !== value) {
            let selectionModel: Map<CrudEntityKey, boolean | null>;
            const lastChange = this._changes.length
                ? this._changes[this._changes.length - 1]
                : null;
            if (lastChange?.name === ListChangeNameEnum.SET_SELECTED) {
                selectionModel = lastChange.args.selectionModel;
            } else {
                selectionModel = new Map();
                this._changes.push({
                    name: ListChangeNameEnum.SET_SELECTED,
                    args: {
                        selectionModel,
                    },
                });
            }

            selectionModel.set(
                key,
                value === IExternalSelectStatus.SET
                    ? true
                    : value === IExternalSelectStatus.UNSET
                    ? false
                    : null
            );
        }
        this._selectedKeys.set(key, value);
    }

    protected _mark(key: CrudEntityKey | undefined): void {
        this._changes.push({
            name: ListChangeNameEnum.MOVE_MARKER,
            args: {
                from: this._markedKey ?? undefined,
                to: key ?? undefined,
            },
        });
        this._markedKey = key;
    }

    protected _processAddedItem(item: Model): void {
        const isExpanded = item.get(ExternalCollectionItemKeys.is_expanded) as boolean;
        const isMarked = item.get(ExternalCollectionItemKeys.is_marked) as boolean;
        const selectStatus = item.get(
            ExternalCollectionItemKeys.is_selected
        ) as IExternalSelectStatus;
        const ident = item.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

        if (isExpanded) {
            this._expandKey(ident);
        } else if (!isExpanded) {
            this._collapseKey(ident);
        }
        this._select(ident, selectStatus);
        if (isMarked) {
            this._mark(ident);
        }
    }

    protected _processRemovedItem(key: CrudEntityKey): void {
        this._collapseKey(key);
        if (this._markedKey === key) {
            this._mark(undefined);
        }
        this._select(key, IExternalSelectStatus.UNSET);
    }

    protected _resetComputedState() {
        this._expandedKeys = new Set();
        this._selectedKeys = new Map();
        this._markedKey = undefined;
    }

    protected _setInHasMoreStorage(
        key: CrudEntityKey | null,
        { forward, backward }: { forward: boolean; backward: boolean }
    ) {
        // TODO. hasMoreStorage - ключи типа number и null приводятся к string,
        //  т.к. ключ в обычном объекте это string
        const prevForward = this._hasMoreStorage?.[`${key}`]?.forward;
        const prevBackward = this._hasMoreStorage?.[`${key}`]?.backward;
        if (prevForward === forward && prevBackward === backward) {
            return;
        }
        this._hasMoreStorage = {
            ...this._hasMoreStorage,
            [`${key}`]: {
                forward,
                backward,
            },
        };
        this._changes.push({
            name: ListChangeNameEnum.SET_HAS_MORE,
            args: {
                hasMoreStorage: this._hasMoreStorage,
            },
        });
    }

    sync({
        collection,
        hasMoreStorage,
    }: {
        collection: ICollection | ITreeGridCollection;
        hasMoreStorage?: IHasMoreStorage;
    }): void {
        const recordSet = collection.getCollection();

        this._hasMoreStorage = hasMoreStorage;
        this._recordSet = recordSet;
        this._changes = [];
        this._keys = [];
        this._root = (collection as unknown as ITreeGridCollection).getRoot?.()?.key;

        this._resetComputedState();

        recordSet.forEach((item) => {
            const key = item.getKey();
            this._keys.push(key);

            const isExpanded = item.get(ExternalCollectionItemKeys.is_expanded);
            const isMarked = item.get(ExternalCollectionItemKeys.is_marked);
            const selectStatus = item.get(ExternalCollectionItemKeys.is_selected);

            if (isExpanded) {
                this._expandedKeys.add(key);
            }
            if (isMarked) {
                this._markedKey = key;
            }
            this._selectedKeys.set(key, selectStatus);
        });
    }

    getExpandedKeys(): Set<CrudEntityKey> {
        return this._expandedKeys;
    }

    getKeyByIndex(index: number): CrudEntityKey {
        return this._keys[index];
    }

    getChanges(): IListChange[] {
        return this._changes;
    }

    addMany(recordSet: IStompEventByType<IStompEventType.OnAdd>['args']): void {
        recordSet.forEach((iterator) => {
            const newIndex = iterator.get('index');
            const newItem = this._prepareItem(iterator.get('item'));
            const newKey = newItem.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

            const prevKeyByNewIndex = this._keys[newIndex];
            if (prevKeyByNewIndex === undefined) {
                const anchorKey =
                    this._keys.length === 0
                        ? FirstItemKeySymbol
                        : this._keys[this._keys.length - 1];
                this._keys.push(newKey);
                const lastChange = this._changes.length
                    ? this._changes[this._changes.length - 1]
                    : null;
                if (
                    lastChange?.name === ListChangeNameEnum.APPEND_ITEMS &&
                    !lastChange.args.items.has(anchorKey)
                ) {
                    lastChange.args.items.set(anchorKey, newItem);
                } else {
                    this._changes.push({
                        name: ListChangeNameEnum.APPEND_ITEMS,
                        args: {
                            items: new Map([[anchorKey, newItem]]),
                            changeSource: ListChangeSourceEnum.EXTERNAL,
                        },
                    });
                }
            } else {
                this._keys.splice(newIndex, 0, newKey);
                const lastChange = this._changes.length
                    ? this._changes[this._changes.length - 1]
                    : null;
                if (
                    lastChange?.name === ListChangeNameEnum.PREPEND_ITEMS &&
                    !lastChange.args.items.has(prevKeyByNewIndex)
                ) {
                    lastChange.args.items.set(prevKeyByNewIndex, newItem);
                } else {
                    this._changes.push({
                        name: ListChangeNameEnum.PREPEND_ITEMS,
                        args: {
                            items: new Map([[prevKeyByNewIndex, newItem]]),
                            changeSource: ListChangeSourceEnum.EXTERNAL,
                        },
                    });
                }
            }
            this._processAddedItem(newItem);
        });
    }

    removeMany(recordSet: IStompEventByType<IStompEventType.OnRemove>['args']): void {
        const change: IListChange = {
            name: ListChangeNameEnum.REMOVE_ITEMS,
            args: {
                keys: [],
                changeSource: ListChangeSourceEnum.EXTERNAL,
            },
        };
        recordSet.forEach((iterator) => {
            const index = iterator.get('index');
            const prevKeyByIndex = this._keys[index];
            if (prevKeyByIndex === undefined) {
                return;
            }
            change.args.keys.push(prevKeyByIndex);
            this._keys.splice(index, 1);
            this._processRemovedItem(prevKeyByIndex);
        });
        if (change.args.keys.length) {
            this._changes.push(change);
        }
    }

    replaceMany(recordSet: IStompEventByType<IStompEventType.OnReplace>['args']): void {
        const change: IListChange = {
            name: ListChangeNameEnum.REPLACE_ITEMS,
            args: {
                items: new Map(),
                changeSource: ListChangeSourceEnum.EXTERNAL,
            },
        };

        const addedItems: Model[] = [];
        recordSet.forEach((iterator) => {
            const index = iterator.get('index');
            const newItem = this._prepareItem(iterator.get('item'));
            const newKey = newItem.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

            const prevKeyByIndex = this._keys[index];
            if (prevKeyByIndex === undefined) {
                return;
            }

            this._keys[index] = newKey;

            change.args.items.set(prevKeyByIndex, newItem);
            if (prevKeyByIndex !== newKey) {
                this._processRemovedItem(prevKeyByIndex);
            }
            addedItems.push(newItem);
        });
        if (change.args.items.size) {
            this._changes.push(change);
        }
        addedItems.forEach((item) => this._processAddedItem(item));
    }

    replaceAll(recordSet: IStompEventByType<IStompEventType.OnReset>['args']): void {
        const items = new RecordSet({
            keyProperty: ExternalCollectionItemKeys.ident,
        });
        this._keys = [];
        this._resetComputedState();

        recordSet.forEach((iterator) => {
            const item = this._prepareItem(iterator);
            const key = item.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;
            items.add(item);
            this._keys.push(key);
        });

        this._changes.push({
            name: ListChangeNameEnum.REPLACE_ALL_ITEMS,
            args: {
                items,
            },
        });

        items.forEach((item) => this._processAddedItem(item));
    }

    selectMany(recordSet: IStompEventByType<IStompEventType.OnSelect>['args']): void {
        const change: IListChange = {
            name: ListChangeNameEnum.SET_SELECTED,
            args: {
                selections: new Map(),
            },
        };
        recordSet.forEach((iterator) => {
            const pos = iterator.get('pos');
            const status: IExternalSelectStatus = iterator.get('selection_status');

            const key = this._keys[pos];
            const value: boolean | null =
                status === IExternalSelectStatus.SET
                    ? true
                    : status === IExternalSelectStatus.UNSET
                    ? false
                    : null;
            change.args.selections.set(key, value);
            const item = this._recordSet.at(pos);
            if (item) {
                const clone = item.clone();
                clone.set(ExternalCollectionItemKeys.is_selected, status);
                this._changes.push({
                    name: ListChangeNameEnum.REPLACE_ITEMS,
                    args: {
                        items: new Map([[key, clone]]),
                        changeSource: ListChangeSourceEnum.EXTERNAL,
                    },
                });
            }
        });
        if (change.args.selections.size) {
            this._changes.push(change);
        }
    }

    mark(recordSet: IStompEventByType<IStompEventType.OnMark>['args']): void {
        const fromIndex: number = recordSet.get('disable');
        const toIndex: number = recordSet.get('enable');

        const from = this._keys[fromIndex];
        const to = this._keys[toIndex];

        const replaceChange: IListChange = {
            name: ListChangeNameEnum.REPLACE_ITEMS,
            args: {
                items: new Map(),
                changeSource: ListChangeSourceEnum.EXTERNAL,
            },
        };
        const fromItem = this._recordSet.at(fromIndex);
        if (fromItem) {
            const clone = fromItem.clone();
            clone.set(ExternalCollectionItemKeys.is_marked, false);
            replaceChange.args.items.set(from, clone);
        }
        const toItem = this._recordSet.at(toIndex);
        if (toItem) {
            const clone = toItem.clone();
            clone.set(ExternalCollectionItemKeys.is_marked, true);
            replaceChange.args.items.set(to, clone);
        }
        if (replaceChange.args.items.size) {
            this._changes.push(replaceChange);
        }

        if ((from || to) != null) {
            this._changes.push({
                name: ListChangeNameEnum.MOVE_MARKER,
                args: {
                    from,
                    to,
                },
            });
        }
    }

    replacePath(recordSet: IStompEventByType<IStompEventType.OnPath>['args']): void {
        const path: Model[] = [];

        recordSet.forEach((iterator) => path.push(this._prepareItem(iterator)));

        const root = (path[path.length - 1]?.get?.(ExternalCollectionItemKeys.ident) ??
            null) as CrudEntityKey | null;

        this._setInHasMoreStorage(this._root, { forward: false, backward: false });

        this._changes.push({
            name: ListChangeNameEnum.REPLACE_PATH,
            args: {
                path,
            },
        });
        this._changes.push({
            name: ListChangeNameEnum.CHANGE_ROOT,
            args: {
                key: root,
            },
        });

        this._root = root;
    }

    end(recordSet: IStompEventByType<IStompEventType.End>['args']): void {
        const data = recordSet;
        if (!(data instanceof SbisRecord)) {
            return;
        }
        const ident = data.get('ident');
        const forward = data.get('forward');
        const backward = data.get('backward');
        this._setInHasMoreStorage(ident, {
            backward,
            forward,
        });
    }
}
