import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { BaseItem } from './BaseItem';
import {
    IDescriptionProps,
    IImageProps,
    ITileItemActionsProps,
    ICaptionProps,
    TVerticalPosition,
    TProportion,
    TCaptionPosition,
    IZenProps,
    ICustomContent,
    IActionsProps,
    IBorderProps,
    ICheckboxProps,
    IMarkerProps,
    IPaddingProps,
    IRoundAnglesProps,
    IShadowProps,
    ICursorProps,
    TImageSize,
    IHighlightDecoratorProps,
    AVAILABLE_SIZE_VALUES,
    TSize,
    TTileImageEffect,
} from 'Controls/interface';
import { TextRender } from './common/TextRender';
import { calculateRGB, calculateVariables } from 'Controls/themesExt';
import 'css!Controls-Templates/itemTemplates';
import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import { TInternalProps } from 'UICore/Executor';
import { CollectionItem } from 'Controls/display';
import Image from './common/Image';

/**
 * @interface Controls-Templates/IVerticalItemImageProps
 * @public
 * Интерфейс опций для настройки вывода изображения в шаблоне VerticalItem
 */
export interface IVerticalItemImageProps extends IImageProps {
    /**
     * @cfg
     * Режим отображения изображения
     */
    imageViewMode?: 'circle' | 'rectangle' | 'none';
    /**
     * @cfg {Controls/interface/TVerticalPosition} Положение изображения
     */
    imagePosition?: TVerticalPosition;
    /**
     * @cfg {Controls/interface/TTileImageEffect.typedef}
     * Эффект на изображении.
     * Для прямоугольных изображений может быть применён градиент или "умный градиент", который зависит от значения, указанного в поле записи dominantColor.
     * Для круглых изображений применяется эффект рамки.
     * @demo Controls-Templates-demo/VerticalItem/ImageEffect/Index
     */
    imageEffect?: TTileImageEffect;
    /**
     * @cfg {Controls/interface/TProportion.typedef} Пропорция изображения. Высота изображения будет подстраиваться под ширину в соответствии с этой пропорцией.
     */
    imageProportion?: TProportion;
    /**
     * @cfg {Controls/interface/TImageSize} Размер изображения
     */
    imageSize?: TImageSize;
}

export type TGradientDirection = 'toBottom' | 'toBottomRight';

/**
 * Интерфейс для опций контрола {@link Controls-Templates/VerticalItem}.
 * @interface Controls-Templates/IVerticalItemProps
 * @implements Controls/interface/IMarkerProps
 * @implements Controls/interface/ICheckboxProps
 * @implements Controls/interface/IShadowProps
 * @implements Controls/interface/IBorderProps
 * @implements Controls/interface/IRoundAnglesProps
 * @implements Controls/interface/IPaddingProps
 * @implements Controls/interface/ICaptionProps
 * @implements Controls/interface/IDescriptionProps
 * @implements Controls/interface/ICustomContent
 * @implements Controls/interface/ICursorProps
 * @implements Controls-Templates/IVerticalItemImageProps
 * @public
 */
export interface IVerticalItemProps
    extends IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IActionsProps,
        IRoundAnglesProps,
        IPaddingProps,
        ICursorProps,
        ICaptionProps,
        IZenProps,
        IDescriptionProps,
        IVerticalItemImageProps,
        ITileItemActionsProps,
        ICustomContent,
        IItemActionsHandler,
        IItemEventHandlers,
        TInternalProps,
        Partial<IHighlightDecoratorProps> {
    item: CollectionItem;
    /**
     * @cfg {Controls/interface/TCaptionPosition} Расположение заголовка
     */
    captionPosition?: TCaptionPosition;
    /**
     * @cfg {string} Классы, которые применяются к элементу.
     */
    className?: string;

    // styleProp, чтобы не конфликтовать с опцией style, которая в контролах обозначает совсем другое
    styleProp?: React.CSSProperties;
    /**
     * @cfg {string} Стиль фона элемента
     */
    backgroundColorStyle?: string;

    /**
     * @typedef {String} TGradientDirection
     * @variant toBottom Направление градиента сверху вниз.
     * @variant toBottomRight Направление градиента из верхнего левого в правый нижний угол.
     */
    /**
     * @cfg {TGradientDirection} Направление градиента.
     * @default toBottom
     * @see gradientStartColor
     * @see gradientStopColor
     */
    gradientDirection?: TGradientDirection;

    /**
     * @cfg {String} Начальный цвет высокого градиента. Можно указывать в любом формате, который поддерживается в CSS.
     * @default #FFF
     * @see imageSize
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     * @see gradientDirection
     * @see gradientStopColor
     */
    gradientStartColor?: string;

    /**
     * @cfg {String} Конечный цвет высокого градиента. Можно указывать в любом формате, который поддерживается в CSS.
     * @default #FFF
     * @see imageSize
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     * @see gradientDirection
     * @see gradientStartColor
     */
    gradientStopColor?: string;
}

