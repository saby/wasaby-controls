import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с окнами фильтров.
 */
export const errorMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:error',
    ['handleLoadError']
);
