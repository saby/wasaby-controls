import * as React from 'react';
import { SyntheticEvent } from 'UICommon/Events';
import { constants } from 'Env/Env';

export function getNativeMouseEvent(
    event?: SyntheticEvent<MouseEvent> | React.MouseEvent | MouseEvent | TouchEvent | unknown
): MouseEvent | TouchEvent | undefined {
    if (!event) {
        return;
    }

    // Для тестов, т.к. в Node нет событий
    if (!constants.isBrowserPlatform) {
        const nativeEvent = event as Event & {
            nativeEvent?: MouseEvent | TouchEvent;
        };
        return nativeEvent.nativeEvent ?? (event as MouseEvent | TouchEvent | undefined);
    }

    if (
        (typeof window.MouseEvent !== 'undefined' && event instanceof MouseEvent) ||
        (typeof window.TouchEvent !== 'undefined' && event instanceof TouchEvent)
    ) {
        return event;
    }

    if ((event as { touches?: Touch[] }).touches?.length) {
        return event as TouchEvent;
    }

    return getNativeMouseEvent(
        (
            event as {
                nativeEvent?: MouseEvent | TouchEvent;
            }
        ).nativeEvent
    );
}
