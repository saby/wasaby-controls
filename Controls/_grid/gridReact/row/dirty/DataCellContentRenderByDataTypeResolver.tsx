/*
 * Файл содержит функцию, возвращающую контент ячейки для различных типов данных (Money, Date, Number, String)
 */

import * as React from 'react';
import type { GridCell, GridDataCell } from 'Controls/grid';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';

/*
 * Функция, возвращающая контент ячейки для различных типов данных (Money, Date, Number, String)
 */
export function getDataCellContentRenderByDataType(
    cell: GridCell,
    cellProps: ICellComponentProps
): React.ReactElement {
    const CellContentRender = cell.getCellContentRender();
    return (
        <CellContentRender
            key={cell.key}
            cCountStart={cell.cCountStart}
            cCountEnd={cell.cCountEnd}
            className={cellProps.contentRenderClassName}
            value={cell.getDisplayValue()}
            highlightedValue={cell.getHighlightedValue()}
            fontSize={cellProps.fontSize || cell.config.fontSize}
            fontWeight={cellProps.fontWeight || cell.config.fontWeight}
            fontColorStyle={cellProps.fontColorStyle || cell.config.fontColorStyle}
            displayTypeOptions={cell.config.displayTypeOptions}
            textOverflow={cell.getTextOverflow()}
            column={cell}
            tooltip={(cell as GridDataCell).getTextOverflowTitle()}
        />
    );
}
