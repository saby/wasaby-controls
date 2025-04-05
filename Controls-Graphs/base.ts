/**
 * Библиотека базового компонента HighCharts, а также стили и типы к нему.
 * @includes ILegend Controls-Graphs/_base/interfaces/ILegend
 * @includes IAnimation Controls-Graphs/_base/interfaces/IAnimation
 * @includes IData Controls-Graphs/_base/interfaces/IData
 * @includes IValueFormatter Controls-Graphs/_base/interfaces/IValueFormatter
 * @includes ITooltip Controls-Graphs/_base/interfaces/ITooltip
 * @includes ISeries Controls-Graphs/_base/interfaces/ISeries
 * @includes IConfig Controls-Graphs/_base/interfaces/IConfig
 * @includes IXAxis Controls-Graphs/_base/interfaces/IXAxis
 * @includes IYAxis Controls-Graphs/_base/interfaces/IYAxis
 * @includes ISingleItem Controls-Graphs/_base/interfaces/ISingleItem
 * @includes ISingleSeriesItem Controls-Graphs/_base/interfaces/ISingleSeriesItem
 * @library
 * @public
 */

export { default as HighChartsLight } from './_base/HighChartsLight/HighChartsLight';
export {
    default as ILegend,
    TLegendVerticalPosition,
    THorizontalAlignment,
} from './_base/interfaces/ILegend';
export { default as IAnimation } from './_base/interfaces/IAnimation';
export { default as ITooltip } from './_base/interfaces/ITooltip';
export { default as IData } from './_base/interfaces/IData';
export { default as ISingleItem } from './_base/interfaces/ISingleItem';
export { default as IValueFormatter } from './_base/interfaces/IValueFormatter';
export { default as ITwoDimensionalPoint } from './_base/interfaces/ITwoDimensionalPoint';
export { default as ISingleSeriesItem } from './_base/interfaces/ISingleSeriesItem';
export { default as ISeries } from './_base/interfaces/ISeries';
export { default as IConfig } from './_base/interfaces/IConfig';
export { default as IColorIndex } from './_base/interfaces/IColorIndex';
export { default as IChartContext } from './_base/interfaces/IChartContext';
export { IChartOptions } from './_base/interfaces/IChartOptions';
export { default as IChartAxis } from './_base/interfaces/IChartAxis';
export { default as ITooltipPoint } from './_base/interfaces/ITooltipPoint';
export { default as IXAxis } from './_base/interfaces/IXAxis';
export { default as IYAxis } from './_base/interfaces/IYAxis';
export { default as Legend, ILegendItem, ILegendProps } from './_base/Legend';
export { default as EmptyView } from './_base/EmptyView';
