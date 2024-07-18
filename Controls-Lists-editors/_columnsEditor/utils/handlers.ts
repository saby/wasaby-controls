import { Model } from 'Types/entity';
import { IColumn, TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { recalculateColumnsHeader } from 'Controls-Lists-editors/_columnsEditor/utils/markup';

interface IOnColumnDeleteCallbackResult {
    editingColumns: TColumnsForCtor;
    editingHeaders: THeaderForCtor;
    selectedColumnsIdxs: number[];
}

interface IOnMouseMoveParams {
    widgetHTMLElement: HTMLElement;
    popupContainer: HTMLElement;
    prevScrollLeft: number | undefined;
    buttons: number;
    clientX: number;
    clientY: number;
    isDragging: boolean;
}

interface IOnItemClickForReplaceParams {
    item: Model;
    onValueChange: Function;
    onClose: Function;
    allColumns: IColumn[];
}

// Утилиты - обработчики событий редактора колонок

/**
 * Обновить позицию горизонтального скрола
 * @param {IOnMouseMoveParams} params
 */
export function moveScrollLeft(params: IOnMouseMoveParams): number | undefined {
    const {
        popupContainer,
        prevScrollLeft,
        widgetHTMLElement,
        buttons,
        clientX,
        clientY,
        isDragging,
    } = params;
    const touchedScrollBar = document.elementsFromPoint(clientX, clientY).find((elem) => {
        return elem.className.includes?.('js-controls-ColumnScroll__thumb');
    });
    const contentStyle = popupContainer?.querySelector(
        '.ControlsListsEditors_columnsDesignTime-markup_container'
    ).style;
    if (touchedScrollBar && !isDragging) {
        contentStyle.pointerEvents = 'none';
        popupContainer
            .querySelectorAll('.ControlsListsEditors_info-line')
            .forEach((el) => el.classList.add?.('ControlsListsEditors_info-line-animation-hidden'));
        popupContainer
            .querySelectorAll(
                '.ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
            )
            .forEach((el) => el.classList.add?.('tw-invisible'));
        return;
    } else if (buttons === 0) {
        const gridTransformStyle = getComputedStyle(
            widgetHTMLElement?.querySelector('.controls-Grid')
        )?.transform;
        let offsetString = gridTransformStyle.slice(0, gridTransformStyle.lastIndexOf(','));
        offsetString = offsetString.slice(offsetString.lastIndexOf(',') + 1);
        const nextLeftScrollWidth = Math.abs(Number(offsetString));
        if (contentStyle.pointerEvents === 'none' && nextLeftScrollWidth === prevScrollLeft) {
            contentStyle.pointerEvents = '';
            popupContainer
                .querySelectorAll('.ControlsListsEditors_info-line')
                .forEach((el) =>
                    el.classList.remove?.('ControlsListsEditors_info-line-animation-hidden')
                );
            popupContainer
                .querySelectorAll(
                    '.ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
                )
                .forEach((el) => el.classList.remove?.('tw-invisible'));
        }
        return nextLeftScrollWidth;
    }
}

export function itemClickForReplace(props: IOnItemClickForReplaceParams) {
    const { item, onValueChange, onClose, allColumns } = props;
    onValueChange({
        caption: item.getRawData().caption,
        displayProperty: allColumns[item.getRawData().startColumn - 1].displayProperty,
    });
    onClose();
}

export function onColumnDeleteCallback(
    headers: THeaderForCtor,
    columns: TColumnsForCtor,
    selectedColumnsIdxs: number[],
    headerIdx: number
): IOnColumnDeleteCallbackResult {
    const headerToDelete = headers[headerIdx];
    const columnOffset = headerToDelete.endColumn - headerToDelete.startColumn;
    const newColumns = [...columns];
    newColumns.splice(headerToDelete.startColumn - 1, columnOffset);
    const newHeader = [...headers];
    newHeader.splice(headerIdx, columnOffset);
    recalculateColumnsHeader(newHeader, headerIdx, columnOffset);
    const newSelectedColumnsIdxs: number[] = [];
    for (let i = 0; i < selectedColumnsIdxs.length; i++) {
        if (selectedColumnsIdxs[i] !== headerIdx) {
            if (selectedColumnsIdxs[i] > headerIdx) {
                newSelectedColumnsIdxs.push(selectedColumnsIdxs[i] - 1);
            } else {
                newSelectedColumnsIdxs.push(selectedColumnsIdxs[i]);
            }
        }
    }
    return {
        editingColumns: newColumns,
        editingHeaders: newHeader,
        selectedColumnsIdxs: newSelectedColumnsIdxs,
    };
}
