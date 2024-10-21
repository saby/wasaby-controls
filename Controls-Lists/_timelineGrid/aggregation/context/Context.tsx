import * as React from 'react';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

export interface IAggregationContext {
    isShown: boolean;
    quantum: Quantum;
    setQuantum: (quantum: Quantum) => void;
    columnRender?: JSX.Element;
    range: IRange;
    dynamicColumnsGridData: Date[];
}

function emptyFunction(): void {
    return;
}

export const AggregationContext = React.createContext<IAggregationContext>({
    isShown: false,
    quantum: 'hour' as Quantum,
    setQuantum: emptyFunction,
    range: {
        start: new Date(),
        end: new Date(),
    },
    dynamicColumnsGridData: [],
});
