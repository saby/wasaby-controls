import type { TCursor } from 'Controls/interface';

// Карта соответствий вида курсора при наличии скролла колонок.
const isScrollableCellCursorMap: Record<TCursor, TCursor> = {
    auto: 'grab',
    grab: 'grab',
    text: 'grab',
    default: 'grab',
    pointer: 'pointer',
};

/*
 * Утилита, позволяющая рассчитать вид курсора в ячейке списка.
 * @param cursor
 * @param isScrollableCell
 * @param defaultValue
 */
export function getCursor(
    cursor?: TCursor,
    isScrollableCell?: boolean,
    defaultCursor: TCursor = 'default',
    isDragScrolling: boolean | undefined = isScrollableCell
): TCursor {
    const _cursor = cursor || defaultCursor;
    if (isScrollableCell && isDragScrolling) {
        return isScrollableCellCursorMap[_cursor];
    }
    return _cursor;
}
