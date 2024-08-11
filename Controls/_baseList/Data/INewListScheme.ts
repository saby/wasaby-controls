/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type * as React from 'react';
import type { CrudEntityKey } from 'Types/source';
import type { Collection } from 'Controls/display';
import type { TTriggerVisibilityChangedCallback } from 'Controls/gridReact';
import type { IItemAction, INavigationSourceConfig } from 'Controls/interface';
import type { Model } from 'Types/entity';
import type { RecordSet } from 'Types/collection';
import type { ScrollControllerLib } from 'Controls/listsCommonLogic';

export interface INewListSchemeProps {
    useCollection: boolean;
    hasSlice?: boolean;
    loading: boolean;
}

export type TOnToggleExpansionParams = {
    markItem?: boolean;
};

export interface INewListSchemeActionsHandlers {
    onActionClickNew(
        action: IItemAction,
        item: Model,
        container: HTMLDivElement,
        nativeEvent: MouseEvent
    ): void;
}

/**
 * @private
 * Интерфейс взаимодействия списка с внешним контроллером
 */
export interface INewListSchemeHandlers {
    setCollection(collection: Collection, isOnInitInOldLists?: boolean): boolean;

    mark(itemKey: CrudEntityKey): void;

    // Удалить
    isExpanded(itemKey: CrudEntityKey): boolean;

    // Удалить
    isExpandAll(): boolean;

    toggleExpansion(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;

    collapse(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;

    expand(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;

    reload(sourceConfig?: INavigationSourceConfig, keepNavigation?: boolean): Promise<unknown>;

    _loadItemsToDirection(
        direction: ScrollControllerLib.IDirection,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean
    ): Promise<RecordSet | Error>;

    _setPreloadedItems(items: RecordSet, direction: ScrollControllerLib.IDirection): Promise<void>;

    resetExpansion(): void;

    /**
     * @param params
     * @param canMarkItemOnActivate Определяет, следует ли ставить маркер на первую запись при активации списка.
     * Работает в контексте работы с клавиатуры (WorkByKeyboardContext).
     * @param mark
     */
    onActivated(
        params: {
            isTabPressed: boolean;
            isShiftKey: boolean;
            key?: React.KeyboardEvent['key'];
        },
        canMarkItemOnActivate?: () => boolean,
        mark?: INewListSchemeHandlers['mark']
    ): void;

    onCheckboxClickNew(itemKey: CrudEntityKey): void;

    onItemClickNew(itemKey: CrudEntityKey, params?: unknown): void;

    onExpanderClick(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;

    onItemKeyDownEnterNew(e: React.KeyboardEvent): void;

    onViewKeyDownArrowUpNew(e: React.KeyboardEvent): void;

    onViewKeyDownArrowDownNew(e: React.KeyboardEvent): void;

    onViewKeyDownArrowLeftNew(e: React.KeyboardEvent): void;

    onViewKeyDownArrowRightNew(e: React.KeyboardEvent): void;

    onViewKeyDownDelNew(e: React.KeyboardEvent): void;

    onViewKeyDownSpaceNew(e: React.KeyboardEvent): void;

    onViewTriggerVisibilityChanged: TTriggerVisibilityChangedCallback;
}
