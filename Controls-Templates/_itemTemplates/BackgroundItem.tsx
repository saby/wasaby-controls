import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { BaseItem } from './BaseItem';
import { calculateRGB, calculateVariables } from 'Controls/themesExt';
import {
    IDescriptionProps,
    IImageProps,
    ICursorProps,
    ITileItemActionsProps,
    ICaptionProps,
    TOverlayDirection,
    TOverlayStyle,
    IZenProps,
    ICustomContent,
    TProportion,
    IActionsProps,
    IBorderProps,
    ICheckboxProps,
    IMarkerProps,
    IPaddingProps,
    IRoundAnglesProps,
    IShadowProps,
    TSize,
    AVAILABLE_SIZE_VALUES,
} from 'Controls/interface';
import 'css!Controls-Templates/itemTemplates';
import { TextRender } from './common/TextRender';
import { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import { TInternalProps } from 'UICore/Executor';
import { CollectionItem } from 'Controls/display';

/**
 * Интерфейс для опций контрола {@link Controls-Templates/BackgroundItem}.
 * @interface Controls-Templates/IBackgroundItemProps
 * @implements Controls-Templates/interface/IMarkerProps
 * @implements Controls-Templates/interface/ICheckboxProps
 * @implements Controls-Templates/interface/IShadowProps
 * @implements Controls-Templates/interface/IBorderProps
 * @implements Controls-Templates/interface/IRoundAnglesProps
 * @implements Controls-Templates/interface/IPaddingProps
 * @implements Controls-Templates/interface/ICaptionProps
 * @implements Controls-Templates/interface/IDescriptionProps
 * @implements Controls-Templates/interface/IImageProps
 * @implements Controls-Templates/interface/IZenProps
 * @implements Controls-Templates/interface/ICustomContent
 * @public
 */
export interface IBackgroundItemProps
    extends IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IActionsProps,
        IRoundAnglesProps,
        IPaddingProps,
        ICaptionProps,
        IDescriptionProps,
        IImageProps,
        ICursorProps,
        ITileItemActionsProps,
        IZenProps,
        ICustomContent,
        IItemActionsHandler,
        IItemEventHandlers,
        TInternalProps {
    item: CollectionItem;
    /**
     * @cfg {string} Классы, которые применяются к элементу.
     */
    className?: string;

    /**
     * @cfg {Controls-Templates/interface/TOverlayDirection} Направление градиентного перекрытия изображения
     */
    overlayDirection?: TOverlayDirection;

    /**
     * @cfg {Controls-Templates/interface/TOverlayStyle} Стиль градиентного перекрытия изображения
     */
    overlayStyle?: TOverlayStyle;

    /**
     * @cfg {Controls-Templates/interface/TProportion} Пропорция изображения. Высота изображения будет подстраиваться под ширину в соответствии с этой пропорцией.
     */
    imageProportion?: TProportion;

    // styleProp, чтобы не конфликтовать с опцией style, которая в контролах обозначает совсем другое
    styleProp?: React.CSSProperties;
}

const DEFAULT_PADDING: TSize = 'm';

function getItemClassName({
    dominantColor,
    complementaryColor,
    theme = 'default',
    brightness = 'light',
    className = '',
}: IBackgroundItemProps): string {
    let classes = ` ${className} Controls-Templates-TileItem__wrapper`;

    if (dominantColor) {
        classes +=
            ` controls_theme-${theme} controls_themes__wrapper controls-ZenWrapper controls-ZenWrapper__${brightness}` +
            ` controls-ZenWrapper_complementary${
                !complementaryColor ? '-empty' : ''
            }`;
    }

    return classes;
}

function getImageClassName({
    imageObjectFit = 'cover',
    imageClass = '',
    imageSrc = '',
    dominantColor = '',
}: IBackgroundItemProps): string {
    let classes = `${imageClass} Controls-Templates-BackgroundItem__image Controls-Templates-TileItem__image
    Controls-Templates-TileItem__image_centered`;
    classes += ` Controls-Templates-TileItem__image_object-fit_${imageObjectFit}`;
    if (!imageSrc && dominantColor) {
        classes += ' Controls-Templates-TileItem__content_color-background';
    }
    return classes;
}

function getContentClassName({
    captionVAlign = 'top',
}: IBackgroundItemProps): string {
    let classes = ' Controls-Templates-TileItem__content_as_column';
    classes += ` Controls-Templates-TileItem__content_justify_${captionVAlign}`;
    return classes;
}

function validatePadding(padding: string): TSize {
    return AVAILABLE_SIZE_VALUES.includes(padding)
        ? (padding as TSize)
        : DEFAULT_PADDING;
}

function getCaptionClassName({
    captionClass = '',
    description,
    descriptionLines,
    paddingTop = DEFAULT_PADDING,
    paddingBottom = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    overlayDirection = 'none',
}: IBackgroundItemProps): string {
    let classes = captionClass;

    if (overlayDirection === 'to-top-content') {
        classes +=
            ' Controls-Templates-BackgroundItem__content-overlay_top-gradient Controls-Templates-BackgroundItem__content-overlay_fill';
    } else {
        classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(
            paddingTop
        )}`;
    }

    if (!description || descriptionLines === 0) {
        classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
            paddingBottom
        )}`;
    }

    if (descriptionLines === 0) {
        classes += ' Controls-Templates-TileItem__content_as_column ';
    }

    classes += ` Controls-Templates-BaseItem__content_padding-left_${validatePadding(
        paddingLeft
    )}`;
    classes += ` Controls-Templates-BaseItem__content_padding-right_${validatePadding(
        paddingRight
    )}`;

    return classes;
}

