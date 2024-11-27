import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над разворотом узлов.
 */
export const expandCollapseMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:expandCollapse',
    'expandCollapse',
    [
        'setExpandedItems',
        'setCollapsedItems',
        'updateExpansionModel',
        'setExpandCollapsedItems',
        'expand',
        'collapse',
        'resetExpansion',
        'handleRemovedItems',
        'complexUpdateExpandCollapse',
    ]
);
