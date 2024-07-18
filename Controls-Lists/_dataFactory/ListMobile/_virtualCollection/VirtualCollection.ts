import type { Collection as ICollection } from 'Controls/display';
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import type { IListChange } from 'Controls/abstractListAspect';
import { ListChangeNameEnum } from 'Controls/abstractListAspect';

import { Model, Record as SbisRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { FirstItemKeySymbol, ListChangeSourceEnum } from 'Controls/itemsListAspect';
import {
    BREADCRUMBS_DISPLAY_PROPERTY,
    CollectionItemModule,
    ExternalCollectionItemKeys,
    IExternalCollectionItem,
    IExternalDecoratedModel,
    IExternalSelectStatus,
    IStompEventByType,
    IStompEventType,
} from '../_interface/IExternalTypes';
import { isEqual } from 'Types/object';

const STUB_IDENT_PREFIX = 'stub-to-';

interface IVirtualCollectionProps {
    parentProperty?: string;
    displayProperty: string;
    model?: typeof Model;

    // Только ради крошек
    _getFilter: () => Record<string, unknown>;
}

/**
 * Класс реализующий расчет универсальных ListChange-s, с учетом сдвига ключей при работе с индексами.
 * @class Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection
 * @see Controls-Lists
 * @private
 */
export class VirtualCollection {
    private readonly props: IVirtualCollectionProps;

    protected _keys: CrudEntityKey[];
    protected _expandedKeys: Set<CrudEntityKey>;
    protected _selectedKeys: Map<CrudEntityKey, IExternalSelectStatus>;
    protected _markedKey: CrudEntityKey | undefined;
    protected _hasMoreStorage?: IHasMoreStorage;
    protected _changes: IListChange[];
    protected _recordSet: RecordSet;
    protected _root: CrudEntityKey | null;
    private readonly _model: typeof Model;

    constructor(props: IVirtualCollectionProps) {
        this.props = props;

        const { model = Model } = this.props;
        this._model = model;
    }

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

            if (name === 'origin' || name === 'stub') {
                // FIXME:
                //  Во-первых, зачем тут приведение к плоскому виду, собранному из
                //  системных и несистемных полей?
                //  Во-вторых, этот формат должен быть 1 на RS, т.е. его нужно аккумулировать.
                //  Сейчас этого нет.
                //  В-третьих, тут нужно разбирать айтем, отличать данные от кнопки еще,
                //  крошек, тробблеров, разделителей и т.д.
                if (value) {
                    const origin = value as SbisRecord;
                    origin.getFormat(true).each((originField) => {
                        const originFieldName = originField.getName();
                        format.push({
                            name: originFieldName,
                            type: originField.getType(),
                        });
                        rawData[originFieldName] = origin.get(originFieldName);
                    });
                }
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

        format.push({
            name: ExternalCollectionItemKeys.module,
            type: 'string',
        });

        if (record.get('stub') && !record.get('origin')) {
            rawData[ExternalCollectionItemKeys.module] = CollectionItemModule.HasMoreFooter;
        } else {
            rawData[ExternalCollectionItemKeys.module] = CollectionItemModule.Data;
        }

        return new this._model({
            format,
            rawData,
            keyProperty: ExternalCollectionItemKeys.ident,
        });
    }

    private _prepareBreadcrumbItems(recordSet: RecordSet<IExternalCollectionItem>): Model[] {
        const path: Model[] = [];

        recordSet.forEach((rawItem, index) => {
            const item = this._prepareItem(rawItem);

            // Прилетает название в другом поле, название которого !== displayProperty
            // https://online.sbis.ru/opendoc.html?guid=d17143f3-0c30-44d8-a883-e7d7483c7d73&client=3
            item.set(this.props.displayProperty, item.get(BREADCRUMBS_DISPLAY_PROPERTY));

            // Костыль для клиентов пока, по задаче будем решать как лучше поступать.
            // https://online.sbis.ru/opendoc.html?guid=8a7cfed2-bac6-4a04-a5bc-02cf6dc3e3a2&client=3
            // https://online.sbis.ru/opendoc.html?guid=14dd16d8-aecb-417e-81cb-7dc2e42b0cfa&client=3
            item.set(
                ExternalCollectionItemKeys.parent,
                index === 0
                    ? this.props._getFilter()['Root']
                    : path[index - 1].get(ExternalCollectionItemKeys.ident)
            );

            path.push(item);
        });

        return path;
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
                        selectionObject: {
                            selected: [],
                            excluded: [],
                            recursive: false,
                        },
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

    protected _updateHasMoreStorage(
        key: CrudEntityKey | null,
        { forward, backward }: { forward: boolean; backward: boolean }
    ) {
        this._setHasMoreStorage({
            ...this._hasMoreStorage,
            [`${key}`]: {
                forward,
                backward,
            },
        });
    }

    private _setHasMoreStorage(newHasMoreStorage: IHasMoreStorage) {
        if (!isEqual(this._hasMoreStorage, newHasMoreStorage)) {
            this._hasMoreStorage = newHasMoreStorage;
            this._changes.push({
                name: ListChangeNameEnum.SET_HAS_MORE,
                args: {
                    hasMoreStorage: this._hasMoreStorage,
                },
            });
        }
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

    getIndexByKey(key: CrudEntityKey): number {
        return this._keys.indexOf(key);
    }

    getChanges(): IListChange[] {
        return this._changes;
    }

    addMany(recordSet: IStompEventByType<IStompEventType.OnAdd>['args']): void {
        recordSet.forEach((iterator) => {
            const newIndex = iterator.get('index');
            const collectionItem = iterator.get('item');
            const newItem = this._prepareItem(iterator.get('item'));
            this._prepareStubIdent(collectionItem, newItem);
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
                index: recordSet.at(0).get('index'),
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
            const collectionItem = iterator.get('item');
            const newItem = this._prepareItem(collectionItem);
            this._prepareStubIdent(collectionItem, newItem);
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
            model: this._model,
        });
        this._keys = [];
        this._resetComputedState();

        recordSet.forEach((iterator) => {
            const item = this._prepareItem(iterator);
            this._prepareStubIdent(iterator, item);
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
                selectionModel: new Map(),
                selectionObject: {
                    selected: [],
                    excluded: [],
                    recursive: false,
                },
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
            change.args.selectionModel.set(key, value);
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
        if (change.args.selectionModel.size) {
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
        const path: Model[] = this._prepareBreadcrumbItems(recordSet);

        const root = (path[path.length - 1]?.get?.(ExternalCollectionItemKeys.ident) ??
            null) as CrudEntityKey | null;

        this._updateHasMoreStorage(this._root, { forward: false, backward: false });

        this._changes.push({
            name: ListChangeNameEnum.REPLACE_PATH,
            args: {
                path,
            },
        });
        this.changeRoot(root);
    }

    changeRoot(root: CrudEntityKey | null): void {
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
        const forward = data.get('forward');
        const backward = data.get('backward');

        const hasMoreForNodes = this._keys
            .filter((key) => `${key}`.startsWith(STUB_IDENT_PREFIX))
            .map((key) => `${key}`.replace(STUB_IDENT_PREFIX, ''))
            .reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: { backward: false, forward: true },
                }),
                {} as IHasMoreStorage
            );

        this._setHasMoreStorage({
            [this._root as string]: {
                backward,
                forward,
            },
            ...hasMoreForNodes,
        });
    }

    _prepareStubIdent(
        originCollectionItem: SbisRecord<IExternalCollectionItem>,
        preparedCollectionItem: Model<IExternalDecoratedModel>
    ) {
        const stub = originCollectionItem.get('stub');
        if (stub && !originCollectionItem.get('origin')) {
            const key = `${STUB_IDENT_PREFIX}${this._keys[stub.get('pos')]}`;
            preparedCollectionItem.set(ExternalCollectionItemKeys.ident, key);
        }
    }
}
