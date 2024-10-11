/*
 * Файл содержит методы, для рассчета стилей style=master
 */

import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';
import { IGridViewProps } from 'Controls/_grid/gridReact/view/interface';
import { GridCell } from 'Controls/baseGrid';

/*
 * Стили, специфичные для style=master
 */
export function getCellComponentMasterStyleProps(
    cell: GridCell,
    cellProps: ICellComponentProps
): ICellComponentProps {
    cellProps.minHeightClassName = cell.getMinHeightClasses();
    // Радиусы в Мастере задаются своими собственными переменными.
    // см. controls-Grid__row-cell__last-master, controls-Grid__row-cell__first-master
    if (cellProps.isFirstCell) {
        cellProps.bottomLeftBorderRadius = 'master';
        cellProps.topLeftBorderRadius = 'master';
    }
    if (cellProps.isLastCell) {
        cellProps.bottomRightBorderRadius = 'master';
        cellProps.topRightBorderRadius = 'master';
    }
    if (cellProps.isMarked) {
        cellProps.fontWeight = 'bold';
        cellProps.fontColorStyle = 'master_selected';
        cellProps.backgroundStyle = 'master_selected';
        cellProps.backgroundColorStyle = 'master_selected';
    }
    if (!cellProps.fontSize) {
        cellProps.fontSize = 'l';
    }

    return cellProps;
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
