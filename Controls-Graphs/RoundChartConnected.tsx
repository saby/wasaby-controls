import * as React from 'react';
import RoundChart, { IRoundChartProps } from 'Controls-Graphs/RoundChart';
import { ISingleItem, ISingleSeriesItem, HighChartsLight } from 'Controls-Graphs/base';
import { useDataFromSlice } from 'Controls-Graphs/data';
import IConnectedGraphProps from 'Controls-Graphs/interfaces/IConnectedGraphProps';
import 'css!Controls-Graphs/RoundChart';

export interface IRoundChartConnectedProps
    extends Omit<IRoundChartProps, 'data'>,
        IConnectedGraphProps {
    size?: 's' | 'm' | 'l';
}

/**
 * Контрол круговой диаграммы, которая имеет возможность запрашивать дааные из контекста.
 * @public
 * @class Controls-Graphs/RoundChartConnected
 * @implements Controls-Graphs/interfaces/IRoundChartProps
 * @implements Controls-Graphs/interfaces/IConnectedGraphProps
 * @ignoreOptions data
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

/**
 * @name Controls-Graphs/RoundChartConnected#size
 * @cfg {string} Определяет размер графика.
 * @variant s
 * @variant m
 * @variant l
 * @default s
 */

export default RoundChartConnected;
