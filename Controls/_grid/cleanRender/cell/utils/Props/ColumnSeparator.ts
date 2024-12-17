import { TColumnSeparatorSize } from 'Controls/_grid/dirtyRender/cell/interface';
import { GridCell } from 'Controls/baseGrid';

interface IColumnSeparators {
    leftSeparatorSize: TColumnSeparatorSize;
    rightSeparatorSize: TColumnSeparatorSize;
}

interface IGetColumnSeparatorsProps {
    cell: GridCell;
}

export function getColumnSeparators(props: IGetColumnSeparatorsProps): IColumnSeparators {
    const { cell } = props;

    // Используем именно правый бордер для вывода разделителя.
    // Это связано с тем, что в случае использования горизонтального скролла разделитель, отделяющий фиксированную
    // часть от скроллируемой не должен проскраливаться вместе со скроллируемой ячейкой.
    // (p.s. если использовать левый разделитель - то это будет разделитель левой, скроллируемой ячейки)
    const columnSeparators: IColumnSeparators = {
        leftSeparatorSize: 'null',
        rightSeparatorSize: cell.isLastColumn() ? 'null' : cell.getRightSeparatorSize(),
    };

    return columnSeparators;
}
