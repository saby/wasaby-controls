/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { IDialogPopupOptions } from 'Controls/popup';

const DIRECTION_TO_POSITION_MAP = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

export enum HORIZONTAL_DIRECTION {
    LEFT = 'left',
    RIGHT = 'right',
}

export enum VERTICAL_DIRECTION {
    TOP = 'top',
    BOTTOM = 'bottom',
}

/**
 * Получение набора свойст в которых хранятся названия свойств отвечающих за позиционирование попапа.
 * @param {IResizeDirection} direction
 * @return {IResizeDirection}
 */
export function getPositionProperties(
    direction: IDialogPopupOptions['resizeDirection'] = {
        horizontal: HORIZONTAL_DIRECTION.RIGHT,
        vertical: VERTICAL_DIRECTION.BOTTOM,
    }
): IDialogPopupOptions['resizeDirection'] {
    return {
        horizontal: DIRECTION_TO_POSITION_MAP[direction.horizontal] || HORIZONTAL_DIRECTION.LEFT,
        vertical: DIRECTION_TO_POSITION_MAP[direction.vertical] || VERTICAL_DIRECTION.TOP,
    };
}

export function getInvertedHorizontalPositionProperty(property: string): string {
    return DIRECTION_TO_POSITION_MAP[property];
}
