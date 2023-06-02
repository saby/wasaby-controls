import * as React from 'react';
import { IContextWithSelfRef, TColumnKey, TItemKey, TRowSelection } from '../interfaces';

export interface IGridSelectionContext extends IContextWithSelfRef<IGridSelectionContext> {
    isEnabled: boolean;

    updateRowSelection(itemKey: TItemKey, rowSelection: TRowSelection): void;

    getHasSibling(itemKey: TItemKey): Record<TColumnKey, { up: boolean; down: boolean }>;
}

export const GridSelectionContext = React.createContext<IGridSelectionContext>(undefined);
GridSelectionContext.displayName = 'Controls/dynamicGrid:GridSelectionContext';
