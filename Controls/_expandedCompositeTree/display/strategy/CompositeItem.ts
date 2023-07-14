/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { IItemsStrategy } from 'Controls/display';
import CollectionItem, { MODULE_NAME } from '../CompositeCollectionItem';
import Collection from '../Collection';
import { Model } from 'Types/entity';
import { ObservableList } from 'Types/collection';
import { CachedHierarchy } from './CachedHierarchyUtil';
import { CrudEntityKey } from 'Types/source';
import { RootSeparatorItem } from 'Controls/baseTree';

interface IOptions<S, T extends CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    display: Collection<S, T>;
    // @TODO Удалить, когда прикладник везде исправит свою БЛ.
    //   По умолчанию записи из корня расположены внизу, но
    //   не везде БЛ может присылать записи в нужном виде.
    //   Опция rootItemsPositionBottom в значении false позволяет расположить
    //   записи в старом виде - в начале реестра.
    rootItemsPositionBottom?: boolean;
}

interface ISortOptions<S, T extends CollectionItem<S>> {
    display: Collection<S, T>;
    compositeItems: T[];
    hierarchy: CachedHierarchy;
    rootItemsPositionBottom?: boolean;
    separators: Map<string | number | null, RootSeparatorItem>;
    shouldUpdateCompositeChildren: boolean;
    afterUpdateCompositeItems: Function;
}

