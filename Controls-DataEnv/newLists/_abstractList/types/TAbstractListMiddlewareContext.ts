import type {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/newLists/_dispatcher/types/TAbstractMiddlewareContext';
import type { TAbstractAction } from 'Controls-DataEnv/newLists/_dispatcher/types/TAbstractAction';
import type { TAnyAbstractListAction } from 'Controls-DataEnv/newLists/_abstractList/actions/types';
import type { IAbstractListState } from 'Controls-DataEnv/newLists/_abstractList/interface/IAbstractListState';
import type { Collection as ICollection } from 'Controls/display';

/**
 * Тип абстрактного списочного контекста абстрактного промежуточного слоя.
 *
 * Является дженерик-типом и принимает
 * * `TState` - тип состояния, с которым работает промежуточный слой.
 * * [TAbstractAction] `TAction` - тип действия для обработки и дальнейшего распространения.
 */
export type TAbstractListMiddlewareContext<
    TState extends IAbstractListState = IAbstractListState,
    TAction extends TAbstractAction = TAnyAbstractListAction,
> = TAbstractMiddlewareContext<TState, TAction> & {
    /**
     * Метод, возвращающий индикатор необходимости пропуска этапа установки коллекции
     * */
    getSkipSetCollection(): boolean;
    /**
     * Метод, возвращающий текущую коллекцию
     * */
    getCollection(): ICollection | undefined;
    /**
     * Метод для добавления action в очередь
     * */
    scheduleDispatch(action: TAction): void;
    /**
     * Метод для регистрации Promise
     * */
    registerPendingPromise<T>(key: Symbol, promise: Promise<T>): Promise<T>;
};

/**
 * Тип геттера абстрактного списочного контекста абстрактного промежуточного слоя.
 *
 * Геттер контекста промежуточного слоя отвечает за получение контекста текущего промежуточного слоя.
 * Используется только внутри абстрактного диспетчера.
 *
 * Является дженерик-типом и принимает
 * * `TState` - тип состояния, с которым работает промежуточный слой.
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 * * `TMiddlewareContext` - тип абстрактного контекста промежуточного слоя.
 */
export type TAbstractListMiddlewareContextGetter<
    TState extends IAbstractListState = IAbstractListState,
    TAction extends TAbstractAction = TAnyAbstractListAction,
    TMiddlewareContext extends TAbstractListMiddlewareContext<
        TState,
        TAction
    > = TAbstractListMiddlewareContext<TState, TAction>,
> = TAbstractMiddlewareContextGetter<TState, TAction, TMiddlewareContext>;

/**
 * Тип расширения абстрактного списочного контекста абстрактного промежуточного слоя.
 *
 * Расширение контекста позволяет добавить в контекст новые поля в слоях-наследниках, отличные от тех, что уже определены в абстрактном контексте
 *
 * Является дженерик-типом и принимает
 * * `TState` - тип состояния, с которым работает промежуточный слой.
 * * `TAction` - тип действия для обработки и дальнейшего распространения.
 * * `TMiddlewareContext` - тип абстрактного контекста промежуточного слоя.
 */
export type TListMiddlewareContextExtension<
    TState extends IAbstractListState = IAbstractListState,
    TAction extends TAbstractAction = TAnyAbstractListAction,
    TMiddlewareContext extends TAbstractListMiddlewareContext<
        TState,
        TAction
    > = TAbstractListMiddlewareContext<TState, TAction>,
> = Omit<TMiddlewareContext, keyof TAbstractListMiddlewareContext>;
