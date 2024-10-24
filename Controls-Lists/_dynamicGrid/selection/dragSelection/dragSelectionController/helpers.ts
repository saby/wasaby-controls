/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TPoint, TRect } from './types';
import { TResizerDirection } from '../shared/types';
import { START_FIXED_PART_OBSERVER, END_FIXED_PART_OBSERVER } from '../../../shared/constants';
import { TKeyPair } from './../../shared/types';
import * as React from 'react';

const PERCENT_OF_SIZE_TO_SELECT_CELL = 0.1;

export function getDragStartParams(
    container: HTMLElement,
    startRect: TRect,
    direction: TResizerDirection
): {
    startPoint: TPoint;
    xOffset: number;
    yOffset: number;
    xMinOffset: number;
    yMinOffset: number;
} {
    const viewPortRect = getViewportBoundingClientRect(container);
    let xOffset: number;
    let yOffset: number;
    let xMinOffset: number;
    let yMinOffset: number;

    const startPoint: TPoint = {
        x: undefined,
        y: undefined,
    };

    const getXInViewportRange = (x: number) =>
        Math.min(Math.max(x, viewPortRect.x), viewPortRect.x + viewPortRect.width);
    const getYInViewportRange = (y: number) =>
        Math.min(Math.max(y, viewPortRect.y), viewPortRect.y + viewPortRect.height);

    const getXOffsetInViewportRange = (startX: number, offset: number) => {
        // Итоговая координата может быть уменьшена, если выделение вылезает за вьюпорт.
        const correctStartX = getXInViewportRange(startX + offset);
        // Реальный отступ, будет такой же или меньше.
        return offset > 0 ? correctStartX - startX : -1 * (startX - correctStartX);
    };

    const getYOffsetInViewportRange = (startY: number, offset: number) => {
        // Итоговая координата может быть уменьшена, если выделение вылезает за вьюпорт.
        const correctStartY = getYInViewportRange(startY + offset);
        // Реальный отступ, будет такой же или меньше.
        return offset > 0 ? correctStartY - startY : -1 * (startY - correctStartY);
    };

    // Координата Y
    // Начальная точка это либо левый верхний угол, либо правый нижний, но не больше чем размеры контейнера.
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'topRight':
            // Правый нижний, центр вокруг которого будет выделение.
            startPoint.y = getYInViewportRange(startRect.y + startRect.height);
            // Из левого верхнего вычитаем центр, чтобы узнать отступ(должен быть отрицательным).
            yOffset = getYOffsetInViewportRange(startPoint.y, startRect.y - startPoint.y);
            break;
        case 'none':
        case 'bottom':
        case 'right':
        case 'bottomLeft':
        case 'bottomRight':
            // Левый верхний угол, центр вокруг которого будет выделение.
            startPoint.y = getYInViewportRange(startRect.y);
            // Из правого нижнего вычитаем центр, чтобы узнать отступ(должен быть положительным).
            yOffset = getYOffsetInViewportRange(
                startPoint.y,
                startRect.y + startRect.height - startPoint.y
            );
            break;
    }

    // Координата X
    // Начальная точка это либо левый верхний угол, либо правый нижний, но не больше чем размеры контейнера.
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            // Правый нижний, центр вокруг которого будет выделение.
            startPoint.x = getXInViewportRange(startRect.x + startRect.width);
            // Из левого верхнего вычитаем центр, чтобы узнать отступ(должен быть отрицательным).
            xOffset = getXOffsetInViewportRange(startPoint.x, startRect.x - startPoint.x);
            break;
        case 'none':
        case 'bottom':
        case 'right':
        case 'topRight':
        case 'bottomRight':
            // Левый верхний угол, центр вокруг которого будет выделение.
            startPoint.x = getXInViewportRange(startRect.x);
            // Из правого нижнего вычитаем центр, чтобы узнать отступ(должен быть положительным).
            xOffset = getXOffsetInViewportRange(
                startPoint.x,
                startRect.x + startRect.width - startPoint.x
            );
            break;
    }

    // Минимальное смещение по Y
    switch (direction) {
        case 'top':
        case 'topLeft':
        case 'topRight':
            yMinOffset = -1 * startRect.height;
            break;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
            yMinOffset = startRect.height;
            break;
        case 'none':
        case 'left':
        case 'right':
            yMinOffset = yOffset;
            break;
    }

    // Минимальное смещение по X
    switch (direction) {
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            xMinOffset = -1 * startRect.width;
            break;
        case 'right':
        case 'topRight':
        case 'bottomRight':
            xMinOffset = startRect.width;
            break;
        case 'none':
        case 'top':
        case 'bottom':
            xMinOffset = xOffset;
            break;
    }

    return {
        startPoint,
        xOffset,
        yOffset,
        xMinOffset,
        yMinOffset,
    };
}

