import type { TVerticalItemPadding } from 'Controls/display';

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
