import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { GridCell, GridGroupCell } from 'Controls/gridDisplay';
import { IGroupProps, IGroupRowComponentProps } from 'Controls/_gridRender/interface/Group';
import { getStickyProps } from 'Controls/_gridRender/cell/utils/Props/Sticky';
import { getColumnScrollProps } from 'Controls/_gridRender/cell/utils/Props/ColumnScroll';
import { groupConstants } from 'Controls/display';
import type { GridGroupRow as GroupRow } from 'Controls/gridDisplay';
import { IGroupCellComponentProps } from 'Controls/_gridRender/cell/Group';
import { isFirstDataCell } from 'Controls/_gridRender/cell/utils/Props/Cell';
import getFixedZIndex from 'Controls/_gridRender/cell/utils/Props/ZIndex';
import { getPaddingsObject } from 'Controls/_gridRender/cell/utils/Props/Padding';

interface IGetGroupCellComponentProps {
    cell: GridGroupCell;
    row: GroupRow;
    rowProps: IGroupRowComponentProps;
}

interface IGroupRenderProps {
    item: string;
    itemData: GroupRow;
    expanded: boolean;
    highlightedValue?: string;
}

export function getGroupCellProps({
    cell,
    row,
    rowProps = {},
}: IGetGroupCellComponentProps): IGroupCellComponentProps {
    const { style } = wasabyAttrsToReactDom({
        style: cell.getWrapperStyles(),
    });

    // ItemTemplateOptions врежиме совместимости могут содержать фон,
    // необходимый группам при groupViewMode===blocks, titledBlocks.
    const groupProps: IGroupProps = {
        // todo Значения rowProps передаются при использовании иерархической группировки.
        //  Для обычной тут вроде не должно быть rowProps
        //  а совместимые параметры должны набираться прямо в слое compatible
        fontSize: rowProps.fontSize,
        fontWeight: rowProps.fontWeight,
        fontColorStyle: rowProps.fontColorStyle,
        textTransform: rowProps.textTransform,
        ...row.getItemTemplateOptions(),
        ...row.getRowProps(),
    };

    const stickyProps = getStickyProps({ cell: cell as unknown as GridCell, row });
    if (rowProps.backgroundColorStyle && rowProps.groupViewMode === 'titledBlocks') {
        stickyProps.stickiedBackgroundStyle = rowProps.backgroundColorStyle;
    }
    if (rowProps.fixedBackgroundStyle && rowProps.groupViewMode === 'titledBlocks') {
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
        expanded: row.isExpanded(),
        highlightedValue: row.getSearchValue?.(),
    };

    const padding = getPaddingsObject({
        cell,
        row,
        paddingTop: groupProps.paddingTop || 's',
        paddingBottom: groupProps.paddingBottom || '2xs',
        paddingLeftDefault: 'null',
        paddingRightDefault: 'null',
    });

    const contentRender =
        groupProps.contentRender ||
        groupProps.contentTemplate ||
        rowProps.contentRender ||
        cell.contents;

    return {
        // columnScroll
        ...columnScrollProps,

        // sticky groups
        ...stickyProps,

        // colspan
        startColumn: colspanParams?.startColumn || 'auto',
        endColumn: colspanParams?.endColumn || 'auto',

        textVisible: groupProps.textVisible !== false && cell.isContentCell?.(),
        rightTemplateCondition: !cell.isContentCell?.() || row.getColspanGroup?.(),
        expanded: cell.isExpanded(),
        isGroupNode: false,
        isHiddenGroup: cell?.contents === groupConstants.hiddenGroup,
        style,
        decorationStyle: cell.getStyle(),
        // TODO это костыльная правка, нужно реорганизовать код так,
        //  чтобы мы могли однозначно определить ячейку чекбокса.
        cellType:
            cell.getOwner().hasMultiSelectColumn() &&
            cell.isFirstColumn() &&
            !cell.isLastColumn() &&
            columnsCount > stickyColumnsCount
                ? 'checkbox'
                : 'base',
        contentRender,
        separatorVisible:
            groupProps.separatorVisibility !== undefined
                ? groupProps.separatorVisibility
                : groupProps.separatorVisible,
        halign: groupProps.halign || groupProps.textAlign,
        expanderPosition: groupProps.expanderPosition || groupProps.expanderAlign,
        isFirstDataColumn: isFirstDataCell(cell),
        hoverBackgroundStyle: 'none',
        highlightOnHover: false,
        isStickyLadderCell: !!cell.$GSLC,
        expanderVisible:
            groupProps.expanderVisible !== undefined ? groupProps.expanderVisible : true,
        customTemplateProps: groupRenderProps,

        // z-index
        fixedZIndex: getFixedZIndex(
            columnScrollProps.hasColumnScroll,
            columnScrollProps.columnScrollIsFixedCell
        ),

        // cursor
        cursor: 'pointer',
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
        rightTemplateProps: groupRenderProps,

        // padding
        padding,

        // first last cell
        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
    };
}
