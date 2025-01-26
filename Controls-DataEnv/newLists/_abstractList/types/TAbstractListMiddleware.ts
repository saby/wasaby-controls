import { type TAbstractAction, TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';

import type { TAbstractListMiddlewareContext } from './TAbstractListMiddlewareContext';
import type { IAbstractListState } from '../interface/IAbstractListState';
import { TAbstractListActions } from '../actions';

/**
 * Тип абстрактного списочного промежуточного слоя.
 *
 * Наследник абстрактного промежуточного слоя.
 *
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 */
export type TAbstractListMiddleware<
    TState extends IAbstractListState = IAbstractListState,
    TAction extends TAbstractAction = TAbstractListActions.TAnyAbstractListAction<TState>,
    TMiddlewareContext extends TAbstractListMiddlewareContext<
        TState,
        TAction
    > = TAbstractListMiddlewareContext<TState, TAction>,
> = TAbstractMiddleware<TState, TAction, TMiddlewareContext>;
