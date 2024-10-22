import { IFooterCellComponentProps } from 'Controls/_grid/cleanRender/cell/FooterCellComponent';
import { GridCell, GridFooterCell, GridFooterRow, ICellPadding } from 'Controls/baseGrid';
import { IBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import {
    getHorizontalPaddingProp,
    IPartialColumnsConfigForGetPadding,
} from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
import { TGridHPaddingSize } from 'Controls/_interface/GridInterfaces';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { getBackgroundColorStyle } from 'Controls/_grid/cleanRender/cell/utils/Props/BackgroundColorStyle';

interface IGetFooterCellComponentProps
    extends Pick<
        IBaseCellComponentProps,
        'className' | 'data-qa' | 'contentRender' | 'onClick' | 'onMouseMove' | 'onMouseEnter'
    > {
    cell: GridFooterCell;
    row: GridFooterRow;
}

export function getFooterCellComponentProps(
    props: IGetFooterCellComponentProps
): IFooterCellComponentProps {
    const { cell, row } = props;
    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();

    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: IPartialColumnsConfigForGetPadding[] = [];

    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps() : {};

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

    const padding = getHorizontalPaddingProp({
        cell: cell as unknown as GridCell,
        columnsConfig,
        getCellsPropsParams: () => ({}),
        rowLeftPadding: (rowLeftPadding ? `list_${rowLeftPadding}` : '') as TGridHPaddingSize,
        rowRightPadding: (rowRightPadding ? `list_${rowRightPadding}` : '') as TGridHPaddingSize,
        hasMultiSelectColumn: row.hasMultiSelectColumn(),
    });

    const columnScrollProps = getColumnScrollProps({ cell, row });

    const stickyProps = getStickyProps({ cell: cell as unknown as GridCell, row });
    const shouldAddFooterPadding = cell.shouldAddFooterPadding;

    return {
        ...getCellPropsResult,
        ...columnScrollProps,

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),

        // фон
        backgroundColorStyle: getBackgroundColorStyle({
            getCellPropsResult,
            cellConfig,
            isFixedCell:
                columnScrollProps.hasColumnScroll && columnScrollProps.columnScrollIsFixedCell,
        }),

        // колспан
        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

        // отступы
        padding,
        shouldAddFooterPadding,

        // events
        onClick: props.onClick,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,

        // sticky
        ...stickyProps,
    };
}
