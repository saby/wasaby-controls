import * as React from 'react';
import { Collection as ICollection } from 'Controls/display';
import { TKey } from 'Controls/interface';
import { listActions, ListSlice } from 'Controls/dataFactory';
import { INewListSchemeHandlers } from './INewListScheme';
import { CommonUILogic } from 'Controls/abstractListAspect';
import { ExpandCollapseUILogic } from 'Controls/expandCollapseListAspect';
import { MarkerUILogic } from 'Controls/markerListAspect';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import {
    executeAction,
    getHandlers as getActionsHandlers,
} from 'Controls/_baseList/Data/aspects/ItemActionsNew';
import { IGetHandlersProps } from 'Controls/_baseList/Data/IGetHandlersProps';

export function getHandlers(props: IGetHandlersProps): INewListSchemeHandlers {
    const { slice, changeRootByItemClick, context } = props;

    const mark: INewListSchemeHandlers['mark'] = (itemKey: TKey): void => {
        slice.mark(itemKey);
    };

    return {
        setCollection(collection: ICollection, isOnInitInOldLists?: boolean): boolean {
            return slice.setCollection(collection, isOnInitInOldLists);
        },
        mark,
        onCheckboxClickNew(itemKey: TKey): void {
            slice.select(itemKey);
        },
        onItemClickNew(itemKey: TKey, params): void {
            listActions.onItemClick(slice, itemKey, {
                changeRootByItemClick,
                ...params,
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
            slice.expand(itemKey, params);
        },
        collapse(itemKey: TKey, params): void {
            slice.collapse(itemKey, params);
        },
        resetExpansion(): void {
            slice.resetExpansion();
        },
        // TODO: Убрать отсюда всё, что в новом списке не нужно, здесь должен быть только чистый код.
        onActivated(
            params: {
                isTabPressed: boolean;
                isShiftKey: boolean;
                key?: React.KeyboardEvent['key'];
            },
            canMarkItemOnActivate: () => boolean = () => true,
            markMethod: INewListSchemeHandlers['mark'] = mark
        ) {
            if (
                (params.key === 'Tab' || params.key === 'Enter') &&
                slice.state.markerVisibility === 'onactivated' &&
                slice.state.items &&
                slice.state.items.getCount() &&
                canMarkItemOnActivate()
            ) {
                const collection = slice._collection;
                const item = params.isShiftKey ? collection.getLast() : collection.getFirst();
                markMethod(item.key);
            }
        },
        onViewKeyDownArrowUpNew(e) {
            e.stopPropagation();
            e.preventDefault();

            slice.mark(
                MarkerUILogic.getMarkerStrategy(slice._collection).getMarkedKeyByDirection(
                    slice.state,
                    slice._collection,
                    'Up'
                )
            );
        },
        onViewKeyDownArrowDownNew(e) {
            e.stopPropagation();
            e.preventDefault();

            const strategy = MarkerUILogic.getMarkerStrategy(slice._collection);
            slice.mark(strategy.getMarkedKeyByDirection(slice.state, slice._collection, 'Down'));
        },
        onViewKeyDownArrowLeftNew() {
            toggleMarkedNode(slice, 'collapse');
        },
        onViewKeyDownArrowRightNew() {
            toggleMarkedNode(slice, 'expand');
        },
        onViewMouseDownSpaceNew(e) {
            e.stopPropagation();
            e.preventDefault();
            slice.select(slice.state.markedKey);
            slice.mark(
                MarkerUILogic.getMarkerStrategy(slice._collection).getNextMarkedKey(
                    slice.state,
                    slice.collection
                )
            );
        },
        onViewKeyDownDelNew(e) {
            // todo: В будущем для выполнения действий над записями
            //  будут использоваться Actions на слайсе.
            //  Тогда тут нужно будет учесть выполнение этих действий.
            if (slice.state.listActions?.length) {
                const actionParams = {
                    id: 'remove',
                    actionName: 'Controls/actions:Remove',
                };
                const actionOptions = slice.state.listActions.find((item) => {
                    return (
                        item.id === actionParams.id || item.actionName === actionParams.actionName
                    );
                });
                if (actionOptions) {
                    loadAsync('Controls/actions').then(({ createAction }) => {
                        const action = createAction(actionOptions.actionName, actionOptions);
                        executeAction(action, actionOptions, slice, context, e);
                    });
                }
            }
        },
        onViewTriggerVisibilityChanged(position, state) {
            // todo: Должен отрабатывать на первом этапе только для новейшего списка.
            //  В дальнейшем данная строчка будет убрана, код вызова триггера будет единым.
            if (!slice.state.collectionType) {
                return;
            }
            // todo Сюда нужно добавить код, вызывающий загрузку вперед или назад (в зависимости от сработавшего триггера)
            if (state) {
                if (position === 'bottom') {
                    slice.next();
                }
                if (position === 'top') {
                    slice.prev();
                }
            }
        },
        ...getActionsHandlers(props),
    };
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
