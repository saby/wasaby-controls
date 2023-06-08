import {
    Collection as BaseCollection,
    ICollectionOptions,
    ItemsFactory,
    itemsStrategy,
} from 'Controls/display';
import CollectionItem from './CollectionItem';
import { Model } from 'Types/entity';
import SpacersStrategy from './strategy/Spacers';

const SPACING = {
    null: 0,
    '3xs': 1,
    '2xs': 2,
    xs: 3,
    s: 4,
    m: 6,
    l: 8,
    xl: 10,
    '2xl': 12,
    '3xl': 14,
    default: 6,
};

export interface IAdaptiveTileCollectionOptions<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> extends ICollectionOptions<S, T> {
    minItemHeight: number;
    maxItemHeight: number;
    minItemWidth: number;
    maxItemWidth: number;
    availableHeight: number;
}

export default class Collection<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> extends BaseCollection<S, T> {
    protected _$minItemHeight: number;
    protected _$maxItemHeight: number;
    protected _$minItemWidth: number;
    protected _$maxItemWidth: number;
    protected _$availableHeight: number;
    protected _$imageProperty: string;

    /**
     * Число записей, помещающихся по высоте
     * @protected
     */
    protected _maxItemsByHeight: number;

    constructor(options: IAdaptiveTileCollectionOptions<S, T>) {
        super(options);
    }

    protected _createComposer(): itemsStrategy.Composer<S, T> {
        const composer = super._createComposer();
        this.updateMaxItemsByHeight();
        composer.append(SpacersStrategy, {
            display: this,
        });

        return composer;
    }

    setMinItemHeight(minItemHeight: number): void {
        if (minItemHeight !== this._$minItemHeight) {
            this._$minItemHeight = minItemHeight;
            this._nextVersion();
        }
    }
    getMinItemHeight(): number {
        return this._$minItemHeight;
    }

    setMaxItemHeight(maxItemHeight: number): void {
        if (maxItemHeight !== this._$maxItemHeight) {
            this._$maxItemHeight = maxItemHeight;
            this._nextVersion();
        }
    }
    getMaxItemHeight(): number {
        return this._$maxItemHeight;
    }

    setMinItemWidth(minItemWidth: number): void {
        if (minItemWidth !== this._$minItemWidth) {
            this._$minItemWidth = minItemWidth;
            this._nextVersion();
        }
    }
    getMinItemWidth(): number {
        return this._$minItemWidth;
    }

    setMaxItemWidth(maxItemWidth: number): void {
        if (maxItemWidth !== this._$maxItemWidth) {
            this._$maxItemWidth = maxItemWidth;
            this._nextVersion();
        }
    }
    getMaxItemWidth(): number {
        return this._$maxItemWidth;
    }

    setImageProperty(imageProperty: string): void {
        if (imageProperty !== this._$imageProperty) {
            this._$imageProperty = imageProperty;
            this._nextVersion();
        }
    }
    getImageProperty(): string {
        return this._$imageProperty;
    }

    setAvailableHeight(availableHeight: number): void {
        if (availableHeight !== this._$availableHeight) {
            this._$availableHeight = availableHeight;
            const maxItemsByHeightChanged = this.updateMaxItemsByHeight();
            if (maxItemsByHeightChanged) {
                const session = this._startUpdateSession();
                this.getStrategyInstance(SpacersStrategy).invalidate();
                this._reSort();
                this._reFilter();
                this._finishUpdateSession(session, true);
            }
        }
    }
    getAvailableHeight(): number {
        return this._$availableHeight;
    }

    updateMaxItemsByHeight(): boolean {
        const itemHeightWithSpacing =
            this._$minItemHeight +
            SPACING[this._$topPadding] +
            SPACING[this._$topPadding];
        const newMaxItemsByHeight = Math.floor(
            this._$availableHeight / itemHeightWithSpacing
        );
        if (newMaxItemsByHeight !== this._maxItemsByHeight) {
            this._maxItemsByHeight = newMaxItemsByHeight;
            return true;
        }
    }
    getMaxItemsByHeight(): number {
        return this._maxItemsByHeight;
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(
            options?: Record<string, unknown>
        ): T {
            options.minItemHeight = this._$minItemHeight;
            options.maxItemHeight = this._$maxItemHeight;
            options.minItemWidth = this._$minItemWidth;
            options.maxItemWidth = this._$maxItemWidth;
            options.availableHeight = this._$availableHeight;
            return superFactory.call(this, options);
        };
    }
}

Object.assign(Collection.prototype, {
    '[Controls/_adaptiveTile/Collection]': true,
    _moduleName: 'Controls/adaptiveTile:Collection',
    _itemModule: 'Controls/adaptiveTile:CollectionItem',
    _$minItemHeight: null,
    _$maxItemHeight: null,
    _$minItemWidth: null,
    _$maxItemWidth: null,
    _$availableHeight: null,
    _$imageProperty: null,
});
