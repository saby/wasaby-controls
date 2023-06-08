/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import {
    ICollectionItemOptions as IBaseOptions,
    IItemPadding,
    TMarkerSize,
    TShadowVisibility,
} from 'Controls/display';
import { TreeItem } from 'Controls/baseTree';
import ColumnsCollection from './Collection';
import { Model } from 'Types/entity';
import { object } from 'Types/util';
import { TBackgroundStyle, TTagStyle } from 'Controls/interface';

export interface IOptions<T extends Model = Model> extends IBaseOptions<T> {
    columnProperty: string;
    tagStyleProperty?: string;
    imageProperty?: string;
    fallbackImage?: string;
    column: number;
}

type TColumsShadowVisibility = Extract<TShadowVisibility, 'hidden' | 'visible'>;

export default class CollectionItem<
    T extends Model = Model
> extends TreeItem<T> {
    protected _$columnProperty: string;
    protected _$column: number = 0;
    private _prevColumn: number | undefined;
    protected _$owner: ColumnsCollection<T>;
    protected _$tagStyleProperty: string;
    protected _$imageProperty: string;
    protected _$fallbackImage: string;

    readonly listInstanceName: string = 'controls-Columns';

    readonly listElementName: string = 'item';

    constructor(options?: IOptions<T>) {
        super(options);
        this._$column = options?.column || 0;
    }

    setTagStyleProperty(tagStyleProperty: string): void {
        if (this._$tagStyleProperty !== tagStyleProperty) {
            this._$tagStyleProperty = tagStyleProperty;
            this._nextVersion();
        }
    }

    getTagStyle(tagStyle: TTagStyle): TTagStyle {
        if (tagStyle) {
            return tagStyle;
        }
        if (this._$tagStyleProperty) {
            return this.contents.get(this._$tagStyleProperty);
        }
    }

    getColumn(): number {
        return this._$column;
    }

    setColumn(column: number): void {
        this._prevColumn = this._$column;
        if (this._$column === column) {
            return;
        }
        this._$column = column;
        this._nextVersion();
    }

    getPrevColumn(): number | undefined {
        return this._prevColumn;
    }

    get index(): number {
        return this.getOwner().getIndex(this);
    }

    /**
     * Возвращает классы с отступами элемента
     */
    getItemPaddingClasses(): string {
        let classes = '';
        classes += ` controls-ColumnsView__item_spacingTop_${this.getTopPadding()}`;
        classes += ` controls-ColumnsView__item_spacingBottom_${this.getBottomPadding()}`;

        return classes;
    }

    getContentPaddingClasses(contentPadding: IItemPadding = {}): string {
        let classes = '';
        classes += ` controls-padding_top-${contentPadding.top || 'null'}`;
        classes += ` controls-padding_bottom-${
            contentPadding.bottom || 'null'
        }`;
        classes += ` controls-padding_left-${contentPadding.left || 'null'}`;
        classes += ` controls-padding_right-${contentPadding.right || 'null'}`;
        return classes;
    }

    getWrapperClasses(
        templateHighlightOnHover: boolean = true,
        cursor: string | boolean = 'pointer',
        backgroundColorStyle?: TBackgroundStyle,
        templateHoverBackgroundStyle?: TBackgroundStyle,
        showItemActionsOnHover?: boolean,
        contentPadding?: IItemPadding
    ): string {
        let result: string = super.getWrapperClasses.apply(this, arguments);
        result += ' controls-ColumnsView__itemV';

        result += ` ${this.getItemPaddingClasses()}`;
        result += ` ${this.getRoundBorderClasses()}`;

        result += ` ${this.getContentPaddingClasses(contentPadding)}`;
        result += ` controls-background-${this.getBackgroundStyle()}`;

        if (cursor === true || cursor === 'pointer') {
            result += ' controls-ListView__itemV_cursor-pointer';
        }

        result += this.getFadedClass();

        if (this.isDragTargetNode()) {
            result += ' controls-ColumnsView__dragTargetNode';
        }

        return result;
    }

    getMultiSelectPositionClasses(): string {
        return `controls-ColumnsView__checkbox_position-${this.getOwner().getMultiSelectPosition()} `;
    }

    getMarkerClasses(markerSize: TMarkerSize = 'content-xl'): string {
        const classes = `controls-ListView__itemV_marker controls-ListView__itemV_marker_size_${markerSize}`;
        return classes + super.getMarkerClasses(markerSize, true);
    }

    getContentClasses(
        shadowVisibility: TColumsShadowVisibility = 'visible'
    ): string {
        let classes: string = '';

        classes += this._getShadowClasses(shadowVisibility);

        // Тут должен быть вызов метода суперкласса, НО нам не нужны почти все классы, которые он предлагает
        classes += ' controls-ColumnsView__itemContent';
        return classes;
    }

    /**
     * Возвращает URL изображения
     * @return {string} URL изображения
     */
    getImageUrl(): string {
        const baseUrl =
            object.getPropertyValue<string>(
                this.contents,
                this._$imageProperty
            ) || this._$fallbackImage;
        return baseUrl;
    }

    /**
     * Возвращает название свойства, содержащего ссылку на изображение
     * @return {string} Название свойства
     */
    getImageProperty(): string {
        return this._$imageProperty;
    }

    /**
     * Устанавливает название свойства, содержащего ссылку на изображение
     * @param {string} imageProperty Название свойства
     * @void
     */
    setImageProperty(imageProperty: string): void {
        if (imageProperty !== this._$imageProperty) {
            this._$imageProperty = imageProperty;
            this._nextVersion();
        }
    }

    getItemActionClasses(itemActionsPosition: string): string {
        return `controls-ColumnsView__itemActionsV_${itemActionsPosition}`;
    }

    getItemActionPositionClasses(
        itemActionsPosition: string,
        templateItemActionClass: string
    ): string {
        let classes: string;
        const itemActionClass =
            templateItemActionClass ||
            'controls-itemActionsV_position_bottomRight';
        classes = `${itemActionClass} `;
        if (this._$roundBorder) {
            // Если располагаем ItemActions снизу, то скругляем им верхний левый угол.
            if (
                itemActionClass === 'controls-itemActionsV_position_bottomRight'
            ) {
                classes += ` controls-itemActionsV_roundBorder_topLeft_${this.getTopRightRoundBorder()}`;

                // Если располагаем ItemActions вверху, то скругляем им нижний левый угол
            } else if (
                itemActionClass === 'controls-itemActionsV_position_topRight'
            ) {
                classes += ` controls-itemActionsV_roundBorder_bottomLeft_${this.getBottomRightRoundBorder()}`;
            }
        }
        return classes;
    }
}

Object.assign(CollectionItem.prototype, {
    '[Controls/_columns/display/CollectionItem]': true,
    _moduleName: 'Controls/columns:ColumnsCollectionItem',
    _instancePrefix: 'columns-item-',
    _$column: 1,
    _$tagStyleProperty: null,
    _$imageProperty: null,
    _$fallbackImage: null,
});
