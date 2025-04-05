import * as React from 'react';
import LinearChart, { ILinearChartProps } from 'Controls-Graphs/LinearChart';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { useDataFromSlice, IConnectedGraphProps } from 'Controls-Graphs/data';

/**
 * @public
 * @interface Controls-Graphs/LinearChartConnected/ILinearChartConnectedProps
 * @implements Controls-Graphs/data/IConnectedGraphProps
 * @implements Controls-Graphs/LinearChart/ILinearChartProps
 * @ignoreOptions data
 * Интерфейс, описывающий опции линейного графика, который имеет возможность запрашивать данные из контекста.
 */
export interface ILinearChartConnectedProps
    extends Omit<ILinearChartProps, 'data'>,
        IConnectedGraphProps {}

/**
 * @public
 * @class Controls-Graphs/LinearChartConnected
 * @implements Controls-Graphs/LinearChartConnected/ILinearChartConnectedProps
 * Контрол, линейного графика, который имеет возможность запрашивать данные из контекста.
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
                yAxis={props.yAxis}
            />
        );
    }
);

LinearChartConnected.displayName = 'Controls-Graphs/LinearChartConnected';

export default LinearChartConnected;
