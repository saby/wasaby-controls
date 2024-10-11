import {
    ColumnScrollRenderUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
    ColumnSeparatorUtils,
    ICellPadding,
    IRowComponentProps,
} from 'Controls/grid';
import { TGridHPaddingSize } from 'Controls/interface';
import BreadcrumbsItemCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import { IPathComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/PathComponent';
import { ISearchBreadcrumbsCellComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchBreadcrumbsCellComponent';
import { CursorUtils } from 'Controls/baseGrid';

interface IGetSearchBreadcrumbsProps {
    cell: BreadcrumbsItemCell;
    row: BreadcrumbsItemRow;
    rowProps?: IRowComponentProps;
}

export function getSearchBreadcrumbsProps(
    props: IGetSearchBreadcrumbsProps
): Partial<ISearchBreadcrumbsCellComponentProps> {
    const { row, cell } = props;

    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();
    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps() : {};
    const columnScrollProps = ColumnScrollRenderUtils.getColumnScrollProps({ cell, row });
    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: PaddingRenderUtils.IPartialColumnsConfigForGetPadding[] = [];

    const { actionHandlers } = props.rowProps || {};

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

    // Курсор
    const isScrollable =
        columnScrollProps.hasColumnScroll && !columnScrollProps.columnScrollIsFixedCell;
    const cursor = CursorUtils.getCursor(getCellPropsResult.cursor, isScrollable, 'pointer');

    return {
        // ItemActions
        actionHandlers,
        actionsVisibility: props.rowProps.actionsVisibility,
        actionsPosition: props.rowProps.actionsVisibility,
        actionsClassName: props.rowProps.actionsClassName,

        ...getCellPropsResult,
        ...columnScrollProps,

        // PathComponent props
        ...getBreadcrumbsPathProps(props),

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
        readOnly: row.isReadonly(),

        // отступы
        padding: {
            ...PaddingRenderUtils.getDefaultPaddingsObject({}, row),
            ...horizontalPadding,
        },

        // колспан
        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

        // separator
        ...ColumnSeparatorUtils.getColumnSeparators({ cell }),
        ...RowSeparatorUtils.getRowSeparators(props),

        // cursor
        cursor,

        // backgrounds
        // todo bckcgnd from rowProps ??
        hoverBackgroundStyle: 'default',
        backgroundStyle: 'default',
        highlightOnHover: true,
        fixedBackgroundStyle: row.getFixedBackgroundStyle(),
    };
}

export function getBreadcrumbsPathProps(props: IGetSearchBreadcrumbsProps): IPathComponentProps {
    return props.cell.getBreadcrumbsPathProps();
}
