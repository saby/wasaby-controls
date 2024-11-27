import { Slice } from 'Controls-DataEnv/slice';
import type {
    TAbstractAction,
    TAbstractMiddleware,
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from 'Controls-DataEnv/dispatcher';
import { Dispatcher } from 'Controls-DataEnv/dispatcher';
import { getUnloadedDeps, UI_DEPENDENCIES } from 'Controls-DataEnv/staticLoader';
import { AbstractListActionCreators, type TAbstractListActions } from './actions';
import * as ErrorDescriptors from './ErrorDescriptors';
import { Initializer } from './Initializer';
import { createCollection } from './collection/factory';
import { getCollectionType } from './collection/utils/getCollectionType';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import type { SyntheticEvent } from 'UICommon/Events';
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
    private _rejectPromise?: TDecomposedPromise<void>;

    constructor(...[props, ...args]: ConstructorParameters<typeof Slice<TState>>) {
        super(
            {
                ...props,
                onChange: (...[state, ...onChangeArgs]: unknown[]) => {
                    this._dispatcher?.logSliceChangeStart();
                    const result = props.onChange?.(state, ...onChangeArgs);
                    this._dispatcher?.logSliceChangeEnd((state as object) || {});
                    return result;
                },
            },
            ...args
        );
        const userBeforeApplyState = this._beforeApplyState.bind(this);
        this._beforeApplyState = async (nextState: TState): Promise<TState> => {
            return this._endBeforeApplyState(
                await userBeforeApplyState(await this._startBeforeApplyState(nextState))
            );
        };
    }

    //# region Slice lifecycle API

    protected _initState(
        loadResult: IAbstractListDataFactoryLoadResult,
        config: IAbstractListDataFactoryArguments
    ): TState {
        this._collectionType = getCollectionType(config.collectionType, config.viewMode);

        return Initializer.getState(loadResult, config) as TState;
    }

    protected _onAfterInitState(state: TState): void {
        if (typeof this._collectionType === 'string') {
            // Запоминаем, чтобы знать что коллекция создана нами. Потом ее нужно уничтожить.
            state.collection = createCollection(this._collectionType, state);
        }
    }

    private async _startBeforeApplyState(nextState: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return this.state;
        }

        if (nextState._actionToDispatch) {
            this._executingActionToDispatch = nextState._actionToDispatch as TAction[];
            delete nextState._actionToDispatch;
        }

        const result = await this._dispatcher.dispatch(
            AbstractListActionCreators.complexUpdate.startUpdate(
                // @ts-ignore
                this._executingActionToDispatch
            ) as TAction
        );

        if (this.isDestroyed()) {
            return this.state;
        }

        return result;
    }
    private async _endBeforeApplyState(nextState: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return this.state;
        }

        // FIXME: Тут надо понять как луче всего настроить типы.
        //  Ругается на beforeApplyStateEnd, что его просто нет,
        //  но добавить его проблематично
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await this._dispatcher.dispatch({
            type: 'endUpdate',
            payload: {
                nextState,
                // FIXME: _propsForMigration - только на время перевода
                //  всё на dispatcher.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _propsForMigration: this._propsForMigrationToDispatcher,
            },
        });
        this._executingActionToDispatch = undefined;
        if (this._rejectPromise) {
            this._rejectPromise.resolve();
            this._rejectPromise = undefined;
            return this.state;
        }

        if (this.isDestroyed()) {
            return this.state;
        }
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

    protected async _beforeApplyState(nextState: TState): Promise<TState> {
        // Логика _beforeApplyState была разбита на две фазы: startUpdate и endUpdate,
        // исполняемые до и после прикладного _beforeApplyState.
        // Внутри платформенного _beforeApplyState ничего не выполняется.
        return nextState;
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        this._rejectPromise = getDecomposedPromise<void>();
        await this.__dispatcher?.rejectDispatch();
        await this._rejectPromise.promise;
    }

    destroy() {
        if (isLoaded('Controls-DataEnv/listDebug')) {
            loadSync<typeof import('Controls-DataEnv/listDebug')>(
                'Controls-DataEnv/listDebug'
            ).deleteLabel(this);
        }

        this._unsubscribe(this.state);
        this._dispatcher.destroy();
        this._destroyCollection();
        this._destroyOperationsController();
        super.destroy();
    }

    //# endregion Lifecycle

    //# region OldControllers

    // TODO: Сделать приватными когда удалятся аспекты, вызов будет из startBas
    protected _subscribe(state: TState): void {
        if (state.operationsController) {
            state.operationsController.subscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
                this
            );
        }
    }

    // TODO: Сделать приватными когда удалятся аспекты, вызов будет из endBas
    protected _unsubscribe(state: TState): void {
        if (state.operationsController) {
            state.operationsController.unsubscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
                this
            );
        }
    }

    private _operationsPanelExpandedChanged(_: SyntheticEvent, expanded: boolean): void {
        if (this.state.operationsPanelVisible === expanded) {
            return;
        }

        if (expanded) {
            this.openOperationsPanel();
        } else {
            this.closeOperationsPanel();
        }
    }

    private _destroyOperationsController() {
        if (!this.state.sliceOwnedByBrowser && this.state.operationsController) {
            this.state.operationsController.destroy();
        }
    }
    //# endregion OldControllers

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

    private _executingActionToDispatch?: TAction[];

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
    protected _addAction(action: TAction): void {
        // @ts-ignore
        super.setState((currentState) => {
            const _actionToDispatch = (currentState._actionToDispatch || []).filter(
                (queuedAction) => {
                    // исключаем те, что сейчас исполняются
                    // @ts-ignore
                    return !this._executingActionToDispatch?.includes(queuedAction);
                }
            );
            // @ts-ignore
            _actionToDispatch.push(action);
            return {
                _actionToDispatch,
            };
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

    setState(partialState: Partial<TState> | ((prevState: TState) => Partial<TState>)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (partialState._actionToDispatch) {
            super.setState(partialState);
        } else {
            this._addAction(
                // @ts-ignore
                AbstractListActionCreators.complexUpdate.publicSetState(partialState) as TAction
            );
        }
    }

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
     * @param {{markItem: boolean | undefined}} params
     * @return {void}
     * @public
     */
    expand(key: CrudEntityKey, params?: { markItem?: boolean }): void {
        this._addAction(
            AbstractListActionCreators.expandCollapse.expand(key, params?.markItem) as TAction
        );
    }

    /**
     * Свернуть узел
     * @function
     * @param {CrudEntityKey} key
     * @param {{markItem: boolean | undefined}} params
     * @return {void}
     * @public
     */
    collapse(key: CrudEntityKey, params?: { markItem?: boolean }): void {
        this._addAction(
            AbstractListActionCreators.expandCollapse.collapse(key, params?.markItem) as TAction
        );
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
