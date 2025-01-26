/*
 * Файл содержит методы, для рассчета стилей style=master
 */

import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';
import { IGridViewProps } from 'Controls/_gridRender/interface/IView';
import { GridCell } from 'Controls/gridDisplay';
import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';
import { getMinHeightClasses } from 'Controls/_gridRender/cell/utils/Classes/MinHeight';

/*
 * Стили, специфичные для style=master
 */
export function getCellProps(
    cell: Cell,
    cellProps: IDataCellComponentProps
): IDataCellComponentProps {
    cellProps.minHeightClassName = getMinHeightClasses(
        cell.getOwner().getTopPadding(),
        cell.getOwner().getBottomPadding(),
        cell.getStyle()
    );
    const cellConfig = cell.config;
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
        cellProps.fontWeight = cellConfig.fontWeight || 'bold';
        cellProps.fontColorStyle = cellConfig.fontColorStyle || 'master_selected';
        cellProps.backgroundStyle = cellProps.backgroundStyle || 'master_selected';
        cellProps.backgroundColorStyle =
            cellProps.backgroundColorStyle || cellProps.backgroundStyle || 'master_selected';
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
export function getRowProps(
    rowProps: IRowComponentProps,
    viewProps: IGridViewProps,
    isAdaptive: boolean
): IRowComponentProps {
    const masterStyleProps: IRowComponentProps = { ...rowProps };
    if (
        !viewProps.itemPadding?.top ||
        viewProps.itemPadding.top === 'null' ||
        viewProps.itemPadding.top === 'default'
    ) {
        masterStyleProps.paddingTop = isAdaptive ? 'master_adaptive' : 'master';
    }
    if (
        !viewProps.itemPadding?.bottom ||
        viewProps.itemPadding.bottom === 'null' ||
        viewProps.itemPadding.bottom === 'default'
    ) {
        masterStyleProps.paddingBottom = isAdaptive ? 'master_adaptive' : 'master';
    }
    return masterStyleProps;
}
