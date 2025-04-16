import * as baseYAxisTemplate from 'wml!Controls-Graphs/_baseUtils/yAxis/templates/baseYAxisTemplate';
import * as yAxisLabelTemplate from 'wml!Controls-Graphs/_baseUtils/yAxis/templates/yAxisLabelTemplate';
import { getUnitsInfo } from './yAxisTitleFormatter';

export type TChartContext = {
    axis: {
        tickPositions: number[];
    };
    value: number;
};

const getTriad = (value: string | number): string => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatYLabel = (value: number, positions: number[]): string => {
    const maxPosition: number = Math.max.apply(null, positions.map(Math.abs));
    const minDischarge = 1000;
    const unitsInfo = getUnitsInfo(maxPosition, minDischarge);
    return getTriad((value / unitsInfo.discharge).toString());
};

export const yTicsResolver = (context: TChartContext) => {
    const positions = context.axis.tickPositions || [];
    return {
        label: formatYLabel(context.value, positions),
    };
};

export const yAxisLabelFormatter = (chartContext: TChartContext, theme: string) => {
    return baseYAxisTemplate({
        theme,
        template: yAxisLabelTemplate,
        options: yTicsResolver(chartContext),
    });
};
