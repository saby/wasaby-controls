/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { IItemsStrategy } from 'Controls/display';
import { Model } from 'Types/entity';
import TileCollection from '../TileCollection';
import TileCollectionItem from '../TileCollectionItem';
import InvisibleTileItem, {
    IInvisibleTileItemOptions,
} from '../InvisibleTileItem';

export const COUNT_INVISIBLE_ITEMS = 11;

/**
 * Интерфейс опций, с которыми создается стратегия InvisibleStrategy
 * @private
 */
interface IOptions<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> {
    source: IItemsStrategy<S, T>;
    display: TileCollection<S, T>;
}

/**
 * Интерфейс опций метода InvisibleStrategy::sortItems
 * @private
 */
interface ISortOptions<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> {
    display: TileCollection<S, T>;
    invisibleItems: InvisibleTileItem[];
}

/**
 * Стратегия, которая создает невидимые элементы в коллекции
 * @private
 */
export default class InvisibleStrategy<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _count: number;
    protected _items: T[];
    protected _options: IOptions<S, T>;
    protected _source: IItemsStrategy<S, T>;

    /**
     * Группы
     */
    protected _invisibleItems: InvisibleTileItem[] = [];

    /**
     * Индекс в стратегии -> оригинальный индекс
     */
    protected _itemsOrder: number[];

    constructor(options: IOptions<S, T>) {
        this._options = options;
    }

    get options(): IOptions<S, T> {
        return this._options;
    }

    get source(): IItemsStrategy<S, T> {
        return this.options.source;
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
        let sourceIndex = overallIndex - this._invisibleItems.length;

        sourceIndex =
            sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + this._invisibleItems.length;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        this._invisibleItems = [];
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        this._invisibleItems = [];
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        const removedItems = this.source.splice(start, deleteCount, added);

        this._removeInvisibleItems(removedItems);
        return removedItems;
    }

    protected _removeInvisibleItems(removedItems: T[]): void {
        removedItems.forEach((item) => {
            const index = this._invisibleItems.findIndex(
                (invisibleItem: InvisibleTileItem) => {
                    return invisibleItem.contents === item.contents;
                }
            );
            if (index !== -1) {
                this._invisibleItems.splice(index, COUNT_INVISIBLE_ITEMS);
            }
        });
    }

    /**
     * Возвращает подвалы узлов + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        return (this._invisibleItems as undefined as T[]).concat(
            this.source.items
        );
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
        return InvisibleStrategy.sortItems<S, T>(this.source.items, {
            display: this.options.display,
            invisibleItems: this._invisibleItems,
        });
    }

    static _needCreateInvisibleItems<
        S extends Model = Model,
        T extends TileCollectionItem<S> = TileCollectionItem<S>
    >(item: T, invisibleItems): boolean {
        const index = invisibleItems.findIndex(
            (invisibleItem: InvisibleTileItem) => {
                return invisibleItem.contents === item.contents;
            }
        );
        return index === -1;
    }

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<
        S extends Model = Model,
        T extends TileCollectionItem<S> = TileCollectionItem<S>
    >(items: T[], options: ISortOptions<S, T>): number[] {
        const { display } = options;
        const newInvisibleItems = [];
        const insertIndexForNewInvisibleItems = [];

        function isGroupItem(item: T): boolean {
            return item['[Controls/_display/GroupItem]'];
        }

        function isAdditionalItem(item: T): boolean {
            return item['[Controls/_tile/AdditionalTileItem]'];
        }

        // Элементы плоской стратегии могут быть группы, доп. элементы, хлебные крошки
        function isPlainItem(item: T): boolean {
            return isGroupItem(item) || isAdditionalItem(item);
        }

        for (let i = 0; i < items.length; i++) {
            let itemIndex = i;
            let item = items[i];

            let nextItem = items[i + 1];
            let hasNextItem = !!nextItem;
            let nextItemIsPlain = hasNextItem && isPlainItem(nextItem);
            while (hasNextItem && !nextItemIsPlain) {
                i++;
                item = items[i];
                itemIndex = i;
                nextItem = items[i + 1];
                hasNextItem = !!nextItem;
                nextItemIsPlain = hasNextItem && isPlainItem(nextItem);
            }

            // Добавляем невидимые элементы перед группой для того, чтобы предшествующие плитки ужались
            if (hasNextItem && isGroupItem(nextItem)) {
                if (InvisibleStrategy._needCreateInvisibleItems(item, options.invisibleItems)) {
                    newInvisibleItems.push(this._createInvisibleItems(display, item, {}));
                } else {
                    newInvisibleItems.push(
                        options.invisibleItems.filter((invisibleItem: InvisibleTileItem) => {
                            return invisibleItem.contents === item.contents;
                        })
                    );
                }
                // invisible-элементы нужно добавлять ПЕРЕД группой
                insertIndexForNewInvisibleItems.push(itemIndex + 1);
            }
        }

        // invisible-элементы после всех элементов нужно добавлять только в режиме static, либо, если есть группировка
        if (display.getTileMode() === 'static' || !!display.getGroup()) {
            const lastItem = items[items.length - 1];
            const hasLastItem = !!lastItem;
            const lastItemIsPlain = hasLastItem && isPlainItem(lastItem);
            const lastItemIsAdditional = hasLastItem && isAdditionalItem(lastItem);
            const lastItemIsLeaf = hasLastItem && !lastItemIsPlain;
            if (lastItemIsAdditional || lastItemIsLeaf) {
                if (InvisibleStrategy._needCreateInvisibleItems(lastItem, options.invisibleItems)) {
                    newInvisibleItems.push(this._createInvisibleItems(display, lastItem, {}));
                } else {
                    newInvisibleItems.push(
                        options.invisibleItems.filter((invisibleItem: InvisibleTileItem) => {
                            return invisibleItem.contents === lastItem.contents;
                        })
                    );
                }
                // invisible-элементы нужно добавлять в самый конец
                insertIndexForNewInvisibleItems.push(items.length);
            }
        }

        const itemsOrder = items.map((it, index) => {
            return index + newInvisibleItems.length * COUNT_INVISIBLE_ITEMS;
        });

        options.invisibleItems.length = 0;

        for (let i = 0; i < newInvisibleItems.length; i++) {
            const newItems = newInvisibleItems[i];
            options.invisibleItems.push(...newItems);
            const insertIndex = insertIndexForNewInvisibleItems[i];
            for (let j = 0; j < newItems.length; j++) {
                const invisibleItemIndex = COUNT_INVISIBLE_ITEMS * i + j;
                itemsOrder.splice(insertIndex + invisibleItemIndex, 0, invisibleItemIndex);
            }
        }

        return itemsOrder;
    }

    protected static _createInvisibleItems(
        display: TileCollection,
        prevItem: TileCollectionItem,
        options: Partial<IInvisibleTileItemOptions> = {}
    ): InvisibleTileItem[] {
        const items = [];

        const params = this._getInvisibleItemParams(display, prevItem, options);
        for (let i = 0; i < COUNT_INVISIBLE_ITEMS; i++) {
            if (i === COUNT_INVISIBLE_ITEMS - 1) {
                params.lastInvisibleItem = true;
            }
            items.push(display.createItem(params));
        }

        return items;
    }

    protected static _getInvisibleItemParams(
        display: TileCollection,
        prevItem: TileCollectionItem,
        options: Partial<IInvisibleTileItemOptions>
    ): Partial<IInvisibleTileItemOptions> {
        return {
            ...options,
            itemModule: 'Controls/tile:InvisibleTileItem',
            contents: prevItem.getContents(),
        };
    }
}

Object.assign(InvisibleStrategy.prototype, {
    '[Controls/_display/IItemsStrategy]': true,
    '[Controls/_tile/strategy/Invisible]': true,
    _moduleName: 'Controls/tile:InvisibleStrategy',
    _itemsOrder: null,
});
