import { TColumnKey, ISelection, TRowSelection, TColumns } from '../interfaces';
import { datesEqualByQuantum, TQuantumType } from '../../render/utils';

export function getColumnIndexByKey(
    columnKey: TColumnKey,
    columns: TColumns,
    quantum: TQuantumType
): number {
    const date = new Date(columnKey);
    return columns.findIndex((d) => datesEqualByQuantum(date, d, quantum));
}

export function createNewSelection(newKeys: TColumnKey[]): ISelection {
    return {
        rootKey: newKeys[0],
        firstColumnKey: newKeys[0],
        lastColumnKey: newKeys[newKeys.length - 1],
        selectedKeys: newKeys,
        hasBorderTop: true,
        hasBorderBottom: true,
        gridColumnStart: undefined,
        gridColumnEnd: undefined,
    };
}

export function unshiftFromSelectionMutable(
    rowSelection: TRowSelection,
    selection: ISelection,
    columnsToRoot: Record<TColumnKey, TColumnKey>
): ISelection {
    const columnKey = selection.firstColumnKey;
    const rightSelection: ISelection = createNewSelection(selection.selectedKeys.slice(1));

    rightSelection.selectedKeys.forEach((k) => {
        columnsToRoot[k] = rightSelection.rootKey;
    });

    delete rowSelection[columnsToRoot[columnKey]];
    delete columnsToRoot[columnKey];

    rowSelection[rightSelection.rootKey] = rightSelection;

    return rightSelection;
}

export function popFromSelectionMutable(
    rowSelection: TRowSelection,
    selection: ISelection,
    columnsToRoot: Record<TColumnKey, TColumnKey>
): ISelection {
    const columnKey = selection.lastColumnKey;
    const leftSelection: ISelection = createNewSelection(
        selection.selectedKeys.slice(0, selection.selectedKeys.length - 1)
    );

    leftSelection.selectedKeys.forEach((k) => {
        columnsToRoot[k] = leftSelection.rootKey;
    });

    delete rowSelection[columnsToRoot[columnKey]];
    delete columnsToRoot[columnKey];
    rowSelection[leftSelection.rootKey] = leftSelection;

    return leftSelection;
}

export function splitSelectionMutable(
    rowSelection: TRowSelection,
    selection: ISelection,
    columnsToRoot: Record<TColumnKey, TColumnKey>,
    columnKey: TColumnKey
): [leftSelection: ISelection, rightSelection: ISelection] {
    const leftSelection = createNewSelection(
        selection.selectedKeys.slice(0, selection.selectedKeys.indexOf(columnKey))
    );

    leftSelection.selectedKeys.forEach((k) => {
        columnsToRoot[k] = leftSelection.rootKey;
    });

    const rightSelection = createNewSelection(
        selection.selectedKeys.slice(selection.selectedKeys.indexOf(columnKey) + 1)
    );

    rightSelection.selectedKeys.forEach((k) => {
        columnsToRoot[k] = rightSelection.rootKey;
    });

    delete rowSelection[columnsToRoot[columnKey]];
    delete columnsToRoot[columnKey];

    rowSelection[leftSelection.rootKey] = leftSelection;
    rowSelection[rightSelection.rootKey] = rightSelection;

    return [leftSelection, rightSelection];
}

export function deleteSelectionMutable(
    rowSelection: TRowSelection,
    selection: ISelection,
    columnsToRoot: Record<TColumnKey, TColumnKey>
): void {
    const columnKey = selection.rootKey;
    delete rowSelection[columnsToRoot[columnKey]];
    delete columnsToRoot[columnKey];
}

export function handleAddToSelectionMutable(
    rowSelection: TRowSelection,
    columnsToRoot: Record<TColumnKey, TColumnKey>,
    columnKey: TColumnKey,
    prevColumnKey: TColumnKey,
    nextColumnKey: TColumnKey
): ISelection {
    let joinSelection: ISelection;

    if (columnsToRoot[prevColumnKey]) {
        joinSelection = rowSelection[columnsToRoot[prevColumnKey]];

        joinSelection.selectedKeys.push(columnKey);
        joinSelection.lastColumnKey = columnKey;
        columnsToRoot[columnKey] = columnsToRoot[prevColumnKey];
    }

    if (columnsToRoot[nextColumnKey]) {
        const nextSelection = rowSelection[columnsToRoot[nextColumnKey]];
        const nextSelectionRoot = columnsToRoot[nextColumnKey];

        if (joinSelection) {
            joinSelection.selectedKeys.push(...nextSelection.selectedKeys);
            joinSelection.lastColumnKey = nextSelection.lastColumnKey;
            nextSelection.selectedKeys.forEach((key) => {
                columnsToRoot[key] = joinSelection.rootKey;
            });
            delete rowSelection[nextSelectionRoot];
        } else {
            joinSelection = nextSelection;

            joinSelection.selectedKeys.unshift(columnKey);
            joinSelection.firstColumnKey = columnKey;
            columnsToRoot[columnKey] = columnsToRoot[nextColumnKey];
        }
    }

    if (!joinSelection) {
        joinSelection = createNewSelection([columnKey]);
        rowSelection[columnKey] = joinSelection;
        columnsToRoot[columnKey] = columnKey;
    }

    return joinSelection;
}

export function getGridColumnCSSStyle(selection: ISelection, columns: TColumns, quantum: TQuantumType): {
    gridColumnStart: number;
    gridColumnEnd: number;
} {
    let gridColumnStart = getColumnIndexByKey(selection.firstColumnKey, columns, quantum);
    let gridColumnEnd = getColumnIndexByKey(selection.lastColumnKey, columns, quantum);

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

    return {gridColumnStart, gridColumnEnd};
}
