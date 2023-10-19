import { TPoint } from './types';
import { TResizerDirection } from '../shared/types';

export function getDragStartParams(
    startRect: DOMRect,
    endRect: DOMRect,
    direction: TResizerDirection
) {
    let xOffset: number;
    let yOffset: number;
    let xMinOffset: number;
    let yMinOffset: number;

    const startPoint: TPoint = {
        x: undefined,
        y: undefined,
    };

    // Начальная точка это либо левый верхний угол, либо правый нижний.
    // Координата Y
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'topRight':
            startPoint.y = endRect.y + endRect.height;
            yOffset = startRect.y - startPoint.y;
            break;
        case 'bottom':
        case 'right':
        case 'bottomLeft':
        case 'bottomRight':
            startPoint.y = startRect.y;
            yOffset = endRect.y + endRect.height - startRect.y;
            break;
    }

    // Координата X
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            startPoint.x = endRect.x + endRect.width;
            xOffset = startRect.x - startPoint.x;
            break;
        case 'bottom':
        case 'right':
        case 'topRight':
        case 'bottomRight':
            startPoint.x = startRect.x;
            xOffset = endRect.x + endRect.width - startRect.x;
            break;
    }

    // Минимальное смещение по Y
    switch (direction) {
        case 'top':
        case 'topLeft':
        case 'topRight':
            yMinOffset = -1 * endRect.height;
            break;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
            yMinOffset = startRect.height;
            break;
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
            xMinOffset = -1 * endRect.width;
            break;
        case 'right':
        case 'topRight':
        case 'bottomRight':
            xMinOffset = startRect.width;
            break;
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

export function getNewOffset(
    cellRect: DOMRect,
    startPoint: TPoint,
    direction: TResizerDirection,
    minXOffset: number,
    minYOffset: number
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
            newOffsetY = newOffsetY > 0 ? minYOffset : newOffsetY;
            break;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
            newOffsetY = cellRect.y + cellRect.height - startPoint.y;
            newOffsetY = newOffsetY < 0 ? minYOffset : newOffsetY;
            break;
        case 'left':
        case 'right':
            newOffsetY = minYOffset;
            break;
    }

    // Координата X
    switch (direction) {
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            newOffsetX = cellRect.x - startPoint.x;
            newOffsetX = newOffsetX > 0 ? minXOffset : newOffsetX;
            break;
        case 'right':
        case 'topRight':
        case 'bottomRight':
            newOffsetX = cellRect.x + cellRect.width - startPoint.x;
            newOffsetX = newOffsetX < 0 ? minXOffset : newOffsetX;
            break;
        case 'top':
        case 'bottom':
            newOffsetX = minXOffset;
            break;
    }

    return {
        x: newOffsetX,
        y: newOffsetY,
    };
}

export function getSelectionPoints(
    startPoint: TPoint,
    direction: TResizerDirection,
    offsetX: number,
    offsetY: number
): {
    start: TPoint;
    end: TPoint;
} {
    let x1: number;
    let y1: number;

    let x2: number;
    let y2: number;

    // Координата Y
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'topRight':
            y1 = startPoint.y - 2;
            y2 = startPoint.y - -1 * offsetY + 2;
            break;
        case 'bottom':
        case 'right':
        case 'bottomLeft':
        case 'bottomRight':
            y1 = startPoint.y + 2;
            y2 = startPoint.y + offsetY - 2;
            break;
    }

    // Координата X
    switch (direction) {
        case 'top':
        case 'left':
        case 'topLeft':
        case 'bottomLeft':
            x1 = startPoint.x - 2;
            x2 = startPoint.x - -1 * offsetX + 2;
            break;
        case 'bottom':
        case 'right':
        case 'topRight':
        case 'bottomRight':
            x1 = startPoint.x + 2;
            x2 = startPoint.x + offsetX - 2;
            break;
    }

    return {
        start: {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
        },
        end: {
            x: Math.max(x1, x2),
            y: Math.max(y1, y2),
        },
    };
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
