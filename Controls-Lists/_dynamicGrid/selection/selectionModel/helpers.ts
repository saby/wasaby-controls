/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import {
    ICellsSelectionModel,
    IRowSelectionModel,
    IGridSelectionModel,
    TSelectionMap,
} from './types';
import { TColumnKey, TColumnKeys, TItemKey } from '../shared/types';

export function createEmptySelection(newKeys: TColumnKey[]): ICellsSelectionModel {
    return {
        rootKey: newKeys[0],
        firstColumnKey: newKeys[0],
        lastColumnKey: newKeys[newKeys.length - 1],
        selectedKeys: newKeys,
        gridColumnStart: undefined,
        gridColumnEnd: undefined,

        isHidden: false,
        hasSiblingUp: false,
        hasSiblingDown: false,
        prevItemKey: undefined,
        nextItemKey: undefined,
    };
}

export function getGridColumnCSSStyle(
    selection: ICellsSelectionModel,
    columns: TColumnKeys
): {
    gridColumnStart: number;
    gridColumnEnd: number;
} {
    let gridColumnStart = columns.indexOf(selection.firstColumnKey);
    let gridColumnEnd = columns.indexOf(selection.lastColumnKey);

    if (gridColumnStart === -1 || gridColumnEnd === -1) {
        if (gridColumnStart === -1 && gridColumnEnd === -1) {
            gridColumnStart = undefined;
            gridColumnEnd = undefined;
        } else if (gridColumnStart === -1) {
            gridColumnStart = 1;
        } else if (gridColumnEnd === -1) {
            gridColumnEnd = -1;
        }
    } else {
        gridColumnStart = gridColumnStart + 1;
        gridColumnEnd = gridColumnEnd + 1 + 1;
    }

    return {
        gridColumnStart,
        gridColumnEnd,
    };
}

export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function resetHasSiblingToDirection(
    selection: IRowSelectionModel,
    direction: 'up' | 'down' | 'both'
): boolean {
    let isChanged = false;

    Object.keys(selection).forEach((key) => {
        if (direction === 'up' || direction === 'both') {
            if (selection[key].hasSiblingUp) {
                isChanged = true;
            }
            selection[key].hasSiblingUp = false;
            selection[key].prevItemKey = undefined;
        }
        if (direction === 'down' || direction === 'both') {
            if (selection[key].hasSiblingDown) {
                isChanged = true;
            }
            selection[key].hasSiblingDown = false;
            selection[key].nextItemKey = undefined;
        }
    });

    return isChanged;
}

export function updateSiblingCellsSelection(
    gridSelection: IGridSelectionModel,
    currentItemKey: TItemKey,
    currentRowSelectionKey: TColumnKey,
    siblingItemKey: TItemKey,
    direction: 'up' | 'down'
): boolean {
    let isChanged = false;

    const rowSelection = gridSelection[currentItemKey] as unknown as IRowSelectionModel;
    const siblingRowSelection = gridSelection[siblingItemKey] as unknown as IRowSelectionModel;

    const siblingCellsSelectionRoot = Object.keys(siblingRowSelection).find(
        (prevKey) =>
            siblingRowSelection[prevKey].firstColumnKey ===
                rowSelection[currentRowSelectionKey].firstColumnKey &&
            siblingRowSelection[prevKey].lastColumnKey ===
                rowSelection[currentRowSelectionKey].lastColumnKey
    );

    if (typeof siblingCellsSelectionRoot !== 'undefined') {
        const cellsSelection = rowSelection[currentRowSelectionKey] as ICellsSelectionModel;
        const sCellsSelection = siblingRowSelection[
            siblingCellsSelectionRoot
        ] as ICellsSelectionModel;

        if (direction === 'up') {
            sCellsSelection.hasSiblingDown = true;
            sCellsSelection.nextItemKey = currentItemKey;
            cellsSelection.hasSiblingUp = true;
            cellsSelection.prevItemKey = siblingItemKey;
        } else {
            sCellsSelection.hasSiblingUp = true;
            sCellsSelection.prevItemKey = currentItemKey;
            cellsSelection.hasSiblingDown = true;
            cellsSelection.nextItemKey = siblingItemKey;
        }
        isChanged = true;
    }

    return isChanged;
}

export function isEqualPlainSelections(
    selection1: TSelectionMap,
    selection2: TSelectionMap
): boolean {
    return compareKeys(Object.keys(selection1), Object.keys(selection2), (a, b) => {
        return compareKeys(selection1[a], selection2[b]);
    });
}

export function convertGridSelectionToPlainRecord(selection: IGridSelectionModel): TSelectionMap {
    return Object.keys(selection).reduce((acc, sKey) => {
        return {
            ...acc,
            [sKey]: Object.keys(selection[sKey]).reduce(
                (rowSelectedKeys, rsKey) => [
                    ...rowSelectedKeys,
                    ...selection[sKey][rsKey].selectedKeys,
                ],
                []
            ),
        };
    }, {});
}

function compareKeys<T>(
    keys1: T[],
    keys2: T[],
    extraComparator?: (key1: T, key2: T) => boolean
): boolean {
    if (keys1.length !== keys2.length) {
        return false;
    } else if (keys1.length === 0) {
        return true;
    } else {
        const sorted1 = keys1.sort();
        const sorted2 = keys2.sort();

        // Ключи есть, их одинаковое количество и они отсортированы.
        for (let i = 0; i < sorted1.length; i++) {
            if (sorted1[i] !== sorted2[i]) {
                return false;
            } else if (extraComparator && !extraComparator(sorted1[i], sorted2[i])) {
                return false;
            }
        }

        return true;
    }
}
