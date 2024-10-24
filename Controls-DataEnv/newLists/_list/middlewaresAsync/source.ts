/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

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
    ]
);
