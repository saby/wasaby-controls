import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с комплексным обновлением состояния(публичный setState)
 */
export const beforeApplyStateMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:complexUpdate',
    'complexUpdate',
    [
        'startUpdate',
        'beforeApplyState',
        'oldBeforeApplyState',
        'endUpdate',
        'publicSetState',
        'reduceState',
    ]
);
