import * as React from 'react';
import { BaseItem } from './BaseItem';
import {
    IImageProps,
    ITileItemActionsProps,
    IActionsProps,
    IBorderProps,
    ICheckboxProps,
    IMarkerProps,
    IPaddingProps,
    IRoundAnglesProps,
    IShadowProps,
    ICursorProps,
    TProportion,
} from 'Controls/interface';
import 'css!Controls-Templates/itemTemplates';
import { TInternalProps } from 'UICore/Executor';
import { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import { CollectionItem } from 'Controls/display';
import Image from './common/Image';

/**
 * Интерфейс для опций контрола {@link Controls-Templates/ImageItem}.
 * @interface Controls-Templates/IImageItemProps
 * @implements Controls/interface/IMarkerProps
 * @implements Controls/interface/ICheckboxProps
 * @implements Controls/interface/IShadowProps
 * @implements Controls/interface/IBorderProps
 * @implements Controls/interface/IRoundAnglesProps
 * @implements Controls/interface/IPaddingProps
 * @implements Controls/interface/IImageProps
 * @public
 */
export interface IImageItemProps
    extends IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IActionsProps,
        IRoundAnglesProps,
        IPaddingProps,
        IImageProps,
        ICursorProps,
        ITileItemActionsProps,
        IItemActionsHandler,
        TInternalProps,
        IItemEventHandlers {
    item: CollectionItem;
    /**
     * @cfg {string} Подсказка при наведении
     */
    title?: string;
    /**
     * @cfg {string} Классы, которые применяются к элементу.
     */
    className?: string;

    /**
     * @cfg {Controls/interface/TProportion.typedef} Пропорция изображения
     */
    imageProportion?: TProportion;

    // styleProp, чтобы не конфликтовать с опцией style, которая в контролах обозначает совсем другое
    styleProp?: React.CSSProperties;
}

const DEFAULT_MARKER_OFFSET = 's';
const DEFAULT_MARKER_SIZE = 'content-xl';

function getItemClassName({ className = '' }: IImageItemProps): string {
    return ` ${className} Controls-Templates-TileItem__wrapper`;
}

function getImageClassName({ imageObjectFit = 'cover', imageClass = '' }: IImageItemProps): string {
    let classes = `${imageClass} Controls-Templates-ImageItem__image Controls-Templates-TileItem__image
    Controls-Templates-TileItem__image_centered`;
    classes += ` Controls-Templates-TileItem__image_object-fit_${imageObjectFit}`;
    return classes;
}

function getImageWrapperClassName({
    roundAngleBL = 'null',
    roundAngleBR = 'null',
    roundAngleTL = 'null',
    roundAngleTR = 'null',
    imageProportion,
}: IImageItemProps): string {
    let classes = ' Controls-Templates-TileItem__image_fill-item';

    classes += ` Controls-Templates-TileItem__borderRadius-tr_${roundAngleTR}`;
    classes += ` Controls-Templates-TileItem__borderRadius-tl_${roundAngleTL}`;
    classes += ` Controls-Templates-TileItem__borderRadius-br_${roundAngleBR}`;
    classes += ` Controls-Templates-TileItem__borderRadius-bl_${roundAngleBL}`;

    if (imageProportion) {
        classes += ` Controls-Templates-TileItem__image_proportion_${imageProportion.replace(
            ':',
            '_'
        )}`;
    }

    return classes;
}

export function ImageItem(props: IImageItemProps): React.ReactElement<IImageItemProps> {
    // В шаблонах без внутреннего отступа (например, в этом) верхний отступ маркера равен или размеру скругления, или s
    const markerOffset = props.roundAngleTR || DEFAULT_MARKER_OFFSET;
    return (
        <BaseItem
            $wasabyRef={props.$wasabyRef}
            item-key={props['item-key']}
            data-qa={props['data-qa']}
            className={getItemClassName(props)}
            item={props.item}
            style={props.styleProp}
            cursor={props.cursor}
            faded={props.faded}
            checkboxValue={props.checkboxValue}
            checkboxVisibility={props.checkboxVisibility}
            checkboxClassName={props.checkboxClassName}
            markerSize={props.markerSize || DEFAULT_MARKER_SIZE}
            markerVisible={props.markerVisible}
            paddingTop={markerOffset}
            paddingBottom={props.paddingBottom}
            paddingLeft={props.paddingLeft}
            paddingRight={props.paddingRight}
            actions={props.actions}
            actionsDisplayDelay={props.actionsDisplayDelay}
            actionsVisibility={props.actionsVisibility}
            actionsPosition={props.actionsPosition}
            iconStyle={'forTranslucent'}
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
        </BaseItem>
    );
}

export default React.memo(ImageItem);

/**
 * Шаблон для вывода изображения.
 * @class Controls-Templates/ImageItem
 * @implements Controls-Templates/IImageItemProps
 * @public
 * @demo Controls-Templates-demo/ImageItem/Index
 */
