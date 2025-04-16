import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { yAxisTitleFormatter } from './yAxisTitleFormatter';
import { yAxisTickPositioner } from './yAxisTickPositioner';

export function preparedYAxisTitleFormatter(data: ISingleItem[], series: ISingleSeriesItem[]) {
    const ticksPositions = yAxisTickPositioner(data, series);
    const text = yAxisTitleFormatter(ticksPositions);
    return {
        yAxis: {
            title: {
                text,
                align: 'high',
                enabled: true,
                margin: 0,
                offset: 12,
                reserveSpace: true,
                rotation: 0,
                textAlign: 'right',
                x: 0,
                y: -17,
                style: {
                    fontWeight: 'bold',
                    color: 'var(--secondary_text-color)',
                    fontSize: 'var(--font-size_3xs)',
                    fontFamily: 'var(--font-family)',
                },
            },
        },
    };
}
