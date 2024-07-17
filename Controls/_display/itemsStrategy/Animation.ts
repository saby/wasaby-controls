/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import IItemsStrategy, { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';
import { DestroyableMixin, Model } from 'Types/entity';
import { mixin } from 'Types/util';
import CollectionItem from 'Controls/_display/CollectionItem';
import Collection from 'Controls/_display/Collection';
import AnimatedItem from '../AnimatedItem';

interface IOptions<S extends Model, T extends CollectionItem<S>> {
    source: IItemsStrategy<S, T>;
    display: Collection<S, T>;
    itemModule: typeof AnimatedItem;
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
        if (typeof this._removingIndex === 'undefined') {
            return this.source.items;
        } else if (this._removingIndex === this.count - 1) {
            return this.source.items.concat([this._removedItem]);
        } else {
            const items = this.source.items.slice();
            items.splice(this._removingIndex, 0, this._removedItem);
            return items;
        }
    }

    protected _options: IOptions<S, T>;
    protected _removedItem: T;
    protected _addingIndex: number;
    protected _removingIndex: number;

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    at(index: number): T {
        if (typeof this._removingIndex === 'undefined') {
            return this.source.at(index);
        } else if (index < this._removingIndex) {
            return this.source.at(index);
        } else {
            return this._removedItem ? this.source.at(index - 1) : this.source.at(index);
        }
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        if (deleteCount === 1 && (!added || !added.length)) {
            this._removedItem = this.at(start);
            this._removedItem = this.options.display.createItem({
                itemModule: this._options.itemModule,
                contents: this.at(start).contents,
            });
            this._removedItem.setAnimation('rm');
            this._removingIndex = start;
        }
        const result = this.source.splice(start, deleteCount, added);
        if (added && added.length === 1) {
            this._addingIndex = start;
            if (
                typeof this._removingIndex !== 'undefined' &&
                this._addingIndex < this._removingIndex
            ) {
                this._removingIndex += 1;
            }
            this.source.items[this._addingIndex].setAnimation('a');
        }
        return result;
    }

    reset(): void {
        this._removedItem = undefined;
        this._addingIndex = undefined;
        this._removingIndex = undefined;
        return this.source.reset();
    }

    invalidate(): void {
        this._removedItem = undefined;
        this._addingIndex = undefined;
        this._removingIndex = undefined;
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        if (typeof this._removingIndex === 'undefined') {
            return this.source.getDisplayIndex(index);
        } else if (index === this._removingIndex) {
            return this._removedItem ? -1 : this.source.getDisplayIndex(index);
        } else if (index < this._removingIndex) {
            return this.source.getDisplayIndex(index);
        } else {
            return this._removedItem
                ? this.source.getDisplayIndex(index - 1)
                : this.source.getDisplayIndex(index);
        }
    }

    getCollectionIndex(index: number): number {
        if (typeof this._removingIndex === 'undefined') {
            return this.source.getCollectionIndex(index);
        } else if (index === this._removingIndex) {
            return this._removedItem ? -1 : this.source.getCollectionIndex(index);
        } else if (index < this._removingIndex) {
            return this.source.getCollectionIndex(index);
        } else {
            return this._removedItem
                ? this.source.getCollectionIndex(index - 1)
                : this.source.getCollectionIndex(index);
        }
    }
}

Object.assign(Animation.prototype, {
    '[Controls/_display/itemsStrategy/Animation]': true,
    _moduleName: 'Controls/display:itemsStrategy.Animation',
});
