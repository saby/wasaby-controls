import * as React from 'react';
import ColumnChart, { IColumnChartProps } from 'Controls-Graphs/ColumnChart';
import { useDataFromSlice, IStoreId } from 'Controls-Graphs/data';

export interface IColumnChartConnectedProps extends IColumnChartProps, IStoreId {}

const ColumnChartConnected = React.forwardRef(
    (props: IColumnChartConnectedProps, ref: React.Ref<HTMLDivElement>) => {
        const data = useDataFromSlice(props.storeId, props.series);
        return (
            <ColumnChart
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

export default ColumnChartConnected;
