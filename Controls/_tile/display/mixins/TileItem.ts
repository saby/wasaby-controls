/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { object } from 'Types/util';
import { isEqual } from 'Types/object';
import { ICollectionItemOptions, TBorderStyle, TMarkerSize } from 'Controls/display';
import {
    getImageClasses,
    getImageRestrictions,
    getImageSize,
    getImageUrl,
} from 'Controls/_tile/utils/imageUtil';
import {
    default as ImageTemplate,
    ImageComponent,
} from 'Controls/_tile/render/itemComponents/Image';
import DefaultContent from 'Controls/_tile/render/itemsContent/Default';
import MediumContent from 'Controls/_tile/render/itemsContent/Medium';
import PreviewContent from 'Controls/_tile/render/itemsContent/Preview';
import RichContent from 'Controls/_tile/render/itemsContent/Rich';
import Tile, {
    DEFAULT_COMPRESSION_COEFF,
    DEFAULT_SCALE_COEFFICIENT,
    DEFAULT_TILE_HEIGHT,
    DEFAULT_TILE_WIDTH,
    TImageFit,
    TImageUrlResolver,
    TTileMode,
    TTileScalingMode,
    TTileSize,
} from './Tile';
import { TItemActionsPosition } from 'Controls/itemActions';
import { default as TileItemActions } from '../../itemActions/Control';
import { ITileRoundBorder, TFontColorStyle, TBackgroundStyle } from 'Controls/interface';
import { IItemTemplateProps, TCursor } from 'Controls/list';
import { toRgb, rgbaToString, rgbToRgba } from 'Controls/Utils/colorUtil';
import { TPaddingSize } from 'Controls/interface';
import IRichTemplateOptions, { TImagePosition } from 'Controls/_tile/interface/IRichTemplate';
import * as React from 'react';
import TileCollectionItem from '../TileCollectionItem';
import IItemTemplateOptions from '../../interface/ItemTemplate';
import IPreviewTemplateOptions from '../../interface/IPreviewTemplate';
import ISmallTemplateOptions from '../../interface/ISmallTemplate';
import IMediumTemplate from '../../interface/IMediumTemplate';
import type { IAutoResizerProps } from 'Controls/_tile/render/itemComponents/AutoResizer';
import { TInternalProps, wasabyAttrsToReactDom } from 'UICore/Executor';
import { Logger } from 'UI/Utils';

const DEFAULT_WIDTH_PROPORTION = 1;
const DEFAULT_ITEM_IMAGE_FIT = 'none';
const DEFAULT_RICH_ITEM_IMAGE_FIT = 'cover';

export type TTileItem = 'default' | 'invisible' | 'medium' | 'preview' | 'rich' | 'small';
export type TTitlePosition = 'underImage' | 'onImage';
export type TContentPosition = 'underImage' | 'onImageTop' | 'onImageBottom';
export type TImageViewMode = 'rectangle' | 'circle' | 'ellipse' | 'none';

export type TShadowVisibility = 'visible' | 'hidden' | 'onhover';
export type TItemActionsPlace = 'wrapper' | 'title';
export type TImageSize = 's' | 'm' | 'l';
export type TImageAlign = 'top' | 'center';
export type TImageEffect = 'none' | 'gradient';
export type TTitleStyle = 'light' | 'dark' | 'accent' | 'onhover' | 'partial';
export type TGradientPlace = 'image' | 'title';
export type TGradientType = 'dark' | 'light' | 'custom';
export type TGradientDirection = 'toBottom' | 'toBottomRight';
export type TFooterPlace = 'wrapper' | 'content';
export type TActionMode = 'showType' | 'adaptive' | 'strict';

export interface ITileItemProps<TItem extends TileCollectionItem = TileCollectionItem>
    extends IItemTemplateProps<Model, TItem>,
        IItemTemplateOptions,
        IRichTemplateOptions,
        IPreviewTemplateOptions,
        ISmallTemplateOptions,
        IMediumTemplate,
        TInternalProps {
    itemWidth: number;
    folderWidth?: number;
    itemType: TTileItem;
    fallbackImage: string;
    isEditing: boolean;
}

export const TILE_SIZES = {
    s: {
        horizontal: {
            width: 320,
            imageHeight: 180,
        },
        vertical: {
            width: 160,
            imageWidth: 300,
        },
    },
    m: {
        horizontal: {
            width: 380,
            imageHeight: 240,
        },
        vertical: {
            width: 200,
            imageWidth: 160,
        },
    },
    l: {
        horizontal: {
            width: 460,
            imageHeight: 320,
        },
        vertical: {
            width: 240,
            imageWidth: 300,
        },
    },
};

export interface IOptions<S extends Model = Model> extends ICollectionItemOptions<S> {
    tileSize: TTileSize;
    tileMode: TTileMode;
    tileScalingMode: TTileScalingMode;
    tileHeight: number;
    tileWidth: number;
    tileFitProperty: string;
    tileWidthProperty: string;
    feature1183277279: string;
    roundBorder: ITileRoundBorder;
    imageProperty: string;
    imageFit: TImageFit;
    imageHeightProperty: string;
    imageWidthProperty: string;
    imageUrlResolver: TImageUrlResolver;
    canShowActions: boolean;
    orientation: 'vertical' | 'horizontal';
}

interface ITileSize {
    width: number;
    imageHeight?: number;
    imageWidth?: number;
}

/**
 * Миксин, который содержит логику отображения элемента в виде плитки.
 * @private
 */
export default abstract class TileItem<T extends Model = Model> {
    protected _$fixedPosition: React.CSSProperties;

    protected _$animated: boolean;

    protected _$canShowActions: boolean;

    protected _$roundBorder: ITileRoundBorder;

    // region TileOptions

    protected _$tileScalingMode: TTileScalingMode;

    protected _$tileMode: TTileMode;

    protected _$tileSize: TTileSize;

    protected _$tileHeight: number;

    protected _$tileWidth: number;

    protected _$tileWidthProperty: string;

    protected _$feature1183277279: string;

    protected _$tileFitProperty: string;

    // endregion TileOptions

    // region ImageOptions

    protected _$imageProperty: string;

    protected _$imageFit: TImageFit;

    protected _$imageHeightProperty: string;

    protected _$imageWidthProperty: string;

    protected _$imageUrlResolver: TImageUrlResolver;

    protected _$fallbackImage: string;

    protected _$orientation: 'vertical' | 'horizontal';

    // endregion ImageOptions

    // region Tile

    /**
     * Возвращает режим отображения плитки
     * @return {TTileMode} Режим отображения плитки
     */
    getTileMode(): TTileMode {
        return this._$tileMode;
    }

    /**
     * Устанавливает режим отображения плитки
     * @param {TTileMode} tileMode Новый режим отображения плитки
     * @void
     */
    setTileMode(tileMode: TTileMode): void {
        if (this._$tileMode !== tileMode) {
            this._$tileMode = tileMode;
            this._nextVersion();
        }
    }

    /**
     * Возвращает минимальный размер плитки
     * @return {TTileSize} Режим отображения плитки
     */
    getTileSize(): TTileSize {
        return this._$tileSize;
    }

    /**
     * Устанавливает новый минимальный размер плитки
     * @param {TTileSize} tileSize Новый минимальный размер плитки
     * @void
     */
    setTileSize(tileSize: TTileSize): void {
        if (this._$tileSize !== tileSize) {
            this._$tileSize = tileSize;
            this._nextVersion();
        }
    }

    /**
     * Возвращает высоту плитки
     * @return {number} Высота плитки
     */
    getTileHeight(): number {
        return this._$tileHeight || DEFAULT_TILE_HEIGHT;
    }

    /**
     * Устанавливает высоту плитки
     * @param {number} tileHeight Высота плитки
     * @void
     */
    setTileHeight(tileHeight: number): void {
        if (this._$tileHeight !== tileHeight) {
            this._$tileHeight = tileHeight;
            this._nextVersion();
        }
    }

    /**
     * Возвращает название свойства на рекорде, которое содержит ширину плитки
     * @return {string} Название свойства
     */
    getTileWidthProperty(): string {
        return this._$tileWidthProperty;
    }

    /**
     * Не использовать
     * @return {string} Название свойства
     */
    getFeature1183277279Property(): string {
        return this._$feature1183277279;
    }

    /**
     * Устанавливает название свойства на рекорде, которое содержит ширину плитки
     * @param {string} tileWidthProperty Название свойства
     * @void
     */
    setTileWidthProperty(tileWidthProperty: string): void {
        if (this._$tileWidthProperty !== tileWidthProperty) {
            this._$tileWidthProperty = tileWidthProperty;
            this._nextVersion();
        }
    }

    /**
     * Возвращает название свойства на рекорде, которое содержит коэффициент
     * для расчета ширины от высоты в динамическом режиме
     * @return {string} Название свойства
     */
    getTileFitProperty(): string {
        return this._$tileFitProperty;
    }

    /**
     * Устанавливает название свойства на рекорде, которое содержит коэффициент
     * для расчета ширины от высоты в динамическом режиме
     * @param {string} tileFitProperty Название свойства
     * @void
     */
    setTileFitProperty(tileFitProperty: string): void {
        if (this._$tileFitProperty !== tileFitProperty) {
            this._$tileFitProperty = tileFitProperty;
            this._nextVersion();
        }
    }

