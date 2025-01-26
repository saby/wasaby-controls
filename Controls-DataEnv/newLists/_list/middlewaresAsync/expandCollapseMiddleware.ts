import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над разворотом узлов.
 */
export const expandCollapseMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:expandCollapse',
    [
        'setExpandedItems',
        'setCollapsedItems',
        'updateExpansionModel',
        'setExpandCollapsedItems',
        'expand',
        'expandParent',
        'collapse',
        'resetExpansion',
        'onItemsRemoved',
    ]
);
