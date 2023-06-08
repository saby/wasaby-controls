/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import IItemsStrategy, { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';
import { DestroyableMixin, Model } from 'Types/entity';
import { mixin } from 'Types/util';
import CollectionItem from 'Controls/_display/CollectionItem';

interface IOptions<S extends Model, T extends CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
}

/**
 * Стратегия-декоратор для отображения анимации при удалении и добавлении записи
 * @class Controls/_display/ItemsStrategy/Animation
 * @mixes Types/entity:DestroyableMixin
 *
 * @private
 */
export default class Animation<S extends Model, T extends CollectionItem<S>>
    extends mixin<DestroyableMixin>(DestroyableMixin)
    implements IItemsStrategy<S, T>
{
    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get options(): IItemsStrategyOptions<S, T> {
        return this.source.options;
    }

    get count(): number {
        return this.source.count + (this._removedItem ? 1 : 0);
    }

    get items(): T[] {
        const animatedIndex = this._animatedIndex;

        if (typeof this._animatedIndex === 'undefined') {
            return this.source.items;
        } else if (animatedIndex === this.count - 1) {
            return this.source.items.concat([this._removedItem]);
        } else {
            const items = this.source.items.slice();
            items.splice(animatedIndex, 0, this._removedItem);
            return items;
        }
    }

    protected _options: IOptions<S, T>;
    protected _removedItem: T;
    protected _animatedIndex: number;

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    at(index: number): T {
        if (typeof this._animatedIndex === 'undefined') {
            return this.source.at(index);
        } else if (index < this._animatedIndex) {
            return this.source.at(index);
        } else {
            return this._removedItem ? this.source.at(index - 1) : this.source.at(index);
        }
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        if (deleteCount === 1 && (!added || !added.length)) {
            this._removedItem = this.at(start);
            this._removedItem.setAnimation('rm');
            this._animatedIndex = start;
        }
        const result = this.source.splice(start, deleteCount, added);
        if (this._removedItem) {
            return result.splice(start, 0, this._removedItem);
        } else {
            return result;
        }
    }

    reset(): void {
        this._removedItem = undefined;
        this._animatedIndex = undefined;
        return this.source.reset();
    }

    invalidate(): void {
        this._removedItem = undefined;
        this._animatedIndex = undefined;
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        if (typeof this._animatedIndex === 'undefined') {
            return this.source.getDisplayIndex(index);
        } else if (index === this._animatedIndex) {
            return this._removedItem ? -1 : this.source.getDisplayIndex(index);
        } else if (index < this._animatedIndex) {
            return this.source.getDisplayIndex(index);
        } else {
            return this._removedItem
                ? this.source.getDisplayIndex(index - 1)
                : this.source.getDisplayIndex(index);
        }
    }

    getCollectionIndex(index: number): number {
        if (typeof this._animatedIndex === 'undefined') {
            return this.source.getCollectionIndex(index);
        } else if (index === this._animatedIndex) {
            return this._removedItem ? -1 : this.source.getCollectionIndex(index);
        } else if (index < this._animatedIndex) {
            return this.source.getCollectionIndex(index);
        } else {
            return this._removedItem
                ? this.source.getCollectionIndex(index - 1)
                : this.source.getCollectionIndex(index);
        }
    }

    setAnimatedIndex(index: number): void {
        this._animatedIndex = index;
    }
}

Object.assign(Animation.prototype, {
    '[Controls/_display/itemsStrategy/Animation]': true,
    _moduleName: 'Controls/display:itemsStrategy.Animation',
});
