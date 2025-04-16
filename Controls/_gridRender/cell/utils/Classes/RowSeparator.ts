/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TRowSeparatorSize } from 'Controls/display';
import { TRowSeparatorStyle } from 'Controls/_gridRender/cell/interface/ICell';

interface IGetRowSeparatorClasses {
    topSeparatorSize?: TRowSeparatorSize;
    topSeparatorStyle?: TRowSeparatorStyle;
    bottomSeparatorSize?: TRowSeparatorSize;
    bottomSeparatorStyle?: TRowSeparatorStyle;
}

/**
 * Утилита, предоставляющая CSS классы разделителей строк
 * @private
 */
export function getRowSeparatorClasses(props: IGetRowSeparatorClasses): string {
    const { topSeparatorSize, bottomSeparatorSize, topSeparatorStyle, bottomSeparatorStyle } =
        props;

    let className = '';

    if (topSeparatorSize && topSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_topSeparatorSize-${topSeparatorSize}`;
        if (topSeparatorStyle) {
            className += ` controls-GridReact-cell_topSeparatorSize_style-${topSeparatorStyle}`;
        }
    }

    if (bottomSeparatorSize && bottomSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_bottomSeparatorSize-${bottomSeparatorSize}`;
        if (bottomSeparatorStyle) {
            className += ` controls-GridReact-cell_bottomSeparatorSize_style-${bottomSeparatorStyle}`;
        }
    }

    return className;
}
