import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/interface';

export type THorizontalMarginsSize = 'xs' | 'default';

/*
 * Метод для формирования классов горизонтальных паддингов
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

interface IGroupPaddingUtils {
    side: 'left' | 'right';
    isFirstCell: boolean;
    isLastCell: boolean;
    paddingLeft: ICellComponentProps['paddingLeft'];
    paddingRight: ICellComponentProps['paddingRight'];
}

// TODO надо свести API c отступами для обычной ячейки и убрать этот лишний код
//  Сейчас группа принимает отдельно leftPaddingClassName, отдельно rightPaddingClassName.
//  Это вроде можно свести с padding.left, padding.right, которые тоже уже туда передаются.
export function getGroupHorizontalPaddingClasses({
    side,
    isFirstCell: isFirstColumn,
    isLastCell: isLastColumn,
    paddingLeft,
    paddingRight,
}: IGroupPaddingUtils): string {
    let classes = '';
    if (side === 'left' && isFirstColumn) {
        classes +=
            paddingLeft === 'null'
                ? ' tw-pl-0'
                : ` controls-Grid__cell_spacingFirstCol_${paddingLeft}`;
    }
    if (side === 'right' && isLastColumn) {
        classes += ` controls-Grid__cell_spacingLastCol_${paddingRight}`;
    }
    return classes;
}
