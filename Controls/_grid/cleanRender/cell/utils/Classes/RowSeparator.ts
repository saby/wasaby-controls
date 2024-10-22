import { TRowSeparatorSize } from 'Controls/display';
import { TRowSeparatorStyle } from 'Controls/_grid/dirtyRender/cell/interface';

interface IGetRowSeparatorClasses {
    topSeparatorSize?: TRowSeparatorSize;
    topSeparatorStyle?: TRowSeparatorStyle;
    bottomSeparatorSize?: TRowSeparatorSize;
    bottomSeparatorStyle?: TRowSeparatorStyle;
}

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
