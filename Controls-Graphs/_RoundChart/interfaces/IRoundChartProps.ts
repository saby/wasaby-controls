import {
    ILegend,
    IAnimation,
    ITooltip,
    IData,
    IValueFormatter,
    IConfig,
    ISeries,
} from 'Controls-Graphs/base';
import { IControlOptions, TemplateFunction } from 'UI/Base';

export type TRoundChartType = 'donut' | 'pie';

/**
 * @interface Controls-Graphs/RoundChart/IRoundChartProps
 * Интерфейс, описывающий опции круговой диаграммы.
 * @public
 * @implements Controls-Graphs/base/IAnimation
 * @implements Controls-Graphs/base/IData
 * @implements Controls-Graphs/base/IValueFormatter
 * @implements Controls-Graphs/base/ITooltip
 * @implements Controls-Graphs/base/ISeries
 * @implements Controls-Graphs/base/ILegend
 * @implements Controls-Graphs/base/IConfig
 */
export default interface IRoundChartProps
    extends ILegend,
        IAnimation,
        ITooltip,
        IData,
        IValueFormatter,
        IConfig,
        Omit<IControlOptions, 'name'>,
        ISeries {
    /**
     * @name Controls-Graphs/RoundChart/IRoundChartProps#type
     * @cfg {String} Тип круговой диаграммы.
     * @demo Controls-Graphs-demo/RoundChart/Type/Index
     * @variant donut
     * @variant pie
     * @default donut
     */
    type?: TRoundChartType;

    /**
     * @name Controls-Graphs/RoundChart/IRoundChartProps#diagramInnerTemplate
     * @cfg {TemplateFunction|ReactNode} Шаблон содержимого круговой диграммы, в случае если type === 'donut'.
     * @demo Controls-Graphs-demo/RoundChart/DiagramInnerTemplate/Index
     */
    diagramInnerTemplate?: TemplateFunction | string;
}
