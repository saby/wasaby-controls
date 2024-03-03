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
    setCollection(collection: Collection): void;

    // Удалить
    isExpanded(itemKey: CrudEntityKey): boolean;
    // Удалить
    isExpandAll(): boolean;

    toggleExpansion(itemKey: CrudEntityKey): void;
    collapse(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;
    expand(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;
    resetExpansion(): void;

    onCheckboxClickNew(itemKey: CrudEntityKey): void;
    onItemClickNew(itemKey: CrudEntityKey, params?: unknown): void;
    onExpanderClick(itemKey: CrudEntityKey, props?: TOnToggleExpansionParams): void;
    onViewMouseDownArrowUpNew(e: React.KeyboardEvent): void;
    onViewMouseDownArrowDownNew(e: React.KeyboardEvent): void;
    onViewMouseDownArrowLeftNew(e: React.KeyboardEvent): void;
    onViewMouseDownArrowRightNew(e: React.KeyboardEvent): void;
    onViewMouseDownSpaceNew(e: React.KeyboardEvent): void;

    onViewTriggerVisibilityChanged: TTriggerVisibilityChangedCallback;
}
