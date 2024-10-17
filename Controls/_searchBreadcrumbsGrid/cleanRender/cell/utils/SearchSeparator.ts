import SearchSeparatorCell from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorCell';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import { ISearchSeparatorCellComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchSeparatorCellComponent';
import {
    ColumnScrollRenderUtils,
    ColumnSeparatorUtils,
    ICellPadding,
    PaddingRenderUtils,
    RowSeparatorUtils,
} from 'Controls/grid';
import { TGridHPaddingSize } from 'Controls/interface';

interface IGetSearchBreadcrumbsProps {
    cell: SearchSeparatorCell;
    row: SearchSeparatorRow;
}

export function getSearchSeparatorCellComponentProps(
    props: IGetSearchBreadcrumbsProps
): Partial<ISearchSeparatorCellComponentProps> {
    const { row, cell } = props;

    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();
    const columnScrollProps = ColumnScrollRenderUtils.getColumnScrollProps({ cell, row });
    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: PaddingRenderUtils.IPartialColumnsConfigForGetPadding[] = [];

    row.getGridColumnsConfig().forEach((gridColumn) => {
        const columnConfig: PaddingRenderUtils.IPartialColumnsConfigForGetPadding = {};

        if (gridColumn.cellPadding) {
            columnConfig.cellPadding = gridColumn.cellPadding as ICellPadding;
        }

        // getCellProps сейчас одинаковый для всех ячеек и не имеет смысла, нужно переходить на gridColumn.cellConfig
        if (cellConfig.getCellProps) {
            columnConfig.getCellProps = cellConfig.getCellProps;
        }

        columnsConfig.push(columnConfig);
    });

    const horizontalPadding = PaddingRenderUtils.getHorizontalPaddingProp({
        cell,
        columnsConfig,
        getCellsPropsParams: () => ({}),
        rowLeftPadding: (rowLeftPadding ? `list_${rowLeftPadding}` : '') as TGridHPaddingSize,
        rowRightPadding: (rowRightPadding ? `list_${rowRightPadding}` : '') as TGridHPaddingSize,
        hasMultiSelectColumn: row.hasMultiSelectColumn(),
    });

    return {
        ...columnScrollProps,

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
        readOnly: true,

        // отступы
        padding: horizontalPadding,

        // колспан
        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

        // separator
        ...ColumnSeparatorUtils.getColumnSeparators({ cell }),
        ...RowSeparatorUtils.getRowSeparators(props),

        // backgrounds
        // todo bckcgnd from rowProps ??
        hoverBackgroundStyle: 'default',
        backgroundStyle: 'default',
        backgroundColorStyle: 'default',
        highlightOnHover: false,
        decorationStyle: row.getStyle(),
    };
}
