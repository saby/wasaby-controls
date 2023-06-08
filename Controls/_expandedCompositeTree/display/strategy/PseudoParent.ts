/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { IItemsStrategy, Tree } from 'Controls/display';
import TreeItem from '../CollectionItem';
import { DestroyableMixin, SerializableMixin, Model } from 'Types/entity';
import { mixin } from 'Types/util';

const PSEUDO_PARENT_MODULE =
    'Controls/expandedCompositeTree:PseudoParentCollectionItem';

interface IOptions<S extends Model, T extends TreeItem<S>> {
    display: Tree<S, T>;
    source: IItemsStrategy<S, T>;
}

export interface ISortOptions<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> {
    display: Tree<S, T>;
    pseudoParent: T;
}

/**
 * Стратегия-декоратор для отображения добавляемой записи
 * @class Controls/_expandedCompositeTree/display/strategy/PseudoParent
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class PseudoParent<S extends Model, T extends TreeItem<S>>
    extends mixin<DestroyableMixin, SerializableMixin>(
        DestroyableMixin,
        SerializableMixin
    )
    implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    protected _items: T[];
    protected _options: IOptions<S, T>;
    protected _source: IItemsStrategy<S, T>;
    protected _itemsOrder: number[];

    protected _pseudoParent: T = null;

    protected constructor(options: IOptions<S, T>) {
        super();
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
        let sourceIndex = overallIndex - (this._pseudoParent ? 1 : 0);

        sourceIndex =
            sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + (this._pseudoParent ? 1 : 0);
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    reset(): void {
        this._itemsOrder = null;
        this._pseudoParent = null;
        return this.source.reset();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        const removedItems = this.source.splice(start, deleteCount, added);

        if (this._pseudoParent) {
            const parentProperty = this._options.display.getParentProperty();
            const hasRealParent = !!added.find((item) => {
                return item.get(parentProperty) === this._pseudoParent.key;
            });

            if (hasRealParent) {
                this._pseudoParent = null;
            }
        }

        return removedItems;
    }

    /**
     * Возвращает дополнительный элемент узлов + элементы оригинальной стратегии
     * @protected
     */
    protected _getItems(): T[] {
        if (this._pseudoParent) {
            return [this._pseudoParent].concat(this.source.items);
        }

        return this.source.items;
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
            display: this.options.display,
            pseudoParent: this._pseudoParent,
        };
    }

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    protected _sortItems(items: T[], options: ISortOptions<S, T>): number[] {
        if (!items.length) {
            return [];
        }
        const { display } = options;
        const parentProperty = display.getParentProperty();
        const keyProperty = display.getKeyProperty();
        const nodeProperty = display.getNodeProperty();
        const firstItemParentKey = items[0].contents.get(parentProperty);
        const rootKey = display.getRoot().key;
        const isCreatePseudoParent =
            firstItemParentKey !== rootKey &&
            !this._pseudoParent &&
            !display.getSourceCollection().getRecordById(firstItemParentKey);

        if (isCreatePseudoParent) {
            const contentsRecord = new Model({
                rawData: {
                    [parentProperty]: rootKey,
                    [keyProperty]: firstItemParentKey,
                    [nodeProperty]: true,
                },
                keyProperty,
            });

            this._pseudoParent = display.createItem({
                itemModule: PSEUDO_PARENT_MODULE,
                contents: contentsRecord,
                parent: display.getRoot(),
                isHiddenItem: true,
            });

            items.forEach((item) => {
                if (item.contents.get(parentProperty) === firstItemParentKey) {
                    item.setParent(this._pseudoParent);
                }
            });
        }

        const itemsOrder = items.map((it, index) => {
            return index + (this._pseudoParent ? 1 : 0);
        });
        if (this._pseudoParent) {
            itemsOrder.unshift(0);
        }

        return itemsOrder;
    }
}

Object.assign(PseudoParent.prototype, {
    '[Controls/expandedCompositeTree:PseudoParent]': true,
    _moduleName: 'Controls/expandedCompositeTree:PseudoParent',
});
