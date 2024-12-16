import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с множественным выделением записей.
 */
export const selectionMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:selection',
    'selection',
    [
        'setSelectionVisibility',
        'resetSelection',
        'setSelection',
        'select',
        'complexUpdateSelection',
        'setSelectionModel',
        'selectAll',
        'invertSelection',
        'onItemsRemoved',
    ]
);
