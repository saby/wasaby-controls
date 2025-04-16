import type { CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import type * as React from 'react';
import type { IFocusChangedConfig } from 'UICore/Focus';

import { TouchDetect } from 'EnvTouch/EnvTouch';
import { useTouches as getTouches } from 'UICommon/Events';

export type TItemEventHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    item: CollectionItem | Model | Model[]
) => void;

export type TItemDeactivatedHandler = (item: CollectionItem, options: IFocusChangedConfig) => void;

export interface IItemEventHandlers {
    onMouseOverCallback?: TItemEventHandler;
    onMouseEnterCallback?: TItemEventHandler;
    onMouseLeaveCallback?: TItemEventHandler;
    onMouseMoveCallback?: TItemEventHandler;
    onMouseDownCallback?: TItemEventHandler;
    onMouseUpCallback?: TItemEventHandler;
    onClickCallback?: TItemEventHandler;
    onDeactivatedCallback?: TItemDeactivatedHandler;
    onContextMenuCallback?: TItemEventHandler;
    onSwipeCallback?: TItemEventHandler;
    onLongTapCallback?: TItemEventHandler;
    onWheelCallback?: TItemEventHandler;
    onItemTouchMoveCallback?: TItemEventHandler;
    onTouchEndCallback?: TItemEventHandler;
    onContextMenu?: TItemEventHandler;
    onClick?: TItemEventHandler;
    onDoubleClick?: TItemEventHandler;
    onMouseDown?: TItemEventHandler;
    onMouseUp?: TItemEventHandler;
    onMouseLeave?: TItemEventHandler;
    onMouseEnter?: TItemEventHandler;
    onMouseMove?: TItemEventHandler;
    onTouchStart?: TItemEventHandler;
    onTouchEnd?: TItemEventHandler;
    onWheel?: TItemEventHandler;
    onKeyDown?: TItemEventHandler;
    onKeyUp?: TItemEventHandler;
}

export function getHandlers<TItem extends CollectionItem | Model = CollectionItem | Model>(
    item: TItem,
    props: IItemEventHandlers
): Partial<React.DOMAttributes<HTMLDivElement>> {
    const isTouch = TouchDetect.getInstance().isTouch();

    // react на тач устройствах по тапу вызывает mouse события.
    // Скипаем эти события, т.к. у нас логика не завязано на такое поведение.
    const handlers = {
        onMouseOver: (event) => {
            if (!isTouch) {
                props.onMouseOverCallback?.(event, item);
            }
        },
        onMouseEnter: (event) => {
            if (!isTouch) {
                props.onMouseEnter?.(event, item);
                props.onMouseEnterCallback?.(event, item);
            }
        },
        onMouseLeave: (event) => {
            if (!isTouch) {
                props.onMouseLeave?.(event, item);
                props.onMouseLeaveCallback?.(event, item);
            }
        },
        onDoubleClick: (event) => {
            props.onDoubleClick?.(event, item);
        },
        onKeyDown: (event) => {
            props.onKeyDown?.(event, item);
        },
        onKeyUp: (event) => {
            props.onKeyUp?.(event, item);
        },

        onTouchStart: null,
        onTouchMove: null,
        onTouchEnd: null,
    };

    [
        'onMouseMove',
        'onMouseDown',
        'onMouseUp',
        'onClick',
        'onContextMenu',
        'onWheel',
        'onMouseOver',
    ].forEach((eventName) => {
        handlers[eventName] = (event) => {
            props[eventName]?.(event, item);
            props[`${eventName}Callback`]?.(event, item);
        };
    });

    // Нельзя вызывать хуки под условием, т.к. при перерисовках кол-во вызовов хуков должно быть одно и тоже.
    // Есть кейсы когда isTouch меняется. Например, компьютеры с тачмониторами и ZinFrame.
    const swipeHandler = (event, direction) => {
        const wasabyEvent = touches.createWasabySwipeEvent(event, direction);
        props.onSwipeCallback?.(wasabyEvent, item);
    };
    const longTapHandler = (event) => {
        const wasabyEvent = touches.createWasabyLongTapEvent(event);
        props.onLongTapCallback?.(wasabyEvent, item);
    };
    const touches = getTouches(swipeHandler, longTapHandler);
    handlers.onTouchStart = (event) => {
        props.onTouchStart?.(event, item);
        return touches.handleTouchStart(event);
    };
    handlers.onTouchMove = (event) => {
        props.onItemTouchMoveCallback?.(event, item);
        return touches.handleTouchMove(event);
    };
    handlers.onTouchEnd = (event) => {
        props.onTouchEnd?.(event, item);
        props.onTouchEndCallback?.(event, item);
        return touches.handleTouchEnd(event);
    };
    return handlers;
}
