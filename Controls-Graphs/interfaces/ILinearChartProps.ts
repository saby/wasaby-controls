import {
    ILegend,
    IData,
    IAnimation,
    IValueFormatter,
    ISeries,
    IXAxis,
    IYAxis,
    ITooltip,
    IConfig,
} from 'Controls-Graphs/base';
import { IComponentProps } from 'Controls/interface';

/**
 * Интерфейс, описывающий пропсы линейного графика.
 * @public
 */
export default interface ILinearChartProps
    extends ILegend,
        IComponentProps,
        IData,
        IAnimation,
        ISeries,
        IXAxis,
        IYAxis,
        IValueFormatter,
        ITooltip,
        IConfig {
    theme?: string;
}
