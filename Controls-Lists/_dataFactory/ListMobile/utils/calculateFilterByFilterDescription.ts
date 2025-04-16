import { getFilterModuleSync } from './getFilterModuleSync';
import type { IFilterDescriptionItem } from 'Controls/filter';
import type { IListMobileState } from '../interface/IListMobileState';

export function calculateFilterByFilterDescription(
    nextState: IListMobileState,
    filterDescription: IFilterDescriptionItem[],
    newState?: Partial<IListMobileState>,
    appliedFrom?: string
): Partial<IListMobileState> | undefined {
    const { FilterCalculator, FilterDescription, FilterHistory } = getFilterModuleSync();

    let filterDescriptionWithCount = filterDescription;

    if (newState?.countFilterValue) {
        const isCurrentDateRangeChanged = FilterDescription.isDateRangeFilterChanged(
            nextState.filterDescription ?? []
        );
        const isNewDateRangeChanged = FilterDescription.isDateRangeFilterChanged(filterDescription);
        const countFilterValue =
            isCurrentDateRangeChanged !== isNewDateRangeChanged ? null : newState?.countFilterValue;
        filterDescriptionWithCount = FilterDescription.applyFilterCounter(
            countFilterValue,
            filterDescription,
            newState
        );
    }

    const descriptionWithAppliedFrom = FilterDescription.setAppliedFrom(
        nextState.filterDescription ?? [],
        filterDescriptionWithCount,
        appliedFrom
    );

    const newFilterDescription =
        nextState.filter &&
        FilterDescription.applyFilterDescription(
            nextState.filterDescription ?? [],
            descriptionWithAppliedFrom,
            nextState.filter
        );

    if (newFilterDescription) {
        const newFilter = FilterCalculator.getFilterByFilterDescription(
            nextState.filter,
            newFilterDescription
        );
        FilterDescription.applyFilterDescriptionToURL(newFilterDescription, nextState.saveToUrl);
        if (nextState.historyId) {
            FilterHistory.update(newFilterDescription, nextState.historyId);
        }
        return {
            filterDescription: newFilterDescription,
            filter: newFilter,
            ...newState,
        };
    }
}
