/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { TemplateFunction } from 'UI/Base';
import { Collection, CollectionItem, IItemsStrategy } from 'Controls/display';
import { Model } from 'Types/entity';
import AdditionalTileItem from '../AdditionalTileItem';

/**
 * Интерфейс опций, с которыми создается стратегия AddTreeTileStrategy
 * @private
 */
interface IOptions<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    display: Collection<S, T>;
    beforeItemsTemplate: TemplateFunction;
    afterItemsTemplate: TemplateFunction;
    itemModule: string;
}

/**
 * Интерфейс опций метода AddTreeTileStrategy::sortItems
 * @private
 */
interface ISortOptions<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>> {
    display: Collection<S, T>;
    beforeItemsTemplate: TemplateFunction;
    afterItemsTemplate: TemplateFunction;
}

/**
 * Стратегия, которая создает плитку добавления в коллекции
 * @private
 */
export default class AdditionalTileStrategy<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _count: number;
    protected _items: T[];
    protected _options: IOptions<S, T>;
    protected _source: IItemsStrategy<S, T>;
    protected _beforeItemsTile: AdditionalTileItem;
    protected _afterItemsTile: AdditionalTileItem;
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
        return this.source.at(index);
    }

    getCollectionIndex(index: number): number {
        return this.source.getCollectionIndex(index);
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + (this._beforeItemsTile ? 1 : 0);
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        return this.source.splice(start, deleteCount, added);
    }

    /**
     * Возвращает дополнительные элементы + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        let items: CollectionItem[] = this.source.items;
        if (!this._beforeItemsTile && this.options.beforeItemsTemplate) {
            this._beforeItemsTile = this._createTileItem(
                'before',
                this.options.beforeItemsTemplate
            );
        }
        if (!this._afterItemsTile && this.options.afterItemsTemplate) {
            this._afterItemsTile = this._createTileItem('after', this.options.afterItemsTemplate);
        }
        if (this._beforeItemsTile) {
            items = ([this._beforeItemsTile] as CollectionItem[]).concat(items);
        }
        if (this._afterItemsTile) {
            items = items.concat([this._afterItemsTile] as CollectionItem[]);
        }
        return items as T[];
    }

    /**
     * Создаёт дополнительный элемент для добавления до или после стратегии
     * @param position
     * @param template
     * @private
     */
    protected _createTileItem(
        position: 'before' | 'after',
        template: TemplateFunction
    ): AdditionalTileItem {
        return this.options.display.createItem({
            itemModule: this.options.itemModule,
            usingCustomItemTemplates: this.options.usingCustomItemTemplates,
            additionalItemTemplate: template,
            position,
            contents: new Model({
                keyProperty: this.options.display.getKeyProperty(),
            }),
        }) as AdditionalTileItem;
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
     * Создает соответствие индексов в стратегии оригинальными индексам
     * @protected
     */
    protected _createItemsOrder(): number[] {
        return AdditionalTileStrategy.sortItems<S, T>(this.source.items, {
            display: this.options.display,
            beforeItemsTemplate: this.options.beforeItemsTemplate,
            afterItemsTemplate: this.options.afterItemsTemplate,
        });
    }

    destroy(): void {
        this._beforeItemsTile = null;
        this._afterItemsTile = null;
    }

    /**
     * Создает индекс сортировки с плиткой добавления
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>>(
        items: T[],
        options: ISortOptions<S, T>
    ): number[] {
        const offset = options.beforeItemsTemplate ? 1 : 0;
        const itemsOrder = items.map((it, index) => {
            return index + offset;
        });
        if (options.beforeItemsTemplate) {
            itemsOrder.unshift(0);
        }
        if (options.afterItemsTemplate) {
            itemsOrder.push(itemsOrder.length);
        }
        return itemsOrder;
    }
}

Object.assign(AdditionalTileStrategy.prototype, {
    '[Controls/_display/IItemsStrategy]': true,
    '[Controls/_tile/strategy/AdditionalTileStrategy]': true,
    _moduleName: 'Controls/tile:AdditionalTileStrategy',
    _itemsOrder: null,
});
