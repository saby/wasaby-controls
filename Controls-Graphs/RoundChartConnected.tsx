import * as React from 'react';
import RoundChart, { IRoundChartProps } from 'Controls-Graphs/RoundChart';
import { ISingleItem, ISingleSeriesItem, HighChartsLight } from 'Controls-Graphs/base';
import { useDataFromSlice, IConnectedGraphProps } from 'Controls-Graphs/data';
import 'css!Controls-Graphs/RoundChart';

/**
 * @public
 * @interface Controls-Graphs/RoundChartConnected/IRoundChartConnectedProps
 * @implements Controls-Graphs/data/IConnectedGraphProps
 * @implements Controls-Graphs/RoundChart/IRoundChartProps
 * @ignoreOptions data
 * Интерфейс, описывающий опции круговой диаграммы, которая имеет возможность запрашивать дааные из контекста.
 */
export interface IRoundChartConnectedProps
    extends Omit<IRoundChartProps, 'data'>,
        IConnectedGraphProps {
    size?: 's' | 'm' | 'l';
}

/**
 * @public
 * @class Controls-Graphs/RoundChartConnected
 * @implements Controls-Graphs/RoundChartConnected/IRoundChartConnectedProps
 * Контрол круговой диаграммы, которая имеет возможность запрашивать дааные из контекста.
 * @demo Controls-Graphs-demo/RoundChartConnected/Items/Index
 * @demo Controls-Graphs-demo/RoundChartConnected/Source/Index
 */
const RoundChartConnected = React.forwardRef(
    (props: IRoundChartConnectedProps, ref: React.Ref<HighChartsLight>) => {
        const { legendVisible = false, type = 'donut', size = 's' } = props;
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