const DEFAULT_PADDING = 'm';

export const cssPrefix = 'Controls-Templates-VerticalItem';

function validatePadding(padding: string): TSize {
    return AVAILABLE_SIZE_VALUES.includes(padding) ? (padding as TSize) : DEFAULT_PADDING;
}

function getItemClassName({
    dominantColor,
    brightness = 'light',
    imageEffect = 'none',
    backgroundColorStyle = 'default',
    className = '',
}: IVerticalItemProps): string {
    let classes = ` ${className} Controls-Templates-TileItem__wrapper ws-flexbox`;
    if (dominantColor && imageEffect === 'custom') {
        classes += ` controls_themes__wrapper controls-ZenWrapper controls-ZenWrapper__${brightness}`;
        classes += ' Controls-Templates-TileItem__wrapper_background-custom';
    } else {
        classes += ` controls-background-${backgroundColorStyle}`;
    }
    return classes;
}

function getImageClassName({
    imageObjectFit = 'cover',
    imageViewMode = 'none',
    imageEffect = 'none',
    imageClass = '',
}: IVerticalItemProps): string {
    let classes = `${imageClass} Controls-Templates-VerticalItem__image Controls-Templates-TileItem__image`;
    classes += ` Controls-Templates-VerticalItem__image_viewMode_${imageViewMode}`;
    classes += ' Controls-Templates-TileItem__image_centered';
    classes += ` Controls-Templates-TileItem__image_object-fit_${imageObjectFit}`;
    if (imageEffect === 'border') {
        classes += ' Controls-Templates-TileItem__image_bordered';
    }
    return classes;
}

function getContentClassName(): string {
    let classes = ' Controls-Templates-VerticalItem__content ';
    classes += ' Controls-Templates-TileItem__content_as_column';

    return classes;
}

function getTextContentClassName({
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
}: IVerticalItemProps): string {
    let classes = '';

    classes += ` Controls-Templates-BaseItem__content_padding-left_${validatePadding(paddingLeft)}`;
    classes += ` Controls-Templates-BaseItem__content_padding-right_${validatePadding(
        paddingRight
    )}`;

    return classes;
}

function getCaptionClassName(props: IVerticalItemProps): string {
    const captionPosition = props.captionPosition;
    const imagePosition = props.imagePosition;
    const hasDescription = props.description && props.descriptionLines;
    let classes = getTextContentClassName(props);
    classes += ' Controls-Templates-VerticalItem__caption ';
    classes += ` Controls-Templates-VerticalItem__caption_position_${captionPosition}`;
    classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(
        props.paddingTop
    )}`;
    if (
        captionPosition !== 'top' &&
        (props.descriptionLines === 0 || (!props.footer && !props.description))
    ) {
        classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
            props.paddingBottom
        )}`;
        classes += ' Controls-Templates-TileItem__content_as_column';
    }

    if (captionPosition !== 'on-image' && (!hasDescription || imagePosition !== 'bottom')) {
        classes += getGradientClassName(props);
    }

    return classes;
}

