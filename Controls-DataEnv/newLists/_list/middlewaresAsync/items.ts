import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с работой с сырым набором записей (RecordSet).
 */
export const itemsMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:items',
    [
        'replaceAllItems',
        'removeItems',
        'replaceItems',
        'prependItems',
        'appendItems',
        'changeKeyProperty',
        'replaceMetaData',
        'mergeMetaData',
        'setItemsChanges',
        'resetItems',
    ]
);
