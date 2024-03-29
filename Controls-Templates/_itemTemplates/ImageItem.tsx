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

/**
 * Интерфейс для опций контрола {@link Controls-Templates/ImageItem}.
 * @interface Controls-Templates/IImageItemProps
 * @implements Controls-Templates/interface/IMarkerProps
 * @implements Controls-Templates/interface/ICheckboxProps
 * @implements Controls-Templates/interface/IShadowProps
 * @implements Controls-Templates/interface/IBorderProps
 * @implements Controls-Templates/interface/IRoundAnglesProps
 * @implements Controls-Templates/interface/IPaddingProps
 * @implements Controls-Templates/interface/IImageProps
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
     * @cfg {Controls-Templates/interface/TProportion} Пропорция изображения
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

function getImageClassName({
    imageObjectFit = 'cover',
    imageClass = '',
}: IImageItemProps): string {
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

function getImageSrc(imageSrc: string | string[]): string {
    if (imageSrc instanceof Array) {
        const [src] = imageSrc;
        return src;
    }

    return imageSrc;
}

function getImageSrcSet(imageSrc: string | string[]): string | void {
    if (imageSrc instanceof Array) {
        return imageSrc
            .map((img, index) => {
                return `${img} ${index + 1}x`;
            })
            .join(', ');
    }

    return;
}

export function ImageItem(
    props: IImageItemProps
): React.ReactElement<IImageItemProps> {
    // В шаблонах без внутреннего отступа (например, в этом) верхний отступ маркера равен или размеру скругления, или s
    const markerOffset = props.roundAngleTR || DEFAULT_MARKER_OFFSET;
    return (
        <BaseItem
            $wasabyRef={props.$wasabyRef}
            attr-data-qa={props['attr-data-qa']}
            item-key={props['item-key']}
            data-qa={props['data-qa']}
            className={getItemClassName(props)}
            item={props.item}
            style={props.styleProp}
            cursor={props.cursor}
            checkboxValue={props.checkboxValue}
            checkboxVisibility={props.checkboxVisibility}
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
                    <img
                        className={getImageClassName(props)}
                        title={props.title}
                        src={getImageSrc(props.imageSrc)}
                        srcset={getImageSrcSet(props.imageSrc)}
                        alt={props.imageAlt}
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
