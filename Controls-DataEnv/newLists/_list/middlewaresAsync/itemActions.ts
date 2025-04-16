import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';

/**
 * Промежуточная функция(middleware) обработки действий над действиями записей.
 */
export const itemActionsMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:itemActions',
    [
        'updateItemActionsMap',
        'onItemsRemoved',
        'onAllItemsReplaced',
        'onItemsAdded',
        'onItemsReset',
        'onItemsReplaced',
    ]
);
