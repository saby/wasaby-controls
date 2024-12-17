import { GridCell, GridEmptyCell, GridEmptyRow, ICellPadding } from 'Controls/baseGrid';
import {
    getHorizontalPaddingProp,
    IPartialColumnsConfigForGetPadding,
} from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/_interface/GridInterfaces';

interface IGetEmptyCellComponentProps {
    cell: GridEmptyCell;
    row: GridEmptyRow;
}

interface IEmptyCellComponentProps {
    paddingLeft: TGridHPaddingSize;
    paddingRight: TGridHPaddingSize;
    paddingTop: TGridVPaddingSize;
    paddingBottom: TGridVPaddingSize;
}

export function getEmptyCellComponentProps(
    props: IGetEmptyCellComponentProps
): IEmptyCellComponentProps {
    const { cell, row } = props;
    const cellConfig = cell.getColumnConfig();

    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: IPartialColumnsConfigForGetPadding[] = [];

    row.getGridColumnsConfig().forEach((gridColumn) => {
        const columnConfig: IPartialColumnsConfigForGetPadding = {};

        if (gridColumn.cellPadding) {
            columnConfig.cellPadding = gridColumn.cellPadding as ICellPadding;
        }

        // getCellProps сейчас одинаковый для всех ячеек и не имеет смысла, нужно переходить на gridColumn.cellConfig
        if (cellConfig.getCellProps) {
            columnConfig.getCellProps = cellConfig.getCellProps;
        }

        columnsConfig.push(columnConfig);
    });

    // Если задан emptyTemplate или рендерится ячейка под чекбокс, то отступы должны быть нулевыми.
    if (cell.isMultiSelectColumn() || (cell.isSingleColspanedCell && !!row.getRowTemplate())) {
        return {
            paddingLeft: 'null',
            paddingRight: 'null',
            paddingTop: 'null',
            paddingBottom: 'null',
        };
    }

    const horizontalPadding = getHorizontalPaddingProp({
        cell: cell as unknown as GridCell,
        columnsConfig,
        getCellsPropsParams: () => ({}),
        rowLeftPadding: (rowLeftPadding ? `list_${rowLeftPadding}` : '') as TGridHPaddingSize,
        rowRightPadding: (rowRightPadding ? `list_${rowRightPadding}` : '') as TGridHPaddingSize,
        hasMultiSelectColumn: row.hasMultiSelectColumn(),
    });

    return {
        paddingLeft: horizontalPadding.left as TGridHPaddingSize,
        paddingRight: horizontalPadding.right as TGridHPaddingSize,
        paddingTop: row.getTopPadding() as TGridVPaddingSize,
        paddingBottom: row.getBottomPadding() as TGridVPaddingSize,
    };
}
