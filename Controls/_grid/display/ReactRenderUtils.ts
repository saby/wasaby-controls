import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import type { IRowComponentProps, IRowProps } from 'Controls/gridReact';
import DataRow from './DataRow';
import {
    IGridPaddingProps,
    TGridHPaddingSize,
    TGridVPaddingSize,
} from 'Controls/_interface/GridInterfaces';

const DEFAULT_PROPS: Partial<IRowComponentProps> = {
    paddingTop: 'grid_s',
    paddingBottom: 'grid_s',
    paddingLeft: 'grid_m',
    paddingRight: 'grid_m',
};

export function calculationRowPadding(rowProps: IRowProps, item: DataRow): IGridPaddingProps {
    const itemPaddingTop =
        item.getTopPadding() === 'default'
            ? DEFAULT_PROPS.paddingTop
            : (('grid_' + item.getTopPadding()) as TGridVPaddingSize);
    const itemPaddingBottom =
        item.getBottomPadding() === 'default'
            ? DEFAULT_PROPS.paddingBottom
            : (('grid_' + item.getBottomPadding()) as TGridVPaddingSize);
    const itemPaddingLeft =
        item.getLeftPadding() === 'default'
            ? DEFAULT_PROPS.paddingLeft
            : (('grid_' + item.getLeftPadding()) as TGridHPaddingSize);
    const itemPaddingRight =
        item.getRightPadding() === 'default'
            ? DEFAULT_PROPS.paddingRight
            : (('grid_' + item.getRightPadding()) as TGridHPaddingSize);

    return {
        paddingTop: rowProps.padding?.top ?? (itemPaddingTop || DEFAULT_PROPS.paddingTop),
        paddingBottom:
            rowProps.padding?.bottom ?? (itemPaddingBottom || DEFAULT_PROPS.paddingBottom),
        paddingLeft: itemPaddingLeft || DEFAULT_PROPS.paddingLeft,
        paddingRight: itemPaddingRight || DEFAULT_PROPS.paddingRight,
    };
}

export function getRowComponentProps(
    rowProps: IRowProps,
    item: DataRow,
    handlers: IItemEventHandlers = null,
    actionHandlers: IItemActionsHandler = null
): IRowComponentProps {
    const actionsVisibility =
        item.getItemActionsPosition() !== 'custom' || item.shouldDisplaySwipeTemplate()
            ? item.getOwner().getActionsVisibility()
            : 'hidden';
    const actionsVisible = actionsVisibility !== 'hidden';
    const markerVisible = item.shouldDisplayMarker(rowProps.markerVisible);
    const stickied = item.shouldWrapInScrollGroup(true);

    const editingConfig = item.getEditingConfig();
    const hoverBackgroundStyle =
        editingConfig?.mode === 'cell' ? 'none' : rowProps.hoverBackgroundStyle;
    const borderVisibility =
        editingConfig?.mode === 'cell' ? 'hidden' : rowProps.borderVisibility || 'hidden';
    const hoverMode = editingConfig?.mode || 'row';

    const padding = calculationRowPadding(rowProps, item);

    return {
        handlers,
        actionHandlers,
        className: rowProps.className,

        item: item.contents,
        'item-key': item.key,
        itemVersion: item.getVersion(),
        cellsIterator: item.getCellsIterator(),

        fontSize: rowProps.fontSize,
        fontWeight: rowProps.fontWeight,
        fontColorStyle: rowProps.fontColorStyle,
        cursor: rowProps.cursor,

        markerVisible,
        markerSize: markerVisible ? rowProps.markerSize : undefined,
        markerClassName: (markerVisible ? rowProps.markerClassName : '') || '',

        checkboxVisibility: item.isVisibleCheckbox() ? item.getMultiSelectVisibility() : 'hidden',
        ...padding,

        hoverMode,
        hoverBackgroundStyle,
        backgroundStyle: rowProps.backgroundStyle,

        actionsVisibility,
        actionsClassName: actionsVisible ? rowProps.actionsClassName : undefined,

        borderVisibility,
        // Вот тут спорно, возможно лучше прокидывать, так было написано, но логики мало.
        borderStyle: borderVisibility !== 'hidden' ? rowProps.borderStyle || 'default' : undefined,
        shadowVisibility: item.isDragged() ? 'dragging' : rowProps.shadowVisibility,

        stickied,
        stickyPosition: stickied ? item.getStickyGroupPosition() : undefined,
        fixedPositionInitial: rowProps.fixedPositionInitial || undefined,
    };
}
