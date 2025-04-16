import type * as React from 'react';
import type { CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import { getItemEventHandlers, TItemDeactivatedHandler } from 'Controls/baseList';
import { ITileViewProps } from 'Controls/_tileRender/interface/ITileView';
import { IItemEventHandlers } from 'Controls/listsCommonLogic';

export interface IGetItemEventHandlerCallbacks {
    itemModel: Model;
    props: Partial<ITileViewProps>;
}

export type TTileItemEventHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    item: CollectionItem | Model | Model[]
) => void;

export interface ITileEventHandlers {
    onMouseOverCallback?: TTileItemEventHandler;
    onMouseEnterCallback?: TTileItemEventHandler;
    onMouseLeaveCallback?: TTileItemEventHandler;
    onMouseMoveCallback?: TTileItemEventHandler;
    onMouseDownCallback?: TTileItemEventHandler;
    onMouseUpCallback?: TTileItemEventHandler;
    onClickCallback?: TTileItemEventHandler;
    onDeactivatedCallback?: TItemDeactivatedHandler;
    onContextMenuCallback?: TTileItemEventHandler;
    onSwipeCallback?: TTileItemEventHandler;
    onLongTapCallback?: TTileItemEventHandler;
    onWheelCallback?: TTileItemEventHandler;
    onItemTouchMoveCallback?: TTileItemEventHandler;
    onContextMenu?: TTileItemEventHandler;
    onClick?: TTileItemEventHandler;
    onDoubleClick?: TTileItemEventHandler;
    onMouseDown?: TTileItemEventHandler;
    onMouseUp?: TTileItemEventHandler;
    onMouseLeave?: TTileItemEventHandler;
    onMouseEnter?: TTileItemEventHandler;
    onMouseMove?: TTileItemEventHandler;
    onTouchStart?: TTileItemEventHandler;
    onTouchEnd?: TTileItemEventHandler;
    onWheel?: TTileItemEventHandler;
}

/**
 * Возвращает базовый набор обработчиков для элемента плитки
 **/
export function getItemEventHandlerCallbacks({ itemModel, props }: IGetItemEventHandlerCallbacks) {
    return Object.entries({
        ...getItemEventHandlers(itemModel, {
            ...props,
            ...props.itemHandlers,
        } as IItemEventHandlers),
    }).reduce(
        (acc, [key, handler]) => ({
            ...acc,
            [`${key}Callback`]: handler,
        }),
        {}
    );
}
