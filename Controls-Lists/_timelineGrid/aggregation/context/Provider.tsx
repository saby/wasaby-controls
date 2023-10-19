import * as React from 'react';
import { AggregationContext, IAggregationContext } from './Context';
import { TQuantumType } from 'Controls-Lists/dynamicGrid';

export type TProviderProps = {
    isShown: boolean;
    children: JSX.Element;
    columnRender?: JSX.Element;
    range: IAggregationContext['range'];
    dynamicColumnsGridData: Date[];
};

function Provider({
    columnRender,
    range,
    isShown,
    children,
    dynamicColumnsGridData,
}: TProviderProps): JSX.Element {
    const [quantum, setQuantum] = React.useState<TQuantumType>('hour');

    const value = React.useMemo<IAggregationContext>(
        () => ({
            isShown,
            columnRender,
            quantum,
            setQuantum,
            range,
            dynamicColumnsGridData,
        }),
        [columnRender, isShown, quantum, range, dynamicColumnsGridData]
    );
    return <AggregationContext.Provider value={value}>{children}</AggregationContext.Provider>;
}

const ProviderMemo = React.memo(Provider);
export default ProviderMemo;
