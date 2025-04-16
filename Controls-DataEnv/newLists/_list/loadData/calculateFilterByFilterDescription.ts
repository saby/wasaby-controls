import { getFilterModuleSync } from './getFilterModuleSync';
import type { IListState } from '../interface/IListState';
import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';

/**
 * Получение фильтра по его конфигурации
 * */
export function calculateFilterByFilterDescription<TState extends IListState = IListState>(
    nextState: TState,
    filterDescription: IFilterDescriptionItem[],
    newState?: Partial<TState>,
    appliedFrom?: string
): Partial<TState> | undefined {
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
            ...(newState ?? {}),
        } as Partial<TState>;
    }
}
