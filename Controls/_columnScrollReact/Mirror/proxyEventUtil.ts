import type * as React from 'react';

export function proxyEvent(
    eventTargetRoot: HTMLDivElement,
    { nativeEvent }: React.MouseEvent
): void {
    const element = _getElementUnderTarget(eventTargetRoot, nativeEvent);

    const eventConstructor = Object.getPrototypeOf(nativeEvent).constructor;
    const emulatedEvent = new eventConstructor(nativeEvent.type, nativeEvent);

    element.dispatchEvent(emulatedEvent);
}

function _getElementUnderTarget(
    targetRoot: HTMLDivElement,
    { pageX, pageY }: MouseEvent
) {
    const originDisplay = targetRoot.style.display;
    targetRoot.style.display = 'none';
    const element = document.elementFromPoint(pageX, pageY);
    targetRoot.style.display = originDisplay;
    return element;
}
