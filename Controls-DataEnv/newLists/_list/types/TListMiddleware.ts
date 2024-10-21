/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';

import type { TListActions } from '../actions';
import type { TListMiddlewareContext } from './TListMiddlewareContext';
import type { IListState } from '../interface/IListState';

/**
 * Тип списочного промежуточного слоя.
 *
 * Наследник абстрактного промежуточного слоя.
 *
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 *
 * @param {TListMiddlewareContext} ctx Контекст промежуточного списочного слоя.
 * @return TAbstractMiddlewareWithoutContext
 *
 * @see TAbstractMiddleware
 * @private
 * @author Родионов Е.А.
 */
export type TListMiddleware = TAbstractMiddleware<
    IListState,
    TListActions.TAnyListAction,
    TListMiddlewareContext
>;
