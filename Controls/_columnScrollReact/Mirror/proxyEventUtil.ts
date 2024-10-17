/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import type * as React from 'react';

export function proxyEvent<
    TEvent extends React.MouseEvent | React.TouchEvent,
    TResult = TEvent extends React.MouseEvent ? MouseEvent : TouchEvent
>(eventTargetRoot: HTMLDivElement, event: TEvent): TResult {
    const element = getElementUnderTarget(eventTargetRoot, event.nativeEvent);

    const eventConstructor = Object.getPrototypeOf(event.nativeEvent).constructor;
    const emulatedEvent = new eventConstructor(event.nativeEvent.type, event.nativeEvent) as Event;

    element.dispatchEvent(emulatedEvent as unknown as Event);
    return emulatedEvent as unknown as TResult;
}

export function getElementUnderTarget(targetRoot: HTMLDivElement, event: MouseEvent | TouchEvent) {
    const originDisplay = targetRoot.style.display;
    targetRoot.style.display = 'none';
    const cursorPosition = getCursorPosition(event);
    const element = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
    targetRoot.style.display = originDisplay;
    return element;
}

function getCursorPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if ((e as TouchEvent).touches) {
        const touchEvent = e as TouchEvent;
        const touch = touchEvent.touches.length
            ? touchEvent.touches[0]
            : touchEvent.changedTouches[0];
        return {
            x: touch.clientX,
            y: touch.clientY,
        };
    } else {
        const mouseEvent = e as MouseEvent;
        return {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
        };
    }
}
