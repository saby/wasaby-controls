import { TListMiddlewareCreator } from '../types/TListMiddleware';
import * as stateActions from '../actions/state';
import * as filterActions from '../actions/filter';

import { loadSync } from 'WasabyLoader/ModulesLoader';

import {
    Logger as DispatcherLogger,
    withLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { isEqual } from 'Types/object';
import { SnapshotName } from 'Controls/_dataFactory/ListWebDispatcher/types/SnapshotName';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'filter',
    actionsNames: ['setFilterDescription', 'setFilter', 'updateFilter'],
});

export const filter: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, snapshots } = withLogger(ctx, 'filter');

    return (next) => async (action) => {
        logger.enter(action);

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

                await dispatch(
                    stateActions.setState({
                        filterDescription: newFilterDescription,
                    })
                );

                break;
            }

            case 'setFilter': {
                await dispatch(
                    stateActions.setState({
                        filter: loadSync<typeof import('Controls/filter')>(
                            'Controls/filter'
                        ).FilterCalculator.getFilterByFilterDescription(
                            action.payload.filter,
                            getState().filterDescription
                        ),
                    })
                );

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
                    await dispatch(filterActions.setFilterDescription(nextFilterState));
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
                    await dispatch(filterActions.setFilter(nextFilterState.filter));
                    filterChanged = true;
                }

                if (filterDescriptionChanged || filterChanged) {
                    const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                    if (beforeSearch) {
                        beforeSearch.root = null;
                    }
                }

                break;
            }
        }

        logger.exit(action);
        next(action);
    };
};
