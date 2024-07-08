/*
 * Файл содержит функцию, возвращающую контент ячейки для различных типов данных (Money, Date, Number, String)
 */

import * as React from 'react';
import { GridCell, GridDataCell } from 'Controls/grid';

/*
 * Функция, возвращающая контент ячейки для различных типов данных (Money, Date, Number, String)
 */
export function getDataCellRender(cell: GridCell): React.ReactElement {
    const CellContentRender = cell.getCellContentRender();
    return (
        <CellContentRender
            key={cell.key}
            cCount={cell.cCount}
            value={cell.getDisplayValue()}
            highlightedValue={cell.getHighlightedValue()}
            fontSize={cell.config.fontSize}
            fontWeight={cell.config.fontWeight}
            fontColorStyle={cell.config.fontColorStyle}
            displayTypeOptions={cell.config.displayTypeOptions}
            textOverflow={cell.getTextOverflow()}
            column={cell}
            tooltip={(cell as GridDataCell).getTextOverflowTitle()}
        />
    );
}
