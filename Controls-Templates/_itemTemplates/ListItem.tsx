import * as React from 'react';
import { BaseItem } from './BaseItem';
import { TextRender } from './common/TextRender';
import 'css!Controls-Templates/itemTemplates';
import {
    ICaptionProps,
    IMarkerProps,
    ICheckboxProps,
    IShadowProps,
    IBorderProps,
    IActionsProps,
    IRoundAnglesProps,
    IPaddingProps,
    ICursorProps,
    IHighlightDecoratorProps,
} from 'Controls/interface';
import type { IItemEventHandlers } from 'Controls/baseList';
import { CollectionItem } from 'Controls/display';

/**
 * Интерфейс опций для настройки посдветки при наведении
 * @interface Controls-Templates/IHoverProps
 * @public
 *
 */
interface IHoverProps {
    /**
     * @cfg
     * Подсветка фона записи при наведении.
     */
    highlightOnHover?: boolean;
}

interface IListItemActionsProps {
    actionsPosition?: 'inside' | 'outside' | 'custom';
}

/**
 * Интерфейс для опций контрола {@link Controls-Templates/IListItem}.
 * @interface Controls-Templates/IListItemProps
 * @implements Controls-Templates/interface/IMarkerProps
 * @implements Controls-Templates/interface/ICheckboxProps
 * @implements Controls-Templates/interface/IShadowProps
 * @implements Controls-Templates/interface/IBorderProps
 * @implements Controls-Templates/interface/IRoundAnglesProps
 * @implements Controls-Templates/interface/IPaddingProps
 * @implements Controls-Templates/interface/ICursorProps
 * @implements Controls-Templates/IHoverProps
 * @public
 */
export interface IListItemProps
    extends IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IActionsProps,
        IRoundAnglesProps,
        IPaddingProps,
        ICursorProps,
        ICaptionProps,
        IHoverProps,
        IListItemActionsProps,
        IItemEventHandlers,
        IHighlightDecoratorProps {
    item: CollectionItem;
    /**
     * @cfg {string} Классы, которые применяются к элементу.
     */
    className?: string;
}

const cssPrefix = 'Controls-Templates-ListItem';

function getItemClassName({ className = '', highlightOnHover = true }: IListItemProps): string {
    let classes = ` ${className} ${cssPrefix}__wrapper`;

    if (highlightOnHover) {
        classes += ` ${cssPrefix}__highlightOnHover`;
    }
    return classes;
}

function getContentClassName({
    paddingTop = 's',
    paddingBottom = 's',
    paddingLeft = 's',
    paddingRight = 's',
}: IListItemProps): string {
    let classes = '';

    classes += ` Controls-Templates-BaseItem__content_padding-top_${paddingTop}`;
    classes += ` Controls-Templates-BaseItem__content_padding-bottom_${paddingBottom}`;
    classes += ` Controls-Templates-BaseItem__content_padding-left_${paddingLeft}`;
    classes += ` Controls-Templates-BaseItem__content_padding-right_${paddingRight}`;

    return classes;
}

export function ListItem(props: IListItemProps): React.ReactElement<IListItemProps> {
    return (
        <BaseItem
            className={getItemClassName(props)}
            item={props.item}
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
            <TextRender
                className={getContentClassName(props)}
                value={props.caption}
                lines={props.captionLines}
                hAlign={props.captionHAlign}
                fontSize={props.captionFontSize}
                fontColorStyle={props.captionFontColorStyle}
                fontWeight={props.captionFontWeight}
                highlightDecoratorClassName={props.highlightDecoratorClassName}
                searchValue={props.searchValue}
            />
        </BaseItem>
    );
}

export default React.memo(ListItem);

/**
 * Шаблон для вывода записи списка.
 * @class Controls-Templates/ListItem
 * @implements Controls-Templates/IListItemProps
 * @public
 * @demo Controls-Templates-demo/ListItem/Index
 */
