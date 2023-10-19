import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { BaseItem } from './BaseItem';
import {
    IDescriptionProps,
    IImageProps,
    ITileItemActionsProps,
    ICaptionProps,
    THorizontalPosition,
    TImageSize,
    ICustomContent,
    IActionsProps,
    IBorderProps,
    ICheckboxProps,
    IMarkerProps,
    IPaddingProps,
    IRoundAnglesProps,
    IZenProps,
    TBackgroundStyle,
    IShadowProps,
    ICursorProps,
    AVAILABLE_SIZE_VALUES,
    IHighlightDecoratorProps,
    TSize,
} from 'Controls/interface';
import 'css!Controls-Templates/itemTemplates';
import { TextRender } from './common/TextRender';
import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import { TInternalProps } from 'UICore/Executor';
import { CollectionItem } from 'Controls/display';
import { calculateRGB, calculateVariables } from 'Controls/themesExt';
import Image from './common/Image';

/**
 * @interface Controls-Templates/HorizontalItem/IHorizontalItemImageProps
 * @public
 * Интерфейс опций для настройки вывода изображения в шаблоне HorizontalItem
 */
export interface IHorizontalItemImageProps extends IImageProps {
    /**
     * @cfg
     * Режим отображения изображения
     */
    imageViewMode?: 'circle' | 'rectangle' | 'none';
    /**
     * @cfg {Controls-Templates/interface/THorizontalPosition | 'left-fit' | 'right-fit'} Положение изображения
     */
    imagePosition?: THorizontalPosition | 'left-fit' | 'right-fit';
    /**
     * @cfg {Controls-Templates/interface/TImageSize | 'half'} Размер изображения
     */
    imageSize?: TImageSize | 'half';
    /**
     * @cfg
     * Эффект на изображении.
     */
    imageEffect?: 'none' | 'custom';
}

/**
 * Интерфейс для опций контрола {@link Controls-Templates/HorizontalItem}.
 * @interface Controls-Templates/IHorizontalItemProps
 * @implements Controls-Templates/interface/IMarkerProps
 * @implements Controls-Templates/interface/ICheckboxProps
 * @implements Controls-Templates/interface/IShadowProps
 * @implements Controls-Templates/interface/IBorderProps
 * @implements Controls-Templates/interface/IRoundAnglesProps
 * @implements Controls-Templates/interface/IPaddingProps
 * @implements Controls-Templates/interface/ICaptionProps
 * @implements Controls-Templates/interface/IDescriptionProps
 * @implements Controls-Templates/interface/ICustomContent
 * @implements Controls-Templates/HorizontalItem/IHorizontalItemImageProps
 * @public
 */
export interface IHorizontalItemProps
    extends IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IActionsProps,
        IRoundAnglesProps,
        IPaddingProps,
        ICaptionProps,
        IDescriptionProps,
        IHorizontalItemImageProps,
        ITileItemActionsProps,
        ICursorProps,
        IZenProps,
        ICustomContent,
        IItemEventHandlers,
        IItemActionsHandler,
        TInternalProps,
        IHighlightDecoratorProps {
    item: CollectionItem;
    /**
     * @cfg {string} Классы, которые применяются к элементу.
     */
    className?: string;

    // styleProp, чтобы не конфликтовать с опцией style, которая в контролах обозначает совсем другое
    styleProp?: React.CSSProperties;

    backgroundColorStyle: TBackgroundStyle;
}

const DEFAULT_PADDING = 'm';

function validatePadding(padding: string): TSize {
    return AVAILABLE_SIZE_VALUES.includes(padding) ? (padding as TSize) : DEFAULT_PADDING;
}

