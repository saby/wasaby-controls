import * as React from 'react';
import { TQuantumType } from 'Controls-Lists/dynamicGrid';

export interface IAggregationContext {
    isShown: boolean;
    quantum: TQuantumType;
    setQuantum: (quantum: TQuantumType) => void;
    columnRender?: JSX.Element;
    range: {
        start: Date;
        end: Date;
    };
    dynamicColumnsGridData: Date[];
}

function emptyFunction(): void {
    return;
}

export const AggregationContext = React.createContext<IAggregationContext>({
    isShown: false,
    quantum: 'hour',
    setQuantum: emptyFunction,
    range: {
        start: new Date(),
        end: new Date(),
    },
    dynamicColumnsGridData: [],
});
