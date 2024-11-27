import {
    ColumnSeparatorUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
    BackgroundRenderUtils,
    ColumnScrollRenderUtils,
    IRowComponentProps,
    IItemsContainerPadding,
} from 'Controls/grid';
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

// TODO вынести в общую с DataCell утилиту, получать из rowProps
function getMargin({ row }: { row: IGetNodeExtraItemCellComponentProps['row'] }) {
    return {
        marginLeft: row._$itemsContainerPadding?.left,
        marginRight: row._$itemsContainerPadding?.right,
    };
}

export function getNodeExtraItemCellComponentProps(
    props: IGetNodeExtraItemCellComponentProps
): INodeExtraItemCellComponentProps {
    const { cell, row, rowProps } = props;
    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();

    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps(cell) : {};

    const isMultiselectCell = row.hasMultiSelectColumn() && cell.isFirstColumn();

    const padding = PaddingRenderUtils.getPaddingsObject({
        cell,
        row,
    });

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
    const margin = getMargin({ row });

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
        ...margin,
        ...ColumnSeparatorUtils.getColumnSeparators({ cell }),
        ...RowSeparatorUtils.getRowSeparators(props),

        isMoreButtonCell: cell.isMoreButton(),
        isMultiselectCell,
        decorationStyle: cell.getStyle() as TListStyle,

        shouldDisplayExtraItem,
        shouldRenderHasMoreButton: cell.shouldRenderHasMoreButton(),

        loadMoreCaption: row.getMoreCaption(),
        linkFontColorStyle: row.getMoreFontColorStyle(),

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),

        'data-qa': 'cell',
        position,
    };
    if (cellConfig.render) {
        resultProps.contentRender = cellConfig.render;
    }
    return resultProps;
}
