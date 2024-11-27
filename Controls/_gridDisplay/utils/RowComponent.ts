import { TouchDetect } from 'EnvTouch/EnvTouch';
import { IRowComponentProps, IRowProps } from 'Controls/grid';
import type { IItemEventHandlers, IItemActionsHandler } from 'Controls/baseList';
import { calcRowPadding } from './Padding';
import DataRow from '../DataRow';
import { TItemActionsVisibility } from 'Controls/interface';

// Утилита разрешает видимость опций записи.
// На тач устройствах надо всегда отображать блок ActionsWrapper, он сам и решает, как отобразить опции записи.
// На устройствах с управлением мышью отображаем, как возвращает коллекция (там своя логика).
function getActionsVisibility(listActionVisibility: TItemActionsVisibility) {
    // Запись становится isSwiped Только после того, как закончитс анимация свайпа.
    // Поэтому завязыываться на то, что запиь свайпнута нет смысла - тут всегда будет false.
    if (TouchDetect.getInstance().isTouch()) {
        return 'onswipe';
    }
    return listActionVisibility;
}

export function getRowComponentProps(
    rowProps: IRowProps,
    item: DataRow,
    handlers: IItemEventHandlers = null,
    actionHandlers: IItemActionsHandler = null
): IRowComponentProps {
    const actionsVisibility = getActionsVisibility(item.getOwner().getActionsVisibility());
    const actionsVisible = actionsVisibility !== 'hidden';
    const stickied = item.shouldWrapInScrollGroup(true);

    const editingConfig = item.getEditingConfig();
    const editingMode = editingConfig?.mode || 'row';
    let hoverBackgroundStyle = rowProps.hoverBackgroundStyle;
    if (!hoverBackgroundStyle) {
        hoverBackgroundStyle = editingMode === 'cell' ? 'none' : item.getHoverBackgroundStyle();
    }
    const borderVisibility =
        editingConfig?.mode === 'cell' ? 'hidden' : rowProps.borderVisibility || 'hidden';

    // Некоторые прикладники подсвечивают всю строку, а редактируют поячеечно.
    // Может, как-то свести со стандартом из таймлайна ???
    const hoverMode = hoverBackgroundStyle && hoverBackgroundStyle !== 'none' ? 'row' : editingMode;

    const padding = calcRowPadding(rowProps, item);

    // Когда прикладаник не выставил itemTemplate,
    // мы не ходим за ItemTemplate из compatibleLayer, но
    // itemTemplateOptions мы должны получать на уровне шаблона.
    const itemTemplateOptions = item.getItemTemplateOptions();

    return {
        ...itemTemplateOptions,
        handlers,
        actionHandlers,
        className:
            (rowProps.className || '') + (item.getClassName() ? ' ' + item.getClassName() : ''),

        item: item.contents,
        'item-key': String(item.key),
        'data-qa': rowProps?.dataQa || item.listElementName,
        'data-name': rowProps?.dataName,
        itemVersion: item.getVersion(),
        gridColumnsConfig: item.getGridColumnsConfig(),
        cellsIterator: item.getCellsIterator(),
        isMarked: item.isMarked(),

        fontSize: rowProps.fontSize,
        fontWeight: rowProps.fontWeight,
        fontColorStyle: rowProps.fontColorStyle,
        cursor: rowProps.cursor,

        markerVisible: rowProps.markerVisible,
        markerSize: rowProps.markerSize,
        markerClassName: rowProps.markerClassName,

        checkboxVisibility: item.isVisibleCheckbox() ? item.getMultiSelectVisibility() : 'hidden',
        ...padding,

        hoverMode,
        hoverBackgroundStyle,
        backgroundStyle: rowProps.backgroundStyle ?? item.getBackgroundStyle(),

        isActive: item.isActive(),
        actionsPosition: item.getItemActionsPosition(),
        actionsVisibility,
        actionsClassName: actionsVisible ? rowProps.actionsClassName : undefined,

        borderVisibility,
        // Вот тут спорно, возможно лучше прокидывать, так было написано, но логики мало.
        borderStyle: borderVisibility !== 'hidden' ? rowProps.borderStyle || 'default' : undefined,
        shadowVisibility: item.isDragged() ? 'dragging' : rowProps.shadowVisibility,

        stickied,
        stickyPosition: stickied ? item.getStickyGroupPosition() : undefined,
        fixedPositionInitial: rowProps.fixedPositionInitial || undefined,
        multiSelectRender: rowProps.multiSelectRender,
    };
}
