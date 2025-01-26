import * as React from 'react';
import RoundChart, { IRoundChartProps } from 'Controls-Graphs/RoundChart';
import { ISingleItem } from 'Controls-Graphs/base';
import { useDataFromSlice, IStoreId } from 'Controls-Graphs/data';

export interface IRoundChartConnectedProps extends IRoundChartProps, IStoreId {}

const RoundChartConnected = React.forwardRef(
    (props: IRoundChartConnectedProps, ref: React.Ref<HTMLDivElement>) => {
        const data: ISingleItem[] = useDataFromSlice(props.storeId, props.series);
        return (
            <RoundChart
                ref={ref}
                legendVisible={props.legendVisible}
                legendHorizontalAlignment={props.legendHorizontalAlignment}
                legendVerticalPosition={props.legendVerticalPosition}
                data={data}
                series={props.series}
            />
        );
    }
);

export default RoundChartConnected;
