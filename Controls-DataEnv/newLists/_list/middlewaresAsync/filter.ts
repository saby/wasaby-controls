import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с фильтрацией данных.
 */
export const filterMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:filter',
    ['setFilterDescription', 'setFilter']
);
