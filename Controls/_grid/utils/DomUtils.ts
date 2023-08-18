import { SyntheticEvent } from 'UICommon/Events';
import Collection from 'Controls/_grid/display/Collection';

export function correctEventTargetFF(target: EventTarget): HTMLElement {
    const targetElement = target as HTMLElement;
    // В FF целью события может быть элемент #text, у которого нет метода closest, в этом случае рассматриваем как
    // цель его родителя.
    if (targetElement && !targetElement.closest && targetElement.parentElement) {
        return targetElement.parentElement;
    }
    return targetElement;
}

export function getCellElementByEventTarget(
    target: HTMLElement,
    cellSelector: string = '.js-controls-Grid__row-cell'
): HTMLElement {
    if (target.className.indexOf && target.className.indexOf(cellSelector.substring(1)) !== -1) {
        return target;
    }
    return target.closest(cellSelector) as HTMLElement;
}

export function getCellIndexByEventTarget(
    event: SyntheticEvent,
    collection: Collection,
    rowSelector: string = '.controls-ListView__itemV',
    cellSelector: string = '.js-controls-Grid__row-cell'
): number {
    // TreeGridControl в explorer используется для всех видов списков, поэтому проверяем коллекцию
    if (!event || !collection['[Controls/_display/grid/mixins/Grid]']) {
        return null;
    }
    const cellIndex = getCellIndexByEventTargetCommon(event, rowSelector, cellSelector);
    const multiSelectOffset = collection.hasMultiSelectColumn() ? 1 : 0;

    return cellIndex - multiSelectOffset;
}

export function getCellIndexByEventTargetCommon(
    event: SyntheticEvent,
    rowSelector: string = '.controls-ListView__itemV',
    cellSelector: string = '.js-controls-Grid__row-cell'
): number {
    const target = correctEventTargetFF(event.target);
    const gridRow = target.closest(rowSelector);
    if (!gridRow) {
        return null;
    }

    const gridCells = gridRow.querySelectorAll(cellSelector);
    const currentCell = getCellElementByEventTarget(target, cellSelector);

    return Array.prototype.slice.call(gridCells).indexOf(currentCell);
}
