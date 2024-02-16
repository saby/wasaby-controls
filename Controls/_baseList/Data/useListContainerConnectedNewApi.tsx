import * as React from 'react';
import { Collection as ICollection } from 'Controls/display';
import { TKey } from 'Controls/_interface/IItems';
import { ListSlice } from 'Controls/dataFactory';
import { listActions } from 'Controls/_dataFactory/AbstractList/listActions';
import { INewListSchemeHandlers } from './INewListScheme';
import { CommonUILogic } from 'Controls/abstractListAspect';
import { ExpandCollapseUILogic } from 'Controls/expandCollapseListAspect';
import { MarkerUILogic } from 'Controls/markerListAspect';
import { TListTriggerPosition } from 'Controls/interface';

export interface IGetHandlersProps {
    slice: ListSlice;
    changeRootByItemClick?: boolean;
}
export function getHandlers({
    slice,
    changeRootByItemClick,
}: IGetHandlersProps): INewListSchemeHandlers {
    return {
        setCollection(collection: ICollection) {
            slice.setCollection(collection);
        },
        onCheckboxClickNew(itemKey: TKey): void {
            slice.select(itemKey);
        },
        onItemClickNew(itemKey: TKey): void {
            listActions.onItemClick(slice, itemKey, {
                changeRootByItemClick,
            });
        },
        onExpanderClick(itemKey: TKey, params): void {
            listActions.toggleExpansion(slice, itemKey, params);
        },
        toggleExpansion(itemKey: TKey): void {
            listActions.toggleExpansion(slice, itemKey);
        },
        isExpanded(itemKey: TKey): boolean {
            return ExpandCollapseUILogic.isExpanded(slice.state, itemKey);
        },
        isExpandAll(): boolean {
            return ExpandCollapseUILogic.isExpandAll(slice.state);
        },
        expand(itemKey: TKey, params): void {
            if (!ExpandCollapseUILogic.isExpanded(slice.state, itemKey)) {
                slice.expand(itemKey, params);
            }
        },
        collapse(itemKey: TKey, params): void {
            if (ExpandCollapseUILogic.isExpanded(slice.state, itemKey)) {
                slice.collapse(itemKey, params);
            }
        },
        resetExpansion(): void {
            slice.resetExpansion();
        },
        onViewMouseDownArrowUpNew(e) {
            e.stopPropagation();
            e.preventDefault();

            slice.mark(
                MarkerUILogic.getMarkerStrategy(slice.collection).getMarkedKeyByDirection(
                    slice.state,
                    slice.collection,
                    'Up'
                )
            );
        },
        onViewMouseDownArrowDownNew(e) {
            e.stopPropagation();
            e.preventDefault();

            const strategy = MarkerUILogic.getMarkerStrategy(slice.collection);
            slice.mark(
                // TODO: Пофиксить двойной вызов
                strategy.getMarkedKeyByDirection(
                    {
                        ...slice.state,
                        markedKey: strategy.getMarkedKeyByDirection(
                            slice.state,
                            slice.collection,
                            'Down'
                        ),
                    },
                    slice.collection,
                    'Down'
                )
            );
        },
        onViewMouseDownArrowLeftNew() {
            toggleMarkedNode(slice, 'collapse');
        },
        onViewMouseDownArrowRightNew() {
            toggleMarkedNode(slice, 'expand');
        },
        onViewMouseDownSpaceNew(e) {
            e.stopPropagation();
            e.preventDefault();
            slice.select(slice.state.markedKey);
            slice.mark(
                MarkerUILogic.getMarkerStrategy(slice.collection).getNextMarkedKey(
                    slice.state,
                    slice.collection
                )
            );
        },
        onViewTriggerVisibilityChanged(position, state) {
            viewTriggerVisibilityChanged(slice, position, state);
        },
    };
}

function viewTriggerVisibilityChanged(
    slice: ListSlice,
    position: TListTriggerPosition,
    state: boolean
) {
    // todo Сюда нужно добавить код, вызывающий загрузку вперед или назад (в зависимости от сработавшего триггера)
    if (state) {
        if (position === 'bottom') {
            slice.next();
        }
        if (position === 'top') {
            slice.prev();
        }
    }
}

function toggleMarkedNode(slice: ListSlice, action: 'expand' | 'collapse') {
    const { markerVisibility, markedKey } = slice.state;

    if (markerVisibility !== 'hidden' && CommonUILogic.isNode(slice.state, markedKey)) {
        const isExpanded = ExpandCollapseUILogic.isExpanded(slice.state, markedKey);
        if (action === 'expand' && !isExpanded) {
            slice.expand(markedKey);
        } else if (action === 'collapse' && isExpanded) {
            slice.collapse(markedKey);
        }
    }
}

export function useHandlers(props: IGetHandlersProps) {
    return React.useMemo<INewListSchemeHandlers>(
        () => getHandlers(props),
        [props.slice, props.changeRootByItemClick]
    );
}
