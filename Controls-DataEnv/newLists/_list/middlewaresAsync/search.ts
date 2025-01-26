import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с поиском.
 */
export const searchMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:search',
    'search',
    ['resetSearch', 'updateSearch']
);
