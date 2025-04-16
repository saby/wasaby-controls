import {
    ColumnSeparatorUtils,
    PaddingRenderUtils,
    RowSeparatorUtils,
    BackgroundRenderUtils,
    ColumnScrollRenderUtils,
    IRowComponentProps,
} from 'Controls/gridRender';
import { TListStyle } from 'Controls/baseList';
import type {
    TreeGridNodeExtraItemCell,
    TreeGridNodeFooterCell,
    TreeGridNodeFooterRow,
    TreeGridNodeHeaderRow,
} from 'Controls/treeGridDisplay';
import { INodeExtraItemCellComponentProps } from 'Controls/_treeGridRender/cell/NodeExtraItem';

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
    const viewConfig = row.getViewConfig();

    const getCellPropsResult = cellConfig?.getCellProps
        ? cellConfig?.getCellProps(row.getNode().contents)
        : {};

    const isMultiselectCell = row.hasMultiSelectColumn() && cell.isFirstColumn();

    const padding = PaddingRenderUtils.getPaddingsObject({
        cell,
        row,
    });

    // Для NodeFooter и NodeHeader по сути используцется один и тот же щаблон,
    // но внутри различаются префиксы CSS классов.
    const position = (cell as unknown as TreeGridNodeFooterCell).$TGNFC ? 'footer' : 'header';

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
        navigationButtonView: viewConfig?.buttonView,
        navigationButtonConfig: viewConfig?.buttonConfig,

        // expanderPadding and levelPadding props

        withoutLevelPadding: getCellPropsResult?.withoutLevelPadding,
        withoutExpanderPadding: getCellPropsResult?.withoutExpanderPadding,
    };
    if (cellConfig.render) {
        resultProps.contentRender = cellConfig.render;
    }
    return resultProps;
}
