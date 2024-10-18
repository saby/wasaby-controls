/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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

import { format as formatLib, Model, Record as SbisRecord } from 'Types/entity';
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
    IUIEventByType,
    StompEventType,
} from '../_interface/IExternalTypes';
import { isEqual } from 'Types/object';

const STUB_IDENT_PREFIX = 'stub-to-';

interface IVirtualCollectionProps {
    displayProperty: string;
    keyProperty?: string;
    parentProperty: string;
    nodeProperty: string;
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
        stubFormat: () => formatLib.IFieldDeclaration[],
        buildModel = true
    ): [CrudEntityKey, Model<IExternalDecoratedModel>] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const format: any[] = [];
        const rawData: Record<string, unknown> = {};
        let originKey: IExternalCollectionItem['ident'];
        let originParent: IExternalCollectionItem['ident'];

        let stub;
        let hasOrigin = false;

        CollectionItemFormat.forEach((fieldFormat) => {
            const value = record.get(fieldFormat.name as keyof IExternalCollectionItem);

            if (fieldFormat.name === 'origin' || fieldFormat.name === 'stub') {
                if (fieldFormat.name === 'origin' && value) {
                    hasOrigin = true;
                } else {
                    stub = value;
                }
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

                    if (fieldFormat.name === 'origin') {
                        originKey = rawData.__ident;
                        originParent = rawData._parent;
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

        if (stub && !hasOrigin) {
            rawData[ExternalCollectionItemKeys.module] = CollectionItemModule.HasMoreFooter;
        } else {
            rawData[ExternalCollectionItemKeys.module] = CollectionItemModule.Data;
        }

        if (stub && !hasOrigin) {
            originKey = `${STUB_IDENT_PREFIX}${this._keys[stub.get('pos')]}`;
        }

        rawData[ExternalCollectionItemKeys.ident] = originKey;
        rawData[ExternalCollectionItemKeys.parent] = originParent;

        const rawProps = {
            format,
            rawData,
            keyProperty: ExternalCollectionItemKeys.ident,
        };
        return [originKey, buildModel ? new this._model(rawProps) : rawProps];
    }

    private _prepareBreadcrumbItems(
        recordSet: IUIEventByType<StompEventType.OnPath>['args']
    ): Model[] {
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
                originalItem: rawItem,
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
        this._processAddedItemByObject((name) => item.get(name));
    }

    private _processAddedItemByRawData(item: IExternalDecoratedModel) {
        this._processAddedItemByObject((name) => item[name]);
    }

    private _processAddedItemByObject(
        get: <T extends keyof IExternalDecoratedModel>(name: T) => IExternalDecoratedModel[T]
    ): void {
        const isExpanded = get(ExternalCollectionItemKeys.is_expanded) as boolean;
        const isMarked = get(ExternalCollectionItemKeys.is_marked) as boolean;
        const selectStatus = get(ExternalCollectionItemKeys.is_selected) as ExternalSelectStatus;
        const ident = get(ExternalCollectionItemKeys.ident) as CrudEntityKey;

        if (isExpanded) {
            this._expandKey(ident);
        } else if (!isExpanded) {
            this._collapseKey(ident);
        }
        this._toggleExpansion(ident, isExpanded);
        this._select(ident, selectStatus);
        this._setHighlightedFields(ident, this._getItemsHighlightedFields());
        if (isMarked) {
            this._mark(ident);
        }
    }

    private _getItemsHighlightedFields(): string[] {
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

            const lastChange = this._getLastChange(ListChangeNameEnum.SET_HAS_MORE);

            if (lastChange) {
                lastChange.args.hasMoreStorage = this._hasMoreStorage;
            } else {
                this._changes.push({
                    name: ListChangeNameEnum.SET_HAS_MORE,
                    args: {
                        hasMoreStorage: this._hasMoreStorage,
                    },
                });
            }
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

    /**
     * Получить ключи раскрытых узлов
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#getExpandedKeys
     * @return {Set<CrudEntityKey>}
     * @public
     */
    getExpandedKeys(): Set<CrudEntityKey> {
        return this._expandedKeys;
    }

    /**
     * Получить ключ элемента по индексу
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#getKeyByIndex
     * @param {number} index
     * @return {CrudEntityKey}
     * @public
     */
    getKeyByIndex(index: number): CrudEntityKey {
        return this._keys[index];
    }

    /**
     * Получить индекс элемента по ключу
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#getIndexByKey
     * @param {CrudEntityKey} key
     * @return {number}
     * @public
     */
    getIndexByKey(key: CrudEntityKey): number {
        return this._keys.indexOf(key);
    }

    /**
     * Получить все изменения
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#getChanges
     * @return {IListChange[]}
     * @public
     */
    getChanges(): IListChange[] {
        return this._changes;
    }

    /**
     * Добавить несколько элементов
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#addMany
     * @param {IUIEventByType<StompEventType.OnAdd>['args']} recordSet
     * @return {void}
     * @public
     */
    addMany(recordSet: IUIEventByType<StompEventType.OnAdd>['args']): void {
        const pairs: [index: number, collectionItem: SbisRecord<IExternalCollectionItem>][] = [];

        for (let i = 0; i < recordSet.getCount(); i++) {
            const item = recordSet.at(i);
            pairs.push([item.get('index'), item.get('item')]);
        }

        const records = pairs.map(([_, item]) => item);
        const originFormatGetter = getSubFormatGetter(records, CollectionItemKeys.origin);
        const stubFormatGetter = getSubFormatGetter(records, CollectionItemKeys.stub);

        pairs.forEach(([newIndex, collectionItem]) => {
            const [newKey, newItem] = this._prepareItem(
                collectionItem,
                originFormatGetter,
                stubFormatGetter
            );

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

    /**
     * Удалить элементы из коллекции
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#removeMany
     * @param {IUIEventByType<StompEventType.OnRemove>['args']} indexes
     * @return {void}
     * @public
     */
    removeMany(indexes: IUIEventByType<StompEventType.OnRemove>['args']): void {
        const change: IListChange = {
            name: ListChangeNameEnum.REMOVE_ITEMS,
            args: {
                keys: [],
                changeSource: ListChangeSourceEnum.EXTERNAL,
                index: indexes[0],
            },
        };

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

    /**
     * Заменить элементы в коллекции
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#replaceMany
     * @param {IUIEventByType<StompEventType.OnReplace>['args']} recordSet
     * @return {void}
     * @public
     */
    replaceMany(recordSet: IUIEventByType<StompEventType.OnReplace>['args']): void {
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
            const [newKey, newItem] = this._prepareItem(
                collectionItem,
                originFormatGetter,
                stubFormatGetter
            );

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

    /**
     * Заменить все элементы
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#replaceAll
     * @param {IUIEventByType<StompEventType.OnReset>['args']} recordSet
     * @return {void}
     * @public
     */
    replaceAll(recordSet: IUIEventByType<StompEventType.OnReset>['args']): void {
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

        const rawData = [];
        let format;

        for (let i = 0; i < records.length; i++) {
            const [key, props] = this._prepareItem(
                records[i],
                originFormatGetter,
                stubFormatGetter,
                false
            );
            this._keys.push(key);
            rawData.push(props.rawData);

            if (!format) {
                format = props.format;
            }
        }

        const items = new RecordSet<Model>({
            keyProperty: ExternalCollectionItemKeys.ident,
            model: this._model,
            format,
            rawData,
        });

        this._changes.push({
            name: ListChangeNameEnum.REPLACE_ALL_ITEMS,
            args: {
                items: items as unknown as RecordSet<Record<string, unknown>>,
            },
        });

        rawData.forEach((rawItem) => this._processAddedItemByRawData(rawItem));
    }

    /**
     * Выделить элементы
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#selectMany
     * @param {IUIEventByType<StompEventType.OnSelect>['args']} recordSet
     * @return {void}
     * @public
     */
    selectMany({
        selected,
        size: selectionCount,
    }: IUIEventByType<StompEventType.OnSelect>['args']): void {
        selected.forEach(([pos, status]) => {
            const key = this._keys[pos];
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

        this._changes.push({
            name: ListChangeNameEnum.SET_SELECTED_COUNT,
            args: {
                count: selectionCount,
            },
        });
    }

    /**
     * Установить маркер
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#mark
     * @param {IUIEventByType<StompEventType.OnMark>['args']} params
     * @return {void}
     * @public
     */
    mark(params: IUIEventByType<StompEventType.OnMark>['args']): void {
        const { disable: fromIndex, enable: toIndex } = params;

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

    /**
     * Заменить путь
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#replacePath
     * @param {IUIEventByType<StompEventType.OnPath>['args']} recordSet
     * @return {void}
     * @public
     */
    replacePath(recordSet: IUIEventByType<StompEventType.OnPath>['args']): void {
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

    /**
     * Заменить корневой элемент
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#changeRoot
     * @param {CrudEntityKey | null} root
     * @return {void}
     * @public
     */
    changeRoot(root: CrudEntityKey | null): void {
        this._changes.push({
            name: ListChangeNameEnum.CHANGE_ROOT,
            args: {
                key: root,
            },
        });

        this._root = root;
    }

    /**
     * Получить ключ корневого элемента
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#getRoot
     * @return {CrudEntityKey | null}
     * @public
     */
    getRoot(): CrudEntityKey | null {
        return this._root;
    }

    /**
     * Добавить заглушку
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#addStub
     * @param {IUIEventByType<StompEventType.OnAddStub>['args']} record
     * @return {void}
     * @public
     */
    addStub(record: IUIEventByType<StompEventType.OnAddStub>['args']) {
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
    /**
     * Удалить заглушку
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#removeStub
     * @return {void}
     * @public
     */
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

    /**
     * Закончить сеанс обновления коллекции
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#end
     * @param {IUIEventByType<StompEventType.End>['args']} data
     * @return {void}
     * @public
     */
    end(data: IUIEventByType<StompEventType.End>['args']): void {
        const { forward, backward } = data;

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

    /**
     * Очистить изменения
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#resetChanges
     * @return {void}
     * @public
     */
    resetChanges(): void {
        this._changes = [];
    }

    /**
     * Открыть панель массовых операций
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#openOperationsPanel
     * @public
     */
    openOperationsPanel() {
        this._toggleOperationsPanelVisibility('visible');
    }

    /**
     * Закрыть панель массовых операций
     * @function Controls-Lists/_dataFactory/ListMobile/_virtualCollection/VirtualCollection#closeOperationsPanel
     * @public
     */
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
                        const formatCollection = value.getFormat(true);
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
    const format: formatLib.IFieldDeclaration = {
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
