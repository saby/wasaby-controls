import { TAbstractAction } from './TAbstractAction';
import { TAbstractMiddleware } from './TAbstractMiddleware';
import {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from './TAbstractMiddlewareContext';

/**
 * Тип метода для получения текущего состояния.
 */
export type TGetStateHook<TState> = () => TState;

/**
 * Тип метода для незамедлительного обновления состояния у владельца Dispatcher'a.
 */
export type TApplyStateHook<TState> = (state: Partial<TState>) => void;

/**
 * Опции конструктора Dispatcher'a.
 * @see Controls-DataEnv/newLists/_dispatcher/Dispatcher
 */
export type TDispatcherProps<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = {
    /**
     * Необязательный идентификатор Dispatcher'a.
     * Необходим в большей степени для удобства отладки.
     */
    dispatcherId?: string;

    /**
     * Метод для получения текущего состояния.
     */
    getState: TGetStateHook<TState>;

    /**
     * Метод для незамедлительного обновления состояния у владельца Dispatcher'a.
     */
    applyState: TApplyStateHook<TState>;

    /**
     * Массив фабрик промежуточных обработчиков.
     */
    middlewares: TAbstractMiddleware<TState, TAction, TMiddlewareContext>[];

    /**
     * Функция получения контекста промежуточного обработчика.
     */
    middlewareContextGetter: TAbstractMiddlewareContextGetter<TState, TAction, TMiddlewareContext>;
};
