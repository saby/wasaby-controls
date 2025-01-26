import * as React from 'react';
import LinearChart, { ILinearChartProps } from 'Controls-Graphs/LinearChart';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { useDataFromSlice, IStoreId } from 'Controls-Graphs/data';

export interface ILinearChartConnectedProps extends ILinearChartProps, IStoreId {
    style: object;
    hasDataCallback?: (data?: ISingleItem[]) => void;
}

const LinearChartConnected = React.forwardRef(
    (props: ILinearChartConnectedProps, ref: React.Ref<HTMLDivElement>) => {
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
            <LinearChart
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

LinearChartConnected.displayName = 'Controls-Graphs/LinearChartConnected';

export default LinearChartConnected;
