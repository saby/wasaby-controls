import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с работой с источником данных.
 */
export const sourceMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:source',
    [
        'updateSavedSourceState',
        'setSavedSourceState',
        'reload',
        'load',
        'loadOnSourceController',
        'reloadOnSourceController',
        'newItemsReceived',
        'resolveStateAfterUpdateItems',
        'loadNodes',
        'oldSliceLoad',
        'reloadItem',
        'reloadItems',
        'loadToDirection',
        'setPreloadedItems',
        'dataLoadedSuccess',
        'requestFetch',
        'fetch',
        'initSource',
        'awaitAllRequests',
        'rejectLoad',
        'updateHasMoreStorage',
        'loadPrev',
        'loadNext',
    ],
    ({ getState }, action) => {
        const { sourceController } = getState();
        if (!sourceController) {
            return false;
        }

        if (action.type === 'loadPrev') {
            return sourceController.hasMoreData('up');
        }
        if (action.type === 'loadNext') {
            return sourceController.hasMoreData('down');
        }
    }
);
