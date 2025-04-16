import {
    ILegend,
    IAnimation,
    ITooltip,
    IData,
    IValueFormatter,
    IConfig,
    ISeries,
} from 'Controls-Graphs/base';
import { TemplateFunction } from 'UI/Base';
import { IComponentProps } from 'Controls/interface';

export type TRoundChartType = 'donut' | 'pie';

/**
 * Интерфейс, описывающий опции круговой диаграммы.
 * @public
 */
export default interface IRoundChartProps
    extends ILegend,
        IAnimation,
        ITooltip,
        IData,
        IValueFormatter,
        IConfig,
        IComponentProps,
        ISeries {
    /**
     * Тип круговой диаграммы.
     * @demo Controls-Graphs-demo/RoundChart/Type/Index
     * @variant donut
     * @variant pie
     * @default donut
     */
    type?: TRoundChartType;

    /**
     * Шаблон содержимого круговой диграммы, в случае если type === 'donut'.
     * @demo Controls-Graphs-demo/RoundChart/DiagramInnerTemplate/Index
     */
    diagramInnerTemplate?: TemplateFunction | string;
    theme?: string;
}
