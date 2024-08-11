/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import AbstractStrategy, {
    IOptions as IAbstractOptions,
    ISerializableState as IDefaultSerializableState,
} from './AbstractStrategy';
import CollectionItem from '../CollectionItem';
import { object } from 'Types/util';
import { Set } from 'Types/shim';
import { TLogError } from '../interface/ICollection';

interface IOptions<S, T> extends IAbstractOptions<S, T> {
    // Признак обеспечения уникальности элементов
    unique?: boolean;
    validateUnique?: boolean;
    logError?: TLogError;
    // Название свойства элемента коллекции, содержащего его уникальный идентификатор
    keyProperty?: string;
}

interface ISortOptions {
    unique?: boolean;
    validateUnique?: boolean;
    logError?: TLogError;
    keyProperty?: string;
}

interface ISerializableState<T> extends IDefaultSerializableState<T> {
    _itemsOrder: number[];
}

/**
 * Стратегия получения элементов проекции напрямую по коллекции
 * @class Controls/_display/ItemsStrategy/Direct
 * @extends Controls/_display/ItemsStrategy/Abstract
 * @private
 */
export default class Direct<S, T> extends AbstractStrategy<S, T> {
    protected _options: IOptions<S, T>;

    /**
     * Индекс в стратегии -> оригинальный индекс
     */
    protected _itemsOrder: number[];

    /**
     * @typedef {Object} Options
     * @property {Controls/_display/Collection} display Проекция
     * @property {Boolean} unique Признак обеспечения униconstьности элементов
     * @property {String} keyProperty Название свойства элемента коллекции, содержащего его уникальный идентификатор
     */

    constructor(options: IOptions<S, T>) {
        super(options);
    }

    /**
     * Устанавливает признак обеспечения уникальности элементов
     */
    set unique(value: boolean) {
        this._options.unique = value;
    }

    /**
     * Устанавливает название свойства элемента коллекции, содержащего его уникальный идентификатор
     */
    set keyProperty(value: string) {
        this._options.keyProperty = value;
    }

    // region IItemsStrategy

    get count(): number {
        return this._getItemsOrder().length;
    }

    get items(): T[] {
        const items = this._getItems();
        const itemsOrder = this._getItemsOrder();

        return itemsOrder.map((position) => {
            return items[position];
        });
    }

    at(index: number): T {
        const items = this._getItems();
        const itemsOrder = this._getItemsOrder();
        const position = itemsOrder[index];

        if (position === undefined) {
            throw new ReferenceError(`Display index ${index} is out of bounds.`);
        }

        return items[position];
    }

    splice(start: number, deleteCount: number, added: S[] = []): T[] {
        const reallyAdded: T[] = added.map((contents) => {
            return contents instanceof CollectionItem
                ? (contents as unknown as T)
                : this._createItem(contents);
        });
        const result = this._getItems().splice(start, deleteCount, ...reallyAdded);

        this._itemsOrder = null;

        return result;
    }

    reset(): void {
        super.reset();
        this._itemsOrder = null;
    }

    invalidate(): void {
        super.invalidate();
        this._itemsOrder = null;
    }

    getDisplayIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const itemIndex = itemsOrder.indexOf(index);

        return itemIndex === -1 ? itemsOrder.length : itemIndex;
    }

    getCollectionIndex(index: number): number {
        const itemsOrder = this._getItemsOrder();
        const itemIndex = itemsOrder[index];
        return itemIndex === undefined ? -1 : itemIndex;
    }

    // endregion

    // region SerializableMixin

    _getSerializableState(state: IDefaultSerializableState<T>): ISerializableState<T> {
        const resultState = super._getSerializableState(state) as ISerializableState<T>;

        resultState._itemsOrder = this._itemsOrder;

        return resultState;
    }

    _setSerializableState(state: ISerializableState<T>): Function {
        const fromSuper = super._setSerializableState(state);
        return function (): void {
            this._itemsOrder = state._itemsOrder;
            fromSuper.call(this);
        };
    }

    // endregion

    // region Protected

    protected _initItems(): void {
        super._initItems();

        const items = this._items;
        const sourceItems = this._getSourceItems();
        const count = items.length;
        for (let index = 0; index < count; index++) {
            items[index] = this._createItem(sourceItems[index]);
        }
    }

    /**
     * Returns relation between internal and original indices
     * @protected
     */
    protected _getItemsOrder(): number[] {
        if (!this._itemsOrder) {
            this._itemsOrder = this._createItemsOrder();
        }
        return this._itemsOrder;
    }

    protected _createItemsOrder(): number[] {
        return Direct.sortItems<T>(this._getItems(), {
            keyProperty: this._options.keyProperty,
            unique: this._options.unique,
            validateUnique: this._options.validateUnique,
            logError: this._options.logError,
        });
    }

    // endregion

    // region Statics

    /**
     * Создает индекс сортировки в том же порядке, что и коллекция
     * @param items Элементы проекции.
     * @param options Опции
     */
    static sortItems<T>(items: T[], options: ISortOptions): number[] {
        const keyProperty = options.keyProperty;

        if (!options.unique || !keyProperty) {
            return items.map((item, index) => {
                return index;
            });
        }

        const processed = new Set();
        const result = [];
        let itemId;

        (items as any as CollectionItem<any>[]).forEach((item, index) => {
            itemId = object.getPropertyValue(item.getContents(), keyProperty);
            if (processed.has(itemId)) {
                if (options.validateUnique && options.logError) {
                    options.logError(
                        `Сырые данные содержат дубли записей с ключом "${keyProperty}"="${itemId}".`
                    );
                }
                return;
            }

            processed.add(itemId);
            result.push(index);
        });

        return result;
    }

    // endregion
}

Object.assign(Direct.prototype, {
    '[Controls/_display/itemsStrategy/Direct]': true,
    _moduleName: 'Controls/display:itemsStrategy.Direct',
    _itemsOrder: null,
});
