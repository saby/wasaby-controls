/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { IItemsStrategy } from 'Controls/display';
import CollectionItem, { MODULE_NAME } from '../CompositeCollectionItem';
import Collection from '../Collection';
import { Model } from 'Types/entity';
import { ObservableList } from 'Types/collection';
import { CachedHierarchy } from './CachedHierarchyUtil';

interface IOptions<S, T extends CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    display: Collection<S, T>;
}

interface ISortOptions<S, T extends CollectionItem<S>> {
    display: Collection<S, T>;
    compositeItems: T[];
    hierarchy: CachedHierarchy;
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

    protected _itemsOrder: number[];

    constructor(options: IOptions<S, T>) {
        this._options = options;
    }

    get options(): IOptions<S, T> {
        return this.source._options;
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
        let sourceIndex = overallIndex - this._compositeItems.length;

        sourceIndex =
            sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + this._compositeItems.length;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        this._getHierarchy().resetCache();
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        this._compositeItems = [];
        this._getHierarchy().resetCache();
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        const removedItems = this.source.splice(start, deleteCount, added);

        this._removeCompositeItems(removedItems);
        this._actualizeCompositeItems(added);

        return removedItems;
    }

    private _actualizeCompositeItems(addedItems: S[]): void {
        const map = [];
        const parentProperty = this._options.display.getParentProperty();
        const nodeProperty = this._options.display.getNodeProperty();

        addedItems.forEach((addedItem) => {
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
                    const index = map.findIndex((item) => {
                        return item.compositeItem === compositeItem;
                    });
                    if (index !== -1) {
                        map[index].items.push(addedItem);
                    } else {
                        map.push({
                            compositeItem,
                            items: [addedItem],
                        });
                    }
                }
            }
        });
        map.forEach((item) => {
            item.compositeItem.getList().append(item.items);
        });
    }

    private _removeCompositeItems(removedItems: T[]): void {
        removedItems.forEach((removedItem) => {
            const index = this._compositeItems.findIndex((item: T) => {
                return item.getParent() === removedItem;
            });
            if (index !== -1) {
                this._compositeItems.splice(index, 1);
            }
        });
    }

    /**
     * Возвращает элементы оригинальной стратегии + составные элементы
     * @protected
     */
    protected _getItems(): T[] {
        return (this._compositeItems as any[] as T[]).concat(this.source.items);
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
                declaredChildrenProperty:
                    this._options.display.getHasChildrenProperty(),
            });
        }

        return this._cachedHierarchy;
    }

    /**
     * Создает соответствие индексов в стратегии оригинальным оригинальный индексам
     * @protected
     */
    protected _createItemsOrder(): number[] {
        return CompositeItems.sortItems<S, T>(this.source.items, {
            display: this._options.display,
            compositeItems: this._compositeItems,
            hierarchy: this._getHierarchy(),
        });
    }

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<
        S extends Model = Model,
        T extends CollectionItem<S> = CollectionItem<S>
    >(items: T[], options: ISortOptions<S, T>): number[] {
        const compositeItemsContents = options.compositeItems.map((it) => {
            return it.getContents();
        });

        // считаем новый список составных элементов
        const nodesWithCompositeItem =
            CompositeItems._countNodesWithCompositeItem(
                items,
                options.display,
                options.hierarchy
            );
        const newNodeCompositeItemContents = nodesWithCompositeItem.map(
            ({ item, type }) => {
                return CompositeItems._getCompositeItemContent(item, type);
            }
        );

        // удаляем из текущего списка уже не нужные элементы
        compositeItemsContents.forEach((compositeItemContent) => {
            if (
                newNodeCompositeItemContents.indexOf(compositeItemContent) ===
                -1
            ) {
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
                const listItems = options.hierarchy
                    .getChildren(item.key, options.display.getCollection())
                    .filter((listItem) => {
                        const nodePropertyValue = listItem.get(
                            options.display.getNodeProperty()
                        );

                        if (type === 'leaves') {
                            return nodePropertyValue === null;
                        } else {
                            return (
                                nodePropertyValue !== null &&
                                CompositeItems.getLevel(
                                    listItem,
                                    options.display,
                                    items
                                ) > 2
                            );
                        }
                    });
                const hasCompositeItemsBothTypes =
                    nodesWithCompositeItem.filter(({ item: cItem }) => {
                        return cItem.key === item.key;
                    }).length === 2;
                const list = new ObservableList({
                    items: listItems,
                });
                const compositeItem = options.display.createItem({
                    itemModule: MODULE_NAME,
                    contents: compositeItemContent,
                    parent: item,
                    compositeViewConfig:
                        options.display.getCompositeViewConfig(),
                    type,
                    canShowFooter: hasCompositeItemsBothTypes
                        ? type === 'leaves'
                        : true,
                    list,
                });

                options.compositeItems.splice(index, 0, compositeItem);
            }
        });

        // обновляем ссылки, т.к. элементы могут пересоздаться
        CompositeItems._updateNodesInCompositeItems(
            items,
            options.compositeItems
        );

        const countCompositeItems = options.compositeItems.length;
        const itemsOrder = items.map((it, index) => {
            return index + countCompositeItems;
        });
        const firstRootLeafIndex = items.findIndex((item) => {
            return item.getParent().isRoot() && !item.isNode();
        });
        options.compositeItems.forEach((compositeItem, index) => {
            const node = compositeItem.getParent();
            const sourceNodeIndex = items.indexOf(node);
            const compositeItemIndex =
                options.compositeItems.indexOf(compositeItem);

            // вставляем compositeItem в начало узла
            // node.isRoot() - compositeItem с корневыми листьями вставляем перед его листьями
            const insertIndex = node.isRoot()
                ? firstRootLeafIndex
                : sourceNodeIndex + 1 + index;
            itemsOrder.splice(insertIndex, 0, compositeItemIndex);
        });

        return itemsOrder;
    }

    static getLevel(
        item: Model,
        display: Collection<Model>,
        items: CollectionItem[]
    ): number {
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

    private static _getCompositeItemContent(
        item: CollectionItem,
        type: string = ''
    ): string {
        return 'composite-item-' + type + '-' + item.key;
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
                const children = hierarchy.getChildren(
                    item.key,
                    display.getCollection()
                );
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

        const rootChildren = hierarchy.getChildren(
            display.getRoot().key,
            display.getCollection()
        );
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