function getDescriptionClassName(props: IVerticalItemProps): string {
    const captionPosition = props.captionPosition;
    const imagePosition = props.imagePosition;

    let classes = getTextContentClassName(props) + ' ' + (props.descriptionClass || '');
    classes +=
        ' Controls-Templates-VerticalItem__description Controls-Templates-TileItem__content_as_column';
    classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(
        props.paddingTop
    )}`;
    classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
        props.paddingBottom
    )}`;

    if (captionPosition !== 'default' || !props.caption || imagePosition === 'bottom') {
        classes += getGradientClassName(props);
    }
    return classes;
}

function getGradientClassName({
    imageViewMode = 'none',
    imagePosition = 'top',
    imageEffect = 'none',
}: IVerticalItemProps): string {
    const needGradient =
        (imageEffect === 'light' || imageEffect === 'custom') && imageViewMode === 'rectangle';
    let classes = '';
    if (needGradient) {
        classes += ' Controls-Templates-VerticalItem__content-overlay_gradient';
        classes += ` Controls-Templates-VerticalItem__content-overlay_${imagePosition}-gradient`;
        classes += ` Controls-Templates-VerticalItem__content-overlay_${imagePosition}-gradient_${imageEffect}`;
    }
    return classes;
}

function getImageWrapperClassName({
    roundAngleBL = 'null',
    roundAngleBR = 'null',
    roundAngleTL = 'null',
    roundAngleTR = 'null',
    imagePosition = 'top',
    paddingLeft = DEFAULT_PADDING,
    imageProportion = '1:1',
    imageSize,
    imageViewMode = 'none',
    captionPosition = 'default',
    descriptionLines,
    footer,
    description,
}: IVerticalItemProps): string {
    const [verticalPosition, horizontalPosition] = imagePosition.split('-');

    let classes = ' Controls-Templates-VerticalItem__image_wrapper ';
    if (!horizontalPosition) {
        classes += ` Controls-Templates-VerticalItem__image_wrapper_viewMode_${imageViewMode}`;
        if (imageViewMode === 'rectangle') {
            classes += ` Controls-Templates-TileItem__image_proportion_${imageProportion.replace(
                ':',
                '_'
            )}`;

            if (captionPosition === 'on-image') {
                classes += ' Controls-Templates-VerticalItem__image_gradientOverlay_to-bottom';
            }
        }
    } else {
        classes += ` Controls-Templates-VerticalItem__image_wrapper_align_${horizontalPosition}`;
        classes += ` Controls-Templates-TileItem__image_size_${imageSize}`;

        if (imageViewMode === 'rectangle') {
            classes += ` Controls-Templates-BaseItem__borderRadius-tr_${roundAngleTR}`;
            classes += ` Controls-Templates-BaseItem__borderRadius-tl_${roundAngleTL}`;
            classes += ` Controls-Templates-BaseItem__borderRadius-br_${roundAngleBR}`;
            classes += ` Controls-Templates-BaseItem__borderRadius-bl_${roundAngleBL}`;
        }
    }

    classes += ` Controls-Templates-VerticalItem__image_position_${verticalPosition}`;
    if (imageViewMode === 'circle' || !!horizontalPosition) {
        const hasDescription = descriptionLines > 0 && (footer || description);
        if (verticalPosition === 'top') {
            classes += ' Controls-Templates-BaseItem__content_margin-top_m';
        }
        if (verticalPosition === 'bottom' || (!hasDescription && captionPosition === 'top')) {
            classes += ' Controls-Templates-BaseItem__content_margin-bottom_m';
        }
        if (paddingLeft !== 'null') {
            classes += ' Controls-Templates-BaseItem__content_margin-left_m';
        }
        classes += ' Controls-Templates-BaseItem__content_margin-right_m';
    }
    return classes;
}

function getItemStyles(props: IVerticalItemProps): React.CSSProperties {
    let styles: React.CSSProperties = props.styleProp ? { ...props.styleProp } : {};
    if (props.dominantColor && props.imageEffect === 'custom') {
        styles = {
            ...styles,
            ...calculateVariables(
                calculateRGB(props.dominantColor),
                calculateRGB(props.complementaryColor),
                props.brightness
            ),
        };
    }
    if (props.gradientStartColor && props.gradientStopColor) {
        const startColor = `${props.gradientStartColor} 0%`;
        const endColor = `${props.gradientStopColor} 100%`;
        const gradientDirectionStyle =
            props.gradientDirection === 'toBottom' ? 'to bottom' : 'to bottom right';
        styles.backgroundImage = `linear-gradient(${gradientDirectionStyle}, ${startColor}, ${endColor})`;
    }
    return styles;
}

