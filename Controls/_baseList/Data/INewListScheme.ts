import type * as React from 'react';
import type { CrudEntityKey } from 'Types/source';
import type { Collection } from 'Controls/display';
import type { TTriggerVisibilityChangedCallback } from 'Controls/gridReact';

export interface INewListSchemeProps {
    useCollection: boolean;
    hasSlice?: boolean;
    loading: boolean;
}

export type TOnToggleExpansionParams = {
    markItem?: boolean;
};

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
    onViewKeyDownArrowUpNew(e: React.KeyboardEvent): void;
    onViewKeyDownArrowDownNew(e: React.KeyboardEvent): void;
    onViewKeyDownArrowLeftNew(e: React.KeyboardEvent): void;
    onViewKeyDownArrowRightNew(e: React.KeyboardEvent): void;
    onViewKeyDownDelNew(e: React.KeyboardEvent): void;
    onViewMouseDownSpaceNew(e: React.KeyboardEvent): void;

    onViewTriggerVisibilityChanged: TTriggerVisibilityChangedCallback;
}
