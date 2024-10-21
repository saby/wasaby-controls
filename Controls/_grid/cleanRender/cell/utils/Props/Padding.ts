import { IHorizontalCellPadding } from 'Controls/_grid/dirtyRender/cell/interface';
import { calcRowPadding, GridCell, ICellPadding } from 'Controls/gridDisplay';
import { TGridHPaddingSize } from 'Controls/interface';
import { IRowProps, IVerticalRowPadding } from 'Controls/_grid/gridReact/row/interface';
import type { GridDataRow } from 'Controls/gridDisplay';

/*  Заметка на будущее - когда будем рефакторить ячейку с данными и переводить её на данные утилиты.
    Как правильно считать отступы для ячейки.
    Есть следующие варианты их установки (чем ниже позиция/больше номер - тем выше приоритет):
    1.  gridProps.itemPadding (отступы строк, используются ТОЛЬКО для первой и последней ячейки);
    2.  gridProps.itemTemplateOptions.itemPadding (отступы строк, используются ТОЛЬКО для первой и последней ячейки);
    3.  gridProps.itemTemplate.itemPadding (отступы конкретной строки, используются ТОЛЬКО для первой и последней ячейки этой строки);
    4*. gridProps.rowProps.itemPadding (аналог #1 для react-стиля описания);
    5.  gridProps.getRowProps (отступы конкретной строки, используются ТОЛЬКО для первой и последней ячейки этой строки);

    6.  column.cellPadding (отступы конкретной колонки для всех ячеек);
    7.  column.templateOptions.cellPadding (отступы конкретной колонки для всех ячеек);
    8.  column.template.cellPadding (отступы конкретной ячейки);
    9*. column.cellProps.padding (аналог #5 для react-стиля описания);
    10. column.getCellProps.padding (отступы конкретной ячейки);
    11. default - значение

    p.s. * - данный способ ещё не реализован

    Заметки:
    cell._cellProps.padding - результат вызова getCellProps
    rowLeftPadding, rowRightPadding - отступы от строки (пункты с 1 по 5)

    Заметки #2:
    Правки в интерфейсе IGetPaddingPropsParams:
    columnsConfig - заменяем на массив из columnsProps всей строки
    getCellsPropsParams - убираем полностью, т.к. это дублирует вызов каллбека на уровне коллекции.
    Наиболее удачным решением является мемоизация результата вызова каллбека с правильными зависимостями в шаблоне рендера ячейки.
*/

export interface IPartialColumnsConfigForGetPadding {
    cellPadding?: ICellPadding;
    getCellProps?: Function;
}

interface IGetPaddingPropsParams {
    cell: GridCell;
    columnsConfig: IPartialColumnsConfigForGetPadding[];
    getCellsPropsParams?: Function;
    rowLeftPadding: TGridHPaddingSize;
    rowRightPadding: TGridHPaddingSize;
    hasMultiSelectColumn: boolean;
}

const DEFAULT_PADDING_EDGE_CELLS: TGridHPaddingSize = 'list_default';
const DEFAULT_PADDING_MIDDLE_CELLS: TGridHPaddingSize = 'grid_default';

function getCellPaddingGivenColspan(props: IGetPaddingPropsParams): ICellPadding {
    const { cell, getCellsPropsParams, columnsConfig, hasMultiSelectColumn } = props;

    const colspan = cell.getColspanParams();
    const multiselectCorrection = +(!cell.CheckBoxCell && hasMultiSelectColumn);
    const columnIndex = cell.columnIndex - multiselectCorrection;
    const startColumnIndex =
        typeof colspan?.startColumn !== 'undefined'
            ? colspan.startColumn - 1 - multiselectCorrection
            : Math.min(columnIndex, columnsConfig.length - 1);

    const endColumnIndex =
        typeof colspan?.endColumn !== 'undefined'
            ? colspan.endColumn - 2 - multiselectCorrection
            : Math.min(columnIndex, columnsConfig.length - 1);

    const paddingFromCellProps: ICellPadding = {};

    // todo Нужно убирать columnsConfig и вызов getCellsPropsParams и просто взять результат его вызова
    //  с нужной колонки, которая находится в props.cell
    if (getCellsPropsParams && columnsConfig[startColumnIndex]?.getCellProps) {
        paddingFromCellProps.left = columnsConfig[startColumnIndex].getCellProps(
            getCellsPropsParams()
        ).padding?.left;
    }

    if (getCellsPropsParams && columnsConfig[startColumnIndex]?.getCellProps) {
        paddingFromCellProps.right = columnsConfig[startColumnIndex].getCellProps(
            getCellsPropsParams()
        ).padding?.right;
    }

    if (startColumnIndex !== -1 && columnsConfig[startColumnIndex] && !paddingFromCellProps.left) {
        paddingFromCellProps.left = columnsConfig[startColumnIndex].cellPadding?.left;
    }

    if (endColumnIndex !== -1 && columnsConfig[endColumnIndex] && !paddingFromCellProps.right) {
        paddingFromCellProps.right = columnsConfig[endColumnIndex].cellPadding?.right;
    }

    return paddingFromCellProps;
}

