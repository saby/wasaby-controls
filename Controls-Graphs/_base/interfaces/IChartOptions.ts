import IXAxis from './IXAxis';
import IYAxis from './IYAxis';
import ITooltip from './ITooltip';

export interface IChartOptions extends IXAxis, IYAxis, ITooltip {
    title: object;
    plotOptions: {
        series: {
            animation: boolean;
        };
    };
    credits: object;
    chart: object;
    series: object[];
}
