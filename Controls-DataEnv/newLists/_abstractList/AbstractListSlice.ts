import { Slice } from 'Controls-DataEnv/slice';
import type { TAbstractAction, TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';
import { Dispatcher } from 'Controls-DataEnv/dispatcher';
import { getUnloadedDeps, UI_DEPENDENCIES } from 'Controls-DataEnv/staticLoader';
import { AbstractListActionCreators, type TAbstractListActions } from './actions';
import * as ErrorDescriptors from './ErrorDescriptors';
import { Initializer } from './Initializer';
import ExecutingQueue from './ExecutingQueue';
import { createCollection } from './collection/factory';
import { getCollectionType, resolveCollectionType } from './collection/utils/getCollectionType';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { cookie } from 'Application/Env';
import type { SyntheticEvent } from 'UICommon/Events';
import type { TFilter, TKey, TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { TSelectionRecordContent } from 'Controls/interface';
import type { CrudEntityKey } from 'Types/source';
import type { IAbstractListState } from './interface/IAbstractListState';
import type { IAbstractListAPI } from './interface/IAbstractListAPI';
import type { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import type { TCollectionType } from './collection/types';
import type { Debugger } from 'Controls-DataEnv/newLists/_listDebug/Debugger';
import { IdleDetector } from './utils/IdleDetector';
import type {
    TAbstractListMiddlewareContext,
    TListMiddlewareContextExtension,
    TAbstractListMiddlewareContextGetter,
} from 'Controls-DataEnv/newLists/_abstractList/types/TAbstractListMiddlewareContext';
import type {
    Collection as ICollection,
    IInteractorStateProps,
    ISourceCollection,
} from 'Controls/display';
import type { EventRaisingMixin } from 'Types/entity';
import { Logger } from 'UI/Utils';

export const COOKIE_LOG_KEY = 'ListInteractorDebug';

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
        TAction extends TAbstractAction =
            | TAbstractListActions.TAnyAbstractListAction<TState>
            | TAbstractAction,
        TMiddlewareContext extends TAbstractListMiddlewareContext<
            TState,
            TAction
        > = TAbstractListMiddlewareContext<TState, TAction>,
    >
    extends Slice<TState>
    implements IAbstractListAPI
{
    // FIXME: Должна быть  приватной.
    protected _collectionType?: TCollectionType;
    private _rejectPromise?: TDecomposedPromise<void>;

    /**
     * Очередь действий, запланированных к распространению.
     */
    private readonly _actionsExecutionQueue: ExecutingQueue = new ExecutingQueue();
    /**
     * Диспатчер любого списка.
     * @private
     */
    private __dispatcher?: Dispatcher<TState, TAction, TMiddlewareContext>;

    private _debugger?: Debugger;

    get collection(): ICollection | undefined {
        return this._collection;
    }

    private _collection?: ICollection;
    // Поднимается в true во всех списках с BaseControl.
    // В них на модель и в RecordSet записи добавляет сам BaseControl.
    private _skipSetCollection: boolean = false;
    private _isPendingSetCollection: boolean = true;

    /**
     * Утилита для отлова висящих пендингов.
     * @protected
     */
    protected _idleDetector: IdleDetector = new IdleDetector();

    get isIdle(): boolean {
        return this._idleDetector.isIdle;
    }

    constructor(...[props, ...args]: ConstructorParameters<typeof Slice<TState>>) {
        super(
            {
                ...props,
                onChange: (...[state, ...onChangeArgs]: unknown[]) => {
                    this._debugger?.logSliceChangeStart();
                    const result = props.onChange?.(state, ...onChangeArgs);
                    this._debugger?.logSliceChangeEnd((state as object) || {});
                    return result;
                },
                onCompleteBeforeApplyState: () => {
                    this._actionsExecutionQueue.endExecution();
                },
            },
            ...args
        );

        // Инициализируем модуль отладки по требованию.
        this._initDebuggerSync();

        const userBeforeApplyState = this._beforeApplyState.bind(this);

        this._beforeApplyState = async (nextState: TState): Promise<TState> => {
            // Важно: Установка исполняемых действий должна происходить в синхронной части beforeApplyState.
            // От начала setState и до этой строчки код исполняется синхронно.

            // В противном случае выполнение асинхронного кода отложит вызов startExecution,
            // который помечает, что начался цикл обновления и очередная пачка действий
            // ушла на исполнение.
            // Тогда в callback внутри addAction придет неактуальное состояние.
            // stateForApply уже будет содержать действия, но они еще не будут помечены как исполняемые,
            // следовательно, нельзя отличить исполняемые действия от планируемых.
            // Проблемный сценарий, если executingActions проставляется в startUpdate:
            // setState( changeRoot1 );
            // setState( changeRoot2 );
            // ----
            // [changeRoot1] - действия первого bas
            // [changeRoot1, changeRoot2] - действия второго bas.
            // addAction запланирует тот, что уже исполняется
            if (nextState._actionToDispatch) {
                this._actionsExecutionQueue.startExecution(nextState._actionToDispatch);
                delete nextState._actionToDispatch;
            }

            // Инициализируем модуль отладки по требованию.
            await this._initDebuggerAsync();
            this._debugger?.startSession(this.state);
            const endResult = await this._endUpdate(
                await userBeforeApplyState(await this._startUpdate(nextState))
            );
            this._debugger?.endSession(endResult);
            return endResult;
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

        if (state.collection) {
            this._collection = state.collection;
        } else {
            this._isPendingSetCollection = true;
        }
    }

    protected _onSnapshot(nextState: TState): TState {
        if (this._collection !== nextState.collection) {
            if (this._collection !== nextState.collection && this._isPendingSetCollection) {
                nextState.collection = this._collection;
            } else {
                this._collection = nextState.collection;
            }
        }
        // TODO: Проверка будет удалена по проекту (старый список без CollectionType).
        if (!this._collection) {
            return nextState;
        } else {
            this._applyChangesToCollection(nextState);
            // @ts-ignore Пока непонятно нужно ли это поле вообще
            this._applyChangesToSourceController(nextState.navigationChanges);
            return {
                // Новые изменения старой логики слайса
                ...nextState,
                // Не костыль, специчный код, вызванный мутабельностью RecordSet, SourceController.
                itemsChanges: undefined,
                navigationChanges: undefined,
            };
        }
    }

    protected _applyChangesToSourceController(_?: unknown): void {}

    private async _startUpdate(_nextState: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return this.state;
        }

        const result = await this._dispatcher.dispatch(
            AbstractListActionCreators.complexUpdate.startUpdate(
                this._actionsExecutionQueue.getExecuting() as TAbstractListActions.TAnyAbstractListAction[]
            ) as TAction
        );

        if (this.isDestroyed()) {
            return this.state;
        }

        this._notifySubscribers(result);

        return result;
    }

    protected async _beforeApplyState(nextState: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return this.state;
        }

        return this._dispatcher.dispatch(
            AbstractListActionCreators.complexUpdate.beforeApplyState(
                nextState,
                // FIXME: _propsForMigration - только на время перевода
                //  всё на dispatcher.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._propsForMigrationToDispatcher
            ) as TAction
        );
    }

    private async _endUpdate(nextState: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }
        if (this._rejectPromise) {
            this._rejectPromise.resolve();
            this._rejectPromise = undefined;
            return this.state;
        }

        await getUnloadedDeps(nextState, UI_DEPENDENCIES);
        const newCollectionType = getCollectionType(this._collectionType, nextState.viewMode);

        if (this._collectionType !== newCollectionType) {
            this._destroyCollection();
            this._collectionType = newCollectionType;
            if (this._collectionType) {
                nextState.collection = createCollection(this._collectionType, nextState);
            }
        }
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

    // FIXME: Закрыть доступ, сделать приватным.
    // protected только пока мобильный Slice не полностью сведен.
    protected get _dispatcher(): Dispatcher<TState, TAction, TMiddlewareContext> {
        if (!this.__dispatcher) {
            this.__dispatcher = this._createDispatcher();
        }
        return this.__dispatcher;
    }

    private _createDispatcher(): Dispatcher<TState, TAction, TMiddlewareContext> {
        return new Dispatcher<TState, TAction, TMiddlewareContext>({
            debuggerInstance: this._debugger,
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

    protected abstract _getMiddlewaresContextExtension(): TListMiddlewareContextExtension<
        TState,
        TAction,
        TMiddlewareContext
    >;

    private _getMiddlewaresContext(): ReturnType<
        TAbstractListMiddlewareContextGetter<TState, TAction, TMiddlewareContext>
    > {
        return {
            ...this._getMiddlewaresContextExtension(),
            getCollection: () => this._collection,
            getSkipSetCollection: () => this._skipSetCollection,
            scheduleDispatch: (action: TAction) => {
                this._addAction(action);
            },
            registerPendingPromise: this._idleDetector.registerPendingPromise.bind(
                this._idleDetector
            ),
        } as ReturnType<TAbstractListMiddlewareContextGetter<TState, TAction, TMiddlewareContext>>;
    }

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

    /**
     * Добавляет действие в очередь для распространения.
     */
    protected _addAction(action: TAction): void {
        // Инициируется попытка обновления состояния
        this.setState({
            _updateToken: this._actionsExecutionQueue.addAction(
                action as TAbstractListActions.TAnyAbstractListAction
            ),
        } as Partial<TState>);
    }

    //# endregion Dispatcher

    //# region Debug
    private _isDebuggerNeeded(): boolean {
        return !!cookie.get(COOKIE_LOG_KEY);
    }

    private _createDebugger({ Debugger, initLabel }: typeof import('Controls-DataEnv/listDebug')) {
        const dispatcherId = initLabel(this, this._name) || this._name;
        this._debugger = new Debugger(dispatcherId, cookie.get(COOKIE_LOG_KEY) as string);
        this.__dispatcher?.setDebugger(this._debugger);
    }

    private _destroyDebugger() {
        if (this._debugger) {
            this._debugger.destroy();
            this._debugger = undefined;
            this.__dispatcher?.setDebugger(this._debugger);
        }
    }

    private _initDebuggerSync() {
        if (!this._debugger && this._isDebuggerNeeded() && isLoaded('Controls-DataEnv/listDebug')) {
            this._createDebugger(
                loadSync<typeof import('Controls-DataEnv/listDebug')>('Controls-DataEnv/listDebug')
            );
        } else {
            this._destroyDebugger();
        }
    }

    private async _initDebuggerAsync() {
        if (this._debugger) {
            return;
        }
        if (!this._isDebuggerNeeded()) {
            this._destroyDebugger();
            return;
        }
        let lib: typeof import('Controls-DataEnv/listDebug');
        if (isLoaded('Controls-DataEnv/listDebug')) {
            lib = loadSync<typeof import('Controls-DataEnv/listDebug')>(
                'Controls-DataEnv/listDebug'
            );
        } else {
            lib = await loadAsync<typeof import('Controls-DataEnv/listDebug')>(
                'Controls-DataEnv/listDebug'
            );
        }
        this._createDebugger(lib);
    }

    //# endregion Debug

    //# region ListEnv API

    /**
     * Открыть панель массовых операций
     */
    openOperationsPanel(): void {
        const action = AbstractListActionCreators.operationsPanel.openOperationsPanel();
        this._addAction(action as TAction);
    }

    /**
     * Закрыть панель массовых операций
     */
    closeOperationsPanel(): void {
        const action = AbstractListActionCreators.operationsPanel.closeOperationsPanel();
        this._addAction(action as TAction);
    }

    /**
     * Открыть окна фильтров
     */
    openFilterDetailPanel(): void {
        const action = AbstractListActionCreators.filter.openFilterDetailPanel();
        this._addAction(action as TAction);
    }

    /**
     * Закрыть окна фильтров
     */
    closeFilterDetailPanel(): void {
        const action = AbstractListActionCreators.filter.closeFilterDetailPanel();
        this._addAction(action as TAction);
    }

    //# endregion ListEnv API

    //# region List API

    abstract getSelection(): Promise<TSelectionRecordContent>;

    setState(partialState: Partial<TState> | ((prevState: TState) => Partial<TState>)) {
        if (
            typeof partialState !== 'function' &&
            this._actionsExecutionQueue.checkUpdateToken(partialState._updateToken)
        ) {
            if (this._actionsExecutionQueue.getExecuting()) {
                // Планирую проверку очереди экшенов после завершения работы beforeApplyState
                super.setState({
                    _updateToken: this._actionsExecutionQueue.scheduleCheckQueue(),
                } as Partial<TState>);
            } else {
                // Код выполняется в том случае, beforeApplyState сейчас не исполняется,
                // поэтому this.state является наиболее актуальным состоянием
                const filteredActions = this._actionsExecutionQueue.prepareForExecution(this.state);
                if (!filteredActions?.length) {
                    return;
                }
                super.setState({
                    _actionToDispatch: filteredActions,
                } as Partial<TState>);
            }
        } else {
            this._addAction(
                AbstractListActionCreators.complexUpdate.publicSetState(partialState) as TAction
            );
        }
    }

    // Возвращается значение для совместимости со старыми таблицами в WEB.
    setCollection<T extends ICollection>(
        collection: T | null,
        isOnInitInOldLists?: boolean
    ): boolean {
        // https://online.sbis.ru/opendoc.html?guid=78cd4cb6-ed7b-44c5-8cba-46b16af4a91d&client=3
        if (collection === this._collection) {
            return !!this._collection;
        }

        if (collection && !collection['[Controls/display:Collection]' as keyof T]) {
            Logger.error(
                'Controls-DataEnv/abstractList:AbstractListSlice',
                this,
                new Error(
                    'Controls-DataEnv/abstractList:AbstractListSlice setCollection: коллекция должна быть наследником Controls/display:Collection'
                )
            );
            this._collection = undefined;
            return false;
        }

        let alias;
        try {
            alias = collection ? resolveCollectionType(collection) : undefined;
        } catch (e) {
            alias = undefined;
            Logger.error('Controls-DataEnv/abstractList:AbstractListSlice', this, e as object);
        }

        if (alias) {
            this._collection = collection ?? undefined;
            // Необходимо разработать слой совместимости
            // Одни и те же операции происходят в Slice, а затем в BaseControl
            // Последствия такого поведения непредсказуемы
            this._skipSetCollection = true;
        } else {
            this._collection = undefined;
            this._skipSetCollection = false;
        }

        if (this._collection && isOnInitInOldLists) {
            // TODO: избавиться, если возможно от рассинхрона со стейтом слайса по задаче
            // https://online.sbis.ru/opendoc.html?guid=28fc0b36-6e6c-4787-a277-28f34015769b&client=3
            this._collection.setMarkedKey(this._initMarker(this.state));
        }

        return !!this._collection;
    }

    protected _initMarker(state: TState): TKey | undefined {
        if (state.markerVisibility === 'hidden') {
            return undefined;
        }

        let newMarkedKey = state.markedKey;

        if (state.markerVisibility === 'visible' && state.items) {
            const item =
                state.markedKey !== undefined &&
                state.markedKey !== null &&
                state.items.getRecordById(state.markedKey);
            if (state.items.getCount() && !item) {
                newMarkedKey = state.items.at(0).getKey();
            }
        }

        return newMarkedKey;
    }

    /**
     * Установить подключение слоя представления к ViewModel.
     * @public
     */
    connect(): void {
        this._addAction(AbstractListActionCreators.interactorCore.connect() as TAction);
    }

    /**
     * Отключает слой представления от ViewModel.
     * @public
     */
    disconnect(): void {
        // FIXME: Тут падает ошибка React. Пока это не требуется - переношу в тонкий интерактор.
        // this._addAction(AbstractListActionCreators.interactorCore.disconnect() as TAction);
    }

    /**
     * Сменить корневой элемент
     * @public
     */
    changeRoot(key: TKey): void {
        this._addAction(AbstractListActionCreators.root.changeRoot(key) as TAction);
    }

    /**
     * Раскрыть узел
     * @public
     */
    expand(key: CrudEntityKey, params?: { markItem?: boolean }): void {
        this._addAction(
            AbstractListActionCreators.expandCollapse.expand(key, params?.markItem) as TAction
        );
    }

    /**
     * Свернуть узел
     */
    collapse(key: CrudEntityKey, params?: { markItem?: boolean }): void {
        this._addAction(
            AbstractListActionCreators.expandCollapse.collapse(key, params?.markItem) as TAction
        );
    }

    /**
     * Отметить элемент
     */
    mark(key: TKey | undefined): void {
        this._addAction(AbstractListActionCreators.marker.mark(key) as TAction);
    }

    /**
     * Загрузить предыдущую "пачку" данных.
     */
    prev(): void {
        this._addAction(AbstractListActionCreators.source.loadPrev() as TAction);
    }

    /**
     * Загрузить следующую "пачку" данных.
     */
    next(): void {
        this._addAction(AbstractListActionCreators.source.loadNext() as TAction);
    }

    /**
     * Выделить элемент
     */
    select(key: CrudEntityKey, direction?: TSingleAxisDirection): void {
        this._addAction(AbstractListActionCreators.selection.select(key, direction) as TAction);
    }

    /**
     * Выделить все элементы
     */
    selectAll(): void {
        this._addAction(AbstractListActionCreators.selection.selectAll() as TAction);
    }

    /**
     * Сбросить выделение
     */
    resetSelection(): void {
        this._addAction(AbstractListActionCreators.selection.resetSelection() as TAction);
    }

    /**
     * Инвертировать выделение
     */
    invertSelection(): void {
        this._addAction(AbstractListActionCreators.selection.invertSelection() as TAction);
    }

    /**
     * Запустить поиск
     */
    search(searchValue: string): void {
        this._addAction(AbstractListActionCreators.search.startSearch(searchValue) as TAction);
    }

    /**
     * Сбросить поиск с очисткой строки поиска
     */
    resetSearch(): void {
        this._addAction(AbstractListActionCreators.search.resetSearch() as TAction);
    }

    /**
     * Установить фильтр
     */
    setFilter(filter: TFilter): void {
        this._addAction(AbstractListActionCreators.filter.setFilter(filter) as TAction);
    }

    //# endregion List API

    //# region Рельсы работы с аспектами

    //  Метод, применяющий список изменений к коллекции
    protected _applyChangesToCollection(nextState: TState): void {
        // Проверка на destroyed нужна пока:
        // 1) BaseControl сам создает и разрушает коллекцию в схеме с синтетическим слайсом;
        // 2) Не будет отвечено на вопрос как к одному слайсу присоединить больше одной вьюхи (а значит и вьюмодели).
        // https://online.sbis.ru/opendoc.html?guid=d82beb6c-0173-4b5b-b465-82bc76e2b8c5&client=3
        if (!this._collection || this._collection.destroyed) {
            return;
        }

        // Глушим события, если они уже не заглушены.
        // Изначально, нужно было глушить и рекордсет, но этого не сделали.
        // Теперь включать опасно, дела только для мобильного слайса.
        const collectionMute = eventRaisingMuteWrapper(this._collection).mute();

        if ('items' in nextState && nextState.items) {
            const prevMetaData = this.state.items?.getMetaData?.();
            const nextMetaData = nextState.items.getMetaData();
            if (prevMetaData?.path !== nextMetaData?.path) {
                const recordSet = this._collection.getSourceCollection();
                recordSet.setMetaData({
                    ...recordSet.getMetaData(),
                    path: nextState.breadCrumbsItems,
                });
            }
        }

        const collectionOptions = [
            'itemActionsMap',
            'selectionModel',
            'root',
            'collapsedItems',
            'expandedItems',
            'markedKey',
            'expansionModel',
        ];
        this._collection.updateInteractorStateProps(
            collectionOptions.reduce((acc: IInteractorStateProps, fieldName) => {
                const key = fieldName as keyof TState;
                if (this.state[key] !== nextState[key]) {
                    acc[key as keyof IInteractorStateProps] = nextState[key];
                }
                return acc;
            }, {})
        );

        // items middleware
        if (this._collectionType) {
            if (this.state.items !== nextState.items && !this._skipSetCollection) {
                this._collection.setCollection(nextState.items as ISourceCollection<any>);
            }

            if (this.state.keyProperty !== nextState.keyProperty) {
                this._collection.setKeyProperty(nextState.keyProperty);
            }

            if (nextState.metaData && this.state.metaData !== nextState.metaData) {
                this._collection.setMetaData(nextState.metaData);
            }
        }

        // Возвращаем способность отстрела событиями как была до нас.
        collectionMute.unmute();
    }

    //# endregion Рельсы работы с аспектами
}

type TDecomposedPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};

const getDecomposedPromise = <T>(): TDecomposedPromise<T> => {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: unknown) => void;

    const promise = new Promise<T>((onResolve, onReject) => {
        resolve = onResolve;
        reject = onReject;
    });

    return {
        promise,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolve,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reject,
    };
};

interface IMuteWrapper {
    mute: () => IMuteWrapper;
    unmute: () => IMuteWrapper;
}

const eventRaisingMuteWrapper = (inst: EventRaisingMixin): IMuteWrapper => {
    let wasRaising: boolean;

    const self: IMuteWrapper = {
        mute: (): IMuteWrapper => {
            if (!inst || !inst.isEventRaising()) {
                return self;
            }

            wasRaising = true;
            inst.setEventRaising(false, true);
            return self;
        },
        unmute: () => {
            if (wasRaising && !inst.isEventRaising()) {
                inst.setEventRaising(true, true);
            }

            return self;
        },
    };
    return self;
};
