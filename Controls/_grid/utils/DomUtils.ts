import { SyntheticEvent } from 'UICommon/Events';
import Collection from 'Controls/_grid/display/Collection';

export function correctEventTargetFF(target: EventTarget): HTMLElement {
    const targetElement = target as HTMLElement;
    // В FF целью события может быть элемент #text, у которого нет метода closest, в этом случае рассматриваем как
    // цель его родителя.
    if (
        targetElement &&
        !targetElement.closest &&
        targetElement.parentElement
    ) {
        return targetElement.parentElement;
    }
    return targetElement;
}

export function getCellElementByEventTarget(target: HTMLElement): HTMLElement {
    return target.closest('.js-controls-Grid__row-cell') as HTMLElement;
}

export function getCellIndexByEventTarget(
    event: SyntheticEvent,
    collection: Collection
): number {
    // TreeGridControl в explorer используется для всех видов списков, поэтому проверяем коллекцию
    if (!event || !collection['[Controls/_display/grid/mixins/Grid]']) {
        return null;
    }
    const target = correctEventTargetFF(event.target);
    const gridRow = target.closest('.controls-ListView__itemV');
    if (!gridRow) {
        return null;
    }

    const gridCells = gridRow.querySelectorAll('.js-controls-Grid__row-cell');
    const currentCell = getCellElementByEventTarget(target);
    const multiSelectOffset = collection.hasMultiSelectColumn() ? 1 : 0;

    return (
        Array.prototype.slice.call(gridCells).indexOf(currentCell) -
        multiSelectOffset
    );
}
