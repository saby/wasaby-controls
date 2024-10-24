/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';

import { isEqual } from 'Types/object';
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import { SnapshotName } from 'Controls-DataEnv/list';

export const filter: TListMiddleware =
    ({ getState, setState, dispatch, snapshots }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setFilterDescription': {
                const nextState = action.payload;

                const newFilterDescription = nextState.filterDescription
                    ? loadSync<typeof import('Controls/filter')>(
                          'Controls/filter'
                      ).FilterDescription.applyFilterCounter(
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
                setState({
                    filter: loadSync<typeof import('Controls/filter')>(
                        'Controls/filter'
                    ).FilterCalculator.getFilterByFilterDescription(
                        action.payload.filter,
                        getState().filterDescription
                    ),
                });

                break;
            }

            case 'updateFilter': {
                const prevState = action.payload.prevState;
                const nextFilterState = action.payload;

                if (
                    (
                        [
                            'filterDescription',
                            'countFilterValue',
                            'countFilterLinkedNames',
                            'countFilterValueConverter',
                        ] as const
                    ).some((name) => nextFilterState[name] !== prevState[name])
                ) {
                    await dispatch(ListWebActions.filter.setFilterDescription(nextFilterState));
                }

                const filterDescriptionChanged = !isEqual(
                    prevState.filterDescription,
                    getState().filterDescription
                );

                let filterChanged = !isEqual(prevState.filter, nextFilterState.filter);

                if (
                    filterDescriptionChanged ||
                    (filterChanged && getState().filterDescription?.length)
                ) {
                    await dispatch(ListWebActions.filter.setFilter(nextFilterState.filter));
                    filterChanged = true;
                }

                if (filterDescriptionChanged || filterChanged) {
                    const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                    // Если во время поиска поменяли фильтр, то надо сбросить
                    // корень перед поиском, т.к мы можем в него не вернуться.
                    // Сбрасываем только если запомнили корень.
                    // Корень из "undefined" в "null" превращать нельзя.
                    if (beforeSearch && beforeSearch.root !== undefined) {
                        beforeSearch.root = null;
                    }
                }

                break;
            }
        }
        next(action);
    };
