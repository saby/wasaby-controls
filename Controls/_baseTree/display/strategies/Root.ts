/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { IItemsStrategy, IItemsStrategyOptions } from 'Controls/display';
import {
    DestroyableMixin,
    SerializableMixin,
    ISerializableState,
} from 'Types/entity';
import { mixin } from 'Types/util';

interface IOptions<S, T> {
    source: IItemsStrategy<S, T>;
    root: Function;
}

/**
 * Стратегия-декоратор для формирования корня дерева
 * @class Controls/_baseTree/RootStrategy
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class Root<S, T>
    extends mixin<DestroyableMixin, SerializableMixin>(
        DestroyableMixin,
        SerializableMixin
    )
    implements IItemsStrategy<S, T>
{
    /**
     * Корень дерева
     */
    get root(): T {
        return this._options.root();
    }

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
        return [this.root].concat(this.source.items);
    }
    /**
     * @typedef {Object} Options
     * @property {Controls/_display/ItemsStrategy/Abstract} source Декорирумая стратегия
     * @property {Function:Controls/_display/TreeItem} root Функция, возвращающая корень дерева
     */

    /**
     * Опции конструктора
     */
    protected _options: IOptions<S, T>;

    // region IItemsStrategy

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    at(index: number): T {
        if (index === 0) {
            return this.root;
        } else {
            return this.source.at(index - 1);
        }
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        return this.source.splice(start, deleteCount, added);
    }

    reset(): void {
        return this.source.reset();
    }

    invalidate(): void {
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        if (isNaN(parseInt(String(index), 10))) {
            return -1;
        }
        index = this.source.getDisplayIndex(index);
        return index === -1 ? index : 1 + index;
    }

    getCollectionIndex(index: number): number {
        return this.source.getCollectionIndex(index - 1);
    }

    // endregion

    // region SerializableMixin

    _getSerializableState(state: ISerializableState): ISerializableState {
        const resultState =
            SerializableMixin.prototype._getSerializableState.call(this, state);
        resultState.$options = this._options;
        return resultState;
    }

    // endregion
}

Object.assign(Root.prototype, {
    '[Controls/_baseTree/RootStrategy]': true,
    _moduleName: 'Controls/display:itemsStrategy.Root',
});