function getDescriptionClassName({
    caption,
    overlayDirection = 'none',
    paddingBottom = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    paddingTop = DEFAULT_PADDING,
}: IBackgroundItemProps): string {
    let classes = ' ws-flexbox';
    if (overlayDirection === 'to-top-content') {
        if (!caption) {
            classes +=
                ' Controls-Templates-BackgroundItem__content-overlay_top-gradient';
        }
        classes += ' Controls-Templates-BackgroundItem__content-overlay_fill';
    } else if (!caption) {
        classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(
            paddingTop
        )}`;
    }

    classes += ` Controls-Templates-BaseItem__content_padding-left_${validatePadding(
        paddingLeft
    )}`;
    classes += ` Controls-Templates-BaseItem__content_padding-right_${validatePadding(
        paddingRight
    )}`;
    classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
        paddingBottom
    )}`;

    return classes;
}

function getImageWrapperClassName({
    overlayDirection = 'none',
    imageProportion,
}: IBackgroundItemProps): string {
    let classes = ' Controls-Templates-TileItem__image_fill-item';

    if (overlayDirection !== 'to-top-content') {
        classes += ` Controls-Templates-BackgroundItem__image_gradientOverlay_${overlayDirection}`;
    }
    if (imageProportion) {
        classes += ` Controls-Templates-TileItem__image_proportion_${imageProportion.replace(
            ':',
            '_'
        )}`;
    }

    return classes;
}

function getItemStyles(props: IBackgroundItemProps): React.CSSProperties {
    let styles: React.CSSProperties = props.styleProp || {};
    if (props.dominantColor) {
        styles = {
            ...styles,
            ...calculateVariables(
                calculateRGB(props.dominantColor),
                calculateRGB(props.complementaryColor),
                props.brightness
            ),
        };
    }
    return styles;
}

function getImageStyles({
    imageSrc,
    fallbackImage,
}: IBackgroundItemProps): React.CSSProperties {
    let backgroundImage: string = '';
    if (imageSrc instanceof Array) {
        const imageSet: string[] = imageSrc.map((img, index) => {
            return `url(${img}) ${index + 1}x`;
        });
        backgroundImage =
            imageSet.length && `-webkit-image-set(${imageSet.join(', ')})`;
    } else if (imageSrc) {
        backgroundImage = `url(${imageSrc})`;
    }
    if (fallbackImage) {
        backgroundImage += `${
            backgroundImage ? ', ' : ''
        }url(${fallbackImage})`;
    }
    return {
        backgroundImage,
    } as React.CSSProperties;
}

