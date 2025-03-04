import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с окнами фильтров.
 */
export const filterPanelMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:filterPanel',
    ['openFilterDetailPanel', 'closeFilterDetailPanel']
);
