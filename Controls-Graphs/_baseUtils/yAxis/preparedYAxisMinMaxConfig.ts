import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { yAxisMinMaxConfig } from './yAxisMinMaxConfig';

export function preparedYAxisMinMaxConfig(data: ISingleItem[], series: ISingleSeriesItem[]) {
    const cfg = yAxisMinMaxConfig(data, series);
    return {
        yAxis: {
            ...cfg,
        },
    };
}
