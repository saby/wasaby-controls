import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';

/**
 * Промежуточная функция(middleware) обработки действий над заглушкой.
 */
export const stubMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:stub',
    ['setStubVisibility', 'onItemsAdded', 'onItemsRemoved', 'onItemsReset']
);
