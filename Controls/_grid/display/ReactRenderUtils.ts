import type { IRowComponentProps, IRowProps } from 'Controls/gridReact';
import DataRow from './DataRow';

export function getRowComponentProps(
    rowProps: IRowProps,
    item: DataRow
): IRowComponentProps {
    const actionsVisibility =
        item.getItemActionsPosition() !== 'custom' ||
        item.shouldDisplaySwipeTemplate()
            ? item.getOwner().getActionsVisibility()
            : 'hidden';
    const actionsVisible = actionsVisibility !== 'hidden';
    const markerVisible = item.shouldDisplayMarker(rowProps.markerVisible);
    const borderVisible =
        rowProps.borderVisibility && rowProps.borderVisibility !== 'hidden';

    return {
        handlers: null,
        actionHandlers: null,

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

        hoverBackgroundStyle: rowProps.hoverBackgroundStyle,
        backgroundColorStyle: rowProps.backgroundColorStyle,

        actionsVisibility,
        actionsClassName: actionsVisible
            ? rowProps.actionsClassName
            : undefined,

        borderVisibility: rowProps.borderVisibility,
        borderStyle: borderVisible ? rowProps.borderStyle : undefined,

        shadowVisibility: item.isDragged()
            ? 'dragging'
            : rowProps.shadowVisibility,
    };
}
