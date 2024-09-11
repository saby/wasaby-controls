/**
 * @kaizen_zone cd70f4c7-a658-45dc-aae3-71ffb9bc915d
 */
/**
 * Библиотека контролов, визуально отображающих состояние процесса.
 * @library
 * @includes IBar Controls/progress:IBar
 * @includes ILegend Controls/progress:ILegend
 * @includes IndicatorCategory Controls/progress:IndicatorCategory
 * @includes IStateIndicator Controls/progress:IStateIndicator
 * @includes IRating Controls/progress:IRating
 * @includes IStateBar Controls/progress:IStateBar
 * @includes Bar Controls/_progress:Bar
 * @public
 */

/*
 * Progress indicators library
 * @library
 * @includes IBar Controls/_progress/IBar
 * @includes ILegend Controls/progress:ILegend
 * @includes IndicatorCategory Controls/progress:IndicatorCategory
 * @includes IStateIndicator Controls/progress:IStateIndicator
 * @includes IRating Controls/progress:IRating
 * @includes IStateBar Controls/progress:IStateBar
 * @author Мочалов М.А.
 */

export {
    default as StateIndicator,
    IIndicatorCategory,
    IStateIndicatorOptions,
} from './_progress/StateIndicator';
export { default as Legend } from './_progress/Legend';
export { default as Bar } from './_progress/Bar';
export { default as Rating, TRatingViewMode } from './_progress/Rating';
export { default as StateBar, _applyNewState } from './_progress/StateBar';
