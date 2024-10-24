/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractDispatch } from './TAbstractDispatch';
import type { TAbstractAction } from './TAbstractAction';

/**
 * Тип абстрактного контекста абстрактного промежуточного слоя.
 *
 * Является дженерик-типом и принимает
 * * `TState` - тип состояния, с которым работает промежуточный слой.
 * * [TAbstractAction] `TAction` - тип действия для обработки и дальнейшего распространения.
 *
 * @author Родионов Е.А.
 */
export type TAbstractMiddlewareContext<TState, TAction extends TAbstractAction> = {
    /**
     * Метод для распространения действий по промежуточным слоям.
     */
    readonly dispatch: TAbstractDispatch<TAction>;

    /**
     * Метод для получения текущего состояния.
     */
    readonly getState: () => TState;

    /**
     * Метод для обновления текущего состояния.
     */
    readonly setState: (state: Partial<TState>) => void;

    /**
     * Метод для обновления текущего состояния и незамедлительного уведомления владельца Dispatcher'a.
     */
    readonly applyState: (state: Partial<TState>) => void;
};

/**
 * Тип геттера абстрактного контекста абстрактного промежуточного слоя.
 *
 * Геттер контекста промежуточного слоя отвечает за получение контекста текущего промежуточного слоя.
 * Используется только внутри абстрактного диспетчера.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 * * `TMiddlewareContext` - тип абстрактного контекста промежуточного слоя.
 *
 * @return Omit<TAbstractMiddlewareContext, 'dispatch' | 'getState' | 'setState' | 'applyState'>
 * @author Родионов Е.А.
 */
export type TAbstractMiddlewareContextGetter<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = () => Omit<TMiddlewareContext, 'dispatch' | 'getState' | 'setState' | 'applyState'>;
