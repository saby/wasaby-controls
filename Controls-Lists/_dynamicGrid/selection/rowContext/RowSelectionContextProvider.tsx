import * as React from 'react';
import { TColumnKey, TItemKey } from '../interfaces';
import { GridSelectionContext } from '../gridContext/GridSelectionContext';
import {
    IRowSelectionContext,
    ISelection,
    RowSelectionContext,
    TRowSelection,
} from './RowSelectionContext';
import { TQuantumType } from '../../render/utils';
import {
    deleteSelectionMutable,
    getColumnIndexByKey,
    getGridColumnCSSStyle,
    handleAddToSelectionMutable,
    popFromSelectionMutable,
    splitSelectionMutable,
    unshiftFromSelectionMutable,
    updateHasSiblingForRowSelectionMutable,
} from './helpers';

export interface IRowSelectionContextProviderProps {
    children: JSX.Element;
    itemKey: TItemKey;
    quantum: TQuantumType;
}

export const RowSelectionContextProvider = React.memo(function RowSelectionContextProvider(
    props: IRowSelectionContextProviderProps
): JSX.Element {
    const gridSelectionContext = React.useContext(GridSelectionContext);
    const hasSibling = gridSelectionContext.getHasSibling(props.itemKey);

    const isMountedRef = React.useRef<boolean>(false);

    const [rowSelection, setRowSelection] = React.useState<TRowSelection>({});
    const [columnsToRoot, setColumnsToRoot] = React.useState<Record<TColumnKey, TColumnKey>>({});

    React.useLayoutEffect(() => {
        if (updateHasSiblingForRowSelectionMutable(rowSelection, hasSibling)) {
            setRowSelection({ ...rowSelection });
        }
    }, [hasSibling]);

    React.useLayoutEffect(() => {
        if (isMountedRef.current) {
            setRowSelection({});
            setColumnsToRoot({});
        }
    }, [props.quantum]);

    React.useLayoutEffect(() => {
        if (isMountedRef.current) {
            let changed = false;
            Object.keys(rowSelection).forEach((key) => {
                const gridColumnCSSStyle = getGridColumnCSSStyle(
                    rowSelection[key],
                    gridSelectionContext.columns,
                    props.quantum
                );

                rowSelection[key].gridColumnStart = gridColumnCSSStyle.gridColumnStart;
                rowSelection[key].gridColumnEnd = gridColumnCSSStyle.gridColumnEnd;

                changed = true;
            });
            if (changed) {
                setRowSelection({ ...rowSelection });
            }
        }
    }, [gridSelectionContext.columns]);

    const handleSelection = React.useMemo(() => {
        return (columnKey: TColumnKey) => {
            const isColumnSelected = typeof columnsToRoot[columnKey] !== 'undefined';
            const changedSelections: ISelection[] = [];

            if (!isColumnSelected) {
                const columnIndex = getColumnIndexByKey(
                    columnKey,
                    gridSelectionContext.columns,
                    props.quantum
                );

                const prevColumn = gridSelectionContext.columns[columnIndex - 1];
                const prevColumnKey = prevColumn && prevColumn.getTime();
                const nextColumn = gridSelectionContext.columns[columnIndex + 1];
                const nextColumnKey = nextColumn && nextColumn.getTime();

                changedSelections.push(
                    handleAddToSelectionMutable(
                        rowSelection,
                        columnsToRoot,
                        columnKey,
                        prevColumnKey,
                        nextColumnKey
                    )
                );
            } else {
                const selection = rowSelection[columnsToRoot[columnKey]];

                if (selection.selectedKeys.length === 1) {
                    deleteSelectionMutable(rowSelection, selection, columnsToRoot);
                } else if (selection.lastColumnKey === columnKey) {
                    changedSelections.push(
                        popFromSelectionMutable(rowSelection, selection, columnsToRoot)
                    );
                } else if (selection.firstColumnKey === columnKey) {
                    changedSelections.push(
                        unshiftFromSelectionMutable(rowSelection, selection, columnsToRoot)
                    );
                } else {
                    changedSelections.push(
                        ...splitSelectionMutable(rowSelection, selection, columnsToRoot, columnKey)
                    );
                }
            }

            changedSelections.forEach((s) => {
                const gridColumnCSSStyle = getGridColumnCSSStyle(
                    s,
                    gridSelectionContext.columns,
                    props.quantum
                );

                s.gridColumnStart = gridColumnCSSStyle.gridColumnStart;
                s.gridColumnEnd = gridColumnCSSStyle.gridColumnEnd;
            });

            const newRowSelection = { ...rowSelection };

            const newHasSibling =
                gridSelectionContext.contextRefForHandlersOnly.current.updateRowSelection(
                    props.itemKey,
                    newRowSelection
                );

            updateHasSiblingForRowSelectionMutable(newRowSelection, newHasSibling);

            setRowSelection(newRowSelection);
            setColumnsToRoot({ ...columnsToRoot });
        };
    }, [gridSelectionContext.columns, props.quantum, props.itemKey, rowSelection, columnsToRoot]);

    React.useLayoutEffect(() => {
        isMountedRef.current = true;
    }, []);

    const isSelected = React.useCallback(
        (key: TColumnKey) => {
            return typeof columnsToRoot[key] !== 'undefined';
        },
        [columnsToRoot]
    );

    const value = React.useMemo<IRowSelectionContext>(() => {
        return {
            handleSelection,
            rowSelection,
            isSelected,
        };
    }, [handleSelection, rowSelection, isSelected]);

    return (
        <RowSelectionContext.Provider value={value}>{props.children}</RowSelectionContext.Provider>
    );
});
