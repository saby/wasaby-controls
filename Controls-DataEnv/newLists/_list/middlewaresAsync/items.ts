import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с работой с сырым набором записей (RecordSet).
 */
export const itemsMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:items',
    'items',
    [
        'complexUpdateItems',
        'replaceAllItems',
        'removeItems',
        'replaceItems',
        'prependItems',
        'appendItems',
        'changeKeyProperty',
        'replaceMetaData',
        'mergeMetaData',
    ]
);
