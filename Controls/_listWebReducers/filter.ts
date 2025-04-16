/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TListMiddleware } from 'Controls/dataFactory';

export const filter: TListMiddleware =
    ({ getState, setState }) =>
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
        }
        next(action);
    };
