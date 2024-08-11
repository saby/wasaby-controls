/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { IItemsStrategy, itemsStrategy } from 'Controls/display';
import { DestroyableMixin, SerializableMixin, ISerializableState, Model } from 'Types/entity';
import { mixin } from 'Types/util';
import type TreeItem from '../TreeItem';
import type Tree from '../Tree';
import type RootSeparatorItem from 'Controls/_baseTree/display/RootSeparatorItem';

interface ISortOptions<S extends Model, T extends TreeItem<S>> {
    display: Tree<S, T>;
    template: string;
    itemModule?: string;
}

/**
 * Стратегия для формирования разделителей записей, расположенных в корне дерева
 * при отображении результатов поиска.
 * @class Controls/_baseTree/RootStrategy
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class RootSeparator<S, T>
    extends mixin<itemsStrategy.Proxy, DestroyableMixin, SerializableMixin>(
        itemsStrategy.Proxy,
        DestroyableMixin,
        SerializableMixin
    )
    implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    protected _itemsOrder: number[];

    private _separatorItem: RootSeparatorItem = null;

    /**
     * Возвращает количество записей проекции с разделителем
     */
    get count(): number {
        return this._getItemsOrder().length;
    }

    /**
     * Возвращает записи проекции с разделителем
     */
    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();
        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    /**
     * Возвращает запись по индексу из проекции
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

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        const removedItems = this.source.splice(start, deleteCount, added);

        if (this._separatorItem) {
            const parentProperty = this._options.display.getParentProperty();
            const hasRealParent = !!added.find((item) => {
                const record = item['[Controls/_display/CollectionItem]']
                    ? (item as unknown as T).contents
                    : item;
                return record.get(parentProperty) === this._separatorItem.key;
            });

            if (hasRealParent) {
                this._separatorItem = null;
            }
        }

        return removedItems;
    }

    reset(): void {
        this._itemsOrder = null;
        this._separatorItem = null;
        return this.source.reset();
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(index);
        const overallIndex = sourceIndex + +!!this._separatorItem;
        const itemIndex = itemsOrder.indexOf(overallIndex);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    getCollectionIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const overallIndex = itemsOrder[index];
        let sourceIndex = overallIndex - +!!this._separatorItem;

        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;

        return sourceIndex;
    }

    // endregion

    // region SerializableMixin

    _getSerializableState(state: ISerializableState): ISerializableState {
        const resultState = SerializableMixin.prototype._getSerializableState.call(this, state);
        resultState.$options = this._options;
        return resultState;
    }

    // endregion

    /**
     * Возвращает элементы оригинальной стратегии + составные элементы
     * @protected
     */
    protected _getItems(): T[] {
        if (this._separatorItem) {
            return [this._separatorItem].concat(this.source.items);
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
        return this.sortItems<S, T>(this.source.items, {
            owner: this._options.display,
            display: this._options.display,
            template: this._options.template,
            itemModule: 'Controls/baseTree:RootSeparatorItem',
        });
    }

    /**
     * Создает индекс сортировки в порядке группировки
     * @param items Элементы проекции.
     * @param options Опции
     */
    protected sortItems<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>>(
        items: T[],
        options: ISortOptions<S, T>
    ): number[] {
        const firstRootLeafIndex = items.findIndex((item) => {
            return (
                item &&
                item['[Controls/_display/TreeItem]'] &&
                !item['[Controls/treeGrid:TreeGridNodeFooterRow]'] &&
                !item['[Controls/treeGrid:TreeGridNodeHeaderRow]'] &&
                !item['[Controls/treeGrid:TreeGridGroupDataRow]'] &&
                !item['[Controls/_baseTree/BreadcrumbsItem]'] &&
                item.getParent().isRoot() &&
                !item.isNode?.()
            );
        });
        let itemsOrder = [];
        // Если перед всеми записями из корня находится запись группы, то разделитель из корня не рисуем.
        const hasPrevGroup =
            firstRootLeafIndex > 0 &&
            items[firstRootLeafIndex - 1]?.['[Controls/_display/GroupItem]'];
        if (firstRootLeafIndex > 0 && !this._separatorItem && !hasPrevGroup) {
            this._separatorItem = options.display.createRootSeparator({
                ...options,
                contents: 'root-separator',
            });
        }
        itemsOrder = items.map((it, index) => {
            return index + +!!this._separatorItem;
        });
        if (this._separatorItem) {
            itemsOrder.splice(firstRootLeafIndex, 0, 0);
        }

        return itemsOrder;
    }
}

Object.assign(RootSeparator.prototype, {
    '[Controls/_baseTree/RootSeparatorStrategy]': true,
    _moduleName: 'Controls/baseTree:RootSeparatorStrategy',
});
