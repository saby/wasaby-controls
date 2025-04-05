import IColumnChartProps from '../interfaces/IColumnChartProps';
import { COLUMN_GRAPH_HEIGHT } from '../constants';
import { IChartContext, ITooltipPoint } from 'Controls-Graphs/base';
import {
    tooltipPositionResolver,
    preparedYAxisMinMaxConfig,
    preparedYAxisTitleFormatter,
    preparedYAxisTickPositioner,
    preparedYAxisLabelFormatter,
} from 'Controls-Graphs/baseUtils';
import { tooltipFormatter } from 'Controls-Graphs/LinearChart';
import { prepareSeriesData } from './prepareSeriesData';
import { merge } from 'Types/object';
import { ITooltipFormatterProps } from 'Controls-Graphs/LinearChart';

export const getChartConfig = (props: IColumnChartProps) => {
    const xAxis = getXAxisConfig(props);
    const tooltip = getTooltipConfig();
    const chart = getChartSettings();
    const otherOptions = getDefaultOptions();
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
    const categories = getGraphsCategories(props.series, props.data);
    return {
        tickWidth: 1,
        tickLength: 5,
        categories,
        type: 'category',
    };
};

const getGraphsCategories = (
    series: IColumnChartProps['series'],
    data: IColumnChartProps['data']
) => {
    if (series?.[0]?.xValueProperty) {
        return data.map((item) => item?.[series[0].xValueProperty as string]);
    }
    return undefined;
};

const getTooltipConfig = () => {
    return {
        positioner(pointWidth: number, pointHeight: number, point: ITooltipPoint): object {
            const chart = (this as unknown as { chart: IChartContext }).chart;
            return tooltipPositionResolver(chart, pointWidth, pointHeight, point);
        },
        formatter(): string | boolean {
            return tooltipFormatter(this as unknown as ITooltipFormatterProps);
        },
        padding: 0,
        shadow: false,
        shared: true,
        useHTML: true,
        borderWidth: 0,
        backgroundColor: 'transparent',
    };
};

const getChartSettings = () => {
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
                pointPadding: 0.2,
                maxPointWidth: 14,
                groupPadding: 0.2,
                shadow: false,
            },
            states: {
                inactive: {
                    enabled: false,
                },
            },
        },
    };
};
