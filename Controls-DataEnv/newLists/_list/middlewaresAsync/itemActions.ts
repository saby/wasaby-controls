import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над действиями записей.
 */
export const itemActionsMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:itemActions',
    ['updateItemActionsMap', 'onItemsRemoved', 'onAllItemsReplaced']
);
