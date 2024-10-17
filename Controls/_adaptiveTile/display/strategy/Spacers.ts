import { IItemsStrategy } from 'Controls/display';
import { Model } from 'Types/entity';
import Collection from '../Collection';
import CollectionItem from '../CollectionItem';
import SpacerItem, { ISpacerItemOptions } from '../SpacerItem';

/**
 * Интерфейс опций, с которыми создается стратегия SpacerStrategy
 * @private
 */
interface IOptions<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    display: Collection<S, T>;
}

/**
 * Интерфейс опций метода SpacerStrategy::sortItems
 * @private
 */
interface ISortOptions<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>> {
    display: Collection<S, T>;
    spacerItems: SpacerItem[];
}

/**
 * Стратегия, которая создает невидимые элементы в коллекции
 * @private
 */
export default class SpacersStrategy<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _count: number;
    protected _items: T[];
    protected _options: IOptions<S, T>;
    protected _source: IItemsStrategy<S, T>;

    protected _spacerItems: SpacerItem[] = [];

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
        let sourceIndex = overallIndex - this._spacerItems.length;

        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + this._spacerItems.length;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        this._spacerItems = [];
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        this._spacerItems = [];
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        this._spacerItems = [];
        return this.source.splice(start, deleteCount, added);
    }

    /**
     * Возвращает подвалы узлов + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        return (this._spacerItems as undefined as T[]).concat(this.source.items);
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
        return SpacersStrategy.sortItems<S, T>(this.source.items, {
            display: this.options.display,
            spacerItems: this._spacerItems,
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
        // Добавляем распорки, чтобы в последнем столбце записи не расползались.
        const maxItemsInColumn = options.display.getMaxItemsByHeight();
        // Если столбец всего один, то распорки не нужны.
        const needAppendSpacerItems = items.length > maxItemsInColumn;
        const itemsInLastColumn = items.length % maxItemsInColumn;
        const spacersCount = itemsInLastColumn ? maxItemsInColumn - itemsInLastColumn : 0;
        const offset = needAppendSpacerItems && spacersCount ? spacersCount : 0;
        const itemsOrder = items.map((it, index) => {
            return index + offset;
        });

        if (needAppendSpacerItems) {
            const lastItem = items[items.length - 1];
            const spacerItems = SpacersStrategy._createSpacerItems(
                options.display,
                lastItem,
                spacersCount
            );
            options.spacerItems.push(...spacerItems);
            for (let i = 0; i < options.spacerItems.length; i++) {
                itemsOrder.push(i);
            }
        }

        return itemsOrder;
    }

    protected static _createSpacerItems(
        display: Collection,
        prevItem: CollectionItem,
        spacersCount: number,
        options: Partial<ISpacerItemOptions> = {}
    ): SpacerItem[] {
        const items = [];

        const params = this._getSpacerItemParams(display, prevItem, options);
        for (let i = 0; i < spacersCount; i++) {
            items.push(display.createItem(params));
        }

        return items;
    }

    protected static _getSpacerItemParams(
        display: Collection,
        prevItem: CollectionItem,
        options: Partial<ISpacerItemOptions>
    ): Partial<ISpacerItemOptions> {
        return {
            ...options,
            itemModule: 'Controls/adaptiveTile:SpacerItem',
            contents: prevItem.getContents(),
        };
    }
}

Object.assign(SpacersStrategy.prototype, {
    '[Controls/_display/IItemsStrategy]': true,
    '[Controls/_adaptiveTile/strategy/Spacers]': true,
    _moduleName: 'Controls/adaptiveTile:SpacersStrategy',
    _itemsOrder: null,
});