function getItemClassName({
    dominantColor,
    brightness = 'light',
    imageEffect = 'none',
    backgroundColorStyle = 'default',
    className = '',
}: IHorizontalItemProps): string {
    let classes = ` ${className} Controls-Templates-TileItem__wrapper`;
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
    roundAngleBL = 'null',
    roundAngleBR = 'null',
    roundAngleTL = 'null',
    roundAngleTR = 'null',
    imagePosition = 'left',
    imageViewMode = 'rectangle',
}: IHorizontalItemProps): string {
    let classes = ' Controls-Templates-HorizontalItem__image Controls-Templates-TileItem__image';
    classes += ' Controls-Templates-TileItem__image_centered';
    classes += ` Controls-Templates-TileItem__image_object-fit_${imageObjectFit}`;

    if (imageViewMode === 'rectangle' && !imagePosition.includes('fit')) {
        classes += ` Controls-Templates-BaseItem__borderRadius-tr_${roundAngleTR}`;
        classes += ` Controls-Templates-BaseItem__borderRadius-tl_${roundAngleTL}`;
        classes += ` Controls-Templates-BaseItem__borderRadius-br_${roundAngleBR}`;
        classes += ` Controls-Templates-BaseItem__borderRadius-bl_${roundAngleBL}`;
    }

    return classes;
}

function getContentClassName(): string {
    return 'Controls-Templates-TileItem__content';
}

function getTextContentClassName({
    captionVAlign = 'top',
    imagePosition = 'left',
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    imageViewMode = 'rectangle',
}: IHorizontalItemProps): string {
    let classes = ' Controls-Templates-TileItem__content_as_column';
    classes += ` Controls-Templates-HorizontalItem__content_justify_${captionVAlign}`;

    const rightClasses = ` Controls-Templates-BaseItem__content_padding-right_${validatePadding(
        paddingRight
    )}`;
    const leftClasses = ` Controls-Templates-BaseItem__content_padding-left_${validatePadding(
        paddingLeft
    )}`;

    if (imageViewMode === 'none') {
        classes += rightClasses + leftClasses;
    } else if (imagePosition.includes('left')) {
        classes += rightClasses;
    } else if (imagePosition.includes('right')) {
        classes += leftClasses;
    }

    return classes;
}

function getImageWrapperClassName({
    imageSize = 'xl',
    imagePosition = 'left',
    imageViewMode = 'rectangle',
    imageClass = '',
    paddingTop = DEFAULT_PADDING,
    paddingBottom = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
}: IHorizontalItemProps): string {
    let classes = ` ${imageClass}  Controls-Templates-HorizontalItem__image_wrapper `;
    classes += ` Controls-Templates-HorizontalItem__image_viewMode_${imageViewMode}`;
    classes += ` Controls-Templates-HorizontalItem__image_position_${imagePosition}`;

    classes += getGradientClassName(arguments[0]);

    if (imagePosition.includes('left')) {
        classes += ' Controls-Templates-BaseItem__content_margin-right_m';
    } else if (imagePosition.includes('right')) {
        classes += ' Controls-Templates-BaseItem__content_margin-left_m';
    }

    if (imagePosition.includes('fit')) {
        classes += ` Controls-Templates-HorizontalItem__image-fit_size_${imageSize}`;
    } else {
        if (imagePosition.includes('left')) {
            classes += ` Controls-Templates-BaseItem__content_margin-left_${validatePadding(
                paddingLeft
            )}`;
        } else if (imagePosition.includes('right')) {
            classes += ` Controls-Templates-BaseItem__content_margin-right_${validatePadding(
                paddingRight
            )}`;
        }
        classes += ` Controls-Templates-TileItem__image_size_${imageSize}`;
        classes += ` Controls-Templates-BaseItem__content_margin-top_${validatePadding(
            paddingTop
        )}`;
        classes += ` Controls-Templates-BaseItem__content_margin-bottom_${validatePadding(
            paddingBottom
        )}`;
    }

    return classes;
}

