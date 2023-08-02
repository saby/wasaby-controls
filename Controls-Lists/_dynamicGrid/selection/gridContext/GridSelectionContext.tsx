import * as React from 'react';
import {
    IContextWithSelfRef,
    TColumns,
    THasSiblingForRowSelection,
    TItemKey,
    TRowSelection,
} from '../interfaces';
import { TOffsetSize } from 'Controls/interface';

export interface IGridSelectionContext extends IContextWithSelfRef<IGridSelectionContext> {
    isEnabled: boolean;

    itemsSpacing: TOffsetSize;
    columns: TColumns;

    updateRowSelection(itemKey: TItemKey, rowSelection: TRowSelection): THasSiblingForRowSelection;

    getHasSibling(itemKey: TItemKey): THasSiblingForRowSelection;
}

export const GridSelectionContext = React.createContext<IGridSelectionContext>(undefined);
GridSelectionContext.displayName = 'Controls/dynamicGrid:GridSelectionContext';
