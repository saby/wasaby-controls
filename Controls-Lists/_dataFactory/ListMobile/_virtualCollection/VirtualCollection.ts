import type { Collection as ICollection } from 'Controls/display';
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import type {
    IGetListChangeByName,
    IListChange,
    THighlightedFieldsMap,
    THighlightedValues,
} from 'Controls/listAspects';
import {
    FirstItemKeySymbol,
    ListChangeNameEnum,
    ListChangeSourceEnum,
    TVisibility as TOperationsPanelVisibility,
} from 'Controls/listAspects';

import { format as formatLib, Model, Record as SbisRecord, adapter } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    BREADCRUMBS_DISPLAY_PROPERTY,
    CollectionItemFormat,
    CollectionItemKeys,
    CollectionItemModule,
    ExternalCollectionItemKeys,
    ExternalSelectStatus,
    IExternalCollectionItem,
    IExternalDecoratedModel,
    IStompEventByType,
    StompEventType,
} from '../_interface/IExternalTypes';
import { isEqual } from 'Types/object';

const STUB_IDENT_PREFIX = 'stub-to-';

interface IVirtualCollectionProps {
    displayProperty: string;
    model?: typeof Model;

    // Пока данные не присылают нормально разметку
    _getSearchValue?: () => string;
}

const SELECTION_ON_MODEL_BY_STATUS = {
    [ExternalSelectStatus.SET]: true,
    [ExternalSelectStatus.UNSET]: false,
    [ExternalSelectStatus.ACTIVE]: null,
};

/**
 * Класс реализующий расчет универсальных ListChange-s, с учетом сдвига ключей при работе с индексами.
 * @class Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection
 * @see Controls-Lists
 * @private
 */
export class VirtualCollection {
    private readonly props: IVirtualCollectionProps;
    private readonly _model: typeof Model;

    private _keys: CrudEntityKey[] = [];
    private _changes: IListChange[] = [];
    private _stub?: {
        position: number;
        type: number;
    };
    private _expandedKeys: Set<CrudEntityKey> = new Set();
    private _selectedKeys: Map<CrudEntityKey, ExternalSelectStatus> = new Map();
    private _highlightedFields: THighlightedFieldsMap = new Map();
    private _hasMoreStorage?: IHasMoreStorage = Object.create(null);
    private _expansionModel: Map<CrudEntityKey, boolean> = new Map();

    protected _markedKey: CrudEntityKey | undefined;
    protected _recordSet: RecordSet;
    protected _root: CrudEntityKey | null;

    constructor(props: IVirtualCollectionProps) {
        this.props = props;

        const { model = Model } = this.props;
        this._model = model;
    }

    protected _prepareItem(
        record: SbisRecord<IExternalCollectionItem>,
        originFormat: () => formatLib.IFieldDeclaration[],
        stubFormat: () => formatLib.IFieldDeclaration[]
    ): Model<IExternalDecoratedModel> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const format: any[] = [];
        const rawData: Record<string, unknown> = {};

