import {
    IAnimation,
    IData,
    IValueFormatter,
    ITooltip,
    ISeries,
    ILegend,
    IXAxis,
    IYAxis,
    IConfig,
} from 'Controls-Graphs/base';
import { IComponentProps } from 'Controls/interface';

/**
 * Интерфейс, описывающий пропсы столбчатой диаграммы.
 * @public
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
        IConfig,
        IComponentProps {
    theme?: string;
}
