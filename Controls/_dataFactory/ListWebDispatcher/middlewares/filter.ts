/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import asyncMiddlewareFactory from '../middlewareFactory/async';

export const filter = asyncMiddlewareFactory('Controls/listWebReducers:filter', 'filter', [
    'setFilterDescription',
    'setFilter',
    'updateFilter',
]);
