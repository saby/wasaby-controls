import { TColumnKey, TGridRowSelection, TGridSelection, TPlainSelection } from '../interfaces';

export function resetHasSiblingToDirection(
    selection: TGridRowSelection,
    direction: 'up' | 'down'
): boolean {
    let isChanged = false;

    Object.keys(selection.hasSibling).forEach((key) => {
        if (selection.hasSibling[key][direction]) {
            selection.hasSibling[key][direction] = false;
            isChanged = true;
        }
    });

    return isChanged;
}

function updateSiblingRowSelectionsToDirectionMutable(
    selection: TGridRowSelection,
    siblingSelection: TGridRowSelection,
    currentSelectionKey: TColumnKey,
    direction: 'up' | 'down'
): boolean {
    let isChanged = false;

    const siblingKey = Object.keys(siblingSelection.rowSelection).find(
        (prevKey) =>
            siblingSelection.rowSelection[prevKey].firstColumnKey ===
                selection.rowSelection[currentSelectionKey].firstColumnKey &&
            siblingSelection.rowSelection[prevKey].lastColumnKey ===
                selection.rowSelection[currentSelectionKey].lastColumnKey
    );

    if (typeof siblingKey !== 'undefined') {
        siblingSelection.hasSibling[siblingKey][direction === 'up' ? 'down' : 'up'] = true;
        selection.hasSibling[currentSelectionKey][direction] = true;
        isChanged = true;
    }

    return isChanged;
}

export function updateHasSiblingMutable(
    selection: TGridRowSelection,
    prevSiblingSelection: TGridRowSelection,
    nextSiblingSelection: TGridRowSelection
): [isPrevChanged: boolean, isNextChanged: boolean] {
    Object.keys(selection.rowSelection).forEach((key) => {
        selection.hasSibling[key] = {
            up: false,
            down: false,
        };
    });

    if (!prevSiblingSelection && !nextSiblingSelection) {
        return [false, false];
    }

    let isPrevChanged = false;
    let isNextChanged = false;

    if (prevSiblingSelection) {
        isPrevChanged = resetHasSiblingToDirection(prevSiblingSelection, 'down');
    }

    if (nextSiblingSelection) {
        isNextChanged = resetHasSiblingToDirection(nextSiblingSelection, 'up');
    }

    Object.keys(selection.rowSelection).forEach((currentSelectionKey) => {
        if (prevSiblingSelection) {
            isPrevChanged =
                updateSiblingRowSelectionsToDirectionMutable(
                    selection,
                    prevSiblingSelection,
                    currentSelectionKey as unknown as TColumnKey,
                    'up'
                ) || isPrevChanged;
        }

        if (nextSiblingSelection) {
            isNextChanged =
                updateSiblingRowSelectionsToDirectionMutable(
                    selection,
                    nextSiblingSelection,
                    currentSelectionKey as unknown as TColumnKey,
                    'down'
                ) || isNextChanged;
        }
    });

    if (isPrevChanged) {
        prevSiblingSelection.hasSibling = { ...prevSiblingSelection.hasSibling };
    }

    if (isNextChanged) {
        nextSiblingSelection.hasSibling = { ...nextSiblingSelection.hasSibling };
    }

    return [isPrevChanged, isNextChanged];
}

export function isEqualPlainSelections(
    selection1: TPlainSelection,
    selection2: TPlainSelection
): boolean {
    return compareKeys(Object.keys(selection1), Object.keys(selection2), (a, b) => {
        return compareKeys(selection1[a], selection2[b]);
    });
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

export function convertGridSelectionToPlainRecord(selection: TGridSelection): TPlainSelection {
    return Object.keys(selection).reduce((acc, sKey) => {
        return {
            ...acc,
            [sKey]: Object.keys(selection[sKey].rowSelection).reduce(
                (rowSelectedKeys, rsKey) => [
                    ...rowSelectedKeys,
                    ...selection[sKey].rowSelection[rsKey].selectedKeys,
                ],
                []
            ),
        };
    }, {});
}

export function convertPlainSelectionToGridSelection(selection: TPlainSelection): TGridSelection {
    const gridSelection: TGridSelection = {};
    // TODO: Не реализовано, будет делаться тут, если это вообще требуется.
    // Сейчас смена набора выбранных ячеек прикладным разработчиком через слайс не работает.
    return gridSelection;
}
