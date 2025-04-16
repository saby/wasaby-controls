/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
export enum MouseButtons {
    Left,
    Wheel,
    Right,
}

export function isMouseEvent(event: Event): boolean {
    return event instanceof MouseEvent;
}

export const MouseUp = {
    isButton(event: MouseEvent, button: MouseButtons): boolean {
        if ('buttons' in event) {
            return button === event.button;
        }
        return button === event.which - 1;
    },
};
