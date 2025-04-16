import {
    ILegend,
    IData,
    IAnimation,
    IValueProperty,
    IValueFormatter,
    ISeries,
    IXAxis,
    IYAxis,
    ITooltip,
} from 'Controls-Graphs/base';
import { IControlOptions } from 'UI/Base';

export default interface ILinearChartProps
    extends ILegend,
        IControlOptions,
        IData,
        IAnimation,
        IValueProperty,
        ISeries,
        IXAxis,
        IYAxis,
        IValueFormatter,
        ITooltip {}
