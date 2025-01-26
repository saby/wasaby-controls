import {
    ILegend,
    IAnimation,
    IValueProperty,
    ITooltip,
    IData,
    IValueFormatter,
    IConfig,
    IColorProperty,
    ISeries,
} from 'Controls-Graphs/base';
import { IControlOptions, TemplateFunction } from 'UI/Base';

export type TRoundChartType = 'donut' | 'pie';

/**
 * Интерфейс, описывающий опции круговой диаграммы.
 * @public
 */
export default interface IRoundChartProps
    extends ILegend,
        IAnimation,
        IValueProperty,
        ITooltip,
        IData,
        IValueFormatter,
        IConfig,
        IColorProperty,
        IControlOptions,
        ISeries {
    type?: TRoundChartType;
    diagramInnerTemplate?: TemplateFunction | string;
}
