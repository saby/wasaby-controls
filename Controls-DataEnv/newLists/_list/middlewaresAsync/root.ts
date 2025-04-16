import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над корнем иерархии.
 */
export const rootMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:root',
    ['setRoot', 'changeRoot']
);