export function getNewDirection(targetRect: TRect, startRect: TRect): TResizerDirection {
    // Иллюстрация работы функции https://online.sbis.ru/shared/disk/ac51f39e-945c-4ad6-84de-3781504a02a1
    const centerPoint: TPoint = {
        x: startRect.x + startRect.width,
        y: startRect.y + startRect.height,
    };
    if (targetRect.y >= centerPoint.y - startRect.height && targetRect.y < centerPoint.y) {
        if (centerPoint.x <= targetRect.x) {
            return 'right';
        } else if (targetRect.x < centerPoint.x - startRect.width) {
            return 'left';
        } else {
            return 'none';
        }
    }
    if (targetRect.x >= centerPoint.x - startRect.width && targetRect.x < centerPoint.x) {
        if (targetRect.y < centerPoint.y - startRect.height) {
            return 'top';
        } else if (targetRect.y >= centerPoint.y) {
            return 'bottom';
        } else {
            return 'none';
        }
    }
    if (targetRect.x >= centerPoint.x) {
        if (targetRect.y >= centerPoint.y) {
            return 'bottomRight';
        } else if (targetRect.y < centerPoint.y - startRect.height) {
            return 'topRight';
        }
    }
    if (targetRect.x < centerPoint.x - startRect.width) {
        if (targetRect.y < centerPoint.y - startRect.height) {
            return 'topLeft';
        } else if (targetRect.y >= centerPoint.y) {
            return 'bottomLeft';
        }
    }
    return 'none';
}

export function getNewOffset(
    direction: TResizerDirection,
    cellRect: TRect,
    startPoint: TPoint,
    yMinOffset: number,
    xMinOffset: number
): {
    x: number;
    y: number;
} {
    let newOffsetX: number;
    let newOffsetY: number;

    // Координата Y
    switch (direction) {
        case 'top':
        case 'topLeft':
        case 'topRight':
            newOffsetY = cellRect.y - startPoint.y;
            newOffsetY = newOffsetY > 0 ? yMinOffset : newOffsetY;
            break;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
            newOffsetY = cellRect.y + cellRect.height - startPoint.y;
            newOffsetY = newOffsetY < 0 ? yMinOffset : newOffsetY;
            break;
        case 'none':
        case 'left':
        case 'right':
            newOffsetY = yMinOffset;
            break;
    }

    // Координата X
    switch (direction) {
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            newOffsetX = cellRect.x - startPoint.x;
            newOffsetX = newOffsetX > 0 ? xMinOffset : newOffsetX;
            break;
        case 'right':
        case 'topRight':
        case 'bottomRight':
            newOffsetX = cellRect.x + cellRect.width - startPoint.x;
            newOffsetX = newOffsetX < 0 ? xMinOffset : newOffsetX;
            break;
        case 'none':
        case 'top':
        case 'bottom':
            newOffsetX = xMinOffset;
            break;
    }

    return {
        x: newOffsetX,
        y: newOffsetY,
    };
}

export function getEndPoint(
    startPoint: TPoint,
    direction: TResizerDirection,
    offsetX: number,
    offsetY: number
): TPoint {
    let x: number;
    let y: number;

    // Координата Y
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'topRight':
            y = startPoint.y + offsetY + 3;
            break;
        case 'none':
        case 'bottom':
        case 'right':
        case 'bottomLeft':
        case 'bottomRight':
            y = startPoint.y + offsetY - 3;
            break;
    }

    // Координата X
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            x = startPoint.x + offsetX + 3;
            break;
        case 'none':
        case 'bottom':
        case 'right':
        case 'topRight':
        case 'bottomRight':
            x = startPoint.x + offsetX - 3;
            break;
    }

    return {
        x,
        y,
    };
}

type TKeyPairs = {
    topLeft: TKeyPair;
    bottomRight: TKeyPair;
};

