/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import IItemsStrategy, { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';
import { DestroyableMixin, SerializableMixin, ISerializableState, Model } from 'Types/entity';
import { mixin } from 'Types/util';
import CollectionItem from '../CollectionItem';

interface IOptions<S extends Model, T extends CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    item: T;
    addPosition: 'top' | 'bottom';
    addIndex?: number;
    groupMethod?: Function;
}

/**
 * Стратегия-декоратор для отображения добавляемой записи
 * @class Controls/_display/ItemsStrategy/Add
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class Add<S extends Model, T extends CollectionItem<S>>
    extends mixin<DestroyableMixin, SerializableMixin>(DestroyableMixin, SerializableMixin)
    implements IItemsStrategy<S, T>
{
    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get options(): IItemsStrategyOptions<S, T> {
        return this.source.options;
    }

    get count(): number {
        return this.source.count + 1;
    }

    get items(): T[] {
        const addItemIndex = this._getAddingItemIndex();

        if (addItemIndex === 0) {
            return [this._options.item].concat(this.source.items);
        } else if (addItemIndex === this.count - 1) {
            return this.source.items.concat([this._options.item]);
        } else {
            // Важно оставить исходную коллекцию без изменений.
            const items = this.source.items.slice();
            items.splice(addItemIndex, 0, this._options.item);
            return items;
        }
    }

    protected _options: IOptions<S, T>;
    private _addingItemIndex?: number;

    // region IItemsStrategy

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    at(index: number): T {
        const addItemIndex = this._getAddingItemIndex();

        if (index === addItemIndex) {
            return this._options.item;
        } else if (index < addItemIndex) {
            return this.source.at(index);
        } else {
            return this.source.at(index - 1);
        }
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._addingItemIndex = undefined;
        return this.source.splice(start, deleteCount, added);
    }

    reset(): void {
        this._addingItemIndex = undefined;
        return this.source.reset();
    }

    invalidate(): void {
        this._addingItemIndex = undefined;
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        const addItemIndex = this._getAddingItemIndex();

        if (index === addItemIndex) {
            return -1;
        } else if (index < addItemIndex) {
            return this.source.getDisplayIndex(index);
        } else {
            return this.source.getDisplayIndex(index - 1);
        }
    }

    getCollectionIndex(index: number): number {
        const addItemIndex = this._getAddingItemIndex();

        if (index === addItemIndex) {
            return -1;
        } else if (index < addItemIndex) {
            return this.source.getCollectionIndex(index);
        } else {
            return this.source.getCollectionIndex(index - 1);
        }
    }

    // endregion

    getAddingItem(): T {
        return this._options.item;
    }

    getAddingItemIndex(): number {
        return this._getAddingItemIndex();
    }

    private _getAddingItemIndex(): number {
        if (this._addingItemIndex === undefined) {
            this._addingItemIndex = Add._calculateIndex<S, T>(this._options, this.source);
        }
        return this._addingItemIndex;
    }

    // region SerializableMixin

    _getSerializableState(state: ISerializableState): ISerializableState {
        const resultState = SerializableMixin.prototype._getSerializableState.call(this, state);
        resultState.$options = this._options;
        return resultState;
    }

    private static _calculateIndex<S extends Model, T extends CollectionItem<S>>(
        options: IOptions<S, T>,
        source: IItemsStrategy<S, T>
    ): number {
        if (typeof options.addIndex === 'number') {
            const dIndex = options.source.getDisplayIndex(options.addIndex);
            if (dIndex !== -1) {
                return dIndex + (options.addPosition === 'bottom' ? 1 : 0);
            }
        }
        // Индекс может расчитываться по разному в зависимости от типа элемента, но порядок должем быть таким:
        // элемент дерева, элемент группы, элемент простого плоского списка.
        // Для элемента дерева не важно поле группировки. Такой элемент может быть добавлен:
        //  + в родителя, который уже находится в группе;
        //  + в корень, тогда стратегия группировки сама создаст новую группу, если нужно.
        // Получается, что не нужно расчитывать индексы для такого элемента, достаточно вставить в начало или конец.
        // Если элемент дочерний, то его правильным отображением займется стратегия древовидного отображения,
        // иначе - стратегия группировки.
        // Для элемента группы необходимо расчитать индекс в группе. Если позиция добавления top,
        // то запись добавляется на место первого элемента группы, иначе последнего.
        if (options.item['[Controls/_display/TreeItem]']) {
            return options.addPosition === 'top' ? 0 : source.count;
        } else if (options.groupMethod) {
            return Add._calculateGroupedItemIndex(options.item, options, source);
        } else {
            return options.addPosition === 'top' ? 0 : source.count;
        }
    }

    private static _calculateGroupedItemIndex<S extends Model, T extends CollectionItem<S>>(
        item: T,
        options: IOptions<S, T>,
        source: IItemsStrategy<S, T>
    ): number {
        const groupId = options.groupMethod(item.contents);
        if (options.addPosition === 'top') {
            let index = -1;
            source.items.forEach((sourceItem, sourceIndex) => {
                if (index === -1 && options.groupMethod(sourceItem.contents) === groupId) {
                    index = sourceIndex;
                }
            });
            return index === -1 ? 0 : index;
        } else {
            let index = source.count;
            source.items.forEach((sourceItem, sourceIndex) => {
                if (options.groupMethod(sourceItem.contents) === groupId) {
                    index = sourceIndex + 1;
                }
            });
            return index;
        }
    }

    // endregion
}

Object.assign(Add.prototype, {
    '[Controls/_display/itemsStrategy/Add]': true,
    _moduleName: 'Controls/display:itemsStrategy.Add',
});
