import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';

/**
 * Промежуточная функция(middleware) обработки действий над подсветкой полей.
 */
export const highlightFieldsMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:highlightFields',
    ['setHighlightedFieldsMap']
);
