import { ILangOptions } from './ILangOptions';
import { IChartOptions } from './IChartOptions';

export default interface IHighChartsBaseOptions {
    chartOptions: IChartOptions;
    langOptions?: ILangOptions;
    modules?: string[];
    animation: boolean;
}
