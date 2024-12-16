import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над хлебными крошками.
 */
export const breadCrumbsMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:breadCrumbs',
    'breadCrumbs',
    ['setBreadCrumbs', 'handleItemsChanged']
);
