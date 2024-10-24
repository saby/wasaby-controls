import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { GridCell, GridGroupCell } from 'Controls/gridDisplay';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { IGroupProps, IGroupRowComponentProps } from 'Controls/_grid/gridReact/group/interface';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { isTreeGroupNodeCell } from 'Controls/_grid/utils/Type';
import { groupConstants } from 'Controls/display';
import type { GridGroupRow as GroupRow } from 'Controls/gridDisplay';
import { IGroupCellComponentProps } from 'Controls/_grid/cleanRender/cell/GroupCellComponent';
import { isFirstDataCell } from 'Controls/_grid/cleanRender/cell/utils/Props/Cell';
import getFixedZIndex from 'Controls/_grid/cleanRender/cell/utils/Props/ZIndex';
import { getGroupHorizontalPaddingClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';

const DEFAULT_PROPS: Partial<ICellComponentProps> = {
    hoverBackgroundStyle: 'default',
};

interface IGetGroupCellComponentProps {
    cell: GridGroupCell;
    row: GroupRow;
    rowProps: IGroupRowComponentProps;
}

interface IGroupRenderProps {
    item: string;
    itemData: GroupRow;
    expanded: boolean;
}

export function getGroupCellComponentProps({
    cell,
    row,
    rowProps,
}: IGetGroupCellComponentProps): IGroupCellComponentProps {
    const { style } = wasabyAttrsToReactDom({
        style: cell.getWrapperStyles(),
    });

    // ItemTemplateOptions врежиме совместимости могут содержать фон,
    // необходимый группам при groupViewMode===blocks, titledBlocks.
    const groupProps: IGroupProps = row.getRowProps() || row.getItemTemplateOptions() || {};

    const stickyProps = getStickyProps({ cell: cell as unknown as GridCell, row });
    if (rowProps.backgroundColorStyle && rowProps.groupViewMode === 'titledBlocks') {
        stickyProps.stickiedBackgroundStyle = rowProps.backgroundColorStyle;
    }
    if (groupProps.fixedBackgroundStyle && rowProps.groupViewMode === 'titledBlocks') {
        stickyProps.fixedBackgroundStyle = rowProps.fixedBackgroundStyle;
    }

    // columnScroll
    const columnScrollProps = getColumnScrollProps({ cell, row });

    // columnScroll
    const columnsCount = row.getColumnsCount();
    const stickyColumnsCount = row.getStickyColumnsCount();

    // colspanParams
    const colspanParams = cell.getColspanParams();

    // пропсы, которые передаютися в прикладной рендер.
    // Надо будет добавить хук типа useGroupData(), позволяющий узнать раскрытость группы и другие нужные параметры.
    // Добавим позже, когда соберём больше фидбека.
    const groupRenderProps: IGroupRenderProps = {
        item: row.getContents(),
        itemData: row,
        expanded: row.isExpanded(),
    };

    return {
        // columnScroll
        ...columnScrollProps,

        // sticky groups
        ...stickyProps,

        // colspan
        startColspanIndex: colspanParams?.startColumn || 'auto',
        endColspanIndex: colspanParams?.endColumn || 'auto',

        textVisible: groupProps.textVisible !== false && cell.isContentCell?.(),
        rightPaddingClassName: getGroupHorizontalPaddingClasses({
            side: 'right',
            isFirstCell: cell.isFirstColumn(),
            isLastCell: cell.isLastColumn(),
            paddingLeft: row.getLeftPadding(),
            paddingRight: row.getRightPadding(),
        }),
        leftPaddingClassName: getGroupHorizontalPaddingClasses({
            side: 'left',
            isFirstCell: cell.isFirstColumn(),
            isLastCell: cell.isLastColumn(),
            paddingLeft: row.getLeftPadding(),
            paddingRight: row.getRightPadding(),
        }),
        rightTemplateCondition: !cell.isContentCell?.() || row.getColspanGroup?.(),
        expanded: cell.isExpanded(),
        isGroupNode: isTreeGroupNodeCell(cell),
        isHiddenGroup: cell?.contents === groupConstants.hiddenGroup,
        style,
        decorationStyle: cell.getStyle(),
        // TODO это костыльная правка, нужно реорганизовать код так,
        //  чтобы мы могли однозначнео определить ячейку чекбокса.
        cellType:
            cell.getOwner().hasMultiSelectColumn() &&
            cell.isFirstColumn() &&
            !cell.isLastColumn() &&
            columnsCount > stickyColumnsCount
                ? 'checkbox'
                : 'base',
        contentRender: rowProps.contentRender || rowProps.contentTemplate || cell.contents,
        separatorVisible:
            groupProps.separatorVisibility !== undefined
                ? groupProps.separatorVisibility
                : groupProps.separatorVisible,
        halign: groupProps.halign || groupProps.textAlign,
        expanderPosition: groupProps.expanderPosition || groupProps.expanderAlign,
        isFirstColumn: cell?.isFirstColumn?.(),
        isLastColumn: cell?.isLastColumn?.(),
        isFirstDataColumn: isFirstDataCell(cell),
        hoverBackgroundStyle: isTreeGroupNodeCell(cell)
            ? groupProps.hoverBackgroundStyle ?? DEFAULT_PROPS.hoverBackgroundStyle
            : 'none',
        highlightOnHover: isTreeGroupNodeCell(cell) ? groupProps.highlightOnHover : false,
        isStickyLadderCell: !!cell['[Controls/_display/StickyLadderCell]'],
        expanderVisible:
            groupProps.expanderVisible !== undefined ? groupProps.expanderVisible : true,
        customTemplateProps: groupRenderProps,

        // z-index
        fixedZIndex: getFixedZIndex(
            columnScrollProps.hasColumnScroll,
            columnScrollProps.columnScrollIsFixedCell
        ),

        // cursor
        cursor: 'pointer', // from cellProps/rowProps ?
        valign: 'center',

        listElementName: row.listElementName,
        isFirstItem: row.isFirstItem(),
        fontSize: groupProps.fontSize,
        fontWeight: groupProps.fontWeight,
        fontColorStyle: groupProps.fontColorStyle,
        textTransform: groupProps.textTransform,
        iconStyle: groupProps.iconStyle,
        iconSize: groupProps.iconSize,
        rightTemplate: groupProps.rightTemplate,

        // padding
        paddingTop: groupProps.paddingTop,
        paddingBottom: groupProps.paddingBottom,

        // first last cell
        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
    };
}