interface IGetHorizontalLeftPaddingParams {
    cellLeftPadding: TGridHPaddingSize;
    rowLeftPadding: TGridHPaddingSize;
    isFirstColumn: boolean;
    isFirstColumnAfterCheckbox: boolean;
}

function getHorizontalLeftPadding(props: IGetHorizontalLeftPaddingParams): TGridHPaddingSize {
    const { cellLeftPadding, rowLeftPadding, isFirstColumn, isFirstColumnAfterCheckbox } = props;

    if (isFirstColumnAfterCheckbox) {
        return 'grid_null';
    }

    if (cellLeftPadding) {
        return `grid_${cellLeftPadding}` as TGridHPaddingSize;
    }

    if (isFirstColumn) {
        if (rowLeftPadding) {
            return rowLeftPadding;
        }

        return DEFAULT_PADDING_EDGE_CELLS;
    }

    return DEFAULT_PADDING_MIDDLE_CELLS;
}

interface IGetHorizontalRightPaddingParams {
    cellRightPadding: TGridHPaddingSize;
    rowRightPadding: TGridHPaddingSize;
    isLastColumn: boolean;
}

function getHorizontalRightPadding(props: IGetHorizontalRightPaddingParams): TGridHPaddingSize {
    const { cellRightPadding, rowRightPadding, isLastColumn } = props;

    if (cellRightPadding) {
        return `grid_${cellRightPadding}` as TGridHPaddingSize;
    }

    if (isLastColumn) {
        if (rowRightPadding) {
            return rowRightPadding;
        }

        return DEFAULT_PADDING_EDGE_CELLS;
    }

    return DEFAULT_PADDING_MIDDLE_CELLS;
}

export function getHorizontalPaddingProp(props: IGetPaddingPropsParams): IHorizontalCellPadding {
    const { cell, hasMultiSelectColumn, rowLeftPadding, rowRightPadding } = props;

    const { left: cellLeftPadding, right: cellRightPadding } = getCellPaddingGivenColspan(props);

    if (cell.CheckBoxCell) {
        return {
            left: 'grid_null',
            right: 'grid_null',
        };
    }

    const isFirstColumnAfterCheckbox =
        cell.getColumnIndex(false, false) === 1 && hasMultiSelectColumn;

    return {
        left: getHorizontalLeftPadding({
            cellLeftPadding: cellLeftPadding as TGridHPaddingSize,
            rowLeftPadding: rowLeftPadding as TGridHPaddingSize,
            isFirstColumn: cell.isFirstColumn(),
            isFirstColumnAfterCheckbox,
        }),
        right: getHorizontalRightPadding({
            cellRightPadding: cellRightPadding as TGridHPaddingSize,
            rowRightPadding: rowRightPadding as TGridHPaddingSize,
            isLastColumn: cell.isLastColumn(),
        }),
    };
}

// Утилита возвращает все отступы - вертикальные и горизонтальные в одном объекте,
export function getDefaultPaddingsObject(
    rowProps: IRowProps,
    item: GridDataRow
): IVerticalRowPadding & IHorizontalCellPadding {
    const rowPadding = calcRowPadding(rowProps, item);
    return {
        top: rowPadding.paddingTop,
        bottom: rowPadding.paddingBottom,
        left: rowPadding.paddingLeft,
        right: rowPadding.paddingRight,
    };
}
