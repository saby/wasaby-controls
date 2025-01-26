import { type TAbstractAction, TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';

import type { TAbstractListMiddlewareContext } from './TAbstractListMiddlewareContext';
import type { IAbstractListState } from 'Controls-DataEnv/newLists/_abstractList/interface/IAbstractListState';

/**
 * Тип абстрактного списочного промежуточного слоя.
 *
 * Наследник абстрактного промежуточного слоя.
 *
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 */
export type TAbstractListMiddleware<
    TState extends IAbstractListState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractListMiddlewareContext<TState, TAction>,
> = TAbstractMiddleware<TState, TAction, TMiddlewareContext>;
