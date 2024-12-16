import { GridCell } from 'Controls/gridDisplay';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import { getDataCellContentRenderByDataType } from 'Controls/_gridRender/row/utils/Resolvers/CellByType';
import { DefaultCellContentRender } from 'Controls/_gridRender/cell/content/Default';
import { Highlighted } from 'Controls/_gridRender/cell/content/Highlighted';

function contentRenderResolver(cell: GridCell, cellProps: ICellComponentProps) {
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
                    <Highlighted
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

export default contentRenderResolver;
