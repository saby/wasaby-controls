/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import IItemsStrategy, {
    IOptions as IItemsStrategyOptions,
} from '../IItemsStrategy';
import AbstractCollection from '../Abstract';
import { ISourceCollection } from '../interface/ICollection';
import {
    DestroyableMixin,
    SerializableMixin,
    ISerializableState as IDefaultSerializableState,
} from 'Types/entity';
import { IEnumerator, IList } from 'Types/collection';
import { mixin } from 'Types/util';

export interface IOptions<S, T> extends IItemsStrategyOptions<S, T> {
    // Исходная коллекция данных
    display?: AbstractCollection<S, T>;
    localize?: boolean;
}

export interface ISerializableState<T> extends IDefaultSerializableState {
    _items: T[];
}

/**
 * Абстрактная стратегия получения элементов проекции
 * @class Controls/_display/ItemsStrategy/Abstract
 *
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 * @private
 */
export default abstract class Abstract<S, T>
    extends mixin<DestroyableMixin, SerializableMixin>(
        DestroyableMixin,
        SerializableMixin
    )
    implements IItemsStrategy<S, T>
{
    get options(): IOptions<S, T> {
        return { ...this._options };
    }

    get source(): IItemsStrategy<S, T> {
        return null;
    }

    get count(): number {
        throw new Error('Property must be implemented');
    }

    get items(): T[] {
        return this._getItems();
    }

    /**
     * @typedef {Object} Options
     * @property {Boolean} localize Алиас зависимости или конструктора элементов проекции
     * @property {Controls/_display/Collection} display Проекция
     */

    /**
     * Элементы проекции
     */
    protected _items: T[];

    protected _itemsOrder: number[];

    /**
     * Кэш элементов исходной коллекции
     */
    protected _sourceItems: T[];

    /**
     * Опции
     */
    protected _options: IOptions<S, T>;

    // region IItemsStrategy

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    at(index: number): T {
        throw new Error('Method must be implemented');
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        throw new Error('Method must be implemented');
    }

    reset(): void {
        this._items = null;
        this._sourceItems = null;
    }

    invalidate(): void {
        // Could be redefined
    }

    getDisplayIndex(index: number): number {
        return index;
    }

    getCollectionIndex(index: number): number {
        return index;
    }

    // endregion

    // region SerializableMixin

    _getSerializableState(
        state: IDefaultSerializableState
    ): ISerializableState<T> {
        const resultState: ISerializableState<T> =
            super._getSerializableState.call(this, state);

        resultState.$options = this._options;
        resultState._items = this._items;

        return resultState;
    }

    _setSerializableState(state: ISerializableState<T>): Function {
        const fromSerializableMixin = super._setSerializableState(state);

        return function (): void {
            fromSerializableMixin.call(this);
            this._items = state._items;
        };
    }

    // endregion

    // region Protected members

    /**
     * Возвращает исходную коллекцию
     * @protected
     */
    protected _getCollection(): ISourceCollection<S> {
        return this._options.display.getSourceCollection();
    }

    /**
     * Возвращает энумератор коллекции
     * @protected
     */
    protected _getCollectionEnumerator(): IEnumerator<S> {
        return this._getCollection().getEnumerator(this._options.localize);
    }

    /**
     * Возвращает элементы проекции
     * @protected
     */
    protected _getItems(): T[] {
        if (!this._items) {
            this._initItems();
        }

        return this._items;
    }

    /**
     * Инициализирует элементы
     * @protected
     */
    protected _initItems(): void {
        this._items = this._items || [];
        this._items.length = this._getSourceCollectionCount();
    }

    private _getSourceCollectionCount(): number {
        const collection = this._getCollection();
        if (collection['[Types/_collection/IList]']) {
            return (collection as unknown as IList<S>).getCount();
        }

        const enumerator = collection.getEnumerator();
        let count = 0;
        enumerator.reset();
        while (enumerator.moveNext()) {
            count++;
        }
        return count;
    }

    /**
     * Возвращает элементы исходной коллекции
     * @protected
     */
    protected _getSourceItems(): any[] {
        if (this._sourceItems) {
            return this._sourceItems;
        }

        const enumerator = this._getCollectionEnumerator();
        const items = [];
        enumerator.reset();
        while (enumerator.moveNext()) {
            items.push(enumerator.getCurrent());
        }

        return (this._sourceItems = items);
    }

    /**
     * Создает элемент проекции
     * @protected
     */
    protected _createItem(contents: S): T {
        return this.options.display.createItem({ contents });
    }

    // endregion
}

Object.assign(Abstract.prototype, {
    '[Controls/_display/itemsStrategy/DestroyableMixin]': true,
    _moduleName: 'Controls/display:itemsStrategy.DestroyableMixin',
    _items: null,
    _sourceItems: null,
});
