import {
    ColumnSeparatorUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
    BackgroundRenderUtils,
    ColumnScrollRenderUtils,
    IRowComponentProps,
} from 'Controls/grid';
import { GridCell, ICellPadding } from 'Controls/gridDisplay';
import { TGridHPaddingSize } from 'Controls/interface';
import { TListStyle } from 'Controls/baseList';
import {
    TreeGridNodeExtraItemCell,
    TreeGridNodeFooterCell,
    TreeGridNodeFooterRow,
    TreeGridNodeHeaderRow,
} from 'Controls/treeGridDisplay';
import { INodeExtraItemCellComponentProps } from 'Controls/_treeGrid/cleanRender/cell/NodeExtraItemCellComponent';

export interface IGetNodeExtraItemCellComponentProps {
    cell: TreeGridNodeExtraItemCell;
    row: TreeGridNodeFooterRow | TreeGridNodeHeaderRow;
    rowProps: IRowComponentProps;
}

export function getNodeExtraItemCellComponentProps(
    props: IGetNodeExtraItemCellComponentProps
): INodeExtraItemCellComponentProps {
    const { cell, row, rowProps } = props;
    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();

    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: PaddingRenderUtils.IPartialColumnsConfigForGetPadding[] = [];

    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps(cell) : {};

    row.getGridColumnsConfig().forEach((gridColumn) => {
        columnsConfig.push({
            cellPadding: gridColumn.cellPadding as ICellPadding,
        });
    });

    const padding = PaddingRenderUtils.getHorizontalPaddingProp({
        cell: cell as unknown as GridCell,
        columnsConfig,
        rowLeftPadding: (rowLeftPadding ? `list_${rowLeftPadding}` : '') as TGridHPaddingSize,
        rowRightPadding: (rowRightPadding ? `list_${rowRightPadding}` : '') as TGridHPaddingSize,
        hasMultiSelectColumn: row.hasMultiSelectColumn(),
    });

    const isMultiselectCell = row.hasMultiSelectColumn() && cell.isFirstColumn();

    // Для NodeFooter и NodeHeader по сути используцется один и тот же щаблон,
    // но внутри различаются префиксы CSS классов.
    const position = (cell as unknown as TreeGridNodeFooterCell)[
        '[Controls/treeGrid:TreeGridNodeFooterCell]'
    ]
        ? 'footer'
        : 'header';

    const hasMoreStorage = position === 'header' ? 'backward' : 'forward';

    const shouldDisplayExtraItem =
        row.hasMoreStorage(hasMoreStorage) && row.shouldDisplayMoreButton();

    const columnScrollProps = ColumnScrollRenderUtils.getColumnScrollProps({ cell, row });

    const resultProps: INodeExtraItemCellComponentProps = {
        backgroundColorStyle:
            BackgroundRenderUtils.getBackgroundColorStyle({
                getCellPropsResult,
                cellConfig,
                isFixedCell:
                    columnScrollProps.hasColumnScroll && columnScrollProps.columnScrollIsFixedCell,
            }) || rowProps.backgroundColorStyle,

        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

        // Columns scroll
        ...columnScrollProps,

        padding,
        ...ColumnSeparatorUtils.getColumnSeparators({ cell }),
        ...RowSeparatorUtils.getRowSeparators(props),

        isMoreButtonCell: cell.isMoreButton(),
        isMultiselectCell,
        decorationStyle: cell.getStyle() as TListStyle,

        shouldDisplayExtraItem,
        shouldRenderHasMoreButton: cell.shouldRenderHasMoreButton(),

        loadMoreCaption: row.getMoreCaption(),
        linkFontColorStyle: row.getMoreFontColorStyle(),
        'data-qa': 'cell',
        position,
    };
    if (cellConfig.render) {
        resultProps.contentRender = cellConfig.render;
    }
    return resultProps;
}