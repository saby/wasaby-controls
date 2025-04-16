import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { yAxisTickPositioner } from './yAxisTickPositioner';

export function preparedYAxisTickPositioner(data: ISingleItem[], series: ISingleSeriesItem[]) {
    const tickPositions = yAxisTickPositioner(data, series) as number[];
    return {
        yAxis: {
            tickPositions,
        },
    };
}
