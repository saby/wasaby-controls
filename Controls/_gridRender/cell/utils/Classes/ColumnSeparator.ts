/*
 * Метод для формирования классов разделителей колонок
 */
import { TColumnSeparatorSize } from 'Controls/gridDisplay';

export interface IColumnSeparatorProps {
    leftSeparatorSize?: TColumnSeparatorSize;
    rightSeparatorSize?: TColumnSeparatorSize;
}

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
