import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с множественным выделением записей.
 */
export const selectionMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:selection',
    [
        'setSelectionVisibility',
        'resetSelection',
        'setSelection',
        'select',
        'setSelectionModel',
        'selectAll',
        'invertSelection',
        'onItemsRemoved',
        'onItemsAdded',
        'onItemsReset',
        'updateCounter',
    ]
);
