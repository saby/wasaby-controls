/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import type { TVerticalItemPadding } from 'Controls/display';

/**
 * Утилита, предоставляющая CSS классы минимальной высоты ячейки
 * @private
 */
export function getMinHeightClasses(
    paddingTop?: TVerticalItemPadding,
    paddingBottom?: TVerticalItemPadding,
    decorationStyle?: string
) {
    const style =
        paddingTop === 'default' && paddingBottom === 'default' ? decorationStyle : 'default';
    const size = paddingTop === 'null' && paddingBottom === 'null' ? 'small' : 'default';
    return ` controls-Grid__row-cell_${size}_style-${style}_min_height`;
}
