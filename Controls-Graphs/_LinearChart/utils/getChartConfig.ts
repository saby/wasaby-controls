import ILinearChartProps from '../interfaces/ILinearChartProps';
import ILinearChartTooltipFormatterProps from '../interfaces/ILinearChartTooltipFormatterProps';
import { IChartContext, ITooltipPoint } from 'Controls-Graphs/base';
import { tooltipPositionResolver } from 'Controls-Graphs/baseUtils';
import { tooltipFormatter } from './tooltipFormatter';
import { ANIMATION_DURATION } from '../constants';
import { prepareSeriesData } from './prepareSeriesData';
import { merge } from 'Types/object';

export const getChartConfig = (props: ILinearChartProps) => {
    const xAxis = getXAxisConfig(props);
    const yAxis = getYAxisConfig(props);
    const chart = getChartSettings(props);
    const tooltip = getTooltipConfig(props);
    const series = prepareSeriesData(props);
    return {
        xAxis,
        yAxis: merge(yAxis, props.yAxis),
        ...chart,
        tooltip,
        ...series,
    };
};

const getXAxisConfig = (props: ILinearChartProps) => {
    return {
        tickInterval: 1,
    };
};

const getYAxisConfig = (props: ILinearChartProps) => {
    return {
        title: {
            enabled: false,
        },
    };
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
            marginRight: 10,
            spacingBottom: 0,
            spacingLeft: 0,
            styledMode: true,
            height: props.autoHeight ? undefined : 223,
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

const getTooltipConfig = (props: ILinearChartProps) => {
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
            const chart = this.chart as unknown as IChartContext;
            return tooltipPositionResolver(chart, pointWidth, pointHeight, point);
        },
        formatter(): string {
            const formatterContext = this as unknown as ILinearChartTooltipFormatterProps;
            return tooltipFormatter(formatterContext);
        },
    };
};
