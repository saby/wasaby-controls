import SearchSeparatorCell from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorCell';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import { ISearchSeparatorCellComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchSeparatorCellComponent';
import {
    ColumnScrollRenderUtils,
    ColumnSeparatorUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
} from 'Controls/grid';
import { ISearchBreadcrumbsTreeGridRowComponentProps } from 'Controls/_searchBreadcrumbsGrid/row/interface';

interface IGetSearchBreadcrumbsProps {
    cell: SearchSeparatorCell;
    row: SearchSeparatorRow;
    rowProps?: ISearchBreadcrumbsTreeGridRowComponentProps;
}

export function getSearchSeparatorCellComponentProps(
    props: IGetSearchBreadcrumbsProps
): Partial<ISearchSeparatorCellComponentProps> {
    const { row, cell, rowProps } = props;

    const colspanParams = cell.getColspanParams();
    const columnScrollProps = ColumnScrollRenderUtils.getColumnScrollProps({ cell, row });

    const padding = PaddingRenderUtils.getPaddingsObject({
        cell,
        row,
        getCellsPropsParams: null,
    });

    return {
        ...columnScrollProps,

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
        readOnly: true,

        // отступы
        padding,

        // колспан
        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

        // separator
        ...ColumnSeparatorUtils.getColumnSeparators({ cell }),
        ...RowSeparatorUtils.getRowSeparators(props),

        // backgrounds
        hoverBackgroundStyle: rowProps?.hoverBackgroundStyle || 'default',
        backgroundColorStyle: rowProps?.backgroundStyle || 'default',
        highlightOnHover: false,
        decorationStyle: row.getStyle(),
    };
}
