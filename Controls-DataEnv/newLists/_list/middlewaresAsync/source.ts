import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с работой с источником данных.
 */
export const sourceMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:source',
    'source',
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
        'loadToDirectionOld',
        'loadToDirectionNew',
        'setPreloadedItems',
        'dataLoadedSuccess',
        'requestFetch',
        'fetch',
        'initSource',
        'awaitAllRequests',
        'complexUpdateSource',
        'rejectLoad',
    ]
);