function getHeaderClasses({
    paddingTop = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    headerPosition = 'content',
}: IVerticalItemProps): string {
    let classes = '';
    classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(paddingTop)}`;
    if (headerPosition !== 'content') {
        classes += ` Controls-Templates-BaseItem__content_padding-left_${validatePadding(
            paddingLeft
        )}`;
        classes += ` Controls-Templates-BaseItem__content_padding-right_${validatePadding(
            paddingRight
        )}`;
    }
    if (headerPosition === 'absolute') {
        classes += ' Controls-Templates-TileItem__absolute-content';
        classes += ' Controls-Templates-TileItem__absolute-header';
    }
    return classes;
}

function getFooterClasses({
    paddingBottom = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    footerPosition = 'content',
}: IVerticalItemProps): string {
    let classes = '';
    classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
        paddingBottom
    )}`;
    if (footerPosition !== 'content') {
        classes += ` Controls-Templates-BaseItem__content_padding-left_${validatePadding(
            paddingLeft
        )}`;
        classes += ` Controls-Templates-BaseItem__content_padding-right_${validatePadding(
            paddingRight
        )}`;
    }
    if (footerPosition === 'absolute') {
        classes += ' Controls-Templates-TileItem__absolute-content';
        classes += ' Controls-Templates-TileItem__absolute-footer';
    }
    return classes;
}

const Header = (props) => {
    return createElement(props.header, { ...props });
};

const Footer = (props) => {
    return createElement(props.footer, { ...props });
};

function validateProps(props: IVerticalItemProps): IVerticalItemProps {
    const validProps: IVerticalItemProps = {
        captionPosition: 'default',
        imagePosition: 'top',
        headerPosition: 'content',
        footerPosition: 'content',
        ...props,
    };
    if (
        validProps.captionPosition !== 'default' &&
        validProps.captionPosition !== 'top' &&
        validProps.captionPosition !== 'on-image'
    ) {
        validProps.captionPosition = 'default';
    }
    return validProps;
}

