/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Библиотека контролов, которые служат для {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ организации фильтрации в списках}.
 * @library
 * @includes View Controls/_filter/View
 * @includes IEditorOptions Controls/filter:EditorOptions
 * @includes ViewItemTemplate Controls/filter:ItemTemplate
 * @includes ViewContainer Controls/_filter/View/Container
 * @includes IFastFilter Controls/_filter/View/interface/IFastFilter
 * @includes IFilterButton Controls/_filter/View/interface/IFilterButton
 * @includes IPrefetch Controls/filter:IPrefetch
 * @includes DateRangeEditor Controls/_filter/Editors/DateRangeEditor
 * @public
 */

/*
 * filter library
 * @library
 * @includes View Controls/_filter/View
 * @includes IEditorOptions Controls/filter:EditorOptions
 * @includes ViewItemTemplate Controls/filter:ItemTemplate
 * @includes ViewContainer Controls/_filter/View/Container
 * @includes IFastFilter Controls/_filter/View/interface/IFastFilter
 * @includes IFilterButton Controls/_filter/View/interface/IFilterButton
 * @includes IPrefetch Controls/filter:IPrefetch
 * @public
 * @author Крайнов Д.О.
 */

import ViewItemTemplate = require('wml!Controls/_filter/View/ItemTemplate');
import HistoryUtils = require('Controls/_filter/HistoryUtils');
import FilterUtils = require('Controls/_filter/resetFilterUtils');

export { default as View } from 'Controls/_filter/View';
export {
    default as ControllerClass,
    IFilterControllerOptions,
} from './_filter/ControllerClass';
export { default as ViewContainer } from './_filter/View/WrappedContainer';
export { default as DateRangeEditor } from './_filter/Editors/DateRange';
export { default as Prefetch } from 'Controls/_filter/Prefetch';
export { default as mergeSource } from 'Controls/_filter/Utils/mergeSource';
export { default as isEqualItems } from 'Controls/_filter/Utils/isEqualItems';
export {
    resetFilter as resetFilterDescription,
    resetFilterItem,
} from 'Controls/_filter/resetFilterUtils';
export {
    updateFilterDescription,
    loadCallbacks,
    isCallbacksLoaded,
} from 'Controls/_filter/Utils/CallbackUtils';
export {
    IFilterItem,
    TViewMode as TFilterItemViewMode,
} from 'Controls/_filter/View/interface/IFilterItem';
export { IFilterItemConfiguration } from 'Controls/_filter/View/interface/IFilterItemConfiguration';
export {
    IFilterViewOptions,
    IFilterView,
} from 'Controls/_filter/View/interface/IFilterView';
export {
    ICalculatedFilter,
    ICalculateFilterParams,
} from './_filter/ControllerClass';
export { default as getFilterByFilterDescription } from 'Controls/_filter/filterCalculator';

export { ViewItemTemplate, HistoryUtils, FilterUtils };
