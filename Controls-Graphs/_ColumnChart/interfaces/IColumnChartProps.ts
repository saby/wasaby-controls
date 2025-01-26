import {
    IAnimation,
    IData,
    IValueFormatter,
    ITooltip,
    IValueProperty,
    ISeries,
    ILegend,
    IXAxis,
    IYAxis,
} from 'Controls-Graphs/base';
import { IControlOptions } from 'UI/Base';

export default interface IColumnChartProps
    extends IAnimation,
        IData,
        IValueFormatter,
        ITooltip,
        IValueProperty,
        ISeries,
        ILegend,
        IXAxis,
        IYAxis,
        IControlOptions {}
