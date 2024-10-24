/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import type { TOffsetSize } from 'Controls/interface';
import type { IContextWithSelfRef } from '../../shared/IContextWithSelfRef';
import type { ISelection, SelectionModel } from '../../SelectionModel';
import type { TColumnKey, TItemKey } from '../../shared/types';
import type { TCellsMultiSelectAccessibilityCallback } from '../../shared/interface';

type TModelMethodReturnType<T extends keyof SelectionModel> = ReturnType<SelectionModel[T]>;

type TShowCellsSelectionArgsVariants = {
    NOTHING: [];
    ALL: [itemKey: TItemKey, columnKey: TColumnKey];
};
type TShowCellsSelectionArgs =
    TShowCellsSelectionArgsVariants[keyof TShowCellsSelectionArgsVariants];

export interface IGridSelectionContext extends IContextWithSelfRef<IGridSelectionContext> {
    isEnabled: boolean;
    itemsSpacing: TOffsetSize;
    columnsSpacing: TOffsetSize;
    multiSelectAccessibilityCallback: TCellsMultiSelectAccessibilityCallback;

    isSelectionInitialized: boolean;

    initializeSelection(): void;

    isSelected(itemKey: TItemKey, columnKey: TColumnKey): TModelMethodReturnType<'isSelected'>;

    getRowSelectionModel(itemKey: TItemKey): TModelMethodReturnType<'getRowSelectionModel'>;

    getCellsSelectionModel(
        itemKey: TItemKey,
        columnKey: TColumnKey
    ): TModelMethodReturnType<'getCellsSelectionModel'>;

    getBoundingSelectionKeys(
        itemKey: TItemKey,
        columnKey: TColumnKey
    ): TModelMethodReturnType<'getBoundingSelectionKeys'>;

    handleSelection(itemKey: TItemKey, columnKey: TColumnKey): void;

    hideCellsSelection(itemKey: TItemKey, columnKey: TColumnKey): void;

    showCellsSelection(...args: TShowCellsSelectionArgs): void;

    changeSelection(oldPartialSelection: ISelection, newPartialSelection: ISelection): void;
}

export const GridSelectionContext = React.createContext<IGridSelectionContext>(undefined);
GridSelectionContext.displayName = 'Controls/dynamicGrid:GridSelectionContext';
