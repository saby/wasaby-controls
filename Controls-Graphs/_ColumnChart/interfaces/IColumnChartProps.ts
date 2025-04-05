import {
    IAnimation,
    IData,
    IValueFormatter,
    ITooltip,
    ISeries,
    ILegend,
    IXAxis,
    IYAxis,
} from 'Controls-Graphs/base';
import { IControlOptions } from 'UI/Base';

/**
 * @public
 * @interface Controls-Graphs/ColumnChart/IColumnChartProps
 * Интерфейс, описывающий пропсы столбчатой диаграммы.
 * @implements Controls-Graphs/base/IAnimation
 * @implements Controls-Graphs/base/IData
 * @implements Controls-Graphs/base/IValueFormatter
 * @implements Controls-Graphs/base/ITooltip
 * @implements Controls-Graphs/base/ISeries
 * @implements Controls-Graphs/base/ILegend
 * @implements Controls-Graphs/base/IXAxis
 * @implements Controls-Graphs/base/IYAxis
 */
export default interface IColumnChartProps
    extends IAnimation,
        IData,
        IValueFormatter,
        ITooltip,
        ISeries,
        ILegend,
        IXAxis,
        IYAxis,
        Omit<IControlOptions, 'name'> {}
