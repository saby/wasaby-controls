import ILinearChartProps from 'Controls-Graphs/interfaces/ILinearChartProps';
import { IChartContext, ITooltipPoint } from 'Controls-Graphs/base';
import {
    tooltipPositionResolver,
    preparedYAxisTitleFormatter,
    preparedYAxisLabelFormatter,
    preparedYAxisTickPositioner,
    preparedYAxisMinMaxConfig,
} from 'Controls-Graphs/baseUtils';
import { ITooltipFormatterProps, tooltipFormatter } from './tooltipFormatter';
import { ANIMATION_DURATION } from '../constants';
import { prepareSeriesData } from './prepareSeriesData';
import { merge } from 'Types/object';

export const getChartConfig = (props: ILinearChartProps) => {
    const xAxis = getXAxisConfig(props);
    const chart = getChartSettings(props);
    const tooltip = getTooltipConfig();
    const series = prepareSeriesData(props);

    // Формируем конфиг оси Y.
    const yAxisTitleCfg = preparedYAxisTitleFormatter(props.data, props.series);
    const yAxisLabelsCfg = preparedYAxisLabelFormatter(props.theme || 'default');
    const yAxisTickCfg = preparedYAxisTickPositioner(props.data, props.series);
    const yAxisMinMaxCfg = preparedYAxisMinMaxConfig(props.data, props.series);
    const yAxis = merge(
        {
            maxPadding: 0.2,
            opposite: false,
        },
        yAxisTickCfg.yAxis,
        // @ts-expect-error tickPositions: undefined | number[]
        yAxisMinMaxCfg.yAxis,
        yAxisTitleCfg.yAxis,
        yAxisLabelsCfg.yAxis
    );

    return merge(
        {
            xAxis,
            yAxis,
            ...chart,
            tooltip,
            ...series,
        },
        props.config
    );
};

const getXAxisConfig = (props: ILinearChartProps) => {
    const categories = getGraphsCategories(props.series, props.data);
    return {
        tickInterval: 1,
        tickLength: 5,
        tickWidth: 1,
        type: 'category',
        categories,
    };
};

const getGraphsCategories = (
    series: ILinearChartProps['series'],
    data: ILinearChartProps['data']
) => {
    if (series?.[0]?.xValueProperty) {
        return data.map((item) => item?.[series[0].xValueProperty as string]);
    }
    return undefined;
};

const getChartSettings = (props: ILinearChartProps) => {
    return {
        title: {
            text: null,
        },
        legend: {
            enabled: false,
        },
        chart: {
            type: 'spline',
            marginRight: 9,
            spacingBottom: 0,
            spacingLeft: 0,
            styledMode: true,
            height: 223,
            spacingTop: 33,
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false,
                },
            },
            series: {
                animation: {
                    duration: props.animation ? ANIMATION_DURATION : 0,
                },
                dataLabels: {
                    enabled: false,
                },
                marker: {
                    enabled: false,
                },
            },
        },
    };
};

const getTooltipConfig = () => {
    return {
        useHTML: true,
        shared: true,
        enabled: true,
        padding: 0,
        style: {
            width: 'auto',
        },
        shadow: false,
        positioner(pointWidth: number, pointHeight: number, point: ITooltipPoint): object {
            const chart = (this as unknown as { chart: IChartContext }).chart;
            return tooltipPositionResolver(chart, pointWidth, pointHeight, point);
        },
        formatter(): string {
            return tooltipFormatter(this as unknown as ITooltipFormatterProps);
        },
    };
};
