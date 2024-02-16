import * as React from 'react';
import { IGridSelectionContext } from '../gridSelectionContext/GridSelectionContext';
import { IContextWithSelfRef } from '../../shared/IContextWithSelfRef';
import { TColumnKey, TItemKey } from '../../shared/types';

export interface IRowSelectionContext
    extends IContextWithSelfRef<IRowSelectionContext>,
        Pick<
            IGridSelectionContext,
            'isEnabled' | 'isSelectionInitialized' | 'itemsSpacing' | 'columnsSpacing'
        > {
    itemKey: TItemKey;

    getMultiSelectAccessibility(
        columnKey: TColumnKey
    ): ReturnType<IGridSelectionContext['multiSelectAccessibilityCallback']>;

    isSelected(columnKey: TColumnKey): ReturnType<IGridSelectionContext['isSelected']>;

    handleSelection(columnKey: TColumnKey): ReturnType<IGridSelectionContext['handleSelection']>;

    getRowSelectionModel(): ReturnType<IGridSelectionContext['getRowSelectionModel']>;

    getCellsSelectionModel(
        columnKey: TColumnKey
    ): ReturnType<IGridSelectionContext['getCellsSelectionModel']>;

    getBoundingSelectionKeys(
        columnKey: TColumnKey
    ): ReturnType<IGridSelectionContext['getBoundingSelectionKeys']>;
}

export const RowSelectionContext = React.createContext<IRowSelectionContext>(undefined);
RowSelectionContext.displayName = 'Controls/dynamicGrid:RowSelectionContext';
