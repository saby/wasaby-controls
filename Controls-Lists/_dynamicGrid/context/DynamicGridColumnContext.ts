import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { TColumnWidth } from 'Controls/gridReact';

export interface IDynamicGridColumnContextValue {
    columnIndex: number;
    renderData?: RecordSet;
    columnWidth?: TColumnWidth;
}

export const DynamicGridColumnContext =
    React.createContext<IDynamicGridColumnContextValue>(undefined);
DynamicGridColumnContext.displayName = 'Controls/dynamicGrid:DynamicGridColumnContext';
