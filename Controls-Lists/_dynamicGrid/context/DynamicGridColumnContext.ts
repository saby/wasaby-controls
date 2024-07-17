import * as React from 'react';
import { RecordSet } from 'Types/collection';

export interface IDynamicGridColumnContextValue {
    columnIndex: number;
    renderData?: RecordSet;
}

export const DynamicGridColumnContext =
    React.createContext<IDynamicGridColumnContextValue>(undefined);
DynamicGridColumnContext.displayName = 'Controls/dynamicGrid:DynamicGridColumnContext';
