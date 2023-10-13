import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import type { IRowComponentProps, IRowProps } from 'Controls/gridReact';
import DataRow from './DataRow';

const DEFAULT_PROPS: Partial<IRowComponentProps> = {
    paddingTop: 'grid_s',
    paddingBottom: 'grid_s',
};

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

    return {
        handlers,
        actionHandlers,

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

        paddingTop: rowProps.padding?.top || DEFAULT_PROPS.paddingTop,
        paddingBottom: rowProps.padding?.bottom || DEFAULT_PROPS.paddingBottom,

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
