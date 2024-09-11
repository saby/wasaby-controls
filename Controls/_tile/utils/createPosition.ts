/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
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
