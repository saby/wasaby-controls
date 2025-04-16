import * as React from 'react';
import RoundChart, { IRoundChartProps } from 'Controls-Graphs/RoundChart';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { useDataFromSlice, IStoreId } from 'Controls-Graphs/data';
import 'css!Controls-Graphs/RoundChart';
export interface IRoundChartConnectedProps extends IRoundChartProps, IStoreId {
    hasDataCallback?: Function;
}

const RoundChartConnected = React.forwardRef(
    (props: IRoundChartConnectedProps, ref: React.Ref<HTMLDivElement>) => {
        const { legendVisible = false, type = 'donut', size = 's' } = props;
        const {
            data,
            series,
        }: {
            data: ISingleItem[];
            series: ISingleSeriesItem[];
        } = useDataFromSlice(props.storeId, props.series, props.name);
        return (
            <RoundChart
                ref={ref}
                legendVisible={legendVisible}
                legendHorizontalAlignment={props.legendHorizontalAlignment}
                legendVerticalPosition={props.legendVerticalPosition}
                data={data}
                series={series}
                type={type}
                className={`${props.className} controls-Graphs_RoundChartConnected controls-Graphs__roundChart-size-${size}`}
            />
        );
    }
);

export default RoundChartConnected;
