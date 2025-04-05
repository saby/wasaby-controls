/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/interface';

export type THorizontalMarginsSize = 'xs' | 'default';

/**
 * Утилита, предоставляющая CSS классы внутренних горизонтальных отступов в ячейке
 * @private
 */
export function getHorizontalPaddingsClasses(
    paddingLeft?: TGridHPaddingSize,
    paddingRight?: TGridHPaddingSize
): string {
    const classes = [];

    if (paddingLeft) {
        classes.push(`controls-padding_left-${paddingLeft.toLowerCase()}`);
    }

    if (paddingRight) {
        classes.push(`controls-padding_right-${paddingRight.toLowerCase()}`);
    }

    return classes.length ? ` ${classes.join(' ')}` : '';
}

/**
 * Утилита, предоставляющая CSS классы внутренних вертикальных отступов в ячейке
 * @private
 */
export function getVerticalPaddingsClasses(
    paddingTop?: TGridVPaddingSize,
    paddingBottom?: TGridVPaddingSize
) {
    const classes = [];
    let top = paddingTop && paddingTop.toLowerCase();
    let bottom = paddingBottom && paddingBottom.toLowerCase();
    if (top === 'default') {
        top = 'grid_default';
    }
    if (bottom === 'default') {
        bottom = 'grid_default';
    }
    if (top && top !== 'null') {
        classes.push(`controls-padding_top-${top}`);
    }

    if (bottom && bottom !== 'null') {
        classes.push(`controls-padding_bottom-${bottom}`);
    }

    return classes.length ? ` ${classes.join(' ')}` : '';
}

/**
 * Утилита, предоставляющая CSS классы внешних горизонтальных отступов в ячейке.
 * Внешние отступы используются для создания пространства вокруг таблицы.
 * @private
 */
export function getHorizontalMarginsClasses(
    marginLeft?: THorizontalMarginsSize,
    marginRight?: THorizontalMarginsSize,
    isFirstColumn?: boolean,
    isLastColumn?: boolean
): string {
    if (!marginLeft && !marginRight) {
        return '';
    }

    let classes = '';

    if (isFirstColumn && marginLeft) {
        classes += ` controls-TreeGridView__itemsContainerPadding_left-${marginLeft}`;
    }

    if (isLastColumn && marginRight) {
        classes += ` controls-TreeGridView__itemsContainerPadding_right-${marginRight}`;
    }

    return classes;
}

