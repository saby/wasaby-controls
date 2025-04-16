import type { CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import type * as React from 'react';
import type { IFocusChangedConfig } from 'UICore/Focus';

import { TouchDetect } from 'EnvTouch/EnvTouch';
import { useTouches as getTouches } from 'UICommon/Events';

/**
 * Событие мыши в списке
 * @private
 * */
export type TItemMouseEventHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    item: CollectionItem | Model | Model[]
) => void;

/**
 * Событие нажатия клавиши в списке
 * @private
 * */
export type TItemKeyboardEventHandler = (
    event: React.KeyboardEvent,
    item: CollectionItem | Model | Model[]
) => void;

/**
 * Событие касания в списке
 * @private
 * */
export type TItemTouchEventHandler = (
    event: React.TouchEvent<HTMLDivElement>,
    item: CollectionItem | Model | Model[]
) => void;

/**
 * Событие деактивации в списке
 * @private
 * */
export type TItemDeactivatedHandler = (item: CollectionItem, options: IFocusChangedConfig) => void;

/**
 * Список обработчиков событий списка
 * @public
 * */
export interface IItemEventHandlers {
    onMouseOverCallback?: TItemMouseEventHandler;
    onMouseEnterCallback?: TItemMouseEventHandler;
    onMouseLeaveCallback?: TItemMouseEventHandler;
    onMouseMoveCallback?: TItemMouseEventHandler;
    onMouseDownCallback?: TItemMouseEventHandler;
    onMouseUpCallback?: TItemMouseEventHandler;
    onClickCallback?: TItemMouseEventHandler;
    onDeactivatedCallback?: TItemDeactivatedHandler;
    onContextMenuCallback?: TItemMouseEventHandler;
    onSwipeCallback?: TItemMouseEventHandler;
    onLongTapCallback?: TItemMouseEventHandler;
    onWheelCallback?: TItemMouseEventHandler;
    onTouchStartCallback?: TItemTouchEventHandler;
    onTouchMoveCallback?: TItemTouchEventHandler;
    onTouchEndCallback?: TItemTouchEventHandler;
    onItemTouchMoveCallback?: TItemTouchEventHandler;
    onContextMenu?: TItemMouseEventHandler;
    onClick?: TItemMouseEventHandler;
    onDoubleClick?: TItemMouseEventHandler;
    onMouseDown?: TItemMouseEventHandler;
    onMouseUp?: TItemMouseEventHandler;
    onMouseLeave?: TItemMouseEventHandler;
    onMouseEnter?: TItemMouseEventHandler;
    onMouseMove?: TItemMouseEventHandler;
    onMouseOver?: TItemMouseEventHandler;
    onTouchStart?: TItemTouchEventHandler;
    onTouchMove?: TItemTouchEventHandler;
    onTouchEnd?: TItemTouchEventHandler;
    onWheel?: TItemMouseEventHandler;
    onKeyDown?: TItemKeyboardEventHandler;
    onKeyUp?: TItemKeyboardEventHandler;
}

export function getHandlers<TItem extends CollectionItem | Model = CollectionItem | Model>(
    item: TItem,
    props: IItemEventHandlers
): Partial<React.DOMAttributes<HTMLDivElement>> {
    const isTouch = TouchDetect.getInstance().isTouch();

    // react на тач устройствах по тапу вызывает mouse события.
    // Скипаем эти события, т.к. у нас логика не завязано на такое поведение.
    const handlers: Partial<React.DOMAttributes<HTMLDivElement>> = {
        onMouseOver: (event: React.MouseEvent<HTMLDivElement>) => {
            if (!isTouch) {
                props.onMouseOverCallback?.(event, item);
            }
        },
        onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => {
            if (!isTouch) {
                props.onMouseEnter?.(event, item);
                props.onMouseEnterCallback?.(event, item);
            }
        },
        onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => {
            if (!isTouch) {
                props.onMouseLeave?.(event, item);
                props.onMouseLeaveCallback?.(event, item);
            }
        },
        onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => {
            props.onDoubleClick?.(event, item);
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
            props.onKeyDown?.(event, item);
        },
        onKeyUp: (event: React.KeyboardEvent<HTMLDivElement>) => {
            props.onKeyUp?.(event, item);
        },
    };

    const events = [
        'onMouseMove',
        'onMouseDown',
        'onMouseUp',
        'onClick',
        'onContextMenu',
        'onWheel',
        'onMouseOver',
    ] as const;

    events.forEach((eventName: keyof Pick<IItemEventHandlers, (typeof events)[number]>) => {
        handlers[eventName] = (event: React.MouseEvent<HTMLDivElement>) => {
            props[eventName]?.(event, item);
            props[`${eventName}Callback`]?.(event, item);
        };
    });

    // Нельзя вызывать хуки под условием, т.к. при перерисовках кол-во вызовов хуков должно быть одно и тоже.
    // Есть кейсы когда isTouch меняется. Например, компьютеры с тачмониторами и ZinFrame.
    const swipeHandler = (event: React.SyntheticEvent, direction: string) => {
        const wasabyEvent = touches.createWasabySwipeEvent(event, direction);
        props.onSwipeCallback?.(
            wasabyEvent as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>,
            item
        );
    };
    const longTapHandler = (event: React.SyntheticEvent) => {
        const wasabyEvent = touches.createWasabyLongTapEvent(event);
        props.onLongTapCallback?.(
            wasabyEvent as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>,
            item
        );
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
        // Если не стопать событие onTouchEnd, то оно долетает до уровня Application
        // и открытое контекстное меню будет закрываться сразу после открытия по closeOnOutsideClick
        event.stopPropagation();
        return touches.handleTouchEnd();
    };
    return handlers;
}
