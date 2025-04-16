import {
    ColumnScrollRenderUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
    ColumnSeparatorUtils,
    IRowComponentProps,
} from 'Controls/grid';
import BreadcrumbsItemCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import { IPathComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/PathComponent';
import { ISearchBreadcrumbsCellComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchBreadcrumbsCellComponent';
import { CursorUtils } from 'Controls/gridRender';

interface IGetSearchBreadcrumbsProps {
    cell: BreadcrumbsItemCell;
    row: BreadcrumbsItemRow;
    rowProps?: IRowComponentProps;
}

export function getSearchBreadcrumbsProps(
    props: IGetSearchBreadcrumbsProps
): Partial<ISearchBreadcrumbsCellComponentProps> {
    const { row, cell, rowProps } = props;

    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();
    const item = row.contents[row.contents.length - 1];
    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps(item) : {};
    const columnScrollProps = ColumnScrollRenderUtils.getColumnScrollProps({ cell, row });

    const { actionHandlers } = rowProps || {};

    const padding = PaddingRenderUtils.getPaddingsObject({
        cell,
        row,
        paddingTop: rowProps?.paddingTop || row.getTopPadding(),
        paddingBottom: rowProps?.paddingBottom || row.getBottomPadding(),
        getCellsPropsParams: () => item,
    });

    // Курсор
    const isScrollable =
        columnScrollProps.hasColumnScroll && !columnScrollProps.columnScrollIsFixedCell;
    const cursor = CursorUtils.getCursor(getCellPropsResult.cursor, isScrollable, 'pointer');

    const endColumn =
        rowProps?.cCountStart && colspanParams && colspanParams.startColumn
            ? colspanParams.startColumn + rowProps.cCountStart
            : colspanParams?.endColumn;

    return {
        // ItemActions
        actionHandlers,
        actionsVisibility: cell.getActionsVisibility(rowProps?.actionsVisibility),
        actionsPosition: rowProps?.actionsPosition,
        actionsClassName: rowProps?.actionsClassName,

        ...getCellPropsResult,
        ...columnScrollProps,

        // PathComponent props
        ...getBreadcrumbsPathProps(props),

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
        readOnly: row.isReadonly(),

        // отступы
        padding,

        // колспан
        startColumn: colspanParams?.startColumn,
        endColumn,

        // separator
        ...ColumnSeparatorUtils.getColumnSeparators({ cell }),
        ...RowSeparatorUtils.getRowSeparators(props),

        // cursor
        cursor,

        // backgrounds
        hoverBackgroundStyle: rowProps?.hoverBackgroundStyle || 'default',
        backgroundStyle: rowProps?.backgroundStyle || 'default',
        highlightOnHover:
            rowProps?.highlightOnHover !== undefined ? rowProps.highlightOnHover : true,
        fixedBackgroundStyle: row.getFixedBackgroundStyle(),
    };
}

export function getBreadcrumbsPathProps(props: IGetSearchBreadcrumbsProps): IPathComponentProps {
    const { cell, row, rowProps } = props;
    return {
        keyProperty: cell.getKeyProperty(),
        displayProperty: cell.getDisplayProperty(),
        readOnly: row.isReadonly(),
        items: cell.getContents(),

        backgroundStyle: row.getBackgroundStyle(),
        containerWidth: row.getContainerWidth(),
        searchValue: cell.getSearchValue(),
        onBreadCrumbsItemClick: rowProps?.handlers?.onBreadCrumbsItemClick,
    };
}
