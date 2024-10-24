/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { IGridSelectionContext } from '../gridSelectionContext/GridSelectionContext';
import { IContextWithSelfRef } from '../../shared/IContextWithSelfRef';
import { TColumnKey, TItemKey } from '../../shared/types';
import { IBorderRadius } from 'Controls-Lists/_dynamicGrid/selection/components/SelectionHighlight';

export interface IRowSelectionContext
    extends IContextWithSelfRef<IRowSelectionContext>,
        Pick<
            IGridSelectionContext,
            'isEnabled' | 'isSelectionInitialized' | 'itemsSpacing' | 'columnsSpacing'
        > {
    itemKey: TItemKey;

    borderRadius: IBorderRadius;

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
