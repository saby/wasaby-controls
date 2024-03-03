import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';

interface IOnMouseMoveParams {
    widgetHTMLElement: HTMLElement;
    popupContainer: HTMLElement;
    prevScrollLeft: number | undefined;
    buttons: number;
    clientX: number;
    clientY: number;
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
    const { popupContainer, prevScrollLeft, widgetHTMLElement, buttons, clientX, clientY } = params;
    const touchedScrollBar = document.elementsFromPoint(clientX, clientY).find((elem) => {
        return elem.className.includes?.('js-controls-ColumnScroll__thumb');
    });
    const contentStyle = popupContainer?.querySelector(
        '.ControlsListsEditors_columnsDesignTime-markup_container'
    ).style;
    if (touchedScrollBar) {
        contentStyle.pointerEvents = 'none';
        popupContainer
            .querySelectorAll('.ControlsListsEditors_info-line')
            .forEach((el) => el.classList.add?.('ControlsListsEditors_info-line-animation-hidden'));
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
