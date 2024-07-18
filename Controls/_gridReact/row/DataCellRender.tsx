import * as React from 'react';
import { GridCell, GridDataCell } from 'Controls/grid';
import { ICellComponentProps } from 'Controls/_gridReact/cell/interface';

export function getDataCellRender(cell: GridCell): React.ReactElement {
    const CellContentRender = cell.getCellContentRender();
    return (
        <CellContentRender
            key={cell.key}
            cCount={cell.cCount}
            value={cell.getDisplayValue()}
            highlightedValue={cell.getSearchValue()}
            fontSize={cell.config.fontSize}
            fontWeight={cell.config.fontWeight}
            fontColorStyle={cell.config.fontColorStyle}
            displayTypeOptions={cell.config.displayTypeOptions}
            textOverflow={cell.config.textOverflow}
            column={cell}
            tooltip={(cell as GridDataCell).getTextOverflowTitle()}
        />
    );
}
