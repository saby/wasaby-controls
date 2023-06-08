import * as React from 'react';
import { ISelection, TRowSelection, TColumnKey } from '../interfaces';

export { ISelection, TRowSelection };

export interface IRowSelectionContext {
    rowSelection: TRowSelection;

    isSelected(columnKey: TColumnKey): boolean;

    handleSelection(columnKey: TColumnKey): void;
}

export const RowSelectionContext = React.createContext<IRowSelectionContext>(undefined);
RowSelectionContext.displayName = 'Controls/dynamicGrid:RowSelectionContext';
