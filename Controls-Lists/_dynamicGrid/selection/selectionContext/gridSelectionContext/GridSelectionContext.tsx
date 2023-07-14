import * as React from 'react';
import type { TOffsetSize } from 'Controls/interface';
import type { IContextWithSelfRef } from '../../shared/IContextWithSelfRef';
import type { ISelection, SelectionModel } from '../../SelectionModel';
import type { TColumnKey, TItemKey } from '../../shared/types';
import type { MultiSelectAccessibility } from 'Controls/display';

type TModelMethodReturnType<T extends keyof SelectionModel> = ReturnType<SelectionModel[T]>;

export type TMultiSelectAccessibilityCallback = (
    itemKey: TItemKey,
    columnKey: TColumnKey
) => (typeof MultiSelectAccessibility)[keyof typeof MultiSelectAccessibility];

export interface IGridSelectionContext extends IContextWithSelfRef<IGridSelectionContext> {
    isEnabled: boolean;

    itemsSpacing: TOffsetSize;
    columnsSpacing: TOffsetSize;
    multiSelectAccessibilityCallback: TMultiSelectAccessibilityCallback;

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

    showCellsSelection(itemKey: TItemKey, columnKey: TColumnKey): void;

    changeSelection(oldPartialSelection: ISelection, newPartialSelection: ISelection): void;
}

export const GridSelectionContext = React.createContext<IGridSelectionContext>(undefined);
GridSelectionContext.displayName = 'Controls/dynamicGrid:GridSelectionContext';
