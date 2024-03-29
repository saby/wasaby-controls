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
        this._invisibleItems = [];
        return this.source.splice(start, deleteCount, added);
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

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<
        S extends Model = Model,
        T extends TileCollectionItem<S> = TileCollectionItem<S>
    >(items: T[], options: ISortOptions<S, T>): number[] {
        const needAppendInvisibleItems =
            items.length && options.display.getTileMode() === 'static';
        const offset = needAppendInvisibleItems ? COUNT_INVISIBLE_ITEMS : 0;
        const itemsOrder = items.map((it, index) => {
            return index + offset;
        });

        if (needAppendInvisibleItems) {
            const lastItem = items[items.length - 1];
            const invisibleItems = InvisibleStrategy._createInvisibleItems(
                options.display,
                lastItem
            );
            options.invisibleItems.push(...invisibleItems);
            for (let i = 0; i < options.invisibleItems.length; i++) {
                itemsOrder.push(i);
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
