/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IListState, TListMiddleware } from 'Controls-DataEnv/list';
import { LibPaths } from 'Controls-DataEnv/staticLoader';
import { isEqual } from 'Types/object';
import { ListActionCreators } from 'Controls-DataEnv/list';
import { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import { FilterCalculator, FilterDescription, FilterHistory } from 'Controls/filter';

const getFilterLib = () => loadSync<typeof import('Controls/filter')>(LibPaths.Filter);

export const filter: TListMiddleware =
    ({ getState, setState, dispatch }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setFilterDescription': {
                const nextState = action.payload;

                const newFilterDescription = nextState.filterDescription
                    ? getFilterLib().FilterDescription.applyFilterCounter(
                          nextState.countFilterValue,
                          nextState.filterDescription,
                          nextState
                      )
                    : nextState.filterDescription;

                setState({
                    filterDescription: newFilterDescription,
                });

                break;
            }

            case 'setFilter': {
                const {
                    FilterCalculator: { getFilterByFilterDescription },
                } = getFilterLib();

                setState({
                    filter: getFilterByFilterDescription(
                        action.payload.filter,
                        getState().filterDescription
                    ),
                });

                break;
            }

            case 'applyFilterDescriptionToFiller': {
                const currentState = getState();
                const { filterDescription, newState, appliedFrom } = action.payload;
                const reCalculatedFilterState = calculateFilterByFilterDescription(
                    currentState,
                    filterDescription,
                    newState,
                    appliedFrom
                );

                const shouldReload =
                    !reCalculatedFilterState ||
                    isEqual(reCalculatedFilterState.filter, currentState.filter);

                if (shouldReload) {
                    await dispatch(ListActionCreators.source.reload());
                }

                if (reCalculatedFilterState) {
                    setState(reCalculatedFilterState);
                }

                break;
            }
        }
        next(action);
    };

/**
 * Получение фильтра по его конфигурации
 * */
function calculateFilterByFilterDescription<TState extends IListState = IListState>(
    nextState: TState,
    filterDescription: IFilterDescriptionItem[],
    newState?: Partial<TState>,
    appliedFrom?: string
): Partial<TState> | undefined {
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
