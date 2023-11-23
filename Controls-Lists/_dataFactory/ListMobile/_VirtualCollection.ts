import type { Collection as ICollection } from 'Controls/display';
import type { Tree as ITreeCollection } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import type { IListChange } from 'Controls/dataFactory';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { FirstItemKeySymbol, IListChangeName, IListChangeSource } from 'Controls/dataFactory';
import { IExternalSelectStatus } from './_interface/IExternalTypes';

type EntityKey = CrudEntityKey | null;

/**
 * Класс реализующий расчет универсальных ListChange-s, с учетом сдвига ключей при работе с индексами.
 * @class Controls-Lists/_dataFactory/ListMobile/_VirtualCollection
 * @see Controls-Lists
 * @public
 */
export class VirtualCollection {
    protected _keyProperty: string;
    protected _parentProperty: string | undefined;
    protected _items: EntityKey[];
    protected _changes: IListChange[];

    protected _rawItemToModel(item: Record<string, unknown>): Model<Record<string, unknown>> {
        const model = Model.fromObject(item);
        model.setKeyProperty(this._keyProperty);
        return model;
    }

    protected _prepareItem(item: Record<string, unknown>): void {
        if (Array.isArray(item[this._parentProperty])) {
            item[this._parentProperty] = JSON.stringify(item[this._parentProperty]);
        }
        if (Array.isArray(item[this._keyProperty])) {
            item[this._keyProperty] = JSON.stringify(item[this._keyProperty]);
        }
    }

    sync(collection: ICollection): void {
        const keyProperty = collection.getKeyProperty();
        const parentProperty = (collection as unknown as ITreeCollection)?.getParentProperty?.();
        const enumerator = collection.getEnumerator();

        this._keyProperty = keyProperty;
        this._parentProperty = parentProperty;
        this._changes = [];
        this._items = [];

        while (enumerator.moveNext()) {
            this._items.push(enumerator.getCurrent().key);
        }
    }

    getKeyByIndex(index: number): EntityKey | undefined {
        return this._items[index];
    }

    getChanges(): IListChange[] {
        return this._changes;
    }

    addMany(items: { index: number; item: Record<string, unknown> }[]): void {
        const keyProperty = this._keyProperty;
        for (const { index, item } of items) {
            this._prepareItem(item);
            const key = this._items[index];
            if (key === undefined) {
                const newKey =
                    this._items.length === 0
                        ? FirstItemKeySymbol
                        : this._items[this._items.length - 1];
                this._items.push(item[keyProperty] as CrudEntityKey);
                const lastChange = this._changes.length && this._changes[this._changes.length - 1];
                if (lastChange?.name === IListChangeName.APPEND_ITEMS) {
                    lastChange.args.items.set(newKey, this._rawItemToModel(item));
                } else {
                    this._changes.push({
                        name: IListChangeName.APPEND_ITEMS,
                        args: {
                            items: new Map([[newKey, this._rawItemToModel(item)]]),
                            changeSource: IListChangeSource.EXTERNAL,
                        },
                    });
                }
            } else {
                this._items.splice(index, 0, item[keyProperty] as CrudEntityKey);
                const lastChange = this._changes.length && this._changes[this._changes.length - 1];
                if (lastChange?.name === IListChangeName.PREPEND_ITEMS) {
                    lastChange.args.items.set(key, this._rawItemToModel(item));
                } else {
                    this._changes.push({
                        name: IListChangeName.PREPEND_ITEMS,
                        args: {
                            items: new Map([[key, this._rawItemToModel(item)]]),
                            changeSource: IListChangeSource.EXTERNAL,
                        },
                    });
                }
            }
        }
    }

    removeMany(indexes: number[]): void {
        const change: IListChange = {
            name: IListChangeName.REMOVE_ITEMS,
            args: {
                keys: [],
                changeSource: IListChangeSource.EXTERNAL,
            },
        };
        for (const index of indexes) {
            const key = this._items[index];
            if (key === undefined) {
                continue;
            }
            change.args.keys.push(key);
            this._items.splice(index, 1);
        }
        if (change.args.keys.length > 0) {
            this._changes.push(change);
        }
    }

    replaceMany(items: { index: number; item: Record<string, unknown> }[]): void {
        const change: IListChange = {
            name: IListChangeName.REPLACE_ITEMS,
            args: {
                items: new Map([]),
                changeSource: IListChangeSource.EXTERNAL,
            },
        };
        const keyProperty = this._keyProperty;

        for (const { index, item } of items) {
            this._prepareItem(item);
            const prevItem = this._items[index];
            if (prevItem === undefined) {
                continue;
            }
            const key = prevItem;
            this._items[index] = item[keyProperty] as CrudEntityKey | null;
            change.args.items.set(key, this._rawItemToModel(item));
        }

        if (change.args.items.size > 0) {
            this._changes.push(change);
        }
    }

    replaceAll(items: Record<string, unknown>[]): void {
        items.forEach((item) => this._prepareItem(item));
        const keyProperty = this._keyProperty;
        this._items = items.map((item) => item[keyProperty] as EntityKey);
        this._changes.push({
            name: IListChangeName.REPLACE_ALL_ITEMS,
            args: {
                items: new RecordSet({
                    rawData: items,
                    keyProperty,
                }),
            },
        });
    }

    selectMany(items: { pos: number; status: IExternalSelectStatus }[]): void {
        const change: IListChange = {
            name: IListChangeName.SET_SELECTED,
            args: {
                selections: new Map(),
            },
        };
        for (const { pos, status } of items) {
            this._changes.push(change);

            const key = this._items[pos];
            const value: boolean | null =
                status === IExternalSelectStatus.SET
                    ? true
                    : status === IExternalSelectStatus.UNSET
                    ? false
                    : null;
            change.args.selections.set(key, value);
        }
        if (change.args.selections.size > 0) {
            this._changes.push(change);
        }
    }

    mark(fromIndex: number, toIndex: number): void {
        const from = this._items[fromIndex];
        const to = this._items[toIndex];
        if ((from || to) != null) {
            this._changes.push({
                name: IListChangeName.MOVE_MARKER,
                args: {
                    from,
                    to,
                },
            });
        }
    }

    replacePath(path: Record<string, unknown>[]): void {
        path.forEach((item) => this._prepareItem(item));

        const keyProperty = this._keyProperty;
        const key = (path[path.length - 1]?.[keyProperty] ?? null) as EntityKey;

        this._changes.push({
            name: IListChangeName.REPLACE_PATH,
            args: {
                path: path.map((item) => this._rawItemToModel(item)),
            },
        });
        this._changes.push({
            name: IListChangeName.CHANGE_ROOT,
            args: {
                key,
            },
        });
    }
}