    /**
     * Возвращает ширину плитки
     * @param {number | string} widthTpl Ширина плитка, заданная на темплейте
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @return {number} Ширина плитки
     */
    getTileWidth(
        widthTpl?: number,
        imagePosition: TImagePosition = 'top',
        imageViewMode: TImageViewMode = 'rectangle'
    ): number {
        if (this.getTileSize()) {
            return this.getTileSizes(imagePosition, imageViewMode).width;
        }

        const imageHeight = this.getImageHeight();
        const imageWidth = this.getImageWidth();
        const tileWidthPropertyValue = object.getPropertyValue<number>(
            this.getContents(),
            this.getTileWidthProperty()
        );

        if (tileWidthPropertyValue && typeof tileWidthPropertyValue !== 'number') {
            Logger.error(
                `Значение ${tileWidthPropertyValue} в поле записи ${this.getTileWidthProperty()}` +
                    ' не соответствует типу number. Шаблон будет построен некорректно!'
            );
        }

        const itemWidth =
            widthTpl || tileWidthPropertyValue || this._$tileWidth || DEFAULT_TILE_WIDTH;
        let widthProportion = DEFAULT_WIDTH_PROPORTION;

        let resultWidth = null;
        if (this.getTileMode() === 'dynamic') {
            if (imageHeight && imageWidth) {
                const imageProportion = imageWidth / imageHeight;
                widthProportion = Math.min(
                    DEFAULT_SCALE_COEFFICIENT,
                    Math.max(imageProportion, this.getCompressionCoefficient())
                );
            } else if (this.getTileFitProperty()) {
                const tileFit = object.getPropertyValue<number>(
                    this.getContents(),
                    this.getTileFitProperty()
                );
                return this.getTileHeight() * (tileFit || DEFAULT_COMPRESSION_COEFF);
            }
        } else {
            return itemWidth;
        }
        if (!widthTpl) {
            resultWidth = Math.floor(this.getTileHeight() * widthProportion);
        }

        return itemWidth ? Math.max(resultWidth, itemWidth) : resultWidth;
    }

    /**
     * Устанавливает ширину плитки
     * @param {number} tileWidth Ширина плитки
     * @void
     */
    setTileWidth(tileWidth: number): void {
        if (this._$tileWidth !== tileWidth) {
            this._$tileWidth = tileWidth;
            this._nextVersion();
        }
    }

    /**
     * Возвращает размеры в плитке
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @return {ITileSize} Режим отображения плитки при наведении курсора
     */
    getTileSizes(
        imagePosition: TImagePosition = 'top',
        imageViewMode: TImageViewMode = 'rectangle'
    ): ITileSize {
        if (!this.getTileSize()) {
            return null;
        }

        const sizeParams = object.clone(TILE_SIZES[this.getTileSize()]);
        const isVertical = imagePosition === 'top' || imagePosition === 'bottom';
        const tileSizes: ITileSize = sizeParams[isVertical ? 'vertical' : 'horizontal'];
        if (isVertical) {
            tileSizes.imageWidth = null;
            if (imageViewMode !== 'rectangle') {
                tileSizes.imageHeight = null;
            }
        } else if (imageViewMode !== 'rectangle') {
            tileSizes.imageHeight = tileSizes.imageWidth;
        }
        return tileSizes;
    }

    /**
     * Возвращает режим отображения плитки при наведении курсора
     * @return {TTileScalingMode} Режим отображения плитки при наведении курсора
     */
    getTileScalingMode(): TTileScalingMode {
        return this._$tileScalingMode;
    }

    /**
     * Устанавливает режим отображения плитки при наведении курсора
     * @param {TTileScalingMode} tileScalingMode Режим отображения плитки при наведении курсора
     * @void
     */
    setTileScalingMode(tileScalingMode: TTileScalingMode): void {
        if (this._$tileScalingMode !== tileScalingMode) {
            this._$tileScalingMode = tileScalingMode;
            this._nextVersion();
        }
    }

    // endregion Tile

    // region AutoResizer

    /**
     * Должен ли показаться блок, который автоматически растягивает плитку
     * @param {TTileItem} itemType Тип элемента
     * @param {boolean} staticHeight Признак, означающий что высота постоянная
     * @param {'item' | 'image'} position Где хотим показать ресайзер
     * @param {number | 'auto'} height Высота из шаблона
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения плитки
     * @param {number} imageProportion Пропорции изображения
     * @return {boolean}
     */
    shouldDisplayAutoResizer({
        itemType = 'default',
        staticHeight,
        position,
        height,
        imagePosition,
        imageViewMode,
        imageProportion,
    }: IAutoResizerProps): boolean {
        if (itemType === 'rich') {
            const isVertical = imagePosition === 'top' || imagePosition === 'bottom';
            return isVertical && imageViewMode === 'rectangle' && !!imageProportion;
        } else {
            const hasStaticHeight = staticHeight || itemType === 'medium';
            return (
                !(position === 'item' && height === 'auto') &&
                !hasStaticHeight &&
                this.getTileMode() !== 'dynamic'
            );
        }
    }

    /**
     * Возвращает стиль для блока, который автоматически растягивает плитку
     * @param {TTileItem} itemType Тип элемента
     * @param {number | string} width Ширина плитки, заданная на темплейте
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения плитки
     * @param {number} imageProportion Пропорции изображения
     * @return {string} Стиль для блока, который автоматически растягивает плитку
     */
    getAutoResizerStyles({
        itemType = 'default',
        width,
        imageProportion,
        imagePosition = 'top',
        imageViewMode = 'rectangle',
    }: ITileItemProps): React.CSSProperties {
        if (typeof width === 'string') {
            return {};
        }
        let paddingTop;
        const percentCoefficient = 100;

        if (itemType === 'rich') {
            paddingTop = imageProportion * percentCoefficient;
        } else {
            const tileProportion =
                this.getTileHeight() / this.getTileWidth(width, imagePosition, imageViewMode);
            paddingTop = tileProportion * percentCoefficient;
        }

        return { paddingTop: `${paddingTop}%` };
    }

    /**
     * Возвращает классы для блока, который автоматически растягивает плитку
     * @param {TTileItem} itemType Тип элемента
     * @param {boolean} staticHeight Признак, означающий что высота постоянная
     * @param {boolean} hasTitle Признак, означающий что заголовок в плитке отображается
     * @param position
     * @return {string} Стиль для блока, который автоматически растягивает плитку
     */
    getAutoResizerClasses({
        itemType = 'default',
        staticHeight,
        hasTitle,
        position,
    }: IAutoResizerProps): string {
        if (itemType === 'preview') {
            return '';
        }
        if (itemType === 'rich') {
            return 'controls-TileView__image_resizer';
        }
        return this.getTileMode() !== 'dynamic' && !staticHeight && hasTitle && position === 'image'
            ? 'controls-TileView__resizer'
            : '';
    }

    // endregion AutoResizer

    /**
     * Пересчитывает тип плитки
     * @param {TTileItem} itemType Тип плитки переданный из шаблона
     * @param {TemplateFunction} nodeContentTemplate Шаблон содержимого узла
     * @return {TTileItem} Тип плитки
     */
    getItemType(itemType: TTileItem, nodeContentTemplate?: TemplateFunction): TTileItem {
        return itemType;
    }

    /**
     * Возвращает коэффициент сжатия размеров плитки
     * @return {number} Коэффициент сжатия размеров плитки
     */
    getCompressionCoefficient(): number {
        return DEFAULT_COMPRESSION_COEFF;
    }

    /**
     * Возвращает видимость теней на плитке
     * @param {TShadowVisibility} templateShadowVisibility Видимость теней, заданаая на темплейте элемента
     * @return {TShadowVisibility} Видимость теней
     */
    getShadowVisibility(templateShadowVisibility?: TShadowVisibility): TShadowVisibility {
        return templateShadowVisibility || 'visible';
    }

    /**
     * Признак, означающий что плитка увеличена в размерах
     * @return {boolean}
     */
    isScaled(): boolean {
        const scalingMode = this.getTileScalingMode();
        return (
            (scalingMode !== 'none' || !!this.getDisplayProperty()) &&
            (this.isHovered() || this.isActive() || this.isSwiped())
        );
    }

    /**
     * Признак, означающий что плитка зафиксирована
     * @return {boolean}
     */
    isFixed(): boolean {
        return !!this.getFixedPositionStyle();
    }

