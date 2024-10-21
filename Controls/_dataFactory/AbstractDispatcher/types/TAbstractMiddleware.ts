/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from './TAbstractAction';
import { TAbstractMiddlewareContext } from './TAbstractMiddlewareContext';

/**
 * Тип метода, который добавляет действие в очередь для обработки следующим промежуточным слоем.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для добавления в очередь.
 *
 * @param {TAbstractAction} action Действие, которое должно быть добавлено в очередь.
 * @return void
 *
 * @private
 * @author Родионов Е.А.
 */
export type TPushActionToNextMiddleware<TAction extends TAbstractAction = TAbstractAction> = (
    action: TAction
) => void;

/**
 * Тип абстрактного промежуточного слоя.
 *
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 *
 * @param {TPushActionToNextMiddleware} pushActionToNextMiddleware Метод, который добавляет действие в очередь для обработки следующим промежуточным слоем.
 * @return Promise<void>
 *
 * @example
 * type TCustomAction = TAbstractAction<'custom_add', {item: string}>
 *     | TAbstractAction<'custom_reload', {}>;
 *
 * const addMiddleware: TAbstractMiddleware = (next) => async (action) => {
 *     if (action.type === 'custom_add') {
 *         // do add async, then we need reload list in other middleware;
 *         next.push({ type: 'custom_reload', payload: {} }, action);
 *     } else {
 *         next(action);
 *     }
 * }
 *
 * @private
 * @author Родионов Е.А.
 */
export type TAbstractMiddleware<TAction extends TAbstractAction = TAbstractAction> = (
    pushActionToNextMiddleware: TPushActionToNextMiddleware<TAction>
) => (action: TAction) => Promise<void>;

/**
 * Тип конструктора абстрактного промежуточного слоя.
 *
 * Конструктор отвечает за создание нового промежуточного слоя и обогащение его контекстом
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 * * `TMiddlewareContext` - тип контекста промежуточного слоя.
 * * `TMiddleware` - тип создаваемого промежуточного слоя.
 *
 * @param {TAbstractMiddlewareContext} ctx Контекст промежуточного слоя.
 * @return TAbstractMiddleware
 *
 * @example
 *
 * type TCustomAction = TAbstractAction<'custom_add', { item: string }>;
 *
 * const addMiddlewareFactory: TAbstractMiddleware = (ctx) => (next) => async (action) => {
 *     const { source } = ctx;
 *
 *     if (action.type === 'custom_add') {
 *         // ...do add...
 *
 *         await source.reload();
 *     }
 *
 *     next(action);
 * }
 *
 * @private
 * @author Родионов Е.А.
 */
export type TAbstractMiddlewareCreator<
    TAction extends TAbstractAction = TAbstractAction,
    TMiddlewareContext extends
        TAbstractMiddlewareContext<TAction> = TAbstractMiddlewareContext<TAction>,
    TMiddleware extends TAbstractMiddleware<TAction> = TAbstractMiddleware<TAction>,
> = (ctx: TMiddlewareContext) => TMiddleware;
