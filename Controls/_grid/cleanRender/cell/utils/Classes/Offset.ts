/*
 * Метод для формирования классов горизонтальных паддингов
 */
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/interface';

export type THorizontalMarginsSize = 'xs' | 'default';

export function getHorizontalOffsetClasses(
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

export function getVerticalPaddingsClasses(
    paddingTop: TGridVPaddingSize,
    paddingBottom: TGridVPaddingSize
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
