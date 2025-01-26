import IColumnChartProps from '../interfaces/IColumnChartProps';
import { COLUMN_GRAPH_HEIGHT } from '../constants';
import { IChartContext, ITooltipPoint } from 'Controls-Graphs/base';
import { tooltipPositionResolver } from 'Controls-Graphs/baseUtils';
import { tooltipFormatter } from 'Controls-Graphs/LinearChart';
import { prepareSeriesData } from './prepareSeriesData';

export const getChartConfig = (props: IColumnChartProps) => {
    const xAxis = getXAxisConfig(props);
    const yAxis = getYAxisConfig(props);
    const tooltip = getTooltipConfig(props);
    const chart = getChartSettings(props);
    const otherOptions = getDefaultOptions();
    const series = prepareSeriesData(props);

    return {
        xAxis,
        yAxis,
        tooltip,
        chart,
        ...series,
        ...otherOptions,
    };
};

const getXAxisConfig = (props: IColumnChartProps) => {
    return {
        tickWidth: 1,
        tickLength: 5,
        categories: props.xAxis?.categories ? props.xAxis.categories : undefined,
        type: 'category',
    };
};

const getYAxisConfig = (props: IColumnChartProps) => {
    return {
        title: {
            text: null,
        },
    };
};

const getTooltipConfig = (props: IColumnChartProps) => {
    return {
        positioner(pointWidth: number, pointHeight: number, point: ITooltipPoint): object {
            const chart = this.chart as unknown as IChartContext;
            return tooltipPositionResolver(chart, pointWidth, pointHeight, point);
        },
        formatter(): string | boolean {
            return tooltipFormatter(this);
        },
        padding: 0,
        shadow: false,
        shared: true,
        useHTML: true,
        borderWidth: 0,
        backgroundColor: 'transparent',
    };
};

const getChartSettings = (props: IColumnChartProps) => {
    return {
        type: 'column',
        height: COLUMN_GRAPH_HEIGHT,
        marginLeft: undefined,
        marginRight: 9,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingTop: 33,
    };
};

const getDefaultOptions = () => {
    return {
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
            margin: 0,
            symbolHeight: 0,
            symbolWidth: 0,
            useHTML: true,
        },
        plotOptions: {
            column: {
                borderRadiusTopLeft: 4,
                borderRadiusTopRight: 4,
                centerInCategory: true,
                groupPadding: 0.31,
                maxPointWidth: 14,
                pointPadding: 0,
                shadow: false,
                // stacking: 'normal',
            },
            states: {
                inactive: {
                    enabled: false,
                },
            },
        },
    };
};
