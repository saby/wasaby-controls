import type { CSSProperties } from 'react';
import {
    CollectionItem as BaseCollectionItem,
    ICollectionItemOptions,
} from 'Controls/display';
import { Model } from 'Types/entity';

export interface IAdaptiveTileCollectionItemOptions<T extends Model = Model>
    extends ICollectionItemOptions<T> {
    minItemHeight: number;
    maxItemHeight: number;
    minItemWidth: number;
    maxItemWidth: number;
    imageProperty: string;
}

export default class CollectionItem<
    T extends Model = Model
> extends BaseCollectionItem<T> {
    protected _$minItemHeight: number;
    protected _$maxItemHeight: number;
    protected _$minItemWidth: number;
    protected _$maxItemWidth: number;
    protected _$imageProperty: string;

    constructor(options: IAdaptiveTileCollectionItemOptions<T>) {
        super(options);
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

    getImageUrl(): string {
        return this.contents.get(this._$imageProperty);
    }

    /**
     * Возвращает классы с отступами элемента
     */
    getItemPaddingClasses(): string {
        let classes = '';
        classes += ` controls-AdaptiveTileView__item_padding_left_${this.getLeftPadding()}`;
        classes += ` controls-AdaptiveTileView__item_padding_right_${this.getRightPadding()}`;
        classes += ` controls-AdaptiveTileView__item_padding_top_${this.getTopPadding()}`;
        classes += ` controls-AdaptiveTileView__item_padding_bottom_${this.getBottomPadding()}`;

        return classes;
    }

    getItemClasses(): string {
        let classes =
            ' controls-ListView__itemV controls-AdaptiveTileView__item ';
        classes += this.getItemPaddingClasses();
        return classes;
    }

    getItemStyles(): CSSProperties {
        return {
            flexBasis: this._$minItemHeight,
            minHeight: this._$minItemHeight,
            maxHeight: this._$maxItemHeight,
            minWidth: this._$minItemWidth,
            maxWidth: this._$maxItemWidth,
        };
    }
}

Object.assign(CollectionItem.prototype, {
    '[Controls/_adaptiveTile/CollectionItem]': true,
    _moduleName: 'Controls/adaptiveTile:CollectionItem',
    _instancePrefix: 'adaptiveTile-item-',
    _$minItemHeight: null,
    _$maxItemHeight: null,
    _$minItemWidth: null,
    _$maxItemWidth: null,
    _$imageProperty: null,
});
