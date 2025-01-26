import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над заглушкой.
 */
export const stubMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:stub',
    ['setStubVisibility', 'onItemsAdded', 'onItemsRemoved', 'onItemsReset']
);
