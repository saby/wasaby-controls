/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */

/*
 * Содержит базовые методы для подсчета позиции элемента в document
 */

/**
 * Интерфейс позиции элемента в document
 * @private
 */
interface ITileItemPosition {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * Считает и возвращает позицию элемента в document
 * @param left
 * @param top
 * @param right
 * @param bottom
 */
export function createPositionInBounds(
    left: number,
    top: number,
    right: number,
    bottom: number
): ITileItemPosition {
    const result: ITileItemPosition = { left, top, right, bottom };
    if (left < 0) {
        result.right += left;
        result.left = 0;
    } else if (right < 0) {
        result.left += right;
        result.right = 0;
    }
    if (top < 0) {
        result.bottom += top;
        result.top = 0;
    } else if (bottom < 0) {
        result.top += bottom;
        result.bottom = 0;
    }

    if (result.left < 0 || result.right < 0 || result.top < 0 || result.bottom < 0) {
        return null;
    } else {
        return result;
    }
}
