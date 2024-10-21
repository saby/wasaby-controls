/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { Collection as ICollection } from 'Controls/display';
import { INavigationSourceConfig, TKey } from 'Controls/interface';
import { INewListSchemeHandlers } from '../INewListScheme';
import { ExpandCollapseUILogic } from 'Controls/listAspects';
import { IGetHandlersProps } from './IGetHandlersProps';
import type { RecordSet } from 'Types/collection';
import { type ScrollControllerLib, hooks } from 'Controls/listsCommonLogic';

const { getRenderHandlers } = hooks;

export function getHandlersNew(props: IGetHandlersProps): INewListSchemeHandlers {
    const { slice, context } = props;

    const mark: INewListSchemeHandlers['mark'] = (itemKey: TKey): void => {
        slice.mark(itemKey);
    };

    // ЧИСТОЕ VIEW MODEL RENDER API
    const renderHandlers = getRenderHandlers(
        {
            current: slice,
        },
        {
            current: slice.state,
        },
        {
            current: props,
        },
        {
            current: {
                ...props,
                sliceForOldItemActions: slice,
                contextForOldItemActions: context,
            },
        }
    );

    return {
        // =========== ИСПОЛЬЗУЕМ ЧИСТОЕ VIEW MODEL API ===========
        onCheckboxClickNew: renderHandlers.onCheckboxClick,
        onItemClickNew: renderHandlers.onItemClick,

        onActionClickNew: renderHandlers.onActionClick,

        onViewKeyDownArrowUpNew: renderHandlers.onViewKeyDownArrowUp,
        onViewKeyDownArrowDownNew: renderHandlers.onViewKeyDownArrowDown,
        onViewKeyDownArrowLeftNew: renderHandlers.onViewKeyDownArrowLeft,
        onViewKeyDownArrowRightNew: renderHandlers.onViewKeyDownArrowRight,
        onViewKeyDownSpaceNew: renderHandlers.onViewKeyDownSpace,
        onViewKeyDownDelNew: renderHandlers.onViewKeyDownDel,

        onExpanderClick(itemKey: TKey, params): void {
            renderHandlers.onExpanderClick(
                {},
                slice._collection.getItemBySourceKey(itemKey, false),
                params
            );
        },
        toggleExpansion(itemKey: TKey): void {
            renderHandlers.onExpanderClick(
                {},
                slice._collection.getItemBySourceKey(itemKey, false)
            );
        },
        onItemKeyDownEnterNew(e): void {
            renderHandlers.onItemKeyDownEnter(
                e,
                slice._collection.getItemBySourceKey(slice.state.markedKey)
            );
        },

        // =========== ИСПОЛЬЗУЕМ ЧИСТОЕ VIEW MODEL RENDER API ===========

        setCollection(collection: ICollection, isOnInitInOldLists?: boolean): boolean {
            return slice.setCollection(collection, isOnInitInOldLists);
        },
        mark,

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
        reload(sourceConfig?: INavigationSourceConfig, keepNavigation?: boolean): Promise<unknown> {
            return slice.reload(sourceConfig, keepNavigation);
        },
        _loadItemsToDirection(
            direction: ScrollControllerLib.IDirection,
            addItemsAfterLoad?: boolean,
            useServicePool?: boolean
        ): Promise<RecordSet | Error> {
            return slice._loadItemsToDirection(direction, addItemsAfterLoad, useServicePool);
        },
        _setPreloadedItems(
            items: RecordSet,
            direction: ScrollControllerLib.IDirection
        ): Promise<void> {
            return slice._setPreloadedItems(items, direction);
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
                (typeof slice.state.markedKey === 'undefined' || slice.state.markedKey === null) &&
                slice.state.items &&
                slice.state.items.getCount() &&
                canMarkItemOnActivate()
            ) {
                const collection = slice._collection;
                const item = params.isShiftKey ? collection.getLast() : collection.getFirst();
                markMethod(item.key);
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
    };
}

export function useHandlersNew(props: IGetHandlersProps) {
    return React.useMemo<INewListSchemeHandlers>(
        () => getHandlersNew(props),
        [props.slice, props.changeRootByItemClick]
    );
}
