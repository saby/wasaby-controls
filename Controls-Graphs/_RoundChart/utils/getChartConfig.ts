import IRoundChartProps from 'Controls-Graphs/interfaces/IRoundChartProps';
import { prepareSeriesData } from './prepareSeriesData';
import { BASE_SPASE } from '../constants';
import { tooltipFormatter } from './tooltipFormatter';
import { merge } from 'Types/object';
import IRoundChartTooltipFormatterContext from '../interfaces/IRoundChartTooltipFormatterContext';

export const getChartConfig = (props: IRoundChartProps) => {
    return merge(props.config, {
        tooltip: {
            padding: BASE_SPASE,
            distance: 25,
            outside: true,
            style: {
                zIndex: 10000,
                width: 'auto',
            },
            useHTML: true,
            borderWidth: BASE_SPASE,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            borderRadius: 'var(--border-radius_xs)',
            className: 'graphs-RoundChart_tooltip',
            formatter(): string {
                const formatterContext = this as unknown as IRoundChartTooltipFormatterContext;
                return props.displayFormatter
                    ? props.displayFormatter(formatterContext)
                    : tooltipFormatter(formatterContext);
            },
        },
        series: prepareSeriesData(
            props.data,
            props.type || 'donut',
            props.valueFormatter,
            props.series
        ),
        chart: {
            type: 'pie',
            height: '100%',
            spacingTop: BASE_SPASE,
            spacingLeft: BASE_SPASE,
            spacingRight: BASE_SPASE,
            spacingBottom: BASE_SPASE,
        },
        title: {
            text: '',
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                animation: {
                    duration: props.animation,
                },
                states: {
                    hover: {
                        enabled: true,
                        halo: null,
                    },
                    inactive: {
                        enabled: true,
                    },
                },
            },
            pie: {
                dataLabels: {
                    enabled: false,
                },
            },
        },
    });
};
