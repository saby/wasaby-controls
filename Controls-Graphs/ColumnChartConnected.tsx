import * as React from 'react';
import ColumnChart, { IColumnChartProps } from 'Controls-Graphs/ColumnChart';
import { useDataFromSlice, IStoreId } from 'Controls-Graphs/data';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

export interface IColumnChartConnectedProps extends IColumnChartProps, IStoreId {}

const ColumnChartConnected = React.forwardRef(
    (props: IColumnChartConnectedProps, ref: React.Ref<HTMLDivElement>) => {
        const { legendVisible = false } = props;
        const {
            data,
            series,
        }: {
            data: ISingleItem[];
            series: ISingleSeriesItem[];
        } = useDataFromSlice(props.storeId, props.series, props.name);
        React.useEffect(() => {
            props.hasDataCallback?.(data);
        }, [data]);
        return (
            <ColumnChart
                ref={ref}
                legendVisible={legendVisible}
                legendHorizontalAlignment={props.legendHorizontalAlignment}
                legendVerticalPosition={props.legendVerticalPosition}
                data={data}
                series={series}
                className={props.className}
                style={props.style}
                yAxis={props.yAxis}
            />
        );
    }
);

ColumnChartConnected.displayName = 'Controls-Graphs/ColumnChartConnected';

export default ColumnChartConnected;