export function VerticalItem(props: IVerticalItemProps): React.ReactElement<IVerticalItemProps> {
    const propsWithDefaults = validateProps(props);

    return (
        <BaseItem
            className={getItemClassName(props)}
            style={getItemStyles(props)}
            $wasabyRef={props.$wasabyRef}
            item={props.item}
            item-key={props['item-key']}
            data-qa={props['data-qa']}
            cursor={props.cursor}
            faded={props.faded}
            checkboxValue={props.checkboxValue}
            checkboxVisibility={props.checkboxVisibility}
            checkboxClassName={props.checkboxClassName}
            markerSize={props.markerSize}
            markerVisible={props.markerVisible}
            paddingTop={props.paddingTop}
            paddingBottom={props.paddingBottom}
            paddingLeft={props.paddingLeft}
            paddingRight={props.paddingRight}
            actions={props.actions}
            actionsDisplayDelay={props.actionsDisplayDelay}
            actionsVisibility={props.actionsVisibility}
            actionsPosition={props.actionsPosition}
            iconStyle={'forTranslucent'}
            brightness={props.brightness}
            actionsClassName={props.actionsClassName}
            borderStyle={props.borderStyle}
            borderVisibility={props.borderVisibility}
            roundAngleBL={props.roundAngleBL}
            roundAngleBR={props.roundAngleBR}
            roundAngleTL={props.roundAngleTL}
            roundAngleTR={props.roundAngleTR}
            shadowVisibility={props.shadowVisibility}
            onActionsMouseEnter={props.onActionsMouseEnter}
            onActionMouseDown={props.onActionMouseDown}
            onActionMouseUp={props.onActionMouseUp}
            onActionMouseEnter={props.onActionMouseEnter}
            onActionMouseLeave={props.onActionMouseLeave}
            onActionClick={props.onActionClick}
            onItemActionSwipeAnimationEnd={props.onItemActionSwipeAnimationEnd}
            itemActionsTemplateMountedCallback={props.itemActionsTemplateMountedCallback}
            itemActionsTemplateUnmountedCallback={props.itemActionsTemplateUnmountedCallback}
            onClick={props.onClick}
            onClickCallback={props.onClickCallback}
            onMouseDownCallback={props.onMouseDownCallback}
            onMouseUpCallback={props.onMouseUpCallback}
            onMouseEnterCallback={props.onMouseEnterCallback}
            onMouseLeaveCallback={props.onMouseLeaveCallback}
            onMouseMoveCallback={props.onMouseMoveCallback}
            onContextMenuCallback={props.onContextMenuCallback}
            onDeactivatedCallback={props.onDeactivatedCallback}
            onLongTapCallback={props.onLongTapCallback}
            onSwipeCallback={props.onSwipeCallback}
            onWheelCallback={props.onWheelCallback}
        >
            <div className={getContentClassName()}>
                {propsWithDefaults.headerPosition !== 'content' && props.header ? (
                    <div className={getHeaderClasses(propsWithDefaults)}>
                        <Header header={props.header} item={props.item} />
                    </div>
                ) : null}
                {props.imageViewMode !== 'none' ? (
                    <div className={getImageWrapperClassName(props)}>
                        {props.imageSrc && (
                            <div>
                                <Image
                                    className={getImageClassName(props)}
                                    title={props.title}
                                    imageSrc={props.imageSrc}
                                    imageAlt={props.imageAlt}
                                    fallbackImage={props.fallbackImage}
                                />
                            </div>
                        )}
                    </div>
                ) : null}
                <div
                    className={getCaptionClassName(propsWithDefaults)}
                    data-qa="controls-ItemTemplate__title"
                >
                    {propsWithDefaults.headerPosition === 'content' && props.header ? (
                        <Header header={props.header} item={props.item} />
                    ) : null}
                    {props.caption ? (
                        <TextRender
                            className={props.captionClass || ''}
                            value={props.caption}
                            lines={props.captionLines}
                            hAlign={props.captionHAlign}
                            fontSize={props.captionFontSize}
                            fontColorStyle={props.captionFontColorStyle}
                            fontWeight={props.captionFontWeight}
                            highlightDecoratorClassName={props.highlightDecoratorClassName}
                            searchValue={props.searchValue}
                            lineBreak={props.captionLineBreak}
                        />
                    ) : null}

                    {props.footer && props.descriptionLines === 0 ? (
                        <Footer footer={props.footer} item={props.item} />
                    ) : null}
                </div>
                {(props.description || props.footer) && props.descriptionLines !== 0 ? (
                    <div className={getDescriptionClassName(propsWithDefaults)}>
                        {props.description ? (
                            <TextRender
                                value={props.description}
                                lines={props.descriptionLines}
                                hAlign={props.descriptionHAlign}
                                fontSize={props.descriptionFontSize}
                                fontColorStyle={props.descriptionFontColorStyle}
                                fontWeight={props.descriptionFontWeight}
                                highlightDecoratorClassName={props.highlightDecoratorClassName}
                                searchValue={props.searchValue}
                            />
                        ) : null}
                        {propsWithDefaults.footerPosition === 'content' && props.footer ? (
                            <Footer footer={props.footer} item={props.item} />
                        ) : null}
                    </div>
                ) : null}

                {propsWithDefaults.footerPosition !== 'content' && props.footer ? (
                    <div className={getFooterClasses(propsWithDefaults)}>
                        <Footer footer={props.footer} item={props.item} />
                    </div>
                ) : null}
            </div>
        </BaseItem>
    );
}

export default React.memo(VerticalItem);

/**
 * Шаблон, состоящий из текстового контента и изображения, располагающегося сверху или снизу от текста.
 * @class Controls-Templates/VerticalItem
 * @implements Controls-Templates/IVerticalItemProps
 * @public
 * @demo Controls-Templates-demo/VerticalItem/Index
 */