    /**
     * Устанавливает признак, означающий что плитка анимирована
     * @param {boolean} animated Признак, означающий что плитка анимирована
     * @param {boolean} silent Признак, означающий что не нужно отправлять событие об изменении коллекции
     */
    setAnimated(animated: boolean, silent?: boolean): void {
        if (this._$animated === animated) {
            return;
        }
        this._$animated = animated;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('animated');
        }
    }

    /**
     * Признака, означающий что плитка анимирована
     * @return {boolean}
     */
    isAnimated(): boolean {
        if (this._$animated && !this.isScaled()) {
            // FIXME This is bad, but there is no other obvious place to
            // reset the animation state. Should probably be in that same
            // animation manager
            this.setAnimated(false, true);
            this.setFixedPositionStyle('', true);
            this.setCanShowActions(false);
        }
        return this._$animated;
    }

    /**
     * Признак, означающий что плитка не увеличивается в размерах
     * @return {boolean}
     */
    isUnscaleable(): boolean {
        return !this.getTileScalingMode() || this.getTileScalingMode() === 'none';
    }

    isMultiSelectContrastBackground(): boolean {
        return true;
    }

    // region Marker

    getTileMarkerClasses(itemType: TTileItem = 'default', markerSize: TMarkerSize): string {
        const addVerticalPaddings = itemType !== 'small' && itemType !== 'rich';
        let classes = '';
        if (itemType === 'rich') {
            classes += ' controls-padding_top-s ';
        }
        const size = markerSize || (itemType === 'small' ? 'content-xs' : 'content-xl');
        classes += `controls-ListView__itemV_marker controls-ListView__itemV_marker_size_${size}`;
        return classes + this.getMarkerClasses(size, addVerticalPaddings);
    }

    // endregion Marker

    // region ItemActions

    /**
     * Устанавливает признак, означающий что плитка может отображать операции на записью
     * @param {boolean} canShowActions Признак, означающий что плитка может отображать операции на записью
     * @param {boolean} silent Признак, означающий что не нужно отправлять событие об изменении коллекции
     */
    setCanShowActions(canShowActions: boolean, silent?: boolean): void {
        if (this._$canShowActions === canShowActions) {
            return;
        }
        this._$canShowActions = canShowActions;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('canShowActions');
        }
    }

    /**
     * Возвращает признак, означающий что плитка может отображать операции на записью
     * @return {boolean}
     */
    canShowActions(): boolean {
        return this._$canShowActions;
    }

    /**
     * Должен ли отрисоваться темплейт операций над записью
     * @param {TTileItem} itemType Тип элемента
     * @param {TItemActionsPosition} itemActionsPositionTemplate Позиционирование панели опций записи
     * @param {TItemActionsPlace} place Место в темплейте, в котором будет отрисовываться темплейт операций над записью
     * @return {boolean}
     */
    shouldDisplayTileItemActions(
        itemType: TTileItem = 'default',
        itemActionsPositionTemplate: TItemActionsPosition,
        place?: TItemActionsPlace
    ): boolean {
        // В превью темплейте itemActions должны показываться внутри блока с названием
        if (itemType === 'preview' && place === 'wrapper') {
            return false;
        }
        const itemActionsPosition =
            itemActionsPositionTemplate ||
            this.getOwner().getActionsTemplateConfig()?.itemActionsPosition;
        return (
            !this.isSwiped() && this.shouldDisplayItemActions() && itemActionsPosition !== 'custom'
        );
    }

    /**
     * Возвращает контрол операций над записью
     * @param {TTileItem} itemType Тип элемента
     * @return {string|undefined} Контрол операций над записью
     */
    getItemActionsControl(itemType: TTileItem = 'default'): Function {
        if (itemType === 'preview') {
            return TileItemActions;
        }
    }

    /**
     * Возвращает классы стилей для операций над записью
     * @param {TTileItem} itemType Тип элемента
     * @param {String} templateItemActionsClass Классы стилей для операций над записью, переданные в темплейт элемента
     * @return {String}
     */
    getItemActionsClasses(
        itemType: TTileItem = 'default',
        templateItemActionsClass?: string
    ): string {
        let classes = '';

        switch (itemType) {
            case 'default':
                classes +=
                    templateItemActionsClass ||
                    'controls-TileView__itemActions controls-TileView__itemActions_bottomRight';
                break;
            case 'small':
                classes += 'controls-TileView__itemActions ';
                classes += templateItemActionsClass || ' controls-TreeTileView__itemActions_center';
                break;
            case 'medium':
                classes += 'controls-TileView__mediumTemplate_itemActions ';
                classes +=
                    templateItemActionsClass || ' controls-TileView__itemActions_bottomRight';
                break;
            case 'rich':
                classes += 'controls-TileView__richTemplate_itemActions ';
                classes += templateItemActionsClass || ' controls-TileView__itemActions_topRight';
                break;
            case 'preview':
                classes += 'controls-TileView__previewTemplate_itemActions';
                break;
        }

        return classes;
    }

    /**
     * CSS классы для блока операций над записью
     * @param itemActionsPosition
     */
    getItemActionClasses(itemActionsPosition: string): string {
        return `controls-itemActionsV_${itemActionsPosition}`;
    }

    /**
     * Возвращает режим отображения операций над записью
     * @param {TTileItem} itemType Тип элемента
     * @return {string}
     */
    getActionMode(itemType: TTileItem = 'default'): TActionMode | undefined {
        if (itemType === 'preview') {
            return 'adaptive';
        } else if (itemType === 'small') {
            return 'strict';
        }
    }

    /**
     * Возвращает отступ для операций над записью
     * @param {TTileItem} itemType Тип элемента
     * @return {string}
     */
    getActionPadding(itemType: TTileItem = 'default'): string {
        if (itemType === 'preview') {
            return 'null';
        }

        return '';
    }

    // endregion ItemActions

    // region Image

    /**
     * Возвращает название свойства, содержащего ссылку на изображение
     * @return {string} Название свойства
     */
    getImageProperty(): string {
        return this._$imageProperty;
    }

    getFallbackImage(): string {
        return this._$fallbackImage;
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

    /**
     * Возвращает режим отображения изображения
     * @return {TImageFit} Режим отображения изображения
     */
    getImageFit(imageFitTpl?: TImageFit): TImageFit {
        return imageFitTpl || this._$imageFit;
    }

    /**
     * Возвращает режим отображения изображения по умолчанию
     * @return {TImageFit} Режим отображения изображения
     */
    getDefaultImageFit(itemType: TTileItem): TImageFit {
        return itemType === 'rich' ? DEFAULT_RICH_ITEM_IMAGE_FIT : DEFAULT_ITEM_IMAGE_FIT;
    }

    /**
     * Устанавливает режим отображения изображения
     * @param {TImageFit} imageFit Режим отображения изображения
     * @void
     */
    setImageFit(imageFit: TImageFit): void {
        if (imageFit !== this._$imageFit) {
            this._$imageFit = imageFit;
            this._nextVersion();
        }
    }

    /**
     * Возвращает название свойства, содержащего высоту оригинального изображения
     * @return {string} Название свойства
     */
    getImageHeightProperty(): string {
        return this._$imageHeightProperty;
    }

    /**
     * Устанавливает название свойства, содержащего высоту оригинального изображения
     * @param {string} imageHeightProperty Название свойства
     * @void
     */
    setImageHeightProperty(imageHeightProperty: string): void {
        if (imageHeightProperty !== this._$imageHeightProperty) {
            this._$imageHeightProperty = imageHeightProperty;
            this._nextVersion();
        }
    }

    /**
     * Возвращает название свойства, содержащего ширину оригинального изображения
     * @return {string} Название свойства
     */
    getImageWidthProperty(): string {
        return this._$imageWidthProperty;
    }

    /**
     * Устанавливает название свойства, содержащего ширину оригинального изображения
     * @param {string} imageWidthProperty Название свойства
     * @void
     */
    setImageWidthProperty(imageWidthProperty: string): void {
        if (imageWidthProperty !== this._$imageWidthProperty) {
            this._$imageWidthProperty = imageWidthProperty;
            this._nextVersion();
        }
    }

    /**
     * Возвращает функцию обратного вызова для получения URL изображения
     * @return {TImageUrlResolver} Функция обратного вызова для получения URL изображения
     */
    getImageUrlResolver(): TImageUrlResolver {
        return this._$imageUrlResolver;
    }

    /**
     * Устанавливает функцию обратного вызова для получения URL изображения
     * @param {TImageUrlResolver} imageUrlResolver Функция обратного вызова для получения URL изображения
     * @void
     */
    setImageUrlResolver(imageUrlResolver: TImageUrlResolver): void {
        if (imageUrlResolver !== this._$imageUrlResolver) {
            this._$imageUrlResolver = imageUrlResolver;
            this._nextVersion();
        }
    }

    /**
     * Возвращает высоту изображения из рекорда по imageHeightProperty
     * @return {number} Высота изображения
     */
    getImageHeight(): number {
        return object.getPropertyValue<number>(this.getContents(), this.getImageHeightProperty());
    }

    /**
     * Возвращает ширину изображения из рекорда по imageWidthProperty
     * @return {number} Ширина изображения
     */
    getImageWidth(): number {
        return object.getPropertyValue<number>(this.getContents(), this.getImageWidthProperty());
    }

    /**
     * Возвращает значения атрибута height для изображения
     * @param {TTileItem} itemType Тип элемента
     * @return {string}
     */
    getImageHeightAttribute(itemType: TTileItem = 'default'): string {
        if (itemType === 'rich') {
            return '';
        } else {
            return '100%';
        }
    }

    /**
     * Возвращает значения атрибута width для изображения
     * @param {TTileItem} itemType Тип элемента
     * @return {string}
     */
    getImageWidthAttribute(itemType: TTileItem = 'default'): string {
        if (itemType === 'rich') {
            return '';
        } else {
            return '100%';
        }
    }

    /**
     * Возвращает URL изображения
     * @param {number} widthTpl Ширина плитки, заданная на темплейте
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {string} fallbackImage URL заглушки, если не получилось посчитать URL изображения
     * @param {boolean} isMenu
     * @return {string} URL изображения
     */
    getImageUrl(
        widthTpl?: number,
        imagePosition: TImagePosition = 'top',
        imageViewMode: TImageViewMode = 'rectangle',
        fallbackImage?: string,
        isMenu?: boolean
    ): string {
        const baseUrl =
            object.getPropertyValue<string>(this.getContents(), this.getImageProperty()) ||
            fallbackImage ||
            this._$fallbackImage;
        if (this.getImageFit() === 'cover') {
            const imageSizes = getImageSize(
                this.getTileWidth(widthTpl, imagePosition, imageViewMode),
                this.getTileHeight(),
                this.getTileMode(),
                this.getImageHeight(),
                this.getImageWidth(),
                this.getImageFit()
            );
            return getImageUrl(
                imageSizes.width,
                imageSizes.height,
                baseUrl,
                this.getContents(),
                this.getImageUrlResolver(),
                isMenu
            );
        } else {
            return baseUrl;
        }
    }

    /**
     * Возвращает пропорции изображения
     * @param {string} proportion Пропорции изображения, заданные на темплейте
     */
    getImageProportion(proportion: string = '1:1'): number {
        const [width, height]: string[] = proportion.split(':');
        if (width && height) {
            return +(Number(height) / Number(width)).toFixed(2);
        }
        return 1;
    }

    /**
     * Должны ли отображать изображение
     * @param {TemplateFunction} contentTemplate Темплейт контента плитки
     * @return {boolean}
     */
    shouldDisplayImageTemplate(contentTemplate: TemplateFunction): boolean {
        return !contentTemplate;
    }

    /**
     * Возвращает темплейт изображения
     * @param {TTileItem} itemType Тип элемента
     * @return {TemplateFunction} Темплейт изображения
     */
    getImageTemplate(itemType: TTileItem = 'default'): ImageComponent {
        return ImageTemplate;
    }

    /**
     * Возвращает классы стилей для изображения
     * @param {TTileItem} itemType Тип элемента
     * @param {number} widthTpl Ширина плитки, заданная на темплейте
     * @param {TImageAlign} imageAlign Выравнивание изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {string} imageProportion Пропорции изображения
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageSize} imageSize Размер изображения
     * @param {TImageFit} imageFit Режим отображения изображения
     * @param {string} imageProportionOnItem Пропорции изображения, заданные на темплейте элемента
     * @param {TPaddingSize} contentPadding Отступ от края плитки до контента внутри неё
     */
    getImageClasses(
        itemType: TTileItem = 'default',
        widthTpl?: number,
        imageAlign: TImageAlign = 'center',
        imageViewMode?: TImageViewMode,
        imageProportion?: number,
        imagePosition?: TImagePosition,
        imageSize?: TImageSize,
        imageFit?: TImageFit,
        imageProportionOnItem?: string,
        contentPadding: TPaddingSize = 'default'
    ): string {
        let classes = '';

        switch (itemType) {
            case 'default':
            case 'preview':
            case 'medium':
                if (imageAlign !== 'top') {
                    classes += ' controls-TileView__image';
                }
                classes += ` controls-TileView__image_align_${imageAlign} `;

                let imageRestrictions = {};
                if (this.getImageFit(imageFit) === 'cover') {
                    imageRestrictions = getImageRestrictions(
                        this.getImageHeight(),
                        this.getImageWidth(),
                        this.getTileHeight(),
                        this.getTileWidth(widthTpl, imagePosition, imageViewMode)
                    );
                }

                classes += getImageClasses(this.getImageFit(imageFit), imageRestrictions);
                break;
            case 'small':
                classes += ' controls-TileView__smallTemplate_image';
                classes += ` controls-TileView__smallTemplate_image_size_${imageSize}`;
                break;
            case 'rich':
                classes += ' controls-TileView__richTemplate_image';
                classes += ' controls-TileView__image';
                classes += ` controls-TileView__image_align_${imageAlign}`;
                classes += ` controls-TileView__richTemplate_image_viewMode_${imageViewMode}`;
                classes += getImageClasses(
                    this.getImageFit(imageFit) || this.getDefaultImageFit(itemType)
                );

                // При установке отступа для изображений в виде прямоугольника
                // к изображению применяется скругление углов.
                if (
                    contentPadding !== 'default' &&
                    contentPadding !== 'null' &&
                    imageViewMode === 'rectangle'
                ) {
                    classes += ` controls-TileView__richTemplate_image_roundBorder_topLeft_${this.getTopLeftRoundBorder()}`;
                    classes += ` controls-TileView__richTemplate_image_roundBorder_topRight_${this.getTopRightRoundBorder()}`;
                    classes += ` controls-TileView__richTemplate_image_roundBorder_bottomLeft_${this.getBottomLeftRoundBorder()}`;
                    classes += ` controls-TileView__richTemplate_image_roundBorder_bottomRight_${this.getBottomRightRoundBorder()}`;
                }
                break;
        }

        return classes;
    }

    /**
     * Возвращает классы стилей для обертки над изображением
     * @param {TTileItem} itemType Тип элемента
     * @param {boolean} templateHasTitle Признак, означающий что заголовок в плитке отображается
     * @param {TTitleStyle} templateTitleStyle Стиль заголовка
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {string} imageProportion Пропорции изображения
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageSize} imageSize Размер изображения
     * @param {string} imageProportionOnItem Пропорции изображения, заданные на темплейте элемента
     * @param {TPaddingSize} contentPadding Отступ от края плитки до контента внутри неё
     */
    getImageWrapperClasses({
        itemType = 'default',
        hasTitle,
        titleStyle,
        imageViewMode = 'rectangle',
        imageProportion,
        imagePosition,
        imageSize,
        imageProportionOnItem,
        contentPadding = 'default',
    }: ITileItemProps): string {
        let classes = 'controls-TileView__imageWrapper';
        if (titleStyle === 'accent') {
            classes += ' controls-TileView__imageWrapper_accent';
        }

        if (this.getTileMode() === 'dynamic') {
            if (this.isAnimated()) {
                classes += ' controls-TileView__item_animated';
            }
            if ((titleStyle === undefined && hasTitle) || titleStyle === 'partial') {
                classes += ' controls-TileView__imageWrapper_reduced';
            }
        }

        switch (itemType) {
            case 'default':
                break;
            case 'small':
                // TODO в этом случае не нужны общие классы вверху, нужно написать так чтобы они не считались
                classes = 'controls-TileView__smallTemplate_imageWrapper';
                break;
            case 'medium':
                classes += ' controls-TileView__mediumTemplate_image ';
                break;
            case 'rich':
                // TODO в этом случае не нужны общие классы вверху, нужно написать так чтобы они не считались
                classes = ' controls-TileView__richTemplate_imageWrapper';
                classes += this._getImageSpacingClasses(
                    imageViewMode,
                    imagePosition,
                    contentPadding
                );

                classes +=
                    ' controls-TileView__richTemplate_image_position_' +
                    `${imagePosition}_viewMode_${imageViewMode}`;
                const isVertical = imagePosition === 'top' || imagePosition === 'bottom';
                if (!imageProportionOnItem || imageViewMode !== 'rectangle' || !isVertical) {
                    classes +=
                        ' controls-TileView__richTemplate_image_size_' +
                        `${imageSize}_position_${imagePosition}_viewMode_${imageViewMode}`;
                    classes +=
                        ' controls-TileView__richTemplate_image_position_' +
                        `${imagePosition}_viewMode_${imageViewMode}`;
                    classes +=
                        ' controls-TileView__richTemplate_image_size_' +
                        `${imageSize}_position_${isVertical ? 'vertical' : 'horizontal'}`;
                }
                break;
            case 'preview':
                classes += ' controls-TileView__previewTemplate_image';
                break;
        }

        return classes;
    }

    private _getImageSpacingClasses(
        imageViewMode: TImageViewMode = 'rectangle',
        imagePosition?: TImagePosition,
        contentPadding: TPaddingSize = 'default'
    ): string {
        const top = ` controls-TileView_richTemplate_image_viewMode_${imageViewMode}_spacing_top_${contentPadding}`;
        const right = ` controls-TileView_richTemplate_image_viewMode_${imageViewMode}_spacing_right_${contentPadding}`;
        const bottom = ` controls-TileView_richTemplate_image_viewMode_${imageViewMode}_spacing_bottom_${contentPadding}`;
        const left = ` controls-TileView_richTemplate_image_viewMode_${imageViewMode}_spacing_left_${contentPadding}`;
        let classes = '';

        if (contentPadding === 'default' || imageViewMode !== 'rectangle') {
            return top + right + bottom + left;
        } else {
            classes += imagePosition !== 'top' ? bottom : '';
            classes += imagePosition !== 'right' ? left : '';
            classes += imagePosition !== 'bottom' ? top : '';
            classes += imagePosition !== 'left' ? right : '';
        }
        return classes;
    }

    /**
     * Возвращает стили для обертки над изображением
     * @param {TTileItem} itemType Тип элемента
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageEffect} imageEffect Эффект изображения
     * @param {string} gradientColor Цвет градиента
     * @param {boolean} hasImage Наличие изображения
     */
    getImageWrapperStyles({
        itemType = 'default',
        imageEffect,
        gradientColor = '#ffffff',
        width,
        imagePosition = 'top',
        imageViewMode = 'rectangle',
        fallbackImage,
    }: ITileItemProps): React.CSSProperties {
        const styles: React.CSSProperties = {};
        if (this.getTileMode() === 'dynamic') {
            let height = this.getTileHeight();
            if (this.isScaled() && this.isAnimated()) {
                height *= this.getOwner().getZoomCoefficient();
            }
            styles.height = `${height}px`;
        }
        if (itemType === 'rich') {
            const imageUrl = this.getImageUrl(width, imagePosition, imageViewMode, fallbackImage);
            if (
                !!imageUrl &&
                imageViewMode === 'rectangle' &&
                imagePosition === 'top' &&
                imageEffect === 'gradient'
            ) {
                styles.backgroundColor = `${rgbaToString(toRgb(gradientColor))}`;
            }
        }

        return styles;
    }

    /**
     * Возвращает классы выравнивания изображения
     * @param {TImageAlign} imageAlign Выравнивание изображения
     */
    getImageAlignClasses(imageAlign: TImageAlign): string {
        if (imageAlign === 'top') {
            return 'controls-TileView__imageAlign_wrapper ws-flexbox ws-justify-content-center ws-align-items-center';
        } else {
            return '';
        }
    }

    /**
     * Возвращает значения атрибута preserveAspectRatio для изображения
     * @param {TTileItem} itemType Тип элемента
     * @param {TImageFit} imageFit Режим отображения изображения
     * @return {string}
     */
    getImagePreserveAspectRatio(itemType: TTileItem = 'default', imageFit?: TImageFit): string {
        switch (itemType) {
            case 'default':
            case 'small':
            case 'preview':
            case 'medium':
                return 'xMidYMid meet';
            case 'rich':
                return `xMidYMid ${this.getImageFit(imageFit) === 'cover' ? 'slice' : 'meet'}`;
        }
    }

    // endregion Image

    // region ImageGradient

    /**
     * Должен ли отрисоваться градиент изображения
     * @param {TTileItem} itemType Тип элемента
     * @param {TImageEffect} imageEffect Эффект изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TGradientPlace} position Место в темплейте, в котором будет отрисован темплейт градиента
     */
    shouldDisplayGradient(
        itemType: TTileItem = 'default',
        imageEffect?: TImageEffect,
        imageViewMode?: TImageViewMode,
        imagePosition?: TImagePosition,
        position?: TGradientPlace
    ): boolean {
        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
                return false;
            case 'rich':
                return (
                    position === 'image' &&
                    imageEffect === 'gradient' &&
                    imageViewMode === 'rectangle' &&
                    imagePosition === 'top'
                );
            case 'preview':
                return position === 'title';
        }
    }

    /**
     * Возвращает классы стилей градиента
     * @param {TTileItem} itemType Тип элемента
     * @param {TGradientType} gradientType Тип градиента
     */
    getGradientClasses(
        itemType: TTileItem = 'default',
        gradientType: TGradientType = 'dark'
    ): string {
        let classes = '';

        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
                break;
            case 'rich':
                classes += ' controls-TileView__richTemplate_image_effect_gradient';
                break;
            case 'preview':
                classes += ' controls-TileView__previewTemplate_gradient';
                classes += ` controls-TileView__previewTemplate_gradient_${gradientType}`;
                break;
        }

        return classes;
    }

    /**
     * Возвращает стили для большого градиента
     * @param {TTileItem} itemType Тип элемента
     * @param {string} gradientStartColor Начальный цвет высокого градиента
     * @param {string} gradientStopColor Конечный цвет высокого градиента
     * @param {TGradientDirection} gradientDirection Направление высокого градиента
     */
    getBigGradientStyles(
        itemType: TTileItem = 'default',
        gradientStartColor: string = '',
        gradientStopColor: string = '',
        gradientDirection: TGradientDirection = 'toBottom'
    ): string {
        let styles = '';

        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
            case 'preview':
                break;
            case 'rich':
                if (gradientStartColor && gradientStopColor) {
                    const startColor = `${gradientStartColor} 0%`;
                    const endColor = `${gradientStopColor} 100%`;
                    const gradientDirectionStyle =
                        gradientDirection === 'toBottom' ? 'to bottom' : 'to bottom right';
                    styles = `linear-gradient(${gradientDirectionStyle}, ${startColor}, ${endColor})`;
                }
        }

        return styles;
    }

    /**
     * Возвращает стили градиента
     * @param {TTileItem} itemType Тип элемента
     * @param {string} gradientColor Цвет градиента
     * @param {TGradientType} gradientType Тип градиента
     */
    getGradientStyles(
        itemType: TTileItem = 'default',
        gradientColor: string = '#ffffff',
        gradientType: TGradientType = 'dark'
    ): React.CSSProperties {
        const styles: React.CSSProperties = {};

        // Нельзя сделать просто градиент от цвета к прозрачному белому,
        // так как в safari это приводит к светлым полосам на темном фоне.
        // Поэтому нужно делать градиент от цвета к прозрачному цвету того же оттенка.
        const rgbColor = toRgb(gradientColor);

        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
                break;
            case 'rich':
                if (rgbColor) {
                    const startColor = `${rgbaToString(rgbToRgba(rgbColor, 0))} 0%`;
                    const endColor = `${rgbaToString(rgbColor)} 100%`;
                    styles.background = `linear-gradient(to bottom, ${startColor}, ${endColor})`;
                }
                break;
            case 'preview':
                if (gradientType === 'custom') {
                    const startColor = `${gradientColor} 0%`;
                    const midColor = `${gradientColor} calc(100% - 4px)`;
                    const endColor = 'rgba(255, 255, 255, 0) 100%';
                    styles.background = `linear-gradient(to top, ${startColor}, ${midColor}, ${endColor})`;
                }
                break;
        }

        return styles;
    }

    // endregion ImageGradient

    // region Styles

    /**
     * Возвращает классы стилей для элемента
     * @param {TTileItem} itemType Тип элемента
     * @param {boolean} clickable Признак, означающий что элемент является кликабельным
     * @param {boolean} hasTitle Признак, означающий что нужно отображать заголовок
     * @param {TCursor} cursor Тип курсора при наведении на элемент
     * @param {TShadowVisibility} templateShadowVisibility Видимость теней
     * @param {boolean} highlightOnHover Признак, означающий что нужно подсвечивать элемент при ховере
     * @param {boolean} border Признак, означающий что нужно отображать границы
     * @param {Controls/display/TBorderStyle.typedef} borderStyle Цвет рамки вокруг записи
     * @param {Boolean} fillViewPortWidth Признак того, что плитка заполняет собой всю ширину вьюпорта, автоматически
     * подстраивая ширину и высоту.
     */
    getItemClasses({
        itemType = 'default',
        hasTitle,
        shadowVisibility,
        highlightOnHover = true,
        border,
        borderStyle,
    }: ITileItemProps): string {
        let classes =
            'controls-TileView__item controls-ListView__itemV js-controls-ListView__editingTarget';

        if (this.getTileScalingMode() === 'none') {
            classes += ' controls-TileView__item_unscalable';
        }

        if (this._$orientation === 'vertical') {
            classes += ' ws-flex-grow-1';
        }

        classes += ` ${this.getItemPaddingClasses()}`;
        classes += ` ${this.getRoundBorderClasses()}`;

        switch (itemType) {
            case 'default':
            case 'medium':
                break;
            case 'rich':
                classes += ' controls-TileView__richTemplate_item';
                classes += ` controls-TileView__item_shadow_${this.getShadowVisibility(
                    shadowVisibility
                )}`;
                classes += this.getBorderClasses(border, borderStyle);
                break;
            case 'preview':
                classes += ' controls-TileView__previewTemplate';
                if (this.hasVisibleActions() && (this.isUnscaleable() || this.canShowActions())) {
                    classes += ' controls-TileView__previewTemplate_actions_showed';
                }
                if (hasTitle === false) {
                    classes += ' controls-TileView__previewTemplate_withoutTitle';
                }
                break;
            case 'small':
                classes += ' controls-TileView__smallTemplate_item';
                if (highlightOnHover) {
                    classes += ' controls-TileView__smallTemplate_item_highlightOnHover';
                }
                classes +=
                    ' js-controls-TileView__withoutZoom  js-controls-ListView__measurableContainer';
                classes += ' controls-TileView__smallTemplate_listItem';
                if (this.isActive()) {
                    classes += ' controls-TileView__smallTemplate_item_active';
                }
                classes += this.getBorderClasses(border, borderStyle);
                classes += ` controls-TileView__item_shadow_${this.getShadowVisibility(
                    shadowVisibility
                )}`;
                break;
        }

        return classes;
    }

    /**
     * Возвращает стили для элемента
     * @param {TTileItem} itemType Тип элемента
     * @param {number} templateWidth Ширина элемента, заданная на темплейте
     * @param {boolean} staticHeight Признак, означающий что высота постоянная
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     */
    getItemStyles({
        itemType = 'default',
        width,
        staticHeight,
        imagePosition = 'top',
        imageViewMode = 'rectangle',
        attrs = {},
    }: ITileItemProps): React.CSSProperties {
        let widthCalculated;
        let flexBasis;
        if (typeof width === 'string') {
            widthCalculated = width;
            flexBasis = width;
        } else {
            widthCalculated = this.getTileWidth(width, imagePosition, imageViewMode);
            if (Number.parseFloat(widthCalculated).toString() === widthCalculated.toString()) {
                flexBasis = widthCalculated * this.getCompressionCoefficient() + 'px';
                widthCalculated += 'px';
            } else {
                widthCalculated = widthCalculated.replace(';', '');
                flexBasis = widthCalculated;
            }
        }

        const styleProp = wasabyAttrsToReactDom(attrs).style as object;
        if (this.getTileMode() === 'dynamic') {
            if (itemType === 'invisible') {
                return {
                    flexBasis,
                    minWidth: flexBasis,
                    ...styleProp,
                };
            } else {
                // TODO: Удалено в 22.1000
                const customHeightData = this.getContents().get(
                    this.getFeature1183277279Property()
                );
                const height = customHeightData ? customHeightData : this.getTileHeight();
                return {
                    flexBasis,
                    minWidth: flexBasis,
                    height: `${height}px`,
                    maxWidth: widthCalculated,
                    ...styleProp,
                };
            }
        }

        return {
            flexBasis: widthCalculated,
            minWidth: widthCalculated,
            height:
                staticHeight && itemType !== 'invisible' ? `${this.getTileHeight()}px` : undefined,
            ...styleProp,
        };
    }

    /**
     * Возвращает классы стилей для обертки элемента
     * @param {TTileItem} itemType Тип элемента
     * @param {TShadowVisibility} shadowVisibility Видимость теней
     * @param {boolean} highlightOnHover Признак, означающий что нужно подсвечивать элемент при ховере
     * @param {Controls/interface/TBackgroundStyle.typedef} backgroundColorStyle
     * @param {string} height
     * @param {boolean} border Признак, означающий что нужно отображать границы
     * @param {Controls/display/TBorderStyle.typedef} borderStyle Цвет рамки вокруг записи
     * @param {TTitleStyle} titleStyle Стиль заголовка
     * @param {boolean} hasTitle Отображается ли заголовок
     */
    getWrapperClasses({
        itemType = 'default',
        shadowVisibility,
        highlightOnHover,
        backgroundColorStyle,
        height,
        border,
        borderStyle,
        titleStyle = 'light',
        hasTitle,
    }: ITileItemProps): string {
        let classes = '';
        classes += ` ${this.getRoundBorderClasses()}`;
        if (itemType === 'small') {
            classes += ' controls-TileView__smallTemplate_wrapper';
            if (this.canShowActions()) {
                classes += ' controls-ListView__item_showActions';
            }
            if (this.getMultiSelectVisibility() !== 'hidden') {
                classes += ' controls-ListView__item_showCheckbox';
            }
            classes += this.getFadedClass();
            return classes;
        }

        classes += ' controls-TileView__itemContent js-controls-ListView__measurableContainer';
        classes += this.getFadedClass();

        // TODO это значение вроде задается только для Rich темплейта всегда, нет смысла прокидывать его в опции
        if (height === 'auto' || itemType === 'rich') {
            classes += ' controls-TileView__item_autoHeight';
        }

        if (highlightOnHover) {
            classes += ' controls-hover-background-default';
        }

        if (backgroundColorStyle) {
            classes += ` controls-TileView__itemContent_background_${backgroundColorStyle}`;
        }

        // в rich этот класс повесится в itemClasses
        if (itemType !== 'rich') {
            classes += this.getBorderClasses(border, borderStyle);
        }

        if (titleStyle === 'accent') {
            classes += ' controls-TileView__itemContent_accent';
        }

        classes += ` controls-TileView__item_shadow_${this.getShadowVisibility(shadowVisibility)}`;
        if (this.isActive()) {
            classes += ' controls-TileView__item_active';
        }
        if (this.isHovered()) {
            classes += ' controls-TileView__item_hovered';
        }
        if (this.isSwiped() || (!this.isScaled() && !this.isUnscaleable())) {
            classes += ' controls-TileView__item_unfixed';
        }
        if (hasTitle === false || itemType !== 'default') {
            classes += ' controls-TileView__item_withoutTitle';
        }
        if (this.isUnscaleable()) {
            classes += ' controls-TileView__item_unscaleable';
        }
        if (this.isScaled()) {
            classes += ' controls-TileView__item_scaled';
        }
        if (this.isFixed()) {
            classes += ' controls-TileView__item_fixed';
        }
        if (this.isAnimated()) {
            classes += ' controls-TileView__item_animated';
        }
        if (this.canShowActions()) {
            classes += ' controls-ListView__item_showActions';
        }
        if (this.getMultiSelectVisibility() !== 'hidden') {
            classes += ' controls-ListView__item_showCheckbox';
        }
        if (this.isEditing()) {
            classes += ' controls-ListView__item_editing';
        }
        if (this.isDragged()) {
            classes += ' controls-ListView__item_dragging';
        }
        if (this.isSwiped()) {
            classes += ' controls-TileView__item_swiped';
        }

        return classes;
    }

    /**
     * Возвращает стили для обертки элемента
     * @param {TTileItem} itemType Тип элемента
     */
    getWrapperStyles(itemType: TTileItem = 'default'): React.CSSProperties {
        return this.getFixedPositionStyle();
    }

    /**
     * Возвращает классы для дополнительной панели
     * @param additionalPanelPosition - положение дополнительной панели
     * @param imageViewMode - режим отображения изображения
     */
    getAdditionalPanelClasses(
        additionalPanelPosition: string = 'topRight',
        imageViewMode: TImageViewMode = 'rectangle'
    ): string {
        let classes = 'controls-TileView__additionalPaneltemplate';
        if (additionalPanelPosition !== 'topLeft' || imageViewMode !== 'none') {
            classes += ' controls-TileView__additionalPaneltemplate_absolute';
        }
        classes += ` controls-TileView__additionalPaneltemplate_${additionalPanelPosition}`;

        return classes;
    }

    /**
     * Возвращает классы с отступами элемента
     */
    getItemPaddingClasses(): string {
        let classes = '';
        classes += `controls-TileView__item_spacingLeft_${this.getLeftPadding()}`;
        classes += ` controls-TileView__item_spacingRight_${this.getRightPadding()}`;
        classes += ` controls-TileView__item_spacingTop_${this.getTopPadding()}`;
        classes += ` controls-TileView__item_spacingBottom_${this.getBottomPadding()}`;

        return classes;
    }

    /**
     * Возвращает стиль фиксированной позиции элемента
     */
    getFixedPositionStyle(): React.CSSProperties {
        return this.isScaled() ? this._$fixedPosition || undefined : undefined;
    }

    /**
     * Устанавливает стиль фиксированной позиции элемента
     * @param {string} position Стиль фиксированной позиции элемента
     * @param {boolean} silent Признак, означающий что не нужно отправлять событие об изменении коллекции
     */
    setFixedPositionStyle(position: React.CSSProperties, silent?: boolean): void {
        if (isEqual(this._$fixedPosition, position)) {
            return;
        }
        this._$fixedPosition = position;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('fixedPosition');
        }
    }

    /**
     * Возвращает стили маркера
     * @param {boolean} borderVisible Признак, означающий что нужно отображать границы
     * @param {Controls/display/TBorderStyle.typedef} borderStyle Цвет рамки вокруг записи
     */
    getBorderClasses(borderVisible: boolean = true, borderStyle: TBorderStyle = 'default'): string {
        let classes = '';
        if (borderVisible) {
            classes += ' controls-TileView__item_border_visible';
            classes += ` controls-TileView__item_border_${borderStyle}`;
        }
        return classes;
    }

    /**
     * Возвращает стили для чекбоксов
     * @param {TTileItem} itemType Тип элемента
     * @param style
     */
    getMultiSelectStyles(itemType: TTileItem = 'default', style?: string): string {
        let styles = style ? style : '';

        switch (itemType) {
            case 'default':
            case 'medium':
            case 'preview':
                break;
            case 'rich':
            case 'small':
                // TODO переопределяем left и top, т.к. в метод getMultiSelectClasses
                //  мы не можем прокинуть параметр itemType
                styles += ' left: unset; top: unset;';
                break;
        }

        return styles;
    }

    // endregion Styles

    // region Content

    /**
     * Возвращает темплейт контента
     * @param {TTileItem} itemType Тип элемента
     * @param {TemplateFunction} contentTemplate Прикладной темплейт контента
     */
    getContentTemplate(
        itemType: TTileItem = 'default',
        contentTemplate?: TemplateFunction | React.FunctionComponent
    ): TemplateFunction | React.FunctionComponent {
        if (contentTemplate) {
            return contentTemplate;
        }

        switch (itemType) {
            case 'default':
            case 'small':
                return DefaultContent;
            case 'medium':
                return MediumContent;
            case 'rich':
                return RichContent;
            case 'preview':
                return PreviewContent;
        }
    }

    /**
     * Возвращает классы стилей для контента
     * @param {TTileItem} itemType Тип элемента
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     */
    getContentClasses({
        itemType = 'default',
        imagePosition = 'top',
        imageViewMode = 'rectangle',
    }: Partial<ITileItemProps>): string {
        let classes = '';

        switch (itemType) {
            case 'default':
                break;
            case 'small':
                break;
            case 'medium':
                classes += ' controls-TileView__mediumTemplate_content';
                break;
            case 'rich':
                classes += ' controls-TileView__richTemplate';
                classes += ` controls-TileView__richTemplate_imagePosition_${imagePosition}`;
                break;
            case 'preview':
                classes += ' controls-TileView__previewTemplate_content';
                break;
        }

        return classes;
    }

    // endregion Content

    // region Title

    /**
     * Должен ли отрисоваться заголовок
     * @param {TTileItem} itemType Тип элемента
     */
    shouldDisplayTitle(
        itemType: TTileItem = 'default',
        titlePosition: TTitlePosition = 'underImage',
        imageViewMode: TImageViewMode = 'rectangle'
    ): boolean {
        switch (itemType) {
            case 'default':
                return !!this.getDisplayValue() || this.shouldDisplayItemActions();
            case 'small':
            case 'medium':
            case 'rich':
                return titlePosition === 'underImage' || imageViewMode === 'none';
            case 'preview':
                return !!this.getDisplayValue();
        }
    }

    /**
     * Возвращает классы стилей для обертки заголовка
     * @param {TTileItem} itemType Тип элемента
     * @param {number} titleLines Кол-во строк в заголовке
     * @param {TGradientType} gradientType Тип градиента
     * @param {TTitleStyle} titleStyle Стиль заголовка
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения,
     * @param {TPaddingSize} contentPadding Отступ от края плитки до контента внутри неё
     * @param {TemplateFunction} footerTemplate  Темплейт футера
     * @param {string} description Описание
     * @param {number} descriptionLines Отступ от края плитки до контента внутри неё
     * @param {TTitlePosition} titlePosition Положение заголовка относительно изображения
     * @param {TContentPosition} contentPosition Положение контента относительно изображения
     * @param {'start' | 'end'} justifyContent Выравнивание контента внутри контентной области
     */
    getTitleWrapperClasses({
        itemType = 'default',
        titleLines = 1,
        gradientType = 'dark',
        titleStyle = 'light',
        imagePosition = 'top',
        imageViewMode = 'none',
        contentPadding = 'default',
        footerTemplate = null,
        description = '',
        descriptionLines = 0,
        titlePosition = 'underImage',
        contentPosition = 'underImage',
        justifyContent = 'start',
    }: Partial<ITileItemProps>): string {
        let classes = '';

        switch (itemType) {
            case 'default':
            case 'medium':
                break;
            case 'small':
                classes += ' controls-TileView__smallTemplate_title';
                break;
            case 'rich':
                classes += 'controls-TileView__richTemplate_itemContent ws-ellipsis';
                classes += ` ws-justify-content-${justifyContent}`;
                if (contentPosition !== 'underImage') {
                    classes += ` controls-TileView__richTemplate_itemContent-${contentPosition}`;
                    classes += this._getContentSpacingClasses(imagePosition, contentPadding);
                    break;
                } else if (
                    !(
                        titlePosition === 'onImage' &&
                        imageViewMode === 'rectangle' &&
                        !footerTemplate &&
                        (!description || !descriptionLines)
                    )
                ) {
                    classes += this._getContentSpacingClasses(imagePosition, contentPadding);
                }
                classes += ' controls-TileView__richTemplate_itemContent_fullHeight';
                break;
            case 'preview':
                classes += 'controls-TileView__previewTemplate_title';
                classes += ' controls-fontsize-m';
                const countLines = titleLines === 1 ? 'single' : 'multi';
                classes += ` controls-TileView__previewTemplate_title_${countLines}Line`;
                classes += ` controls-TileView__previewTemplate_title_gradient_${gradientType}`;
                classes += ` controls-TileView__previewTemplate_title_text_${titleStyle}`;
                break;
        }

        return classes;
    }

    private _getContentSpacingClasses(
        imagePosition?: TImagePosition,
        contentPadding: TPaddingSize = 'default'
    ): string {
        let classes = '';
        const contentPaddingTop = imagePosition !== 'top' ? contentPadding : 'default';
        const contentPaddingRight = imagePosition !== 'right' ? contentPadding : 'default';
        const contentPaddingBottom = imagePosition !== 'bottom' ? contentPadding : 'default';
        const contentPaddingLeft = imagePosition !== 'left' ? contentPadding : 'default';

        classes += ` controls-TileView__richTemplate_itemContent_spacing_top_${contentPaddingTop}`;
        classes += ` controls-TileView__richTemplate_itemContent_spacing_right_${contentPaddingRight}`;
        classes += ` controls-TileView__richTemplate_itemContent_spacing_bottom_${contentPaddingBottom}`;
        classes += ` controls-TileView__richTemplate_itemContent_spacing_left_${contentPaddingLeft}`;

        return classes;
    }

    /**
     * Возвращает стили для обертки заголовка
     * @param {TTileItem} itemType Тип элемента
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {TImagePosition} imagePosition Позиция изображения
     * @param {string} gradientColor Цвет градиента в месте перехода от изображения к контенту
     * @param {string} gradientStartColor Начальный цвет высокого градиента
     * @param {string} gradientStopColor Конечный цвет высокого градиента
     * @param {TGradientDirection} gradientDirection Направление высокого градиента
     * @param {TContentPosition} contentPosition Положение контента относительно изображения
     */
    getTitleWrapperStyles({
        itemType = 'default',
        imageViewMode,
        imagePosition,
        gradientColor = '#FFF',
        gradientStartColor = '#FFF',
        gradientStopColor = '#FFF',
        gradientDirection = 'toBottom',
        contentPosition = 'underImage',
    }: Partial<ITileItemProps>): React.CSSProperties {
        let styles: React.CSSProperties = {};

        switch (itemType) {
            case 'default':
            case 'small':
            case 'preview':
                break;
            case 'medium':
                styles.width = '100%';
                break;
            case 'rich':
                if (contentPosition !== 'underImage') {
                    break;
                }
                if (
                    (!imageViewMode || imageViewMode === 'rectangle') &&
                    imagePosition !== 'left' &&
                    imagePosition !== 'right'
                ) {
                    styles.backgroundColor = rgbaToString(toRgb(gradientColor));
                } else if (imageViewMode === 'none') {
                    const gradient = this.getBigGradientStyles(
                        itemType,
                        gradientStartColor,
                        gradientStopColor,
                        gradientDirection
                    );
                    styles = {
                        ...styles,
                        backgroundImage: gradient,
                    };
                }
                break;
        }

        return styles;
    }

    /**
     * Возвращает классы стилей для заголовка
     * @param {TTileItem} itemType Тип элемента
     * @param {TTitleStyle} titleStyle Стиль заголовка
     * @param {boolean} hasTitle Признак, означающий что нужно отображать заголовок
     * @param {number} titleLines Кол-во строк в заголовке
     * @param {Controls/_interface/IFontColorStyle/TFontColorStyle.typedef} titleColorStyle Стиль цвета заголовка
     * @param {TTitlePosition} titlePosition Положение заголовка относительно изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {TContentPosition} contentPosition Положение контента относительно изображения
     */
    getTitleClasses({
        itemType = 'default',
        titleStyle,
        hasTitle,
        titleLines = 1,
        titleColorStyle = 'default',
        titlePosition = 'underImage',
        imageViewMode = 'rectangle',
        contentPosition = 'underImage',
    }: Partial<ITileItemProps>): string {
        let classes = '';
        switch (itemType) {
            case 'default':
                if (titleStyle === 'accent') {
                    classes += ' controls-TileView__title_accent';
                    classes += ' controls-TileView__title_accent_ellipsis';
                } else {
                    classes += ' controls-TileView__title ';
                    if (titleStyle === 'onhover' || (!titleStyle && !hasTitle)) {
                        classes += ' controls-TileView__title_invisible';
                    }
                }
                break;
            case 'small':
                break;
            case 'medium':
                classes += ' controls-TileView__mediumTemplate_title controls-fontweight-bold';
                classes += ' controls-fontsize-l controls-text-secondary';
                classes += ' controls-TileView__mediumTemplate_title';
                break;
            case 'rich':
                classes += ' controls-TileView__richTemplate_title controls-fontweight-bold';
                classes += ' controls-TileView__richTemplate_title_font-size';
                classes += ` controls-text-${titleColorStyle}`;
                if (titlePosition === 'onImage' && imageViewMode !== 'none') {
                    classes += ' controls-TileView__richTemplate_title-onImage';
                } else {
                    classes += ' controls-TileView__richTemplate_title-underImage';
                }
                if (titleLines === 1) {
                    classes += ' controls-TileView__richTemplate_title-one_line';
                }
                break;
            case 'preview':
                if (!this.isUnscaleable() && this.canShowActions()) {
                    classes += ' ws-hidden ';
                }
                classes += ' controls-TileView__previewTemplate_title_text';
                break;
        }

        return classes;
    }

    /**
     * Возвращает стили для заголовка
     * @param {TTileItem} itemType Тип элемента
     * @param {number} titleLines Кол-во строк в заголовке
     * @param {string} textColor Цвет текста заголовка
     * @param {Controls/_interface/IFontColorStyle/TFontColorStyle.typedef} titleColorStyle Стиль цвета заголовка
     * @param {TTitlePosition} titlePosition Положение заголовка относительно изображения
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {TContentPosition} contentPosition Положение контента относительно изображения
     * @param {object} captionStyle css стили применяемые к заголовку
     */
    getTitleStyles({
        itemType = 'default',
        titleLines = 1,
        textColor = 'inherit',
        titleColorStyle = 'default',
        titlePosition = 'underImage',
        imageViewMode = 'rectangle',
        contentPosition = 'underImage',
        captionStyle = {},
    }: Partial<ITileItemProps>): React.CSSProperties {
        const styles: React.CSSProperties = {};
        switch (itemType) {
            case 'default':
                break;
            case 'small':
                break;
            case 'medium':
                break;
            case 'rich':
                let color =
                    imageViewMode !== 'none' &&
                    (titlePosition === 'onImage' || contentPosition !== 'underImage')
                        ? '#fff'
                        : textColor;
                if (titleColorStyle !== 'default') {
                    color = textColor;
                }
                styles.WebkitLineClamp = titleLines;
                styles.maxHeight = `calc(${titleLines} * (1px + var(--font-size_4xl)))`;
                styles.color = color;
                break;
            case 'preview':
                styles.WebkitLineClamp = titleLines;
                styles.maxHeight = `calc(${titleLines} * var(--font-size_4xl))`;
                styles.color = textColor;
                break;
        }

        return { ...styles, ...captionStyle };
    }

    /**
     * Возвращает классы стилей для заголовка, которые многоточат текст
     * @param {TTileItem} itemType Тип элемента
     * @param {number} titleLines Кол-во строк в заголовке
     * @param {boolean} staticHeight Признак, означающий что высота постоянная
     * @param {boolean} hasTitle Признак, означающий что нужно отображать заголовок
     */
    getEllipsisClasses({
        itemType = 'default',
        titleLines = 1,
        staticHeight,
        hasTitle,
    }: Partial<ITileItemProps>): string {
        let classes = '';

        switch (itemType) {
            case 'default':
                if (!staticHeight && hasTitle) {
                    classes += ' controls-TileView__itemTemplate_text-ellipsis';
                }
                break;
            case 'small':
                classes += 'ws-ellipsis';
                break;
            case 'medium':
                break;
            case 'rich':
            case 'preview':
                classes += ' controls-TileView__previewTemplate_text';
                classes +=
                    titleLines > 1 ? ' controls-TileView__text_ellipsis_multiLine' : ' ws-ellipsis';
                break;
        }

        return classes;
    }

    /**
     * Возвращает стили для размытия в afterTitleTemplate
     * @param {TTileItem} itemType Тип элемента
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     * @param {string} gradientColor Цвет градиента
     * @param titlePosition
     */
    getBlurStyles({
        itemType = 'default',
        imageViewMode = 'none',
        gradientColor = '#FFF',
        titlePosition = 'underImage',
    }: Partial<ITileItemProps>): React.CSSProperties {
        const styles: React.CSSProperties = {};

        switch (itemType) {
            case 'default':
            case 'small':
            case 'preview':
            case 'medium':
                break;
            case 'rich':
                const rgbColor = toRgb(gradientColor);
                if (
                    imageViewMode === 'none' ||
                    (imageViewMode === 'rectangle' && titlePosition === 'underImage')
                ) {
                    if (rgbColor) {
                        styles.background = `linear-gradient(to right, ${rgbaToString(
                            rgbToRgba(rgbColor, 0)
                        )} 0%, ${rgbaToString(rgbColor)} 12px, ${rgbaToString(rgbColor)} 100%)`;
                    } else {
                        styles.background += `linear-gradient(to right, rgb(255, 255, 255, 0) 0%, ${gradientColor} 12px, ${gradientColor} 100%);`;
                    }
                }
                break;
        }

        return styles;
    }

    // endregion Title

    // region Description

    /**
     * Должно ли рисоваться описание
     * @param {TTileItem} itemType Тип элемента
     * @param {string} description Описание
     * @param {number} descriptionLines Кол-во строк в описании
     * @param {TImagePosition} imagePosition Позиция изображения
     */
    shouldDisplayDescription({
        itemType = 'default',
        description,
        descriptionLines,
        imagePosition,
    }: Partial<ITileItemProps>): boolean {
        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
            case 'preview':
                return false;
            case 'rich':
                return imagePosition !== 'bottom' && description && descriptionLines !== 0;
        }
    }

    /**
     * Возвращает классы стилей для описания
     * @param {TTileItem} itemType Тип элемента
     * @param {number} descriptionLines Кол-во строк в описании
     * @param {TTitlePosition} titlePosition Положение заголовка
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     */
    getDescriptionClasses({
        itemType = 'default',
        descriptionLines,
        titlePosition = 'underImage',
        imageViewMode = 'rectangle',
    }: Partial<ITileItemProps>): string {
        let classes = '';
        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
            case 'preview':
                break;
            case 'rich':
                classes += 'controls-TileView__richTemplate_description';
                if (descriptionLines > 1) {
                    classes += ' controls-TileView__text_ellipsis_multiLine';
                } else {
                    classes += ' ws-ellipsis';
                }
                classes += ' controls-TileView__richTemplate_description';
                if (titlePosition !== 'onImage' || imageViewMode === 'none') {
                    classes += ' controls-TileView__richTemplate_description_spacing';
                }
                break;
        }

        return classes;
    }

    /**
     * Возвращает стили для описания
     * @param {TTileItem} itemType Тип элемента
     * @param {number} descriptionLines Кол-во строк в описании
     * @param {string} textColor Цвет текста
     * @param {TContentPosition} contentPosition Положение контента относительно изображения
     */
    getDescriptionStyles({
        itemType = 'default',
        descriptionLines = 1,
        textColor = 'inherit',
        contentPosition = 'underImage',
    }: Partial<ITileItemProps>): React.CSSProperties {
        const styles: React.CSSProperties = {};
        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
            case 'preview':
                break;
            case 'rich':
                styles.WebkitLineClamp = descriptionLines;
                styles.color = contentPosition !== 'underImage' ? '#fff' : textColor;
                break;
        }

        return styles;
    }

    // endregion Description

    // region RoundBorder

    /**
     * Устанавливает скругление углов элемента
     * @param {ITileRoundBorder} roundBorder Скругление углов элемента
     * @void
     */
    setRoundBorder(roundBorder: ITileRoundBorder): void {
        if (!isEqual(this._$roundBorder, roundBorder)) {
            this._$roundBorder = roundBorder;
            this._nextVersion();
        }
    }

    /**
     * Возвращает скругление верхнего левого угла плитки
     * @return {string}
     */
    getTopLeftRoundBorder(): string {
        return this._$roundBorder?.tl || 'default';
    }

    /**
     * Возвращает скругление верхнего правого угла плитки
     * @return {string}
     */
    getTopRightRoundBorder(): string {
        return this._$roundBorder?.tr || 'default';
    }

    /**
     * Возвращает скругление нижнего левого угла плитки
     * @return {string}
     */
    getBottomLeftRoundBorder(): string {
        return this._$roundBorder?.bl || 'default';
    }

    /**
     * Возвращает скругление нижнего правого угла плитки
     * @return {string}
     */
    getBottomRightRoundBorder(): string {
        return this._$roundBorder?.br || 'default';
    }

    /**
     * Возвращает классы стилей для скругления углов плитки
     * @return {string}
     */
    getRoundBorderClasses(): string {
        let classes = ` controls-TileView__item_roundBorder_topLeft_${this.getTopLeftRoundBorder()}`;
        classes += ` controls-TileView__item_roundBorder_topRight_${this.getTopRightRoundBorder()}`;
        classes += ` controls-TileView__item_roundBorder_bottomLeft_${this.getBottomLeftRoundBorder()}`;
        classes += ` controls-TileView__item_roundBorder_bottomRight_${this.getBottomRightRoundBorder()}`;
        return classes;
    }

    // endregion RoundBorder

    // region Footer

    /**
     * Должен ли отрисовываться темплейт футера
     * @param {TTileItem} itemType Тип элемента
     * @param {TemplateFunction} footerTemplate Темплейт футера
     * @param {TFooterPlace} place Место в темплейте, в котором будет отрисовываться темплейт футера
     */
    shouldDisplayFooterTemplate(
        itemType: TTileItem = 'default',
        footerTemplate: TemplateFunction,
        place: TFooterPlace
    ): boolean {
        if (!footerTemplate) {
            return false;
        }

        return (
            (itemType === 'small' && place === 'wrapper') ||
            (itemType === 'preview' && place === 'content')
        );
    }

    /**
     * Возвращает классы стилей для прикладного футера
     * @param {TTileItem} itemType Тип элемента
     * @param {string} description Описание
     * @param {number} descriptionLines Кол-во строк в описании
     * @param {TTitlePosition} titlePosition Положение заголовка
     * @param {TImageViewMode} imageViewMode Режим отображения изображения
     */
    getFooterClasses({
        itemType = 'default',
        description = '',
        descriptionLines = 0,
        titlePosition = 'underImage',
        imageViewMode = 'rectangle',
    }: Partial<ITileItemProps>): string {
        let classes = '';
        switch (itemType) {
            case 'default':
            case 'small':
            case 'medium':
            case 'preview':
                classes += 'controls-TileView__item_footer';
                break;
            case 'rich':
                if (
                    (descriptionLines > 0 && description) ||
                    titlePosition !== 'onImage' ||
                    imageViewMode === 'none'
                ) {
                    classes += ' controls-TileView__richTemplate_footer_spacing';
                }
                break;
        }

        return classes;
    }

    // endregion Footer

    abstract isHovered(): boolean;

    abstract isActive(): boolean;

    abstract isSwiped(): boolean;

    abstract isEditing(): boolean;

    abstract isDragged(): boolean;

    abstract hasVisibleActions(): boolean;

    abstract shouldDisplayItemActions(): boolean;

    abstract shouldDisplayMarker(marker: boolean): boolean;

    abstract getMarkerClasses(markerSize: TMarkerSize, addVerticalPaddings?: boolean): string;

    abstract getDisplayProperty(): string;

    abstract getDisplayValue(): string;

    abstract getContents(): T;

    abstract getTheme(): string;

    abstract getLeftPadding(): string;

    abstract getRightPadding(): string;

    abstract getTopPadding(): string;

    abstract getBottomPadding(): string;

    abstract getOwner(): Tile;

    abstract getMultiSelectVisibility(): string;

    protected abstract _notifyItemChangeToOwner(property: string): void;

    protected abstract _nextVersion(): void;

    abstract getFadedClass(): string;
}

Object.assign(TileItem.prototype, {
    '[Controls/_tile/mixins/TileItem]': true,
    _$fixedPosition: undefined,
    _$animated: false,
    _$canShowActions: false,
    _$tileMode: 'static',
    _$tileSize: null,
    _$tileHeight: DEFAULT_TILE_HEIGHT,
    _$tileWidth: DEFAULT_TILE_WIDTH,
    _$tileWidthProperty: '',
    _$feature1183277279: '',
    _$tileFitProperty: '',
    _$tileScalingMode: 'none',
    _$imageProperty: '',
    _$imageFit: null,
    _$imageHeightProperty: '',
    _$imageWidthProperty: '',
    _$imageUrlResolver: null,
    _$fallbackImage: '',
    _$roundBorder: null,
    _$orientation: 'vertical',
});
