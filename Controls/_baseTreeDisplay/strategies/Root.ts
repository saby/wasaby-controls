/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { itemsStrategy } from 'Controls/display';
import { DestroyableMixin, SerializableMixin, ISerializableState, Model } from 'Types/entity';
import { mixin } from 'Types/util';

/**
 * Стратегия-декоратор для формирования корня дерева
 * @class Controls/_baseTree/RootStrategy
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:SerializableMixin
 *
 * @private
 */
export default class Root<S, T> extends mixin<
    itemsStrategy.Proxy,
    DestroyableMixin,
    SerializableMixin
>(itemsStrategy.Proxy, DestroyableMixin, SerializableMixin) {
    /**
     * Корень дерева
     */
    get root(): T {
        return this._options.root();
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

    // region IItemsStrategy

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

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
        const resultState = SerializableMixin.prototype._getSerializableState.call(this, state);
        resultState.$options = this._options;
        return resultState;
    }

    // endregion
}

Object.assign(Root.prototype, {
    '[Controls/_baseTree/RootStrategy]': true,
    _moduleName: 'Controls/display:itemsStrategy.Root',
});
