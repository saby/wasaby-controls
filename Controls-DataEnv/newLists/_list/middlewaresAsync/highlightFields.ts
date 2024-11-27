import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий над подсветкой полей.
 */
export const highlightFieldsMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:highlightFields',
    'highlightFields',
    ['setHighlightedFieldsMap']
);
