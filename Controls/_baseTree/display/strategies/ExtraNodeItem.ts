/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { IItemsStrategy, itemsStrategy } from 'Controls/display';
import Tree from './../Tree';
import TreeItem from './../TreeItem';
import { Model } from 'Types/entity';

export type TExtraItemVisibilityCallback = (contents: Model) => boolean;

export interface IOptions<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>> {
    source: IItemsStrategy<S, T>;
    display: Tree<S, T>;
    extraItemModule?: string;
    extraItemVisibilityCallback?: TExtraItemVisibilityCallback;
}

export interface ISortOptions<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>> {
    display: Tree<S, T>;
    extraItemModule?: string;
    extraItems: T[];
    extraItemVisibilityCallback?: TExtraItemVisibilityCallback;
}

export interface IInsertExtraItemIndexParams<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> {
    extraItem: T;
    extraItems: T[];
    itemsOrder: number[];
    items: T[];
}

/**
 * Абстрактная стратегия для формирования доп. элементов (подвалы, заголовки узлов)
 * @private
 */
export default abstract class ExtraNodeItem<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> extends itemsStrategy.Proxy {
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _count: number;
    protected _items: T[];
    protected _source: IItemsStrategy<S, T>;

    protected _extraItems: T[] = [];
    protected _itemsOrder: number[];

    /**
     * Возвращает количество записей проекции с доп. элементами.
     */
    get count(): number {
        return this._getItemsOrder().length;
    }

    /**
     * Возвращаетзаписи проекциии с доп. элементами.
     */
    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();
        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    /**
     * Возвращает запись по индексу из проекции с доп элементами
     * @param index
     */
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
        let sourceIndex = overallIndex - this._extraItems.length;

        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + this._extraItems.length;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        this._extraItems = [];
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        const removedItems = this.source.splice(start, deleteCount, added);

        this._removeExtraItems(removedItems);

        return removedItems;
    }

    private _removeExtraItems(removedItems: T[]): void {
        removedItems.forEach((item) => {
            const index = this._extraItems.findIndex((extraItem: T) => {
                return extraItem.getNode() === item;
            });
            if (index !== -1) {
                this._extraItems.splice(index, 1);
                this._setExtraItem(item, null);
            }
        });
    }

    protected abstract _setExtraItem(item: T, extraItem: T): void;

    /**
     * Возвращает дополнительные элементы узлов + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        return this._extraItems.concat(this.source.items);
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

    /**
     * Создает соответствие индексов в стратегии оригинальным оригинальный индексам
     * @protected
     */
    protected _createItemsOrder(): number[] {
        return this._sortItems(this.source.items, this._getSortItemsOptions());
    }

    protected _getSortItemsOptions(): ISortOptions<S, T> {
        return {
            display: this._options.display,
            extraItemModule: this._options.extraItemModule,
            extraItems: this._extraItems,
            extraItemVisibilityCallback: this._options.extraItemVisibilityCallback,
        };
    }

    protected abstract _getExtraItemContent(item: T): string;

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    protected _sortItems(items: T[], options: ISortOptions<S, T>): number[] {
        const extraItemsContent = options.extraItems.map((it) => {
            return it.getContents();
        });

        // считаем новый список дополнительных элементов
        const nodesWithExtraItem = this._getNodesWithExtraItem(items, options);
        const newExtraItemsContent = nodesWithExtraItem.map((extraItem) => {
            return this._getExtraItemContent(extraItem);
        });

        // удаляем из текущего списка дополнительных элементов уже не нужные
        extraItemsContent.forEach((extraItemContent) => {
            if (newExtraItemsContent.indexOf(extraItemContent) === -1) {
                const index = options.extraItems.findIndex((it) => {
                    return it.contents === extraItemContent;
                });
                const removedExtraItem = options.extraItems.splice(index, 1)[0];
                const node = removedExtraItem.getNode();
                this._setExtraItem(node, null);
            }
        });

        // добавляем в текущий список дополнительных элементов новые
        newExtraItemsContent.forEach((extraItemContent, index) => {
            if (extraItemsContent.indexOf(extraItemContent) === -1) {
                const item = nodesWithExtraItem[index];
                const extraNodeItem = options.display.createItem({
                    itemModule: options.extraItemModule,
                    contents: extraItemContent,
                    parent: item,
                    hasMore: item.getHasMoreStorage(),
                    moreFontColorStyle: options.display.getMoreFontColorStyle(),
                    moreCaption: options.display.getNodeMoreCaption(),
                });
                options.extraItems.splice(index, 0, extraNodeItem);
                this._setExtraItem(item, extraNodeItem);
            }
        });

        // обновляем ссылки на родителя в дополнительных элементах и в узлах, т.к. элементы могут пересоздаваться
        this._updateParentInExtraItems(items, options.extraItems);

        const countExtraItems = options.extraItems.length;
        const itemsOrder = items.map((it, index) => {
            return index + countExtraItems;
        });
        options.extraItems.forEach((extraItem) => {
            this._insertExtraItemIndex({
                extraItem,
                extraItems: options.extraItems,
                items,
                itemsOrder,
            });
        });

        return itemsOrder;
    }

    protected abstract _insertExtraItemIndex(params: IInsertExtraItemIndexParams): void;

    protected abstract _shouldAddExtraItem(item: T, options: ISortOptions<S, T>): boolean;

    protected _getNodesWithExtraItem(items: T[], options: ISortOptions<S, T>): T[] {
        const nodesWithExtraItem = [];

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];

            // Проверяем, что запись это узел и он развернут
            if (
                !item['[Controls/_display/TreeItem]'] ||
                item[`[${options.extraItemModule}]`] ||
                item.isNode() === null ||
                !item.isExpanded()
            ) {
                continue;
            }

            if (this._shouldAddExtraItem(item, options)) {
                nodesWithExtraItem.push(item);
            }
        }

        return nodesWithExtraItem;
    }

    protected _updateParentInExtraItems(items: TreeItem[], extraItems: TreeItem[]): void {
        extraItems.forEach((extraItem: T) => {
            const nodeKey = extraItem.getNode().getContents().getKey();
            const newNode = items.find((it) => {
                return it.key === nodeKey;
            }) as T;
            if (newNode) {
                extraItem.setParent(newNode);
                this._setExtraItem(newNode, extraItem);
            }
        });
    }
}

Object.assign(ExtraNodeItem.prototype, {
    '[Controls/_display/IItemsStrategy]': true,
    _groups: null,
    _itemsOrder: null,
});