function getCaptionClassName(props: IHorizontalItemProps): string {
    let classes = ' Controls-Templates-HorizontalItem__caption ' + (props.captionClass || '');
    classes += ` Controls-Templates-BaseItem__content_padding-top_${validatePadding(
        props.paddingTop
    )}`;
    if (props.descriptionLines === 0) {
        classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
            props.paddingBottom
        )}`;
        classes += ' Controls-Templates-TileItem__content_as_column ';
    }
    return classes;
}

function getDescriptionClassName(props: IHorizontalItemProps): string {
    let classes = props.descriptionClass || '';
    classes +=
        ' Controls-Templates-HorizontalItem__description Controls-Templates-TileItem__content_as_column';
    classes += ' Controls-Templates-BaseItem__content_padding-top_s';
    classes += ` Controls-Templates-BaseItem__content_padding-bottom_${validatePadding(
        props.paddingBottom
    )}`;

    return classes;
}

function getItemStyles(props: IHorizontalItemProps): React.CSSProperties {
    let styles: React.CSSProperties = props.styleProp || {};
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
    return styles;
}

function getGradientClassName({
    imageViewMode = 'none',
    imagePosition = 'left',
    imageEffect = 'none',
}: IHorizontalItemProps): string {
    const needGradient = imageEffect === 'custom' && imageViewMode === 'rectangle';
    let classes = '';
    if (needGradient) {
        classes += ' Controls-Templates-HorizontalItem__image_gradientOverlay';
        classes += ` Controls-Templates-HorizontalItem__image_gradientOverlay-${imagePosition}`;
    }
    return classes;
}

function getHeaderClasses({
    paddingTop = DEFAULT_PADDING,
    paddingLeft = DEFAULT_PADDING,
    paddingRight = DEFAULT_PADDING,
    headerPosition = 'content',
}: IHorizontalItemProps): string {
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
}: IHorizontalItemProps): string {
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

export function HorizontalItem(
    props: IHorizontalItemProps
): React.ReactElement<IHorizontalItemProps> {
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
            checkboxClassName={props.checkboxClassName}
            markerSize={props.markerSize}
            markerVisible={props.markerVisible}
            paddingTop={props.paddingTop}
            paddingBottom={props.paddingBottom}
            paddingLeft={props.paddingLeft}
            paddingRight={props.paddingRight}
            actions={props.actions}
            actionsDisplayDelay={props.actionsDisplayDelay}
            actionsPosition={props.actionsPosition}
            actionsVisibility={props.actionsVisibility}
            itemActionsTemplate={props.itemActionsTemplate}
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
            <div className={'Controls-Templates-TileItem__content_as_column'}>
                {headerPosition !== 'content' && props.header ? (
                    <div className={getHeaderClasses(props)}>
                        <Header header={props.header} item={props.item} />
                    </div>
                ) : null}
                <div className={getContentClassName()}>
                    {props.imageViewMode !== 'none' && props.imageSrc ? (
                        <div className={getImageWrapperClassName(props)}>
                            <div>
                                <Image
                                    className={getImageClassName(props)}
                                    title={props.title}
                                    imageSrc={props.imageSrc}
                                    imageAlt={props.imageAlt}
                                    fallbackImage={props.fallbackImage}
                                />
                            </div>
                        </div>
                    ) : null}
                    <div className={getTextContentClassName(props)}>
                        {headerPosition === 'content' && props.header ? (
                            <div className={getHeaderClasses(props)}>
                                <Header header={props.header} item={props.item} />
                            </div>
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
                                    highlightDecoratorClassName={props.highlightDecoratorClassName}
                                    searchValue={props.searchValue}
                                />
                            ) : null}
                            {footerPosition === 'content' &&
                            props.footer &&
                            props.descriptionLines === 0 ? (
                                <Footer footer={props.footer} />
                            ) : null}
                        </div>
                        {(props.description || props.footer) && props.descriptionLines !== 0 ? (
                            <div className={getDescriptionClassName(props)}>
                                {props.description ? (
                                    <TextRender
                                        value={props.description}
                                        lines={props.descriptionLines}
                                        hAlign={props.descriptionHAlign}
                                        fontSize={props.descriptionFontSize}
                                        fontColorStyle={props.descriptionFontColorStyle}
                                        fontWeight={props.descriptionFontWeight}
                                        highlightDecoratorClassName={
                                            props.highlightDecoratorClassName
                                        }
                                        searchValue={props.searchValue}
                                    />
                                ) : null}
                                {footerPosition === 'content' && props.footer ? (
                                    <Footer footer={props.footer} item={props.item} />
                                ) : null}
                            </div>
                        ) : null}
                    </div>
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

export default React.memo(HorizontalItem);

/**
 * Шаблон, состоящий из текстового контента и изображения, располагающегося слева или справа от текста.
 * @class Controls-Templates/HorizontalItem
 * @implements Controls-Templates/IHorizontalItemProps
 * @public
 * @demo Controls-Templates-demo/HorizontalItem/Index
 */
