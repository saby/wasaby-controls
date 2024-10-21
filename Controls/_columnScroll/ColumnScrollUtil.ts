/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
// Процент скроллируемой области справа, свайп по которой способен привезти к открытию операций над записью.
// Значение в соответствии со стандартом
const PERCENT_OF_SCROLLABLE_AREA_FOR_SWIPE = 0.15;

export function isInLeftSwipeRange(
    fixedColumnsWidth: number,
    scrollWidth: number,
    clientX: number
): boolean {
    const leftSwipeRange = getLeftSwipeRange(fixedColumnsWidth, scrollWidth);
    return clientX >= leftSwipeRange.startX && clientX <= leftSwipeRange.stopX;
}

function getLeftSwipeRange(
    fixedColumnsWidth: number,
    scrollWidth: number
): { startX: number; stopX: number } {
    const swipeWidth = Math.floor(scrollWidth * PERCENT_OF_SCROLLABLE_AREA_FOR_SWIPE);

    return {
        startX: fixedColumnsWidth + scrollWidth - swipeWidth,
        stopX: fixedColumnsWidth + scrollWidth,
    };
}
