import { AbstractMarkerStrategy, TDirection } from './AbstractMarkerStrategy';
import { CrudEntityKey } from 'Types/source';
import type { ColumnsCollection } from 'Controls/columns';

function getMarkedKeyByDirection(
    collection: ColumnsCollection,
    index: number,
    direction: TDirection
): CrudEntityKey | null {
    if (direction === 'Forward') {
        return getNextMarkedKey(collection, index);
    } else if (direction === 'Backward') {
        return getPrevMarkedKey(collection, index);
    }

    const curMarkedItem = collection.at(index);
    const itemFromDirection = collection[`getItemTo${direction}`](curMarkedItem);
    return itemFromDirection ? itemFromDirection.getContents().getKey() : null;
}

function getNextMarkedKey(collection: ColumnsCollection, index: number): CrudEntityKey | null {
    const markedItem = collection.find((item) => {
        return item.isMarked();
    });
    let resIndex = index;
    if (!markedItem && collection.getColumnsMode() !== 'fixed') {
        resIndex -= 1;
    }
    if (resIndex >= 0) {
        return getMarkedKeyByDirection(collection, resIndex, 'Right');
    } else {
        return null;
    }
}

function getPrevMarkedKey(collection: ColumnsCollection, index: number): CrudEntityKey | null {
    if (index > 0) {
        return getMarkedKeyByDirection(collection, index, 'Left');
    } else {
        return null;
    }
}

// @ts-ignore
export class MultiColumnMarkerStrategy extends AbstractMarkerStrategy<ColumnsCollection> {
    // Временно, чтобы не было дублирования в контроллере маркера
    oldGetMarkedKeyByDirection = getMarkedKeyByDirection;
    oldGetNextMarkedKey = getNextMarkedKey;
    oldGetPrevMarkedKey = getPrevMarkedKey;

    protected _getMarkedKeyByDirection = getMarkedKeyByDirection;
    protected _getNextMarkedKey = getNextMarkedKey;
    protected _getPrevMarkedKey = getPrevMarkedKey;

    shouldMoveMarkerOnScrollPaging(): boolean {
        return false;
    }
}
