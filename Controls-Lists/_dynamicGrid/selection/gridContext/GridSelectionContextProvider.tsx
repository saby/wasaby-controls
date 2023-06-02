import * as React from 'react';
import type { TreeGridCollection, ITreeGridOptions } from 'Controls/treeGrid';
import { IGridSelectionContext, GridSelectionContext } from './GridSelectionContext';
import { TGridSelection, TItemKey, TRowSelection } from '../interfaces';

export interface IGridSelectionContextProviderProps {
    children: JSX.Element;
    collection?: TreeGridCollection;
    multiSelectVisibility: ITreeGridOptions['multiSelectVisibility'];
}

export const GridSelectionContextProvider = React.memo(
    React.forwardRef(function GridSelectionContextProvider(
        props: IGridSelectionContextProviderProps,
        forwardedRef: React.ForwardedRef<unknown>
    ): JSX.Element {
        const collectionRef = React.useRef(props.collection);
        const contextRefForHandlersOnly = React.useRef<IGridSelectionContext>();

        const [gridSelection, setGridSelection] = React.useState<TGridSelection>({});

        React.useLayoutEffect(() => {
            collectionRef.current = props.collection;
        }, [props.collection]);

        const updateRowSelection = React.useCallback(
            (itemKey: TItemKey, rowSelection: TRowSelection) => {
                // const item = collectionRef.current.getItemBySourceKey(itemKey);

                // const prevItem = item && collectionRef.current.getPrevious(item);
                // const nextItem = item && collectionRef.current.getNext(item);
                //
                // const prevSelection = gridSelection[prevItem && prevItem.key];
                // const nextSelection = gridSelection[nextItem && nextItem.key];

                if (!rowSelection || !Object.keys(rowSelection).length) {
                    delete gridSelection[itemKey];
                    setGridSelection({ ...gridSelection });
                } else {
                    const hasSiblingSelection = {};

                    Object.keys(rowSelection).forEach((key) => {
                        hasSiblingSelection[key] = {
                            up: false,
                            down: false,
                        };
                    });

                    setGridSelection({
                        ...gridSelection,
                        [itemKey]: {
                            rowSelection,
                            hasSibling: hasSiblingSelection,
                        },
                    });
                }
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
                getHasSibling,
                isEnabled: props.multiSelectVisibility !== 'hidden'
            };
            contextRefForHandlersOnly.current = value;
            return value;
        }, [updateRowSelection, getHasSibling, props.multiSelectVisibility]);

        return (
            <GridSelectionContext.Provider value={contextValue}>
                {React.cloneElement(props.children as JSX.Element, {
                    forwardedRef,
                })}
            </GridSelectionContext.Provider>
        );
    })
);
