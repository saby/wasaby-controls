/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model } from 'Types/entity';
import GroupItem from 'Controls/_display/GroupItem';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';
import { groupConstants } from 'Controls/_display/itemsStrategy/Group';
import {
    default as AbstractStrategy,
    IOptions as AbstractStrategyOptions,
} from 'Controls/_display/itemsStrategy/AbstractStrategy';
import CollectionItem from '../CollectionItem';

/**
 * Интерфейс описывает структуру объекта конфигурации стратегии {@link ItemsSpacingStrategy}
 * @private
 */
export interface IItemsSpacingStrategyOptions<S, T> extends AbstractStrategyOptions<S, T> {
    /**
     * Ф-ия должна вернуть инстанс записи-отступа.
     * В качестве параметров принимает запись коллекции перед которой вставляется SpaceItem.
     */
    spaceItemFactory?: (itemAfterSpaceItem: T) => T;

    /**
     * Настройка отступа между записями списка
     * По умолчанию items, т.е. отступы показываются только между записями
     */
    itemsSpacingVisibility?: 'all' | 'items';
}

/**
 * Стратегия, которая умеет добавлять пустые итемы в коллекцию.
 * @private
 */
export default class ItemsSpacingStrategy<
    S extends Model,
    T extends CollectionItem
> extends AbstractStrategy<S, T> {
    protected _options: IItemsSpacingStrategyOptions<S, T>;
    protected _items: T[] = [];

    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get options(): AbstractStrategyOptions<S, T> {
        return this.source.options;
    }

    get count(): number {
        return this._getItems().length;
    }

    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();
        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    at(index: number): T {
        return this.items[index];
    }

    invalidate(): void {
        this._itemsOrder = null;
        return this.source.invalidate();
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._itemsOrder = null;
        return this.source.splice(start, deleteCount, added);
    }

    reset(): void {
        this._itemsOrder = null;
        this._items = [];
        return this.source.reset();
    }

    getDisplayIndex(collectionIndex: number): number {
        const itemsOrder = this._getItemsOrder();
        const sourceIndex = this.source.getDisplayIndex(collectionIndex);
        const overallIndex = sourceIndex + this._items.length;
        const itemIndex = itemsOrder.indexOf(overallIndex);
        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    getCollectionIndex(displayIndex: number): number {
        const itemsOrder = this._getItemsOrder();
        const overallIndex = itemsOrder[displayIndex];
        let sourceIndex = overallIndex - this._items.length;
        sourceIndex = sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;
        return sourceIndex;
    }

    protected _getItems(): T[] {
        if (!this._items) {
            this._items = [];
        }
        return this._items.concat(this.source.items);
    }

    private _createSpaceItems(): T[] {
        const spaceItems = [];

        const sourceItems = this.source.items;
        const sourceItemsCount = sourceItems.length;
        const hiddenGroupIndex = this._getHiddenGroupIndex();
        const hasHiddenGroup = hiddenGroupIndex !== -1;
        const addAllSpaces = this._options.itemsSpacingVisibility === 'all';

        const startIndex = +!addAllSpaces + (hasHiddenGroup ? 1 : 0);
        for (let i = startIndex; i < sourceItemsCount; i++) {
            const sourceItemIndex = this._getSourceItemIndexBySpaceItemIndex(i);
            spaceItems.push(this._options.spaceItemFactory(sourceItems[sourceItemIndex]));
        }

        return spaceItems;
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

    protected _createItemsOrder(): number[] {
        const sourceItems = this.source.items;
        const sourceItemsCount = sourceItems.length;
        const spaceItems = this._items;

        const newSpaceItems = this._createSpaceItems();
        // Удаляем элементы, которых больше не существует
        let i = 0;
        while (i < spaceItems.length) {
            const spaceItem = spaceItems[i];
            const existSpaceItemInNewItems = newSpaceItems.some((it) => {
                return it.key === spaceItem.key;
            });
            if (existSpaceItemInNewItems) {
                i++;
            } else {
                spaceItems.splice(i, 1);
            }
        }
        // Добавляем новые элементы
        newSpaceItems.forEach((newSpaceItem, index) => {
            const existItem = spaceItems.some((it) => {
                return it.key === newSpaceItem.key;
            });
            if (!existItem) {
                spaceItems.splice(index, 0, newSpaceItem);
            }
        });

        const spaceItemsCount = spaceItems.length;
        const itemsOrder: number[] = [];
        const addAllSpaces = this._options.itemsSpacingVisibility === 'all';
        let spaceItemIndex = 0;
        for (let sourceItemIndex = 0; sourceItemIndex < sourceItemsCount; sourceItemIndex++) {
            if (spaceItemIndex === 0 && addAllSpaces) {
                itemsOrder.push(spaceItemIndex);
                spaceItemIndex++;
            }
            itemsOrder.push(sourceItemIndex + spaceItemsCount);
            const sourceItem = sourceItems[sourceItemIndex];
            // После итема скрытой группы нужно пропустить добавления записи отступа,
            // т.к. запись этой группы имеет нулевую высоту и отступ после неё лишний
            if (
                (sourceItem as unknown as GroupItem<unknown>).contents ===
                groupConstants.hiddenGroup
            ) {
                continue;
            }

            if (spaceItemIndex < spaceItemsCount) {
                itemsOrder.push(spaceItemIndex);
                spaceItemIndex++;
            }
        }
        return itemsOrder;
    }

    private _getHiddenGroupIndex(): number {
        return this.source.items.findIndex((item) => {
            return (item as unknown as GroupItem<unknown>).contents === groupConstants.hiddenGroup;
        });
    }

    private _getSourceItemIndexBySpaceItemIndex(spaceItemIndex: number): number {
        /*
         * Просто цифра - индекс sourceItem
         * Цифра с минусом - индекс spaceItem
         * 0         0 hide-group        0
         * -0        1                   -0
         * 1         -1                  1
         * -1        2                   -1
         * 2         -2                  2 hide-group
         * -2        3                   3
         * 3         -3                  -2
         * -3        4                   4
         * 4
         * */
        const hiddenGroupIndex = this._getHiddenGroupIndex();
        const hasHiddenGroup = hiddenGroupIndex !== -1;
        return !hasHiddenGroup || hiddenGroupIndex < spaceItemIndex
            ? spaceItemIndex
            : spaceItemIndex + 1;
    }
}

Object.assign(ItemsSpacingStrategy.prototype, {
    '[Controls/_display/itemsStrategy/ItemsSpacingStrategy]': true,
    _moduleName: 'Controls/display:itemsStrategy.ItemsSpacingStrategy',
});
