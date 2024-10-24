/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { Slice } from 'Controls-DataEnv/slice';
import { Dispatcher } from 'Controls-DataEnv/dispatcher';
import { getUnloadedDeps, UI_DEPENDENCIES } from 'Controls-DataEnv/staticLoader';
import { type TAbstractListActions, AbstractListActionCreators } from './actions';
import * as ErrorDescriptors from './ErrorDescriptors';
import { createCollection } from './collection/factory';
import { getCollectionType } from './collection/utils/getCollectionType';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

import type {
    TAbstractAction,
    TAbstractMiddleware,
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';
import type { TFilter, TKey } from 'Controls-DataEnv/interface';
import type { TSelectionRecordContent } from 'Controls/interface';
import type { CrudEntityKey } from 'Types/source';
import type { IAbstractListState } from './interface/IAbstractListState';
import type { IAbstractListAPI } from './interface/IAbstractListAPI';
import type { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import type { TCollectionType } from './collection/types';

/**
 * Абстрактный слайс списка.
 * Предоставляет интерфейсы(API и методы), доступные в любом списке.
 * @remark
 * Полезные ссылки:
 * * Подробнее про слайс для работы со списочными компонентами читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ статье}
 * @class
 * @abstract
 * @extends Slice
 * @public
 * @author Родионов Е.А.
 */
export abstract class AbstractListSlice<
        TState extends IAbstractListState = IAbstractListState,
        TAction extends TAbstractListActions.TAnyAbstractAction | TAbstractAction =
            | TAbstractListActions.TAnyAbstractAction
            | TAbstractAction,
        TMiddlewareContext extends TAbstractMiddlewareContext<
            TState,
            TAction
        > = TAbstractMiddlewareContext<TState, TAction>,
    >
    extends Slice<TState>
    implements IAbstractListAPI
{
    private _collectionType?: TCollectionType;

    constructor(...[props, ...args]: ConstructorParameters<typeof Slice<TState>>) {
        super(
            {
                ...props,
                onChange: (...[state, ...onChangeArgs]: unknown[]) => {
                    const result = props.onChange?.(state, ...onChangeArgs);
                    this._dispatcher?.logSliceChange((state as object) || {});
                    return result;
                },
            },
            ...args
        );
        // const userBeforeApplyState = this._beforeApplyState.bind(this);
        // this._beforeApplyState = async (nextState: TState): Promise<TState> => {
        //     return this._endBeforeApplyState(
        //         await userBeforeApplyState(await this._startBeforeApplyState(nextState))
        //     );
        // };
    }

    //# region Slice lifecycle API

    protected _initState(
        loadResult: IAbstractListDataFactoryLoadResult,
        config: IAbstractListDataFactoryArguments
    ): TState {
        this._collectionType = getCollectionType(config.collectionType, config.viewMode);

        return {
            isLatestInteractorVersion: loadResult.isLatestInteractorVersion,
        } as TState;
    }

    protected _onAfterInitState(state: TState): void {
        if (typeof this._collectionType === 'string') {
            // Запоминаем, чтобы знать что коллекция создана нами. Потом ее нужно уничтожить.
            state.collection = createCollection(this._collectionType, state);
        }
    }

    // private async _startBeforeApplyState(nextState: TState): Promise<TState> {
    //     return nextState;
    // }
    // private async _endBeforeApplyState(nextState: TState): Promise<TState> {
    //     return nextState;
    // }

    protected async _beforeApplyState(nextState: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return this.state;
        }

        this._executingActionToDispatch = nextState._actionToDispatch as Map<string, TAction>;
        if (nextState._actionToDispatch) {
            delete nextState._actionToDispatch;
        }

        // FIXME: Тут надо понять как луче всего настроить типы.
        //  Ругается на beforeApplyState, что его просто нет,
        //  но добавить его проблематично
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await this._dispatcher.dispatch({
            type: 'beforeApplyState',
            payload: {
                nextState,
                // FIXME: _propsForMigration - только на время перевода
                //  всё на dispatcher.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _propsForMigration: this._propsForMigrationToDispatcher,
                actionsToDispatch: this._executingActionToDispatch,
            },
        });

        if (this.isDestroyed()) {
            return this.state;
        }

        this._executingActionToDispatch = undefined;

        await getUnloadedDeps(result, UI_DEPENDENCIES);

        const newCollectionType = getCollectionType(this._collectionType, result.viewMode);

        if (this._collectionType !== newCollectionType) {
            this._destroyCollection();
            this._collectionType = newCollectionType;
            if (this._collectionType) {
                result.collection = createCollection(this._collectionType, result);
            }
        }

        return result;
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        await this.__dispatcher?.rejectDispatch();
    }

    destroy() {
        if (isLoaded('Controls-DataEnv/listDebug')) {
            loadSync<typeof import('Controls-DataEnv/listDebug')>(
                'Controls-DataEnv/listDebug'
            ).deleteLabel(this);
        }

        this._dispatcher.destroy();
        this._destroyCollection();
        super.destroy();
    }

    //# endregion Lifecycle

    //# region Collection
    private _destroyCollection(): void {
        if (this.state.collection && this._collectionType) {
            // Уничтожаем коллекцию, если сами ее создали.
            // Если ее нам проставил список, то ее трогать нельзя.
            this.state.collection.destroy();
        }
    }
    //# endregion Collection

    //# region Dispatcher

    /**
     * Диспатчер любого списка.
     * @private
     */
    private __dispatcher: Dispatcher<TState, TAction, TMiddlewareContext>;

    private _executingActionToDispatch?: Map<string, TAction>;

    // FIXME: Закрыть доступ, сделать приватным.
    // protected только пока мобильный Slice не полностью сведен.
    protected get _dispatcher(): Dispatcher<TState, TAction, TMiddlewareContext> {
        if (!this.__dispatcher) {
            this.__dispatcher = this._createDispatcher();
        }
        return this.__dispatcher;
    }
    private _createDispatcher(): Dispatcher<TState, TAction, TMiddlewareContext> {
        const dispatcherId = isLoaded('Controls-DataEnv/listDebug')
            ? loadSync<typeof import('Controls-DataEnv/listDebug')>(
                  'Controls-DataEnv/listDebug'
              ).initLabel(this, this._name)
            : this._name;

        return new Dispatcher<TState, TAction, TMiddlewareContext>({
            dispatcherId,
            getState: () => this.state,
            applyState: (state) => this._applyState(state),
            middlewares: this._getMiddlewares(),
            middlewareContextGetter: () => this._getMiddlewaresContext(),
        });
    }

    protected abstract _getMiddlewares(): TAbstractMiddleware<
        TState,
        TAction,
        TMiddlewareContext
    >[];

    protected abstract _getMiddlewaresContext(): ReturnType<
        TAbstractMiddlewareContextGetter<TState, TAction, TMiddlewareContext>
    >;

    // TODO: Doc
    protected _addAsyncAction<TActionResult>(action: TAction): Promise<TActionResult> {
        const { promise, resolve, reject } = getDecomposedPromise<TActionResult>();

        this._addAction({
            ...action,
            payload: {
                ...action.payload,
                onResolve: resolve,
                onReject: reject,
            },
        });

        return promise;
    }

    // TODO: Doc
    protected _addAction(
        action: TAction,
        nextState?: Partial<TState> | ((prevState: TState) => Partial<TState>)
    ): void {
        this.setState((currentState) => {
            const notExecutingActions = new Map<string, TAction>();

            // Чтобы не ругался тип, нужно IState обогатить дженериком
            // действия, а это неудобно. Пока нет других идей, будет ignore.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let newState: Partial<TState> = {
                _actionToDispatch: notExecutingActions,
            };

            if (currentState._actionToDispatch) {
                // Действия, которые уже установлены на состояние и будут выполняться.
                for (const existingOnStateAction of currentState._actionToDispatch.values()) {
                    // Находим из существующих те, которые в данный момент НЕ выполняются.
                    if (
                        this._executingActionToDispatch?.get(existingOnStateAction.type) !==
                        existingOnStateAction
                    ) {
                        notExecutingActions.set(action.type, action);
                    }
                }
            }

            // Устанавливаем переданное действие в очередь.
            notExecutingActions.set(action.type, action);

            // Временное решение, удалить после удаления всех аспектов
            if (nextState) {
                newState =
                    typeof nextState === 'function'
                        ? { ...nextState({ ...currentState, ...newState }), ...newState }
                        : { ...nextState, ...newState };
            }

            return newState;
        });
    }
    //# endregion Dispatcher

    //# region ListEnv API

    /**
     * Открыть панель массовых операций
     * @function
     * @return {void}
     * @public
     */
    openOperationsPanel(): void {
        const action = AbstractListActionCreators.operationsPanel.openOperationsPanel();
        this._addAction(action as TAction);
    }

    /**
     * Закрыть панель массовых операций
     * @function
     * @return {void}
     * @public
     */
    closeOperationsPanel(): void {
        const action = AbstractListActionCreators.operationsPanel.closeOperationsPanel();
        this._addAction(action as TAction);
    }

    /**
     * Открыть окна фильтров
     * @function
     * @public
     * @return {void}
     */
    openFilterDetailPanel(): void {
        const action = AbstractListActionCreators.filter.openFilterDetailPanel();
        this._addAction(action as TAction);
    }

    /**
     * Закрыть окна фильтров
     * @function
     * @public
     * @return {void}
     */
    closeFilterDetailPanel(): void {
        const action = AbstractListActionCreators.filter.closeFilterDetailPanel();
        this._addAction(action as TAction);
    }

    //# endregion ListEnv API

    //# region List API

    abstract getSelection(): Promise<TSelectionRecordContent>;

    /**
     * Установки подключение слоя представления к ViewModel.
     * @function
     * @return {void}
     * @public
     */
    connect(): void {
        this._addAction(AbstractListActionCreators.interactorCore.connect() as TAction);
    }

    /**
     * Отключает слой представления от ViewModel.
     * @function
     * @return {void}
     * @public
     */
    disconnect(): void {
        // FIXME: Тут падает ошибка React. Пока это не требуется - переношу в тонкий интерактор.
        // this._addAction(AbstractListActionCreators.interactorCore.disconnect() as TAction);
    }

    /**
     * Сменить корневой элемент
     * @function
     * @param {CrudEntityKey | null} key
     * @return {void}
     * @public
     */
    changeRoot(key: TKey): void {
        this._addAction(AbstractListActionCreators.root.setRoot(key) as TAction);
    }

    /**
     * Раскрыть узел
     * @function
     * @param {CrudEntityKey} key
     * @return {void}
     * @public
     */
    expand(key: CrudEntityKey, _params?: { markItem?: boolean }): void {
        // FIXME: поддержать params с отметкой
        this._addAction(AbstractListActionCreators.expandCollapse.expand(key) as TAction);
    }

    /**
     * Свернуть узел
     * @function
     * @param {CrudEntityKey} key
     * @return {void}
     * @public
     */
    collapse(key: CrudEntityKey, _params?: { markItem?: boolean }): void {
        // FIXME: поддержать params с отметкой
        this._addAction(AbstractListActionCreators.expandCollapse.collapse(key) as TAction);
    }

    /**
     * Отметить элемент
     * @function
     * @param {TKey | undefined} key
     * @return {void}
     * @public
     */
    mark(key: TKey | undefined): void {
        this._addAction(AbstractListActionCreators.marker.setMarkedKey(key) as TAction);
    }

    /**
     * Загрузить предыдущую "пачку" данных.
     * @function
     * @return {void}
     * @public
     */
    prev(): void {
        this._addAction(AbstractListActionCreators.source.loadPrev() as TAction);
    }

    /**
     * Загрузить следующую "пачку" данных.
     * @function
     * @return {void}
     * @public
     */
    next(): void {
        this._addAction(AbstractListActionCreators.source.loadNext() as TAction);
    }

    /**
     * Выделить элемент
     * @function
     * @param {CrudEntityKey} key
     * @param {'backward' | 'forward'} direction
     * @return {void}
     * @public
     */
    select(key: CrudEntityKey, direction?: 'backward' | 'forward'): void {
        // FIXME: создать тип для direction. Именно тип, не enum
        this._addAction(AbstractListActionCreators.selection.select(key, direction) as TAction);
    }

    /**
     * Выделить все элементы
     * @function
     * @return {void}
     * @public
     */
    selectAll(): void {
        this._addAction(AbstractListActionCreators.selection.selectAll() as TAction);
    }

    /**
     * Сбросить выделение
     * @function
     * @return {void}
     * @public
     */
    resetSelection(): void {
        this._addAction(AbstractListActionCreators.selection.resetSelection() as TAction);
    }

    /**
     * Инвертировать выделение
     * @function
     * @return {void}
     * @public
     */
    invertSelection(): void {
        this._addAction(AbstractListActionCreators.selection.invertSelection() as TAction);
    }

    /**
     * Запустить поиск
     * @function
     * @param {string} searchValue
     * @return {void}
     * @public
     */
    search(searchValue: string): void {
        this._addAction(AbstractListActionCreators.search.startSearch(searchValue) as TAction);
    }

    /**
     * Сбросить поиск с очисткой строки поиска
     * @function
     * @return {void}
     * @public
     */
    resetSearch(): void {
        this._addAction(AbstractListActionCreators.search.resetSearch() as TAction);
    }

    /**
     * Установить фильтр
     * @function
     * @param {TFilter} filter Фильтр
     * @return {void}
     * @public
     */
    setFilter(filter: TFilter): void {
        this._addAction(AbstractListActionCreators.filter.setFilter(filter) as TAction);
    }

    //# endregion List API
}

type TDecomposedPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};

const getDecomposedPromise = <T>(): TDecomposedPromise<T> => {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((onResolve, onReject) => {
        resolve = onResolve;
        reject = onReject;
    });

    return {
        promise,
        // @ts-ignore
        resolve,
        // @ts-ignore
        reject,
    };
};