const Header = (props) => {
    return createElement(props.header, { ...props });
};

const Footer = (props) => {
    return createElement(props.footer, { ...props });
};

function getHeaderClasses({
    paddingTop = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    headerPosition = 'content',
}: IBackgroundItemProps): string {
    let classes = '';
    classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(
        paddingTop
    )}`;
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
    }
    return classes;
}

function getFooterClasses({
    paddingBottom = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    footerPosition = 'content',
}: IBackgroundItemProps): string {
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
    }
    return classes;
}

export function BackgroundItem(
    props: IBackgroundItemProps
): React.ReactElement<IBackgroundItemProps> {
    const headerPosition = props.headerPosition || 'content';
    const footerPosition = props.footerPosition || 'content';
    return (
        <BaseItem
            className={getItemClassName(props)}
            style={getItemStyles(props)}
            $wasabyRef={props.$wasabyRef}
            item={props.item}
            attr-data-qa={props['attr-data-qa']}
            item-key={props['item-key']}
            data-qa={props['data-qa']}
            cursor={props.cursor}
            checkboxValue={props.checkboxValue}
            checkboxVisibility={props.checkboxVisibility}
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
            itemActionsTemplate={props.itemActionsTemplate}
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
            itemActionsTemplateMountedCallback={
                props.itemActionsTemplateMountedCallback
            }
            itemActionsTemplateUnmountedCallback={
                props.itemActionsTemplateUnmountedCallback
            }
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
            <div className={getImageWrapperClassName(props)}>
                <div>
                    <div
                        className={getImageClassName(props)}
                        style={getImageStyles(props)}
                        title={props.imageAlt}
                    />
                </div>
            </div>
            <div className={'Controls-Templates-TileItem__content_as_column'}>
                {headerPosition !== 'content' && props.header ? (
                    <div className={getHeaderClasses(props)}>
                        <Header header={props.header} item={props.item} />
                    </div>
                ) : null}
                <div className={getContentClassName(props)}>
                    {headerPosition === 'content' && props.header ? (
                        <Header header={props.header} item={props.item} />
                    ) : null}
                    <div className={getCaptionClassName(props)}>
                        {props.caption ? (
                            <TextRender
                                value={props.caption}
                                lines={props.captionLines}
                                hAlign={props.captionHAlign}
                                fontSize={props.captionFontSize}
                                fontColorStyle={props.captionFontColorStyle}
                                fontWeight={props.captionFontWeight}
                            />
                        ) : null}

                        {footerPosition === 'content' &&
                        props.footer &&
                        props.descriptionLines === 0 ? (
                            <Footer footer={props.footer} item={props.item} />
                        ) : null}
                    </div>
                    {(props.description || props.footer) &&
                    props.descriptionLines !== 0 ? (
                        <div className={getDescriptionClassName(props)}>
                            {props.description ? (
                                <TextRender
                                    value={props.description}
                                    lines={props.descriptionLines}
                                    hAlign={props.descriptionHAlign}
                                    fontSize={props.descriptionFontSize}
                                    fontColorStyle={
                                        props.descriptionFontColorStyle
                                    }
                                    fontWeight={props.descriptionFontWeight}
                                />
                            ) : null}
                            {footerPosition === 'content' && props.footer ? (
                                <Footer footer={props.footer} />
                            ) : null}
                        </div>
                    ) : null}
                </div>
                {footerPosition !== 'content' && props.footer ? (
                    <div className={getFooterClasses(props)}>
                        <Footer footer={props.footer} item={props.item} />
                    </div>
                ) : null}
            </div>
        </BaseItem>
    );
}

export default React.memo(BackgroundItem);

/**
 * Шаблон, состоящий из изображения и текстового контента, располагающегося поверх этого изображения.
 * @class Controls-Templates/BackgroundItem
 * @implements Controls-Templates/IBackgroundItemProps
 * @public
 * @demo Controls-Templates-demo/BackgroundItem/Index
 */
