/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    TAbstractMiddleware,
    TAbstractMiddlewareCreator,
    TPushActionToNextMiddleware,
} from '../../AbstractDispatcher/types/TAbstractMiddleware';
import { TListAction } from './TListAction';
import { TListMiddlewareContext } from './TListMiddlewareContext';

/**
 * Тип метода, который добавляет действие в очередь для обработки следующим списочным промежуточным слоем.
 *
 * @param {TListAction} action Действие, доступное в списке, которое должно быть добавлено в очередь.
 * @return void
 *
 * @see TPushActionToNextMiddleware
 *
 * @private
 * @author Родионов Е.А.
 */
export type TPushActionToNextListMiddleware<TAction extends TListAction = TListAction> =
    TPushActionToNextMiddleware<TAction>;

/**
 * Тип списочного промежуточного слоя.
 *
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 *
 * Наследник абстрактного промежуточного слоя.
 *
 * @param {TPushActionToNextListMiddleware} pushActionToNextMiddleware Метод, который добавляет действие в очередь для обработки следующим промежуточным слоем.
 * @return Promise<void>
 *
 * @see TAbstractMiddleware
 *
 * @private
 * @author Родионов Е.А.
 */
export type TListMiddleware<TAction extends TListAction = TListAction> =
    TAbstractMiddleware<TAction>;

/**
 * Тип конструктора списочного промежуточного слоя.
 * Наследник конструктора абстрактного промежуточного слоя.
 * @param {TListMiddlewareContext} ctx Контекст промежуточного списочного слоя.
 * @return TListMiddleware
 *
 * @see TAbstractMiddlewareCreator
 * @private
 * @author Родионов Е.А.
 */
export type TListMiddlewareCreator<
    TAction extends TListAction = TListAction,
    TMiddlewareContext extends TListMiddlewareContext = TListMiddlewareContext,
    TMiddleware extends TListMiddleware<TAction> = TListMiddleware<TAction>,
> = TAbstractMiddlewareCreator<TAction, TMiddlewareContext, TMiddleware>;
