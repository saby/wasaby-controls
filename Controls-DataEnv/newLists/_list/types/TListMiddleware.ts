import type { TListActions } from '../actions';
import type { TListMiddlewareContext } from './TListMiddlewareContext';
import type { IListState } from '../interface/IListState';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';

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
 */
export type TListMiddleware<
    TState extends IListState = IListState,
    TAction extends TAbstractAction = TListActions.TAnyListAction,
> = TAbstractListMiddleware<TState, TAction, TListMiddlewareContext<TState, TAction>>;
