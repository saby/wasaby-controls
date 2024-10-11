import { AbstractMarkerStrategy, TDirection } from './AbstractMarkerStrategy';
import { CrudEntityKey } from 'Types/source';
import { Collection as ICollection } from 'Controls/display';

function getMarkedKeyByDirection(
    collection: ICollection,
    index: number,
    direction: TDirection
): CrudEntityKey | null {
    const next = direction === 'Down' || direction === 'Right' || direction === 'Forward';
    const resIndex = next ? index + 1 : index - 1;
    return calculateNearbyItem(collection, resIndex, next);
}

function getNextMarkedKey(collection: ICollection, index: number): CrudEntityKey | null {
    return calculateNearbyItem(collection, index, true);
}

function getPrevMarkedKey(collection: ICollection, index: number): CrudEntityKey | null {
    return calculateNearbyItem(collection, index, false);
}

function calculateNearbyItem(
    collection: ICollection,
    index: number,
    next: boolean
): CrudEntityKey | null {
    let item;
    const count = collection.getCount();
    const indexInBounds = (i: number) => {
        return next ? i < count : i >= 0;
    };
    let resIndex = index;
    while (indexInBounds(resIndex)) {
        item = collection.at(resIndex);
        if (item && item.Markable) {
            break;
        }
        resIndex += next ? 1 : -1;
    }

    if (item && item.Markable) {
        return item.key;
    }

    return null;
}

export class SingleColumnMarkerStrategy extends AbstractMarkerStrategy<ICollection> {
    // Временно, чтобы не было дублирования в контроллере маркера
    oldGetMarkedKeyByDirection = getMarkedKeyByDirection;
    oldGetNextMarkedKey = getNextMarkedKey;
    oldGetPrevMarkedKey = getPrevMarkedKey;

    protected _getMarkedKeyByDirection = getMarkedKeyByDirection;
    protected _getNextMarkedKey = getNextMarkedKey;
    protected _getPrevMarkedKey = getPrevMarkedKey;

    shouldMoveMarkerOnScrollPaging(): boolean {
        return this._moveMarkerOnScrollPaging;
    }
}
