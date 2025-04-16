import * as React from 'react';
import LinearChart from 'Controls-Graphs/LinearChart';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { useDataFromSlice } from 'Controls-Graphs/data';
import IConnectedGraphProps from 'Controls-Graphs/interfaces/IConnectedGraphProps';
import ILinearChartProps from 'Controls-Graphs/interfaces/ILinearChartProps';

/**
 * Интерфейс, описывающий опции линейного графика, который имеет возможность запрашивать данные из контекста.
 * @public
 */
export interface ILinearChartConnectedProps
    extends Omit<ILinearChartProps, 'data'>,
        IConnectedGraphProps {}

/**
 * Контрол, линейного графика, который имеет возможность запрашивать данные из контекста.
 * @public
 * @class Controls-Graphs/LinearChartConnected
 * @implements Controls-Graphs/interfaces/ILinearChartProps
 * @implements Controls-Graphs/interfaces/IConnectedGraphProps
 * @ignoreOptions data
 * @demo Controls-Graphs-demo/LinearChartConnected/Items/Index
 * @demo Controls-Graphs-demo/LinearChartConnected/Source/Index
 */
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
        return (
            <LinearChart
                ref={ref}
                legendVisible={legendVisible}
                legendHorizontalAlignment={props.legendHorizontalAlignment}
                legendVerticalPosition={props.legendVerticalPosition}
                data={data}
                series={series}
                className={props.className}
                yAxis={props.yAxis}
                config={props.config}
            />
        );
    }
);

LinearChartConnected.displayName = 'Controls-Graphs/LinearChartConnected';

export default LinearChartConnected;
