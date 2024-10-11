import {
    ColumnSeparatorUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
    BackgroundRenderUtils,
    ColumnScrollRenderUtils,
} from 'Controls/grid';
import { GridCell, ICellPadding } from 'Controls/baseGrid';
import { TGridHPaddingSize } from 'Controls/interface';
import { TListStyle } from 'Controls/baseList';
import {
    TreeGridNodeExtraItemCell,
    TreeGridNodeFooterCell,
    TreeGridNodeFooterRow,
    TreeGridNodeHeaderRow,
} from 'Controls/baseTreeGrid';
import { INodeExtraItemCellComponentProps } from 'Controls/_treeGrid/cleanRender/cell/NodeExtraItemCellComponent';

export interface IGetNodeExtraItemCellComponentProps {
    cell: TreeGridNodeExtraItemCell;
    row: TreeGridNodeFooterRow | TreeGridNodeHeaderRow;
}

export function getNodeExtraItemCellComponentProps(
    props: IGetNodeExtraItemCellComponentProps
): INodeExtraItemCellComponentProps {
    const { cell, row } = props;
    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();

    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: PaddingRenderUtils.IPartialColumnsConfigForGetPadding[] = [];

    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps() : {};

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

    const shouldDisplayExtraItem = row.hasMoreStorage('forward') && row.shouldDisplayMoreButton();

    // Для NodeFooter и NodeHeader по сути используцется один и тот же щаблон,
    // но внутри различаются префиксы CSS классов.
    const position = (cell as unknown as TreeGridNodeFooterCell)[
        '[Controls/treeGrid:TreeGridNodeFooterCell]'
    ]
        ? 'footer'
        : 'header';

    const columnScrollProps = ColumnScrollRenderUtils.getColumnScrollProps({ cell, row });

    const resultProps: INodeExtraItemCellComponentProps = {
        backgroundColorStyle: BackgroundRenderUtils.getBackgroundColorStyle({
            getCellPropsResult,
            cellConfig,
            isFixedCell:
                columnScrollProps.hasColumnScroll && columnScrollProps.columnScrollIsFixedCell,
        }),

        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

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
