/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractDispatch } from './TAbstractDispatch';
import { TAbstractAction } from './TAbstractAction';

/**
 * Тип абстрактного контекста промежуточного слоя.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 *
 * @private
 * @author Родионов Е.А.
 */
export type TAbstractMiddlewareContext<TAction extends TAbstractAction = TAbstractAction> = {
    dispatch: TAbstractDispatch<TAction>;
};

/**
 * Тип геттера абстрактного контекста промежуточного слоя.
 *
 * Геттер контекста промежуточного слоя отвечает за получение контекста текущего промежуточного слоя.
 * Используется только внутри абстрактного диспетчера.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 * * `TMiddlewareContext` - тип абстрактного контекста промежуточного слоя.
 *
 * @return Omit<TAbstractMiddlewareContext, 'dispatch'>
 *
 * @private
 * @author Родионов Е.А.
 */
export type TAbstractMiddlewareContextGetter<
    TAction extends TAbstractAction = TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TAction> = TAbstractMiddlewareContext<TAction>
> = () => Omit<TMiddlewareContext, 'dispatch'>;
