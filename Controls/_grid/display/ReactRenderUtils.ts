import type {
    IItemActionsHandler,
    IItemEventHandlers,
} from 'Controls/baseList';
import type { IRowComponentProps, IRowProps } from 'Controls/gridReact';
import DataRow from './DataRow';

export function getRowComponentProps(
    rowProps: IRowProps,
    item: DataRow,
    handlers: IItemEventHandlers = null,
    actionHandlers: IItemActionsHandler = null
): IRowComponentProps {
    const actionsVisibility =
        item.getItemActionsPosition() !== 'custom' ||
        item.shouldDisplaySwipeTemplate()
            ? item.getOwner().getActionsVisibility()
            : 'hidden';
    const actionsVisible = actionsVisibility !== 'hidden';
    const markerVisible = item.shouldDisplayMarker(rowProps.markerVisible);
    const stickied = item.shouldWrapInScrollGroup(true);

    const editingConfig = item.getEditingConfig();
    const hoverBackgroundStyle =
        editingConfig?.mode === 'cell' ? 'none' : rowProps.hoverBackgroundStyle;
    const borderVisibility =
        editingConfig?.mode === 'cell'
            ? 'hidden'
            : rowProps.borderVisibility || 'hidden';

    return {
        handlers,
        actionHandlers,

        item: item.contents,
        itemVersion: item.getVersion(),
        cellsIterator: item.getCellsIterator(),

        fontSize: rowProps.fontSize,
        fontWeight: rowProps.fontWeight,
        fontColorStyle: rowProps.fontColorStyle,
        cursor: rowProps.cursor,

        markerVisible,
        markerSize: markerVisible ? rowProps.markerSize : undefined,
        markerClassName: markerVisible ? rowProps.markerClassName : undefined,

        checkboxValue: item.isSelected(),
        checkboxReadonly: item.isReadonlyCheckbox(),
        checkboxVisibility: item.isVisibleCheckbox()
            ? item.getMultiSelectVisibility()
            : 'hidden',

        paddingTop: rowProps.padding?.top,
        paddingBottom: rowProps.padding?.bottom,

        hoverBackgroundStyle,
        backgroundColorStyle: rowProps.backgroundColorStyle,

        actionsVisibility,
        actionsClassName: actionsVisible
            ? rowProps.actionsClassName
            : undefined,

        borderVisibility,
        // Вот тут спорно, возможно лучше прокидывать, так было написано, но логики мало.
        borderStyle:
            borderVisibility !== 'hidden'
                ? rowProps.borderStyle || 'default'
                : undefined,
        shadowVisibility: item.isDragged()
            ? 'dragging'
            : rowProps.shadowVisibility,

        stickied,
        stickyPosition: stickied ? item.getStickyGroupPosition() : undefined,
        fixedPositionInitial: rowProps.fixedPositionInitial || undefined,
    };
}
