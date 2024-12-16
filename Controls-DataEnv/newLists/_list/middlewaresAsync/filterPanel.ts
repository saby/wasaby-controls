import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с окнами фильтров.
 */
export const filterPanelMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:filterPanel',
    'filter',
    ['openFilterDetailPanel', 'closeFilterDetailPanel']
);