        CollectionItemFormat.forEach((fieldFormat) => {
            const value = record.get(fieldFormat.name as keyof IExternalCollectionItem);

            if (fieldFormat.name === 'origin' || fieldFormat.name === 'stub') {
                // FIXME:
                //  Во-первых, зачем тут приведение к плоскому виду, собранному из
                //  системных и несистемных полей?
                //  Во-вторых, этот формат должен быть 1 на RS, т.е. его нужно аккумулировать.
                //  Сейчас этого нет.
                //  В-третьих, тут нужно разбирать айтем, отличать данные от кнопки еще,
                //  крошек, тробблеров, разделителей и т.д.
                if (value) {
                    const subFormat =
                        (fieldFormat.name === 'origin' ? originFormat() : stubFormat()) || [];

                    for (let i = 0; i < subFormat.length; i++) {
                        format.push(subFormat[i]);
                        rawData[subFormat[i].name] = (value as SbisRecord).get(subFormat[i].name);
                    }
                }
            } else if (fieldFormat.name in ExternalCollectionItemKeys) {
                const replacedName = ExternalCollectionItemKeys[fieldFormat.name];
                rawData[replacedName] = value;
                format.push({
                    ...fieldFormat,
                    name: replacedName,
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

    private _prepareBreadcrumbItems(recordSet: RecordSet<SbisRecord>): Model[] {
        const path: {}[] = [];

        for (let i = 0; i < recordSet.getCount(); i++) {
            const rawItem = recordSet.at(i);
            const rawData = {
                // Прилетает название в другом поле, название которого !== displayProperty
                // https://online.sbis.ru/opendoc.html?guid=d17143f3-0c30-44d8-a883-e7d7483c7d73&client=3
                // @ts-ignore
                [ExternalCollectionItemKeys.ident]: rawItem.get(CollectionItemKeys.ident),
                // @ts-ignore
                [this.props.displayProperty]: rawItem.get(BREADCRUMBS_DISPLAY_PROPERTY),
            };

            if (i > 0) {
                // Крошки работают по иерархии, а интерактор нет. Строим ее.
                rawData[ExternalCollectionItemKeys.parent] =
                    // @ts-ignore
                    path[i - 1][ExternalCollectionItemKeys.ident];
            }

            path.push(rawData);
        }

        return path.map(
            (rawData) =>
                new Model({
                    keyProperty: ExternalCollectionItemKeys.ident,
                    rawData,
                })
        );
    }

    private _setExpansionModel(key: CrudEntityKey, value: boolean): void {
        this._expansionModel.set(key, value);
        let change = this._getLastChange(ListChangeNameEnum.SET_EXPANSION_MODEL);
        if (change) {
            change.args.expansionModel = this._expansionModel;
        } else {
            change = {
                name: ListChangeNameEnum.SET_EXPANSION_MODEL,
                args: {
                    expansionModel: this._expansionModel,
                },
            };
            if (key != null) this._changes.push(change);
        }
    }

    protected _toggleExpansion(key: CrudEntityKey, value: boolean): void {
        if (this._expansionModel.get(key) === value) return;
        if (value) {
            this._setExpansionModel(key, true);
        } else if (!value && this._expansionModel.has(key)) {
            this._setExpansionModel(key, false);
        }
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

    protected _setHighlightedFields(key: CrudEntityKey, value: THighlightedValues) {
        if (!this._highlightedFields.has(key) && !value.length) {
            this._highlightedFields.set(key, []);
            return;
        }

        if (this._highlightedFields.get(key) !== value) {
            let highlightedFieldsMap: THighlightedFieldsMap;
            const lastChange = this._getLastChange(ListChangeNameEnum.CHANGE_HIGHLIGHTED_FIELDS);

            if (lastChange) {
                highlightedFieldsMap = lastChange.args.highlightedFieldsMap;
            } else {
                highlightedFieldsMap = new Map();
                this._changes.push({
                    name: ListChangeNameEnum.CHANGE_HIGHLIGHTED_FIELDS,
                    args: {
                        highlightedFieldsMap,
                    },
                });
            }

            highlightedFieldsMap.set(key, value);
        }
        this._highlightedFields.set(key, value);
    }

    protected _select(key: CrudEntityKey, value: ExternalSelectStatus): void {
        if (!this._selectedKeys.has(key) && value === ExternalSelectStatus.UNSET) {
            this._selectedKeys.set(key, value);
            return;
        }
        if (this._selectedKeys.get(key) !== value) {
            let selectionModel: Map<CrudEntityKey, boolean | null>;
            let change = this._getLastChange(ListChangeNameEnum.SET_SELECTION_MAP);

            if (change) {
                selectionModel = change.args.selectionModel;
            } else {
                selectionModel = new Map();
                change = {
                    name: ListChangeNameEnum.SET_SELECTION_MAP,
                    args: {
                        selectionModel,
                    },
                };
                this._changes.push(change);
            }

            selectionModel.set(key, SELECTION_ON_MODEL_BY_STATUS[value]);

            if (Array.from(change.args.selectionModel.values()).find((status) => !!status)) {
                this.openOperationsPanel();
            }
        }
        this._selectedKeys.set(key, value);
    }

    protected _mark(
        toKey: CrudEntityKey | undefined,
        fromKey: CrudEntityKey | undefined = this._markedKey ?? undefined
    ): void {
        this._changes.push({
            name: ListChangeNameEnum.MOVE_MARKER,
            args: {
                from: fromKey,
                to: toKey ?? undefined,
            },
        });
        this._markedKey = toKey;
    }

    protected _processAddedItem(item: Model): void {
        const isExpanded = item.get(ExternalCollectionItemKeys.is_expanded) as boolean;
        const isMarked = item.get(ExternalCollectionItemKeys.is_marked) as boolean;
        const selectStatus = item.get(
            ExternalCollectionItemKeys.is_selected
        ) as ExternalSelectStatus;
        const ident = item.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

        if (isExpanded) {
            this._expandKey(ident);
        } else if (!isExpanded) {
            this._collapseKey(ident);
        }
        this._toggleExpansion(ident, isExpanded);
        this._select(ident, selectStatus);
        this._setHighlightedFields(ident, this._getItemsHighlightedFields(item));
        if (isMarked) {
            this._mark(ident);
        }
    }

    private _getItemsHighlightedFields(_item: Model): string[] {
        const searchValue = this.props._getSearchValue?.();
        return searchValue ? [searchValue] : [];
    }

    protected _processRemovedItem(key: CrudEntityKey): void {
        this._collapseKey(key);
        this._toggleExpansion(key, false);
        if (this._markedKey === key) {
            this._mark(undefined);
        }
        this._select(key, ExternalSelectStatus.UNSET);
        this._setHighlightedFields(key, []);
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

    // TODO: Метод кажется костылём.
    sync({
        collection,
        hasMoreStorage,
    }: {
        collection: ICollection | ITreeGridCollection;
        hasMoreStorage?: IHasMoreStorage;
    }): void {
        this._recordSet = collection.getCollection();
        this._hasMoreStorage = hasMoreStorage;
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

    addMany(recordSet: IStompEventByType<StompEventType.OnAdd>['args']): void {
        const pairs: [index: number, collectionItem: SbisRecord<IExternalCollectionItem>][] = [];

        for (let i = 0; i < recordSet.getCount(); i++) {
            const item = recordSet.at(i);
            pairs.push([item.get('index'), item.get('item')]);
        }

        const records = pairs.map(([_, item]) => item);
        const originFormatGetter = getSubFormatGetter(records, CollectionItemKeys.origin);
        const stubFormatGetter = getSubFormatGetter(records, CollectionItemKeys.stub);

        pairs.forEach(([newIndex, collectionItem]) => {
            const newItem = this._prepareItem(collectionItem, originFormatGetter, stubFormatGetter);
            this._prepareStubIdent(collectionItem, newItem);
            const newKey = newItem.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

            const prevKeyByNewIndex = this._keys[newIndex];
            if (prevKeyByNewIndex === undefined) {
                const anchorKey =
                    this._keys.length === 0
                        ? FirstItemKeySymbol
                        : this._keys[this._keys.length - 1];
                this._keys.push(newKey);
                const lastChange = this._getLastChange(ListChangeNameEnum.APPEND_ITEMS);

                if (lastChange && !lastChange.args.items.has(anchorKey)) {
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
                const lastChange = this._getLastChange(ListChangeNameEnum.PREPEND_ITEMS);
                if (lastChange && !lastChange.args.items.has(prevKeyByNewIndex)) {
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

    removeMany(recordSet: IStompEventByType<StompEventType.OnRemove>['args']): void {
        const change: IListChange = {
            name: ListChangeNameEnum.REMOVE_ITEMS,
            args: {
                keys: [],
                changeSource: ListChangeSourceEnum.EXTERNAL,
                index: recordSet.at(0).get('index'),
            },
        };
        const indexes: number[] = [];

        recordSet.forEach((iterator) => {
            indexes.push(iterator.get('index'));
        });

        if (this._stub) {
            for (let i = 0; i < indexes.length; i++) {
                if (indexes[i] === this._stub.position) {
                    indexes.splice(i, 1);
                    i--;
                } else if (indexes[i] > this._stub.position) {
                    indexes[i]--;
                }
            }
        }

        indexes.forEach((index) => {
            const prevKeyByIndex = this._keys[index];
            if (prevKeyByIndex === undefined) {
                return;
            }
            change.args.keys.push(prevKeyByIndex);
            this._keys.splice(index, 1);

            if (this._keys.indexOf(prevKeyByIndex) === -1) {
                this._processRemovedItem(prevKeyByIndex);
            }
        });
        if (change.args.keys.length) {
            this._changes.push(change);
        }
    }

    replaceMany(recordSet: IStompEventByType<StompEventType.OnReplace>['args']): void {
        const change: IListChange = {
            name: ListChangeNameEnum.REPLACE_ITEMS,
            args: {
                items: new Map(),
                changeSource: ListChangeSourceEnum.EXTERNAL,
            },
        };

        const addedItems: Model[] = [];

        const pairs: [index: number, collectionItem: SbisRecord<IExternalCollectionItem>][] = [];

        for (let i = 0; i < recordSet.getCount(); i++) {
            const item = recordSet.at(i);
            pairs.push([item.get('index'), item.get('item')]);
        }

        const records = pairs.map(([_, item]) => item);
        const originFormatGetter = getSubFormatGetter(records, CollectionItemKeys.origin);
        const stubFormatGetter = getSubFormatGetter(records, CollectionItemKeys.stub);

        pairs.forEach(([index, collectionItem]) => {
            const newItem = this._prepareItem(collectionItem, originFormatGetter, stubFormatGetter);
            this._prepareStubIdent(collectionItem, newItem);
            const newKey = newItem.get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

            const prevKeyByIndex = this._keys[index];
            if (prevKeyByIndex === undefined) {
                return;
            }

            if (prevKeyByIndex !== newKey) {
                this._processRemovedItem(prevKeyByIndex);
            }
            if (this._keys.indexOf(newKey) !== -1) {
                this._processRemovedItem(newKey);
            }

            this._keys[index] = newKey;

            change.args.items.set(prevKeyByIndex, newItem);

            addedItems.push(newItem);
            if (this._stub && index === this._stub.position) {
                this.removeStub();
            }
        });
        if (change.args.items.size) {
            this._changes.push(change);
        }
        addedItems.forEach((item) => this._processAddedItem(item));
    }

    replaceAll(recordSet: IStompEventByType<StompEventType.OnReset>['args']): void {
        const items = new RecordSet<Model>({
            keyProperty: ExternalCollectionItemKeys.ident,
            model: this._model,
        });
        this._keys.forEach((key) => this._processRemovedItem(key));
        this._keys = [];
        this.removeStub();
        this._mark(undefined);

        const records: SbisRecord<IExternalCollectionItem>[] = [];

        for (let i = 0; i < recordSet.getCount(); i++) {
            records.push(recordSet.at(i));
        }

        const originFormatGetter = getSubFormatGetter(records, CollectionItemKeys.origin);
        const stubFormatGetter = getSubFormatGetter(records, CollectionItemKeys.stub);

        for (let i = 0; i < records.length; i++) {
            const item = this._prepareItem(records[i], originFormatGetter, stubFormatGetter);
            this._prepareStubIdent(records[i], item);
            this._keys.push(item.get(ExternalCollectionItemKeys.ident) as CrudEntityKey);
            items.add(item);
        }

        this._changes.push({
            name: ListChangeNameEnum.REPLACE_ALL_ITEMS,
            args: {
                items: items as unknown as RecordSet<Record<string, unknown>>,
            },
        });

        items.forEach((item) => this._processAddedItem(item));
    }

    selectMany(recordSet: IStompEventByType<StompEventType.OnSelect>['args']): void {
        recordSet.forEach((iterator) => {
            const pos = iterator.get('pos');
            const key = this._keys[pos];
            const status: ExternalSelectStatus = iterator.get('selection_status');
            const item = this._recordSet.at(pos);

            this._select(key, status);

            // TODO: Лишний код, удалить.
            //  Побочным эффектом будет неактуальность is_selected на CollectionItem,
            //  но это нормально и уйдет когда коллекция станет "глупой"
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
    }

    mark(recordSet: IStompEventByType<StompEventType.OnMark>['args']): void {
        const fromIndex: number = recordSet.get('disable');
        const toIndex: number = recordSet.get('enable');

        const from = this._keys[fromIndex];
        const to = this._keys[toIndex];

        // TODO: Лишний код, удалить.
        //  Побочным эффектом будет неактуальность is_selected на CollectionItem,
        //  но это нормально и уйдет когда коллекция станет "глупой"
        const replaceChange: IListChange = {
            name: ListChangeNameEnum.REPLACE_ITEMS,
            args: {
                items: new Map(),
                changeSource: ListChangeSourceEnum.EXTERNAL,
            },
        };
        if (from !== undefined) {
            const fromItem = this._recordSet.at(fromIndex);
            if (fromItem) {
                const clone = fromItem.clone();
                clone.set(ExternalCollectionItemKeys.is_marked, false);
                replaceChange.args.items.set(from, clone);
            }
        }
        if (to !== undefined) {
            const toItem = this._recordSet.at(toIndex);
            if (toItem) {
                const clone = toItem.clone();
                clone.set(ExternalCollectionItemKeys.is_marked, true);
                replaceChange.args.items.set(to, clone);
            }
        }
        if (replaceChange.args.items.size) {
            this._changes.push(replaceChange);
        }

        this._mark(to, from);
    }

    replacePath(recordSet: IStompEventByType<StompEventType.OnPath>['args']): void {
        const path: Model[] = this._prepareBreadcrumbItems(recordSet);

        // Всегда есть хоть одна крошка, это контракт.
        const root = path[path.length - 1].get(ExternalCollectionItemKeys.ident);

        // Удаляем первую крошку.
        path.splice(0, 1);

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

    getRoot(): CrudEntityKey | null {
        return this._root;
    }

    addStub(record: IStompEventByType<StompEventType.OnAddStub>['args']) {
        this.replaceAll(new RecordSet({}));

        this._stub = {
            position: record.get('position'),
            type: record.get('stub_type'),
        };

        this._changes.push({
            name: ListChangeNameEnum.ADD_STUB,
            args: {},
        });
    }

    removeStub() {
        if (!this._stub) {
            return;
        }

        this._stub = undefined;

        this._changes.push({
            name: ListChangeNameEnum.REMOVE_STUB,
            args: {},
        });
    }

    end(recordSet: IStompEventByType<StompEventType.End>['args']): void {
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

    resetChanges(): void {
        this._changes = [];
    }

    openOperationsPanel() {
        this._toggleOperationsPanelVisibility('visible');
    }

    closeOperationsPanel() {
        this._toggleOperationsPanelVisibility('hidden');
    }

    private _toggleOperationsPanelVisibility(visibility: TOperationsPanelVisibility): void {
        const last = this._getLastChange(ListChangeNameEnum.CHANGE_OPERATIONS_PANEL_VISIBILITY);

        if (last) {
            last.args.visibility = visibility;
        } else {
            this._changes.push({
                name: ListChangeNameEnum.CHANGE_OPERATIONS_PANEL_VISIBILITY,
                args: {
                    visibility,
                },
            });
        }
    }

    private _getLastChange<T extends (typeof ListChangeNameEnum)[keyof typeof ListChangeNameEnum]>(
        name: T,
        predicate?: (value: IGetListChangeByName<T>) => boolean
    ): IGetListChangeByName<T> | void {
        const changes = this._changes.filter((c) => c.name === name);

        if (!changes.length) {
            return undefined;
        }

        const change = changes[changes.length - 1] as IGetListChangeByName<T>;

        if (!predicate) {
            return change;
        }

        return predicate(change) ? change : undefined;
    }

    private _prepareStubIdent(
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

function getSubFormatGetter(
    records: SbisRecord<IExternalCollectionItem>[],
    name: CollectionItemKeys
): () => formatLib.IFieldDeclaration[] | undefined {
    const fn = (): (() => formatLib.IFieldDeclaration[] | undefined) => {
        let format: formatLib.IFieldDeclaration[] | true;

        return () => {
            if (!format) {
                for (let i = 0; i < records.length; i++) {
                    // @ts-ignore
                    const value = records[i].get(name) as SbisRecord;
                    if (value) {
                        let formatCollection = value.getFormat(true);
                        format = [];
                        for (let j = 0; j < formatCollection.getCount(); j++) {
                            format.push(getFormatDescription(formatCollection.at(j)));
                        }
                        break;
                    }
                }

                // Если во всем RecordSet'е нет такого поля, то запоминаем
                // это иначе при каждом вызове будем пытаться найти.
                if (!format) {
                    format = true;
                }
            }

            return format === true ? undefined : format;
        };
    };

    return fn();
}

function getFormatDescription(field: formatLib.Field): formatLib.IFieldDeclaration {
    let format: formatLib.IFieldDeclaration = {
        name: field.getName(),
        type: field.getType(),
        defaultValue: field.getDefaultValue(),
        nullable: field.isNullable(),
    };

    if ((field as formatLib.ArrayField).getKind) {
        format.kind = (field as formatLib.ArrayField).getKind();
    } else if ((field as formatLib.DateTimeField).isWithoutTimeZone) {
        format.withoutTimeZone = (field as formatLib.DateTimeField).isWithoutTimeZone();
    } else if ((field as formatLib.DictionaryField).getLocaleDictionary) {
        format.dictionary = (field as formatLib.DictionaryField).getDictionary();
        format.localeDictionary = (field as formatLib.DictionaryField).getLocaleDictionary();
    } else if ((field as formatLib.MoneyField).isLarge) {
        format.large = (field as formatLib.MoneyField).isLarge();
    } else if ((field as formatLib.RealField).getPrecision) {
        format.precision = (field as formatLib.RealField).getPrecision();
    }

    return format;
}
