import {
    ILegend,
    IData,
    IAnimation,
    IValueFormatter,
    ISeries,
    IXAxis,
    IYAxis,
    ITooltip,
} from 'Controls-Graphs/base';
import { IControlOptions } from 'UI/Base';

/**
 * @public
 * @interface Controls-Graphs/LinearChart/ILinearChartProps
 * Интерфейс, описывающий пропсы линейного графика.
 * @implements Controls-Graphs/base/IAnimation
 * @implements Controls-Graphs/base/IData
 * @implements Controls-Graphs/base/IValueFormatter
 * @implements Controls-Graphs/base/ITooltip
 * @implements Controls-Graphs/base/ISeries
 * @implements Controls-Graphs/base/ILegend
 * @implements Controls-Graphs/base/IXAxis
 * @implements Controls-Graphs/base/IYAxis
 */
export default interface ILinearChartProps
    extends ILegend,
        Omit<IControlOptions, 'name'>,
        IData,
        IAnimation,
        ISeries,
        IXAxis,
        IYAxis,
        IValueFormatter,
        ITooltip {}