export function getDragEndParams(
    startKeyPairs: TKeyPairs,
    endKeyPair: TKeyPair,
    direction: TResizerDirection
): TKeyPairs {
    const result: TKeyPairs = {
        topLeft: {
            itemKey: undefined,
            columnKey: undefined,
        },
        bottomRight: {
            itemKey: undefined,
            columnKey: undefined,
        },
    };
    switch (direction) {
        case 'top': {
            result.topLeft.itemKey = endKeyPair.itemKey;
            result.topLeft.columnKey = startKeyPairs.topLeft.columnKey;
            result.bottomRight.itemKey = startKeyPairs.bottomRight.itemKey;
            result.bottomRight.columnKey = startKeyPairs.bottomRight.columnKey;
            break;
        }
        case 'topLeft': {
            result.topLeft = endKeyPair;
            result.bottomRight = startKeyPairs.bottomRight;
            break;
        }
        case 'topRight': {
            result.topLeft.itemKey = endKeyPair.itemKey;
            result.topLeft.columnKey = startKeyPairs.topLeft.columnKey;
            result.bottomRight.itemKey = startKeyPairs.bottomRight.itemKey;
            result.bottomRight.columnKey = endKeyPair.columnKey;
            break;
        }
        case 'bottom': {
            result.topLeft.itemKey = startKeyPairs.topLeft.itemKey;
            result.topLeft.columnKey = startKeyPairs.topLeft.columnKey;
            result.bottomRight.itemKey = endKeyPair.itemKey;
            result.bottomRight.columnKey = startKeyPairs.bottomRight.columnKey;
            break;
        }
        case 'bottomLeft': {
            result.topLeft.itemKey = startKeyPairs.topLeft.itemKey;
            result.topLeft.columnKey = endKeyPair.columnKey;
            result.bottomRight.itemKey = endKeyPair.itemKey;
            result.bottomRight.columnKey = startKeyPairs.bottomRight.columnKey;
            break;
        }
        case 'bottomRight': {
            result.topLeft = startKeyPairs.topLeft;
            result.bottomRight = endKeyPair;
            break;
        }
        case 'left': {
            result.topLeft = endKeyPair;
            result.bottomRight = startKeyPairs.bottomRight;
            break;
        }
        case 'right': {
            result.topLeft = startKeyPairs.topLeft;
            result.bottomRight = endKeyPair;
            break;
        }
        case 'none': {
            result.topLeft = startKeyPairs.topLeft;
            result.bottomRight = startKeyPairs.bottomRight;
        }
    }

    return result;
}

export function getRectParams(startPoint: TPoint, offsetX: number, offsetY: number) {
    const transform = (startPosition: number, offset: number) => {
        if (offset < 0) {
            return {
                size: offset * -1,
                position: startPosition + offset,
            };
        }
        return {
            size: offset,
            position: startPosition,
        };
    };

    const xParams = transform(startPoint.x, offsetX);
    const yParams = transform(startPoint.y, offsetY);

    return {
        x: xParams.position,
        y: yParams.position,
        width: xParams.size,
        height: yParams.size,
    };
}

function getViewportBoundingClientRect(element: HTMLElement): TRect {
    // TODO: Сделать меньше хардкода, но это самый производительный вариант.
    //  Т.к. dynamicGrid крайне специфичный, то пока оставляю так.
    element.classList.remove('tw-contents');
    const containerRect = element.getBoundingClientRect();
    element.classList.add('tw-contents');

    // TODO: Заменить https://online.sbis.ru/opendoc.html?guid=496aa470-a438-4638-b9dd-bf7a4e68d5c2&client=3
    const startFixedPart = element.querySelector(`[data-key="${START_FIXED_PART_OBSERVER}"]`);
    const endFixedPart = element.querySelector(`[data-key="${END_FIXED_PART_OBSERVER}"]`);

    if (startFixedPart) {
        // Можно верить только размерам фиксированных частей.
        // Их координаты будут неверными, т.к. на них висит transform.
        const startFixedRectWidth = startFixedPart.getBoundingClientRect().width;
        containerRect.x += startFixedRectWidth;
        containerRect.width -= startFixedRectWidth;
    }

    if (endFixedPart) {
        // Можно верить только размерам фиксированных частей.
        // Их координаты будут неверными, т.к. на них висит transform.
        containerRect.width -= endFixedPart.getBoundingClientRect().width;
    }

    return containerRect;
}

/**
 * Проверяем, что ячейку можно выделить драгом.
 * Ячейка должна быть полностью видимой.
 * @param e React.MouseEvent.
 */
export function canSelectCellByDrag(e: React.MouseEvent): boolean {
    const cellRect = (e.target as HTMLDivElement).getBoundingClientRect();
    const xSizeToRich = PERCENT_OF_SIZE_TO_SELECT_CELL * cellRect.width;
    const ySizeToRich = PERCENT_OF_SIZE_TO_SELECT_CELL * cellRect.height;
    const availableRect = {
        xStart: cellRect.x + xSizeToRich,
        xEnd: cellRect.x + cellRect.width - xSizeToRich,
        yStart: cellRect.y + ySizeToRich,
        yEnd: cellRect.y + cellRect.height - ySizeToRich,
    };

    return (
        e.pageX >= availableRect.xStart &&
        e.pageX <= availableRect.xEnd &&
        e.pageY >= availableRect.yStart &&
        e.pageY <= availableRect.yEnd
    );
}