export default class CompositeItems<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _count: number;
    protected _items: T[];
    protected _options: IOptions<S, T>;
    protected _source: IItemsStrategy<S, T>;
    protected _cachedHierarchy: CachedHierarchy;

    protected _compositeItems: T[] = [];
    private _separators: Map<string | number | null, RootSeparatorItem> = new Map();

    protected _itemsOrder: number[];
    private _shouldUpdateCompositeChildren: boolean;

    constructor(options: IOptions<S, T>) {
        this._options = options;
    }

    get options(): IOptions<S, T> {
        return this.source.options;
    }

    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get count(): number {
        return this._getItemsOrder().length;
    }

    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();
        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    at(index: number): T {
        const itemsOrder = this._getItemsOrder();
        const itemIndex = itemsOrder[index];

        if (itemIndex === undefined) {
            throw new ReferenceError(`Index ${index} is out of bounds.`);
        }

        return this._getItems()[itemIndex];
    }

    getCollectionIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const overallIndex = itemsOrder[index];
        let sourceIndex =
            overallIndex -
            this._compositeItems.length -
            (this._options.rootItemsPositionBottom === false ? 0 : this._separators?.size);

        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex =
            sourceIndex +
            this._compositeItems.length +
            (this._options.rootItemsPositionBottom === false ? 0 : this._separators?.size);
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        this._getHierarchy().resetCache();
        this._shouldUpdateCompositeChildren = true;
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        this._separators = new Map();
        this._compositeItems = [];
        this._getHierarchy().resetCache();
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        const removedItems = this.source.splice(start, deleteCount, added);

        this._removeCompositeItems(removedItems);
        this._removeRootSeparators(removedItems);
        this._actualizeCompositeItems(start, added, removedItems);

        return removedItems;
    }

    private _actualizeCompositeItems(
        start: number,
        addedItems: (S | T)[],
        removedItems: T[]
    ): void {
        const addedRecords: S[] = addedItems.map((item) => {
            return item['[Controls/_display/CollectionItem]'] ? (item as T).contents : item;
        });
        const parentProperty = this._options.display.getParentProperty();
        const nodeProperty = this._options.display.getNodeProperty();

        addedRecords.forEach((addedItem) => {
            const parent = addedItem.get(parentProperty);
            const addedItemIsLeaf = addedItem.get(nodeProperty) === null;
            const compositeItem = this._compositeItems.find((item) => {
                return item.getParent().key === parent;
            });
            if (compositeItem) {
                const shouldAddByType =
                    (compositeItem.getType() === 'leaves' && addedItemIsLeaf) ||
                    (compositeItem.getType() === 'nodes' && !addedItemIsLeaf);
                if (shouldAddByType) {
                    const sourceCollection = this._options.display.getSourceCollection();
                    const compositeCollection = compositeItem.getList();
                    if (start === 0) {
                        compositeCollection.prepend(addedItem);
                    } else if (start === sourceCollection.getCount()) {
                        compositeCollection.append(addedItem);
                    } else {
                        const nearbyItem = sourceCollection.at(start - 1);
                        const nearbyItemIndex = compositeCollection.getIndex(nearbyItem);
                        compositeCollection.add(addedItem, nearbyItemIndex + 1);
                    }
                }
            }
        });

        removedItems.forEach((removedItem) => {
            const removedRecord = removedItem.contents;
            const parent = removedRecord.get(parentProperty);
            const compositeItem = this._compositeItems.find((item) => {
                return item.getParent().key === parent;
            });
            if (compositeItem) {
                compositeItem.getList().remove(removedRecord);
            }
        });
    }

    private _removeRootSeparators(removedItems: T[]): void {
        const collection = this._options.display;
        const sourceCollection = collection.getSourceCollection();
        const hierarchy = this._getHierarchy();

        if (!this._separators.size || !removedItems.length) {
            return;
        }

        const removedItemsKeys = removedItems.map((it) => {
            return it.key;
        });

        removedItemsKeys.forEach((removedItemKey) => {
            const parentKey = CompositeItems._getParentKey(removedItemKey, collection, hierarchy);
            if (this._separators.has(parentKey)) {
                const childNodes = [];
                const childLeaves = [];
                hierarchy.getChildren(parentKey, sourceCollection).forEach((listItem) => {
                    const nodePropertyValue = listItem.get(collection.getNodeProperty());
                    const itemKey = listItem.get(collection.getKeyProperty());
                    if (removedItemsKeys.indexOf(itemKey) !== -1) {
                        return;
                    }
                    if (nodePropertyValue === null) {
                        childLeaves.push(listItem);
                    } else {
                        childNodes.push(listItem);
                    }
                });
                // Удаляем разделитель, если нет узлов или листов на нужном уровне
                if (!childNodes.length || !childLeaves.length) {
                    this._separators.delete(parentKey);
                }
            }
        });
    }

    private _removeCompositeItems(removedItems: T[]): void {
        const collection = this._options.display;
        const hierarchy = this._getHierarchy();

        const parentIsRemoved = (item) => {
            let isRemoved = false;
            let parentKey = item.getParent().key;
            while (parentKey !== collection.getRoot().key && !isRemoved) {
                isRemoved = removedItems.some((removedItem) => {
                    return removedItem.key === parentKey;
                });
                if (!isRemoved) {
                    parentKey = CompositeItems._getParentKey(parentKey, collection, hierarchy);
                }
            }
            return isRemoved;
        };
        for (let i = 0; i < this._compositeItems.length; i++) {
            const compositeItem = this._compositeItems[i];
            if (parentIsRemoved(compositeItem)) {
                this._compositeItems.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Возвращает элементы оригинальной стратегии + составные элементы
     * @protected
     */
    protected _getItems(): T[] {
        const separators =
            this._options.rootItemsPositionBottom !== false && this._separators?.size
                ? Array.from(this._separators.values())
                : [];
        return [...(this._compositeItems as unknown as T[]), ...separators, ...this.source.items];
    }

    /**
     * Возвращает соответствие индексов в стратегии оригинальным индексам
     * @protected
     */
    protected _getItemsOrder(): number[] {
        if (!this._itemsOrder) {
            this._itemsOrder = this._createItemsOrder();
        }

        return this._itemsOrder;
    }

    protected _getHierarchy(): CachedHierarchy {
        if (!this._cachedHierarchy) {
            this._cachedHierarchy = new CachedHierarchy({
                keyProperty: this._options.display.getKeyProperty(),
                parentProperty: this._options.display.getParentProperty(),
                nodeProperty: this._options.display.getNodeProperty(),
                declaredChildrenProperty: this._options.display.getHasChildrenProperty(),
            });
        }

        return this._cachedHierarchy;
    }

    /**
     * Создает соответствие индексов в стратегии оригинальным оригинальный индексам
     * @protected
     */
    protected _createItemsOrder(): number[] {
        const afterUpdateCompositeItems = () => {
            this._shouldUpdateCompositeChildren = false;
        };
        return CompositeItems.sortItems<S, T>(this.source.items, {
            display: this._options.display,
            compositeItems: this._compositeItems,
            separators: this._separators,
            hierarchy: this._getHierarchy(),
            shouldUpdateCompositeChildren: this._shouldUpdateCompositeChildren,
            afterUpdateCompositeItems,
            rootItemsPositionBottom: this._options.rootItemsPositionBottom,
        });
    }

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>>(
        items: T[],
        options: ISortOptions<S, T>
    ): number[] {
        const compositeItemsContents = options.compositeItems.map((it) => {
            return it.getContents();
        });

        // считаем новый список составных элементов
        const nodesWithCompositeItem = CompositeItems._countNodesWithCompositeItem(
            items,
            options.display,
            options.hierarchy
        );
        const newNodeCompositeItemContents = nodesWithCompositeItem.map(({ item, type }) => {
            return CompositeItems._getCompositeItemContent(item, type);
        });

        // удаляем из текущего списка уже не нужные элементы
        compositeItemsContents.forEach((compositeItemContent) => {
            if (newNodeCompositeItemContents.indexOf(compositeItemContent) === -1) {
                const index = options.compositeItems.findIndex((it) => {
                    return it.contents === compositeItemContent;
                });
                options.compositeItems.splice(index, 1);
            }
        });

        // добавляем в текущий список новые элементы
        newNodeCompositeItemContents.forEach((compositeItemContent, index) => {
            if (compositeItemsContents.indexOf(compositeItemContent) === -1) {
                const { item, type } = nodesWithCompositeItem[index];
                const { list, childNodes, childLeaves } = CompositeItems._getCompositeChildren(
                    nodesWithCompositeItem[index],
                    items,
                    options
                );
                const hasCompositeItemsBothTypes =
                    nodesWithCompositeItem.filter(({ item: cItem }) => {
                        return cItem.key === item.key;
                    }).length === 2;
                // Создаём разделители записей для узлов 0 и 1 уровней,
                // но только в тех случаях, когда узел содержит и листы и узлы.
                // При этом нельзя проверять по hasCompositeItemsBothTypes, т.к.
                // узел 1 уровня и корень не содержит композитные узлы, только листы.
                if (
                    (item.getLevel() === 1 || item.key === options.display.getRoot().key) &&
                    !options.separators.has(item.key) &&
                    childLeaves.length &&
                    childNodes.length
                ) {
                    options.separators.set(
                        item.key,
                        options.display.createRootSeparator({
                            ...options,
                            contents: this._getRootSeparatorContent(item.key),
                        })
                    );
                }
                const compositeItem = options.display.createItem({
                    itemModule: MODULE_NAME,
                    contents: compositeItemContent,
                    parent: item,
                    compositeViewConfig: options.display.getCompositeViewConfig(),
                    type,
                    canShowFooter: hasCompositeItemsBothTypes ? type === 'leaves' : true,
                    list,
                });

                options.compositeItems.splice(index, 0, compositeItem);
            } else if (options.shouldUpdateCompositeChildren) {
                const { list } = CompositeItems._getCompositeChildren(
                    nodesWithCompositeItem[index],
                    items,
                    options
                );
                options.compositeItems[index].getChildSourceCollection().assign(list);
            }
        });
        // Сбрасываем shouldUpdateCompositeChildren
        options.afterUpdateCompositeItems();

        // обновляем ссылки, т.к. элементы могут пересоздаться
        CompositeItems._updateNodesInCompositeItems(items, options.compositeItems);

        const countOfServiceItems =
            options.compositeItems.length +
            (options.rootItemsPositionBottom !== false ? options.separators.size : 0);
        const itemsOrder = items.map((it, index) => {
            return index + countOfServiceItems;
        });
        const firstRootLeafIndex = items.findIndex((item) => {
            return item.getParent().isRoot() && !item.isNode();
        });
        options.compositeItems.forEach((compositeItem, index) => {
            const node = compositeItem.getParent();
            const sourceNodeIndex = items.indexOf(node);
            const compositeItemIndex = options.compositeItems.indexOf(compositeItem);
            let insertIndex: number;

            if (options.rootItemsPositionBottom === false) {
                // вставляем compositeItem в начало узла
                // node.isRoot() - compositeItem с корневыми листьями вставляем в начало списка
                insertIndex = node.isRoot() ? 0 : sourceNodeIndex + 1 + index;
                itemsOrder.splice(insertIndex, 0, compositeItemIndex);
            } else {
                // Композитная запись обычно вставляется в позицию узла, для которого она создана
                let originIndex = sourceNodeIndex + 1;
                if (node.isRoot()) {
                    // node.isRoot() - compositeItem с корневыми листьями
                    // вставляем перед его листьями
                    originIndex = firstRootLeafIndex;
                } else if (node.getLevel() === 1 && compositeItem.getType() === 'leaves') {
                    // Для записи с листами первого уровня вычисляем позицию по родителю
                    const firstLevelFirstLeafIndex = items.findIndex((item) => {
                        return (
                            item.getLevel() === 2 &&
                            item.isNode() === null &&
                            item.getParent() === node
                        );
                    });
                    if (firstLevelFirstLeafIndex !== -1) {
                        originIndex = firstLevelFirstLeafIndex;
                    }
                }
                // Ищем позицию для вставки индекса "композитной" записи
                // с учётом смещения на число служебных записей.
                insertIndex = itemsOrder.indexOf(originIndex + countOfServiceItems);
                itemsOrder.splice(insertIndex, 0, compositeItemIndex);
                // Добавляем индексы разделителя записей из корня 0 и 1 уровня,
                // если они доступны для текущего композитного элемента с листами.
                if (compositeItem.getType() === 'leaves' && options.separators.has(node.key)) {
                    const separatorIndex =
                        Array.from(options.separators.keys()).indexOf(node.key) +
                        options.compositeItems.length;
                    itemsOrder.splice(insertIndex, 0, separatorIndex);
                }
            }
        });

        return itemsOrder;
    }

    private static _getCompositeChildren(
        compositeItem: {
            item: CollectionItem;
            type: string;
        },
        items: CollectionItem[],
        options: ISortOptions<Model, CollectionItem>
    ): {
        list: ObservableList<CollectionItem>;
        childNodes: CollectionItem[];
        childLeaves: CollectionItem[];
    } {
        const { item, type } = compositeItem;
        const childNodes = [];
        const childLeaves = [];
        options.hierarchy
            .getChildren(item.key, options.display.getCollection())
            .forEach((listItem) => {
                const nodePropertyValue = listItem.get(options.display.getNodeProperty());
                if (nodePropertyValue === null) {
                    childLeaves.push(listItem);
                } else {
                    childNodes.push(listItem);
                }
            });
        return {
            list: new ObservableList({
                items:
                    type === 'leaves'
                        ? childLeaves
                        : childNodes.filter((listItem) => {
                              return CompositeItems.getLevel(listItem, options.display, items) > 2;
                          }),
            }),
            childNodes,
            childLeaves,
        };
    }

    static getLevel(item: Model, display: Collection<Model>, items: CollectionItem[]): number {
        const parentProperty = display.getParentProperty();
        const currentRoot = display.getRoot().contents;
        const collection = display.getSourceCollection();
        const countLevel = (item, level) => {
            const parentKey = item.get(parentProperty);

            if (parentKey === currentRoot) {
                return level;
            }

            let parent = collection.getRecordById(parentKey);

            if (!parent) {
                parent = items.find((item) => {
                    return item.key === parentKey;
                }).contents;
            }

            return countLevel(parent, level + 1);
        };
        return countLevel(item, 1);
    }

    private static _getParentKey(
        itemKey: CrudEntityKey,
        collection: Collection<Model>,
        hierarchy: CachedHierarchy
    ) {
        const sourceCollection = collection.getSourceCollection();
        if (sourceCollection.getRecordById(itemKey) === undefined) {
            return collection.getRoot().key;
        }
        const parent = hierarchy.getParent(itemKey, sourceCollection) as Model;
        return parent === null ? collection.getRoot().key : parent.getKey();
    }

    private static _getCompositeItemContent(item: CollectionItem, type: string = ''): string {
        return 'composite-item-' + type + '-' + item.key;
    }

    private static _getRootSeparatorContent(key: string): string {
        return `root-separator${key ? '-' + key : ''}`;
    }

    private static _countNodesWithCompositeItem(
        items: CollectionItem[],
        display: Collection<Model>,
        hierarchy: CachedHierarchy
    ): { item: CollectionItem; type: string }[] {
        const nodesWithCompositeItem = [];
        const nodeProperty = display.getNodeProperty();

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];

            // Отбираем из всех элементов только узлы
            if (item.isNode()) {
                // Получаем список дочерних элементов
                const children = hierarchy.getChildren(item.key, display.getCollection());
                // Если найден хотя бы один дочерний элемент, то дополняем nodesWithCompositeItem
                // https://online.sbis.ru/opendoc.html?guid=74b8c53e-2345-4f2a-87b9-d3132180ec3d
                const hasChildrenNodes = children.some((child) => {
                    return child.get(nodeProperty);
                });
                const allowNodesItemByLevel =
                    this.getLevel(item.contents, display, items) >=
                    display.getCompositeNodesLevel() - 1;
                const hasChildrenLeaves = children.some((child) => {
                    return !child.get(nodeProperty);
                });
                if (hasChildrenNodes && allowNodesItemByLevel) {
                    nodesWithCompositeItem.push({ item, type: 'nodes' });
                }
                if (hasChildrenLeaves) {
                    nodesWithCompositeItem.push({ item, type: 'leaves' });
                }
            }
        }

        const rootChildren = hierarchy.getChildren(display.getRoot().key, display.getCollection());
        const hasRootChildrenLeaves = rootChildren.some((child) => {
            return !child.get(nodeProperty);
        });
        if (hasRootChildrenLeaves) {
            nodesWithCompositeItem.push({
                item: display.getRoot(),
                type: 'leaves',
            });
        }

        return nodesWithCompositeItem;
    }

    private static _updateNodesInCompositeItems(
        items: CollectionItem[],
        compositeItems: CollectionItem[]
    ): void {
        compositeItems.forEach((compositeItem) => {
            const nodeKey = compositeItem.getParent().key;
            const newNode = items.find((it) => {
                return it.key === nodeKey;
            });
            if (newNode) {
                compositeItem.setParent(newNode);
            }
        });
    }
}

Object.assign(CompositeItems.prototype, {
    '[Controls/_display/IItemsStrategy]': true,
    '[Controls/expandedCompositeTree:strategy.CompositeItems]': true,
    _moduleName: 'Controls/expandedCompositeTree:strategy.CompositeItems',
    _groups: null,
    _itemsOrder: null,
});
