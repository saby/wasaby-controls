import IXAxis from './IXAxis';
import IYAxis from './IYAxis';
import ITooltip from './ITooltip';

export interface IChartOptions extends IXAxis, IYAxis, ITooltip {
    title: object;
    plotOptions: {
        series: {
            animation: boolean;
        };
        [key: string]: unknown;
    };
    credits: object;
    chart: object;
    series: object[];
}
