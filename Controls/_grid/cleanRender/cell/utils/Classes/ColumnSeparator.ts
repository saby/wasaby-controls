/*
 * Метод для формирования классов разделителей колонок
 */
import { TColumnSeparatorSize } from 'Controls/baseGrid';

interface IGetColumnSeparatorClasses {
    leftSeparatorSize?: TColumnSeparatorSize;
    rightSeparatorSize?: TColumnSeparatorSize;
}

export function getColumnSeparatorClasses(props: IGetColumnSeparatorClasses): string {
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
