import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { GridCell, GridGroupCell } from 'Controls/baseGrid';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { IGroupRowComponentProps } from 'Controls/_grid/gridReact/group/interface';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { isTreeGroupNodeCell } from 'Controls/_grid/compatibleLayer/utils/Type';
import { groupConstants } from 'Controls/_display/itemsStrategy/Group';
import type { GridGroupRow as GroupRow } from 'Controls/baseGrid';
import { IGroupCellComponentProps } from 'Controls/_grid/dirtyRender/group/GroupCellComponent';
import { isFirstDataCell } from 'Controls/_grid/cleanRender/cell/utils/Props/Cell';

const DEFAULT_PROPS: Partial<ICellComponentProps> = {
    hoverBackgroundStyle: 'default',
};

interface IGroupPaddingUtils {
    side: 'left' | 'right';
    isFirstCell: boolean;
    isLastCell: boolean;
    paddingLeft: ICellComponentProps['paddingLeft'];
    paddingRight: ICellComponentProps['paddingRight'];
}

interface IGetGroupCellComponentProps {
    cell: GridGroupCell;
    row: GroupRow;
    rowProps: IGroupRowComponentProps;
}

// TODO надо свести API c утилитой Props/Padding
export function getGroupPaddingClasses({
    side,
    isFirstCell,
    isLastCell,
    paddingLeft,
    paddingRight,
}: IGroupPaddingUtils): string {
    let classes = '';
    if (side === 'left' && isFirstCell) {
        classes += ` controls-Grid__cell_spacingFirstCol_${paddingLeft}`;
    }
    if (side === 'right' && isLastCell) {
        classes += ` controls-Grid__cell_spacingLastCol_${paddingRight}`;
    }
    return classes;
}

interface IGroupRenderProps {
    item: string;
    expanded: boolean;
}

// TODO перетащить сюда то, что осталось в Controls/_baseGrid/display/GroupCell.ts
export function getGroupCellComponentProps({
    cell,
    row,
    rowProps,
}: IGetGroupCellComponentProps): IGroupCellComponentProps {
    const { style } = wasabyAttrsToReactDom({
        style: cell.getWrapperStyles(),
    });

    const stickyProps = getStickyProps({ cell: cell as unknown as GridCell, row });

    // columnScroll
    const columnScrollProps = getColumnScrollProps({ cell, row });

    // columnScroll
    const columnsCount = row.getColumnsCount();
    const stickyColumnsCount = row.getStickyColumnsCount();

    // пропсы, которые передаютися в прикладной рендер.
    // Надо будет добавить хук типа useGroupData(), позволяющий узнать раскрытость группы и другие нужные параметры.
    // Добавим позже, когда соберём больше фидбека.
    const groupRenderProps: IGroupRenderProps = {
        item: row.getContents(),
        expanded: row.isExpanded(),
    };

    return {
        // columnScroll
        ...columnScrollProps,

        ...rowProps,
        ...stickyProps,
        itemData: cell,
        textVisible: rowProps.textVisible !== false && cell.isContentCell?.(),
        rightPaddingClassName: getGroupPaddingClasses({
            side: 'right',
            isFirstCell: cell.isFirstColumn(),
            isLastCell: cell.isLastColumn(),
            paddingLeft: row.getLeftPadding(),
            paddingRight: row.getRightPadding(),
        }),
        leftPaddingClassName: getGroupPaddingClasses({
            side: 'left',
            isFirstCell: cell.isFirstColumn(),
            isLastCell: cell.isLastColumn(),
            paddingLeft: row.getLeftPadding(),
            paddingRight: row.getRightPadding(),
        }),
        rightTemplateCondition: !cell.isContentCell?.() || rowProps.colspanGroup,
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
        contentRender: rowProps.contentRender || rowProps.contentTemplate || rowProps.textRender,
        separatorVisible:
            rowProps.contentRender !== undefined
                ? rowProps.separatorVisible
                : rowProps.separatorVisibility,
        halign: rowProps.halign || rowProps.textAlign,
        expanderPosition: rowProps.expanderPosition || rowProps.expanderAlign,
        isFirstColumn: cell?.isFirstColumn?.(),
        isLastColumn: cell?.isLastColumn?.(),
        isFirstDataColumn: isFirstDataCell(cell),
        hoverBackgroundStyle: isTreeGroupNodeCell(cell)
            ? rowProps.hoverBackgroundStyle ?? DEFAULT_PROPS.hoverBackgroundStyle
            : 'none',
        highlightOnHover: isTreeGroupNodeCell(cell) ? rowProps.highlightOnHover : false,
        isStickyLadderCell: !!cell['[Controls/_display/StickyLadderCell]'],
        expanderVisible: rowProps.expanderVisible !== undefined ? rowProps.expanderVisible : true,
        customTemplateProps: groupRenderProps,
    };
}
