import {
    Collection as BaseCollection,
    ICollectionOptions,
    ItemsFactory,
    itemsStrategy,
} from 'Controls/display';
import CollectionItem from './CollectionItem';
import { Model } from 'Types/entity';
import SpacersStrategy from './strategy/Spacers';
import { ISessionItems } from 'Controls/display';

export const SPACING = {
    null: 0,
    '3xs': 2,
    '2xs': 4,
    xs: 6,
    s: 8,
    st: 10,
    m: 12,
    l: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    default: 8,
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
    availableWidth: number;
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
    protected _$availableWidth: number;
    protected _$imageProperty: string;
    protected _hasFreeSpace: boolean;

    /**
     * Число записей, помещающихся по высоте
     * @protected
     */
    protected _maxItemsByHeight: number;

    /**
     * Текущая ширина записи
     * @protected
     */
    protected _itemWidth: number;

    constructor(options: IAdaptiveTileCollectionOptions<S, T>) {
        super(options);
        this.updateHasFreeSpace();
        this.updateItemsWidth();
    }

    protected _createComposer(): itemsStrategy.Composer<S, T> {
        const composer = super._createComposer();
        this.updateMaxItemsByHeight();
        composer.append(SpacersStrategy, {
            display: this,
        });

        return composer;
    }

    protected _handleAfterCollectionChange(
        changedItems: ISessionItems<T> = [],
        changeAction?: string
    ): void {
        super._handleAfterCollectionChange(changedItems, changeAction);
        this.updateHasFreeSpace();
        this.updateItemsWidth();
    }

    updateHasFreeSpace(): void {
        const itemsCount = this.getCount();
        const columnsCount = Math.ceil(itemsCount / this._maxItemsByHeight);
        const hasFreeSpace = columnsCount * this._$maxItemWidth < this._$availableWidth;
        if (this._hasFreeSpace !== hasFreeSpace) {
            this._hasFreeSpace = hasFreeSpace;
            this._updateItemsProperty('setHasFreeSpace', this._hasFreeSpace, 'setHasFreeSpace');
            this._nextVersion();
        }
    }

    hasFreeSpace(): boolean {
        return this._hasFreeSpace;
    }

    setMinItemHeight(minItemHeight: number): void {
        if (minItemHeight !== this._$minItemHeight) {
            this._$minItemHeight = minItemHeight;
            this._updateItemsProperty('setMinItemHeight', this._$minItemHeight, 'setMinItemHeight');
            this._nextVersion();
        }
    }

    getMinItemHeight(): number {
        return this._$minItemHeight;
    }

    setMaxItemHeight(maxItemHeight: number): void {
        if (maxItemHeight !== this._$maxItemHeight) {
            this._$maxItemHeight = maxItemHeight;
            this._updateItemsProperty('setMaxItemHeight', this._$maxItemHeight, 'setMaxItemHeight');
            this._nextVersion();
        }
    }

    getMaxItemHeight(): number {
        return this._$maxItemHeight;
    }

    setMinItemWidth(minItemWidth: number): void {
        if (minItemWidth !== this._$minItemWidth) {
            this._$minItemWidth = minItemWidth;
            this.updateItemsWidth();
            this._updateItemsProperty('setMinItemWidth', this._$minItemWidth, 'setMinItemWidth');
            this._nextVersion();
        }
    }

    getMinItemWidth(): number {
        return this._$minItemWidth;
    }

    setMaxItemWidth(maxItemWidth: number): void {
        if (maxItemWidth !== this._$maxItemWidth) {
            this._$maxItemWidth = maxItemWidth;
            this.updateItemsWidth();
            this._updateItemsProperty('setMaxItemWidth', this._$maxItemWidth, 'setMaxItemWidth');
            this._nextVersion();
        }
    }

    getMaxItemWidth(): number {
        return this._$maxItemWidth;
    }

    setItemWidth(itemWidth: number): void {
        if (itemWidth !== this._itemWidth) {
            this._itemWidth = itemWidth;
            this._updateItemsProperty('setItemWidth', this._itemWidth, 'setItemWidth');
            this._nextVersion();
        }
    }

    getItemWidth(): number {
        return this._itemWidth;
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

    setAvailableWidth(availableWidth: number): void {
        if (availableWidth !== this._$availableWidth) {
            this._$availableWidth = availableWidth;
            this.updateHasFreeSpace();
            this.updateItemsWidth();
        }
    }

    getAvailableHeight(): number {
        return this._$availableHeight;
    }

    updateMaxItemsByHeight(): boolean {
        const itemHeightWithSpacing =
            this._$minItemHeight + SPACING[this._$topPadding] + SPACING[this._$topPadding];
        const newMaxItemsByHeight = Math.floor(this._$availableHeight / itemHeightWithSpacing);
        if (newMaxItemsByHeight !== this._maxItemsByHeight) {
            this._maxItemsByHeight = newMaxItemsByHeight;
            return true;
        }
    }

    updateItemsWidth(): void {
        const columns = Math.ceil(this.getCollection().getCount() / this._maxItemsByHeight);
        if (
            columns *
                (this._$minItemWidth +
                    SPACING[this._$leftPadding] +
                    SPACING[this._$rightPadding]) >=
            this._$availableWidth
        ) {
            this.setItemWidth(this._$minItemWidth);
        } else if (
            columns *
                (this._$maxItemWidth +
                    SPACING[this._$leftPadding] +
                    SPACING[this._$rightPadding]) <=
            this._$availableWidth
        ) {
            this.setItemWidth(this._$maxItemWidth);
        } else {
            const width =
                this._$availableWidth / columns -
                SPACING[this._$leftPadding] -
                SPACING[this._$rightPadding];
            this.setItemWidth(width);
        }
    }

    getMaxItemsByHeight(): number {
        return this._maxItemsByHeight;
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: Record<string, unknown>): T {
            options.minItemHeight = this._$minItemHeight;
            options.maxItemHeight = this._$maxItemHeight;
            options.minItemWidth = this._$minItemWidth;
            options.maxItemWidth = this._$maxItemWidth;
            options.hasFreeSpace = this._hasFreeSpace;
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
    _$itemWidth: null,
    _$availableHeight: null,
    _$availableWidth: null,
    _$imageProperty: null,
});
