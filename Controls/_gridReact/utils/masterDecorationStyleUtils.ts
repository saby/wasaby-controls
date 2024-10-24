/*
 * Файл содержит методы, для рассчета стилей style=master
 */

import { ICellComponentProps } from 'Controls/_gridReact/cell/interface';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';
import { GridCell } from 'Controls/baseGrid';

/*
 * Стили, специфичные для style=master
 */
export function getCellComponentMasterStyleProps(
    cell: GridCell,
    cellProps: ICellComponentProps
): ICellComponentProps {
    const isMultiSelectCell = cell.isMultiSelectColumn();
    const materStyleProps: ICellComponentProps = { ...cellProps };
    materStyleProps.minHeightClassName = 'controls-Grid__row-cell_default_style-master_min_height';
    // Радиусы в Мастере задаются своими собственными переменными.
    // см. controls-Grid__row-cell__last-master, controls-Grid__row-cell__first-master
    if (cellProps.isFirstCell) {
        materStyleProps.bottomLeftBorderRadius = 'master';
        materStyleProps.topLeftBorderRadius = 'master';
    }
    // Отступ слева для первой ячейки.
    // Добавляется, если ячейка не рендерит чекбокс.
    if (cellProps.isFirstCell && !isMultiSelectCell) {
        materStyleProps.paddingLeft = 'l';
    }
    if (cellProps.isLastCell) {
        materStyleProps.bottomRightBorderRadius = 'master';
        materStyleProps.topRightBorderRadius = 'master';
    }
    return materStyleProps;
}

/*
 * Верхний и нижний отступы в Мастере по умолчанию задаются своими собственными переменными
 * см controls-Grid__row-cell_master_rowSpacingTop_default, controls-Grid__row-cell_master_rowSpacingBottom_default
 */
export function getRowComponentMasterStyleProps(
    rowProps: IRowComponentProps,
    viewProps: IGridViewProps
): IRowComponentProps {
    const masterStyleProps: IRowComponentProps = { ...rowProps };
    if (
        !viewProps.itemPadding?.top ||
        viewProps.itemPadding.top === 'null' ||
        viewProps.itemPadding.top === 'default'
    ) {
        masterStyleProps.paddingTop = 'master';
    }
    if (
        !viewProps.itemPadding?.bottom ||
        viewProps.itemPadding.bottom === 'null' ||
        viewProps.itemPadding.bottom === 'default'
    ) {
        masterStyleProps.paddingBottom = 'master';
    }
    return masterStyleProps;
}
