/**
 * @kaizen_zone 8005b651-a210-459a-a90d-f6ec20a122ee
 */
/**
 * Библиотека контролов, которые служат для {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ организации фильтрации в списках}.
 * @library
 * @includes View Controls/_filter/View
 * @includes IEditorOptions Controls/filter:EditorOptions
 * @includes ViewItemTemplate Controls/filter:ItemTemplate
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
import { default as FilterHistory, IFilterHistoryData } from './_filter/FilterHistory';
import { default as FilterLoader } from './_filter/FilterLoader';

export { default as View } from 'Controls/_filter/View';
export { default as DateRangeEditor } from 'Controls/_filter/Editors/DateRange';
export { FilterLoader, FilterCalculator, FilterHistory, FilterDescription, IFilterHistoryData };
const { loadCallbacks, isCallbacksLoaded, loadEditorTemplateName } = FilterLoader;
const { getFilterByFilterDescription, getDatesByFilterItem } = FilterCalculator;
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
export { IUserPeriod, IPeriodsConfig } from 'Controls/_filter/interface/IPeriodsConfig';
const HistoryUtils = {
    loadHistoryItems: FilterHistory.loadFilterHistory,
    getHistorySource: FilterHistory.getFilterHistorySource,
    getParamHistoryIds: FilterHistory.getHistoryIdsFromDescription,
};
const FilterUtils = {
    hasResetValue: FilterDescription.hasResetValue,
    resetFilterItem: FilterDescription.resetFilterItem,
    resetFilter: FilterDescription.resetFilterDescription,
};
export {
    default as IFilterDescriptionItem,
    TViewMode,
    IFilterItemBase,
} from 'Controls/_filter/interface/IFilterDescriptionItem';
export { default as IFilterItem } from 'Controls/_filter/interface/IFilterSourceItemOld';
export {
    TFilterDescription,
    IFilterDescriptionProps,
} from './_filter/interface/IFilterDescription';
export {
    default as IFilterItemLocal,
    IFilterItemLocalProps,
} from './_filter/interface/IFilterItemLocal';
export { IFilterItemConfiguration } from 'Controls/_filter/interface/IFilterItemConfiguration';
export { IFilterViewOptions, IFilterView } from 'Controls/_filter/View/interface/IFilterView';
export { default as ViewItemTemplate } from 'Controls/_filter/View/ItemTemplate';
export {
    TFilterItemLocalName,
    IFilterItemLocalPropsInternal,
} from 'Controls/_filter/interface/IFilterItemLocal';

export {
    loadCallbacks,
    isCallbacksLoaded,
    loadEditorTemplateName,
    updateFilterDescription,
    resetFilterDescription,
    resetFilterItem,
    mergeFilterDescriptions as mergeSource,
    getFilterByFilterDescription,
    initFilterDescription,
    isEqualItems,
    setAppliedFrom,
    getDatesByFilterItem,
};

export type { THistoryData } from './_filter/FilterHistory';

export { HistoryUtils, FilterUtils };
