/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import type { TColumnSeparatorSize } from 'Controls/gridDisplay';

export interface IColumnSeparatorProps {
    leftSeparatorSize?: TColumnSeparatorSize;
    rightSeparatorSize?: TColumnSeparatorSize;
}

/**
 * Утилита, предоставляющая CSS классы разделителей колонок
 * @private
 */
export function getColumnSeparatorClasses(props: IColumnSeparatorProps): string {
    const { leftSeparatorSize, rightSeparatorSize } = props;

    let className = '';

    if (leftSeparatorSize && leftSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_leftSeparatorSize-${leftSeparatorSize}`;
    }

    if (rightSeparatorSize && rightSeparatorSize !== 'null') {
        className += ` controls-GridReact-cell_rightSeparatorSize-${rightSeparatorSize}`;
    }

    return className;
}
