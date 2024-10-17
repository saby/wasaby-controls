/*
 * Файл содержит функцию getGroupBlockCellRender, которая используется для отображения группировки с groupViewMode = titledBlocks | blocks.
 * Результат выполнения этой функции является контентом ячейки.
 * Это нужно, чтобы задать отступы на уровне контента, а не ячейки, чтобы контент не перекрывал тени, заданные на cell.
 */

import * as React from 'react';
import type { GridCell } from 'Controls/baseGrid';
import { ICellComponentProps } from 'Controls/_gridReact/cell/interface';
import {
    getHorizontalPaddingsClassName,
    getVerticalPaddingsClassName,
} from 'Controls/_gridReact/cell/CellComponent';

export function getGroupBlockCellRender(
    cell: GridCell,
    cellProps: ICellComponentProps
): React.ReactElement {
    let className = `controls-GridReact__groupViewMode_${cellProps.groupViewMode}_contentWrapper`;
    className += getVerticalPaddingsClassName(cellProps.paddingTop, cellProps.paddingBottom);
    className += getHorizontalPaddingsClassName(cellProps.paddingLeft, cellProps.paddingRight);
    return <div className={className}>{cellProps.render}</div>;
}
