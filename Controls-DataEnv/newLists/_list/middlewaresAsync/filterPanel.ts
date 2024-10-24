/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

export const filterPanelMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:filterPanel',
    'filter',
    ['openFilterDetailPanel', 'closeOperationsPanel']
);
