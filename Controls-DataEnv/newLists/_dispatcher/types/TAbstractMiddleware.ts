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
 * @author Родионов Е.А.
 */
export type TPushActionToNextMiddleware<TAction extends TAbstractAction> = (
    action: TAction
) => void;

/**
 * Тип абстрактного промежуточного слоя без привязки к контексту.
 *
 * **Не является самостоятельной единицей и не моет быть использован вне платформенного кода.**
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 *
 * @async
 * @param {TPushActionToNextMiddleware} next Метод, который добавляет действие в очередь для обработки следующим промежуточным слоем.
 * @return Promise<void>
 *
 * @see TAbstractMiddleware
 * @see TPushActionToNextMiddleware
 * @author Родионов Е.А.
 */
export type TAbstractMiddlewareWithoutContext<TAction extends TAbstractAction> = (
    next: TPushActionToNextMiddleware<TAction>
) => (action: TAction) => Promise<void>;

/**
 * Тип абстрактного промежуточного слоя.
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 *
 * Является дженерик-типом и принимает
 * * `TState` - тип состояния, с которым работают промежуточные слои.
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 * * `TMiddlewareContext` - тип контекста промежуточного слоя.
 *
 * @param {TAbstractMiddlewareContext} ctx Контекст промежуточного слоя.
 * @return TAbstractMiddlewareWithoutContext
 *
 * @example
 * type TCustomAction =
 *          | TAbstractAction<'changeRoot', { root: string }>
 *          | TAbstractAction<'reload', { root: string }>;
 *
 * const rootMiddleware: TAbstractMiddleware = (ctx) => (next) => async (action) => {
 *     const { setState } = ctx;
 *
 *     if (action.type === 'changeRoot') {
 *         const { root } = action.payload;
 *         await dispatch({ type: 'reload', payload: { root }});
 *         setState({ root });
 *     }
 *
 *     next(action);
 * }
 *
 * const loadDataMiddleware: TAbstractMiddleware = (ctx) => (next) => async (action) => {
 *     const { source, setState } = ctx;
 *
 *     if (action.type === 'reload') {
 *         const items = await source.reload(action.payload.root);
 *         setState({ items });
 *     }
 *
 *     next(action);
 * }
 *
 * @author Родионов Е.А.
 */
export type TAbstractMiddleware<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = (ctx: TMiddlewareContext) => TAbstractMiddlewareWithoutContext<TAction>;
