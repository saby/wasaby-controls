import * as React from 'react';
import { TItemKey, TColumnKey, TColumns } from '../interfaces';
import { GridSelectionContext } from '../gridContext/GridSelectionContext';
import { RowSelectionContext, TRowSelection, ISelection, IRowSelectionContext } from './RowSelectionContext';
import { TQuantumType } from '../../render/utils';
import {
    getColumnIndexByKey,
    getGridColumnCSSStyle,
    handleAddToSelectionMutable,
    deleteSelectionMutable,
    popFromSelectionMutable,
    splitSelectionMutable,
    unshiftFromSelectionMutable,
} from './helpers';

export interface IRowSelectionContextProviderProps {
    children: JSX.Element;
    dynamicColumnsGridData: TColumns;
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
        if (!hasSibling) {
            return;
        }

        let isChanged = false;
        Object.keys(hasSibling).forEach((key) => {
            if (
                rowSelection[key].hasBorderTop !== !hasSibling[key].up ||
                rowSelection[key].hasBorderBottom !== !hasSibling[key].down
            ) {
                rowSelection[key].hasBorderTop = !hasSibling[key].up;
                rowSelection[key].hasBorderBottom = !hasSibling[key].down;
                isChanged = true;
            }
        });

        if (isChanged) {
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
                    props.dynamicColumnsGridData,
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
    }, [props.dynamicColumnsGridData]);

    const handleSelection = React.useMemo(() => {
        return (columnKey: TColumnKey) => {
            const isSelected = typeof columnsToRoot[columnKey] !== 'undefined';
            const changedSelections: ISelection[] = [];

            if (!isSelected) {
                const columnIndex = getColumnIndexByKey(
                    columnKey,
                    props.dynamicColumnsGridData,
                    props.quantum
                );

                const prevColumn = props.dynamicColumnsGridData[columnIndex - 1];
                const prevColumnKey = prevColumn && prevColumn.getTime();
                const nextColumn = props.dynamicColumnsGridData[columnIndex + 1];
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
                    props.dynamicColumnsGridData,
                    props.quantum
                );

                s.gridColumnStart = gridColumnCSSStyle.gridColumnStart;
                s.gridColumnEnd = gridColumnCSSStyle.gridColumnEnd;
            });

            const newRowSelection = { ...rowSelection };

            gridSelectionContext.contextRefForHandlersOnly.current.updateRowSelection(props.itemKey, newRowSelection);

            setRowSelection(newRowSelection);
            setColumnsToRoot({ ...columnsToRoot });
        };
    }, [props.dynamicColumnsGridData, props.quantum, props.itemKey, rowSelection, columnsToRoot]);

    React.useLayoutEffect(() => {
        isMountedRef.current = true;
    }, []);

    const isSelected = React.useCallback((key: TColumnKey) => {
        return typeof columnsToRoot[key] !== 'undefined';
    }, [columnsToRoot]);

    const value = React.useMemo<IRowSelectionContext>(() => {
        return {
            handleSelection,
            rowSelection,
            isSelected
        };
    }, [handleSelection, rowSelection, isSelected]);

    return (
        <RowSelectionContext.Provider value={value}>{props.children}</RowSelectionContext.Provider>
    );
});
