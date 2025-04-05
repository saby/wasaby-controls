import { TChartContext, yAxisLabelFormatter } from './yAxisLabelFormatter';

export function preparedYAxisLabelFormatter(theme: string) {
    return {
        yAxis: {
            labels: {
                style: {
                    color: 'var(--label_text-color)',
                    fontSize: 'var(--font-size_xs)',
                },
                align: 'right',
                enabled: true,
                x: -12,
                formatter(): string | object {
                    const ctx = this as unknown as TChartContext;
                    return yAxisLabelFormatter(ctx, theme);
                },
            },
        },
    };
}
