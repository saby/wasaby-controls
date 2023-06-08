import * as React from 'react';
import type { TreeGridCollection, ITreeGridOptions } from 'Controls/treeGrid';
import { IGridSelectionContext, GridSelectionContext } from './GridSelectionContext';
import { TGridSelection, TItemKey, TRowSelection, TPlainSelection, TColumns } from '../interfaces';
import {
    convertGridSelectionToPlainRecord,
    convertPlainSelectionToGridSelection,
    isEqualPlainSelections,
    updateHasSiblingMutable,
} from './helpers';
import { TOffsetSize } from 'Controls/interface';

export { TPlainSelection };
export type TOnSelectionChangedCallback = (selection: TPlainSelection) => void;

export interface IGridSelectionContextProviderProps {
    children: JSX.Element;
    collection?: TreeGridCollection;
    columns: TColumns;
    multiSelectVisibility: ITreeGridOptions['multiSelectVisibility'];
    selection: TPlainSelection;
    onSelectionChanged?: TOnSelectionChangedCallback;
    itemsSpacing: TOffsetSize;
}

export const GridSelectionContextProvider = React.memo(
    React.forwardRef(function GridSelectionContextProvider(
        props: IGridSelectionContextProviderProps,
        forwardedRef: React.ForwardedRef<unknown>
    ): JSX.Element {
        const collectionRef = React.useRef(props.collection);
        const contextRefForHandlersOnly = React.useRef<IGridSelectionContext>();

        const [gridSelection, setGridSelection] = React.useState<TGridSelection>(
            convertPlainSelectionToGridSelection(props.selection || {})
        );
        const [gridPlainSelectionState, setGridPlainSelectionState] =
            React.useState<TPlainSelection>({ ...(props.selection || {}) });

        const notifyOnChange = React.useCallback(
            (selection: TPlainSelection) => {
                if (props.onSelectionChanged) {
                    props.onSelectionChanged(selection);
                }
            },
            [props.onSelectionChanged]
        );

        React.useLayoutEffect(() => {
            collectionRef.current = props.collection;
        }, [props.collection]);

        React.useLayoutEffect(() => {
            if (!isEqualPlainSelections(gridPlainSelectionState, props.selection || {})) {
                setGridSelection(convertPlainSelectionToGridSelection(props.selection));
            }
        }, [gridPlainSelectionState, props.selection]);

        const updateRowSelection = React.useCallback(
            (itemKey: TItemKey, rowSelection: TRowSelection) => {
                const item = collectionRef.current.getItemBySourceKey(itemKey);

                const prevItem = item && collectionRef.current.getPrevious(item);
                const nextItem = item && collectionRef.current.getNext(item);

                const prevSelectionKey = prevItem && prevItem.key;
                const prevSelection = gridSelection[prevSelectionKey];

                const nextSelectionKey = nextItem && nextItem.key;
                const nextSelection = gridSelection[nextSelectionKey];

                gridSelection[itemKey] = {
                    rowSelection,
                    hasSibling: {},
                };

                const [isPrevChanged, isNextChanged] = updateHasSiblingMutable(
                    gridSelection[itemKey],
                    prevSelection,
                    nextSelection
                );

                if (isPrevChanged) {
                    gridSelection[prevSelectionKey] = { ...gridSelection[prevSelectionKey] };
                }
                if (isNextChanged) {
                    gridSelection[nextSelectionKey] = { ...gridSelection[nextSelectionKey] };
                }

                if (!rowSelection || !Object.keys(rowSelection).length) {
                    delete gridSelection[itemKey];
                }

                const newGridSelection = { ...gridSelection };
                const newPlainSelection = convertGridSelectionToPlainRecord(newGridSelection);

                setGridSelection(newGridSelection);
                setGridPlainSelectionState(newPlainSelection);

                notifyOnChange(newPlainSelection);

                return gridSelection[itemKey]?.hasSibling;
            },
            [gridSelection]
        );

        const getHasSibling = React.useCallback<IGridSelectionContext['getHasSibling']>(
            (itemKey: TItemKey) => {
                if (!gridSelection[itemKey]) {
                    return undefined;
                }

                return gridSelection[itemKey].hasSibling;
            },
            [gridSelection]
        );

        const contextValue = React.useMemo<IGridSelectionContext>(() => {
            const value: IGridSelectionContext = {
                contextRefForHandlersOnly,
                updateRowSelection,
                itemsSpacing: props.itemsSpacing,
                getHasSibling,
                isEnabled: props.multiSelectVisibility !== 'hidden',
                columns: props.columns,
            };
            contextRefForHandlersOnly.current = value;
            return value;
        }, [
            updateRowSelection,
            getHasSibling,
            props.multiSelectVisibility,
            props.itemsSpacing,
            props.columns,
        ]);

        return (
            <GridSelectionContext.Provider value={contextValue}>
                {React.cloneElement(props.children as JSX.Element, {
                    forwardedRef,
                })}
            </GridSelectionContext.Provider>
        );
    })
);
