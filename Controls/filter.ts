/**
 * @kaizen_zone 8005b651-a210-459a-a90d-f6ec20a122ee
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
import { default as FilterDescription } from './_filter/FilterDescription';
import { default as FilterCalculator } from './_filter/FilterCalculator';
import { default as FilterHistory } from './_filter/FilterHistory';
import { default as FilterLoader } from './_filter/FilterLoader';

export { default as View } from 'Controls/_filter/View';
export { default as DateRangeEditor } from 'Controls/_filter/Editors/DateRange';
export { default as ControllerClass, IFilterControllerOptions } from './_filter/ControllerClass';
export { default as ViewContainer } from './_filter/View/Container';
export { FilterLoader, FilterCalculator, FilterHistory, FilterDescription };
const { loadCallbacks, isCallbacksLoaded } = FilterLoader;
const { getFilterByFilterDescription } = FilterCalculator;
const {
    updateFilterDescription,
    resetFilterDescription,
    resetFilterItem,
    mergeFilterDescriptions,
    initFilterDescription,
    isEqualItems,
    setAppliedFrom,
} = FilterDescription;
export {
    default as IPrefetch,
    IPrefetchOptions,
    IPrefetchParams,
    IPrefetchHistoryParams,
} from 'Controls/_filter/interface/IPrefetch';
const HistoryUtils = {
    loadHistoryItems: FilterHistory.loadHistoryItems,
    getHistorySource: FilterHistory.getFilterHistorySource,
    getParamHistoryIds: FilterHistory.getHistoryIdsFromDescription,
};
const FilterUtils = {
    hasResetValue: FilterDescription.hasResetValue,
    resetFilterItem: FilterDescription.resetFilterItem,
    resetFilter: FilterDescription.resetFilterDescription,
};
export {
    IFilterItem,
    TViewMode as TFilterItemViewMode,
} from 'Controls/_filter/View/interface/IFilterItem';
export {
    TFilterDescription,
    IFilterDescriptionProps,
} from './_filter/interface/IFilterDescription';
export { IFilterItemConfiguration } from 'Controls/_filter/View/interface/IFilterItemConfiguration';
export { IFilterViewOptions, IFilterView } from 'Controls/_filter/View/interface/IFilterView';
export { ICalculatedFilter, ICalculateFilterParams } from './_filter/ControllerClass';
export { default as ViewItemTemplate } from 'Controls/_filter/View/ItemTemplate';

export {
    loadCallbacks,
    isCallbacksLoaded,
    updateFilterDescription,
    resetFilterDescription,
    resetFilterItem,
    mergeFilterDescriptions as mergeSource,
    getFilterByFilterDescription,
    initFilterDescription,
    isEqualItems,
    setAppliedFrom,
};

export type { THistoryData } from './_filter/FilterHistory';

export { HistoryUtils, FilterUtils };
