import { GridCell } from 'Controls/gridDisplay';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { getDataCellContentRenderByDataType } from 'Controls/_grid/gridReact/row/dirty/DataCellContentRenderByDataTypeResolver';
import { DefaultCellContentRender } from 'Controls/_grid/cleanRender/cell/contentRenders/DefaultContentRender';
import { HighlightedContentRender } from 'Controls/_grid/cleanRender/cell/contentRenders/HighlightedContentRender';

function getDirtyDataCellComponentContentRender(cell: GridCell, cellProps: ICellComponentProps) {
    const cellConfig = cell.config;

    let dataCellContentRender = cellConfig?.render;

    // Если задан null, то нужно так и оставить null, т.к. это валидное значение, позволяющее ничего не строить.
    if (dataCellContentRender === undefined) {
        if (cell.getDisplayType() && cell.getDisplayProperty()) {
            dataCellContentRender = getDataCellContentRenderByDataType(cell, cellProps);
        } else {
            if (
                cell.getHighlightedValue().length &&
                cell.getDisplayValue() &&
                cell.config?.displayTypeOptions?.searchHighlight !== false
            ) {
                dataCellContentRender = (
                    <HighlightedContentRender
                        displayProperty={cell.getDisplayProperty()}
                        textOverflow={cellProps.textOverflow}
                        highlightedValue={cell.getHighlightedValue()}
                        showEditArrow={cellProps.showEditArrow}
                        $wasabyRef={cellProps.$wasabyRef}
                    />
                );
            } else {
                dataCellContentRender = (
                    <DefaultCellContentRender
                        displayProperty={cell.getDisplayProperty()}
                        textOverflow={cell.getTextOverflow()}
                    />
                );
            }
        }
    }

    return dataCellContentRender;
}

export default getDirtyDataCellComponentContentRender;
