import { Slice } from 'Controls-DataEnv/slice';
import type { TAbstractAction, TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';
import { Dispatcher } from 'Controls-DataEnv/dispatcher';
import { getUnloadedDeps, LibPaths } from 'Controls-DataEnv/staticLoader';
import { AbstractListActionCreators, type TAbstractListActions } from './actions';
import * as ErrorDescriptors from './ErrorDescriptors';
import { Initializer } from './Initializer';
import ExecutingQueue from './ExecutingQueue';
import { createCollection } from './collection/factory';
import { getCollectionType } from './collection/utils/getCollectionType';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import type { SyntheticEvent } from 'UICommon/Events';
import type { TFilter, TKey, TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { TSelectionRecordContent } from 'Controls-DataEnv/listTypes';
import type { CrudEntityKey } from 'Types/source';
import type {
    ChangeAction,
    IAbstractListState,
    TItemsChange,
} from './interface/IAbstractListState';
import type { IAbstractListAPI } from './interface/IAbstractListAPI';
import type { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import type { TCollectionType } from './collection/types';
import type * as DebugLib from 'Controls-DataEnv/listDebug';
import { AsyncOperationsOrchestrator } from './AsyncOperationsOrchestrator';
import type {
    TAbstractListMiddlewareContext,
    TListMiddlewareContextExtension,
    TAbstractListMiddlewareContextGetter,
} from './types/TAbstractListMiddlewareContext';
import type {
    Collection as ICollection,
    IInteractorStateProps,
    ISourceCollection,
} from 'Controls/display';
import type { EventRaisingMixin, Model } from 'Types/entity';
import { interactorCore } from './middlewares/interactorCore';
import type { RecordSet } from 'Types/collection';
import { getDecomposedPromise, TDecomposedPromise } from './utils/DecomposedPromise';

/**
 * Абстрактный слайс списка.
 * Предоставляет интерфейсы (API и методы), доступные в любом списке.
 * @remark
 * Полезные ссылки:
 * <ul>
 *     <li>Подробнее про слайс для работы со списочными компонентами читайте в {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ статье}</li>
 * </ul>
 *
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
    private _collectionType?: TCollectionType;
    private _rejectPromise?: TDecomposedPromise<void>;
    private _cachedItemsChanges: TItemsChange[] = [];

    /**
     * Очередь действий, запланированных к распространению.
     */
    private readonly _actionsExecutionQueue: ExecutingQueue = new ExecutingQueue();
    /**
     * Диспатчер любого списка.
     * @private
     */
    private __dispatcher?: Dispatcher<TState, TAction, TMiddlewareContext>;

    private _debugger?: DebugLib.Debugger;

    // В некоторых случаях (например replaceAllItems) необходимо игнорировать skipSetCollection и принудительно обновлять items в случае изменения
    private _forceCollectionUpdate?: boolean;

    get collection(): ICollection | undefined {
        return this._collection;
    }

    protected _collection?: ICollection;
    // Поднимается в true во всех списках с BaseControl.
    // В них на модель и в RecordSet записи добавляет сам BaseControl.
    protected _skipSetCollection: boolean = false;

    // Является ли коллекция в поле _collection более актуальным, чем на состоянии.
    // Такое бывает только в текущих списках, которые сами создают коллекцию на уровне View.
    protected _isPrivateCollectionMoreActual: boolean = false;

    // Флаг, определяющий выполняется ли сейчас обновление слайса.
    protected _isSliceUpdating: boolean = false;

    /**
     * Утилита для отслеживания незавершенных Promise.
     * @protected
     */
    protected _asyncOperationsOrchestrator: AsyncOperationsOrchestrator =
        new AsyncOperationsOrchestrator();

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
                    this._debugger?.onEndUpdateSession(this.state);
                },
            },
            ...args
        );

        // Инициализируем модуль отладки по требованию.
        this._initDebuggerSync();

        // Никто кроме абстрактного слайса не в силах устанавливать данное состояние.
        this.state.isDebugging = !!this._debugger?.isEnabled();

        this._debugger?.onSliceInitialized(props.loadResult, props.config, this.state);

        const userBeforeApplyState = this._beforeApplyState.bind(this);

        this._beforeApplyState = async (nextState: TState): Promise<TState> => {
            this._isSliceUpdating = true;
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
            delete nextState._updateToken;
            this._actionsExecutionQueue.startExecution();

            // Инициализируем модуль отладки по требованию.
            await this._initDebuggerAsync();

            this._unsubscribe(nextState);

            const stateAfterStartUpdate = await this._startUpdate(nextState);

            let resultUserState: TState;
            try {
                resultUserState = await userBeforeApplyState(stateAfterStartUpdate);
            } catch (e) {
                resultUserState = this.state;
                this._rejectBeforeApplyPromise();
            }

            const stateAfterEndUpdate = await this._endUpdate(resultUserState);

            this._subscribe(stateAfterEndUpdate);

            this._isSliceUpdating = false;

            // При обновлении состояния searchInputValue запоминается на момент старта beforeApplyState
            // и за время исполнения мидлвар устаревает, поскольку слайс его не контролирует.
            // Значение необходимо актуализировать в максимально синхронной точке от расчета состояния до его установки.
            stateAfterEndUpdate.searchInputValue = this.state.searchInputValue;
            return stateAfterEndUpdate;
        };
    }

    isIdle(): boolean {
        // Слайс считается в состоянии простоя, если не происходит обновления состояния и нету незавершенных промисов.
        // isDispatching нельзя использовать, поскольку обновление слайса состоит из нескольких фаз.
        return this._asyncOperationsOrchestrator.isIdle && !this._isSliceUpdating;
    }

    //# region Slice lifecycle API

    protected _initState(
        loadResult: IAbstractListDataFactoryLoadResult,
        config: IAbstractListDataFactoryArguments
    ): TState {
        this._collectionType = getCollectionType(config.collectionType, config.viewMode);

        this._forceCollectionUpdate = !!config.task88221034059907;

        return Initializer.getState(loadResult, config) as TState;
    }

    protected _onAfterInitState(state: TState): void {
        if (typeof this._collectionType === 'string') {
            // Запоминаем, чтобы знать что коллекция создана нами. Потом ее нужно уничтожить.
            state.collection = createCollection(this._collectionType, state);
        }

        if (state.collection) {
            this._collection = state.collection;
        }
    }

    protected _onSnapshot(nextState: TState): TState {
        // Текущие списки, совместимость, актуализируем модель на состоянии.
        if (this._collection !== nextState.collection) {
            if (this._isPrivateCollectionMoreActual) {
                nextState.collection = this._collection;
                this._isPrivateCollectionMoreActual = false;
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
                navigationChanges: undefined,
            };
        }
    }

    protected _applyChangesToSourceController(_?: unknown): void {}

    private async _startUpdate(_nextState: TState): Promise<TState> {
        const actions = this._actionsExecutionQueue.getExecuting();
        this._debugger?.onStartUpdateSession(this.state, actions || []);

        const onForceEnd = (state: TState): TState => {
            this._debugger?.endSessionPhase(state);
            return state;
        };

        if (this.isDestroyed()) {
            return onForceEnd(this.state);
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return onForceEnd(this.state);
        }

        const result = await this._dispatcher.dispatch(
            AbstractListActionCreators.interactorCore.startUpdate(
                this.state,
                actions as TAbstractListActions.TAnyAbstractListAction[]
            ) as TAction
        );

        if (this.isDestroyed()) {
            return onForceEnd(this.state);
        }

        this._debugger?.nextSessionPhase(result);

        this._notifySubscribers(result);

        return result;
    }

    protected async _beforeApplyState(nextState: TState): Promise<TState> {
        this._debugger?.nextSessionPhase(nextState);

        const onForceEnd = (state: TState): TState => {
            this._debugger?.endSessionPhase(state);
            return state;
        };

        if (this.isDestroyed()) {
            return onForceEnd(this.state);
        }

        if (this._dispatcher.isDispatching()) {
            ErrorDescriptors.UPDATE_STATE_COLLISION();
            return onForceEnd(this.state);
        }

        if (this._isPrivateCollectionMoreActual && !nextState.collection && this._collection) {
            this._isPrivateCollectionMoreActual = false;
            nextState.collection = this._collection;
        }

        const result = await this._dispatcher.dispatch(
            AbstractListActionCreators.interactorCore.beforeApplyState(
                this.state,
                nextState
            ) as TAction
        );

        this._debugger?.nextSessionPhase(result);

        return result;
    }

    private async _endUpdate(nextState: TState): Promise<TState> {
        this._debugger?.nextSessionPhase(nextState);

        const onForceEnd = (state: TState): TState => {
            this._debugger?.endSessionPhase(nextState);
            return state;
        };

        if (this.isDestroyed()) {
            return onForceEnd(this.state);
        }

        if (this._rejectPromise) {
            this._rejectPromise.resolve();
            this._rejectPromise = undefined;
            return onForceEnd(this.state);
        }

        // Никто кроме абстрактного слайса не в силах устанавливать данное состояние.
        nextState.isDebugging = !!this._debugger?.isEnabled();

        const newCollectionType = getCollectionType(this._collectionType, nextState.viewMode);
        await getUnloadedDeps({ ...nextState, collectionType: newCollectionType });

        if (this._collectionType !== newCollectionType) {
            this._destroyCollection();
            this._collectionType = newCollectionType;
            if (this._collectionType) {
                nextState.collection = createCollection(this._collectionType, nextState);
            }
        }

        this._debugger?.nextSessionPhase(nextState);

        return nextState;
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        this._rejectPromise = getDecomposedPromise<void>();
        await this.__dispatcher?.rejectDispatch();
        await this._rejectPromise.promise;
        this._debugger?.rejectUpdateSession();
    }

    destroy() {
        if (isLoaded(LibPaths.SliceDebug)) {
            loadSync<typeof DebugLib>(LibPaths.SliceDebug).deleteLabel(this);
        }

        if (this.state.items) {
            this._updateSubscriptionOnItems(this.state.items, null);
        }

        this._unsubscribe(this.state);

        this.__dispatcher?.destroy();
        this._debugger?.destroy();
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
    protected _onCollectionChange(
        _: SyntheticEvent,
        action: string,
        newItems: Model[],
        newItemsIndex: number,
        removedItems: Model[],
        removedItemsIndex: number,
        reason?: string,
        changedPropertyItems?: object
    ): void {
        // TODO: Убрать условие после слияния старых и новых схем списков
        if (this.collection) {
            this._cachedItemsChanges.push({
                action: action as ChangeAction,
                newItems,
                newItemsIndex,
                removedItems,
                removedItemsIndex,
                reason,
                changedPropertyItems,
            });
        }
    }

    protected _onAfterCollectionChange(): void {
        // TODO: Убрать условие после слияния старых и новых схем списков
        if (this._cachedItemsChanges?.length) {
            this._addAction(
                AbstractListActionCreators.items.setItemsChanges(
                    this._cachedItemsChanges
                ) as TAction
            );
            this._cachedItemsChanges = [];
        }
    }

    protected _updateSubscriptionOnItems(
        oldItems: RecordSet | null,
        newItems: RecordSet | null
    ): void {
        if (oldItems) {
            oldItems.unsubscribe('onCollectionChange', this._onCollectionChange);
            oldItems.unsubscribe('onAfterCollectionChange', this._onAfterCollectionChange);
        }
        if (newItems) {
            newItems.subscribe('onCollectionChange', this._onCollectionChange);
            newItems.subscribe('onAfterCollectionChange', this._onAfterCollectionChange);
        }
    }

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

        // TODO: Этот массив должен быть эквивалентен тому, что отдаем в конструктор коллекции.
        //  Следовательно, тут вообще можно вызвать factory.getCollectionOptions(type, state), как при создании.
        const collectionOptions: (keyof IInteractorStateProps)[] = [
            'keyProperty',
            'itemActionsMap',
            'selectionModel',
            'root',
            'columns',
            'header',
            'collapsedItems',
            'expandedItems',
            'markedKey',
            'expansionModel',
            'highlightedFieldsMap',
            'searchValue',
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

            if (nextState.metaData && this.state.metaData !== nextState.metaData) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._collection.setMetaData(nextState.metaData);
            }
        } else if (this._forceCollectionUpdate && this.state.items !== nextState.items) {
            this._collection.setCollection(nextState.items as ISourceCollection<any>);
        }

        // Возвращаем способность отстрела событиями как была до нас.
        collectionMute.unmute();
    }

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
            idleDetectorInstance: this._asyncOperationsOrchestrator,
            getState: () => this.state,
            applyState: (state) => this._applyState(state),
            middlewares: [
                interactorCore as unknown as TAbstractMiddleware<
                    TState,
                    TAction,
                    TMiddlewareContext
                >,
                ...this._getMiddlewares(),
            ],
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
            registerPendingPromise: this._asyncOperationsOrchestrator.registerPendingPromise.bind(
                this._asyncOperationsOrchestrator
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
        this._debugger?.saveActionTrace(action, new Error().stack);
        // Инициируется попытка обновления состояния
        this.setState({
            _updateToken: this._actionsExecutionQueue.addAction(
                action as TAbstractListActions.TAnyAbstractListAction
            ),
        } as Partial<TState>);
    }

    //# endregion Dispatcher

    //# region Debug
    private _initDebuggerSync(): void {
        if (!isLoaded(LibPaths.SliceDebug)) {
            return;
        }
        this.__initDebuggerSyncOrAsync(() => loadSync<typeof DebugLib>(LibPaths.SliceDebug));
    }

    private async _initDebuggerAsync(): Promise<void> {
        await this.__initDebuggerSyncOrAsync(() => loadAsync<typeof DebugLib>(LibPaths.SliceDebug));
    }

    private __initDebuggerSyncOrAsync<
        T extends Promise<typeof DebugLib> | typeof DebugLib | undefined,
    >(libLoader: () => T): T extends Promise<typeof DebugLib> ? Promise<void> : void {
        if (typeof window === 'undefined') {
            return Promise.resolve() as T extends Promise<typeof DebugLib> ? Promise<void> : void;
        }
        const cookieValue = Initializer.core.getDebugCookie();
        let result: Promise<void> | undefined;

        if (!!cookieValue) {
            if (this._debugger) {
                this._debugger.setCookieValue(cookieValue);
            } else {
                const lib = libLoader();
                if (lib instanceof Promise) {
                    result = lib.then((loadedLib) => {
                        this._createDebugger(loadedLib, cookieValue);
                    });
                } else if (lib) {
                    this._createDebugger(lib, cookieValue);
                }
            }
        } else {
            this._destroyDebugger();
        }

        return result as T extends Promise<typeof DebugLib> ? Promise<void> : void;
    }

    private _createDebugger({ Debugger, initLabel }: typeof DebugLib, cookieValue: string) {
        const dispatcherId = initLabel(this, this._name) || this._name;
        this._debugger = new Debugger(dispatcherId, cookieValue);
        this.__dispatcher?.setDebugger(this._debugger);
    }

    private _destroyDebugger() {
        if (this._debugger) {
            this._debugger.destroy();
            this._debugger = undefined;
            this.__dispatcher?.setDebugger(undefined);
        }
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
        if (this._actionsExecutionQueue.checkUpdateToken(partialState)) {
            if (this._actionsExecutionQueue.isExecuting()) {
                // Отменяем обновление, если добавленный экшен проходит по условиям отмены и сейчас что-то исполняется
                if (
                    this._actionsExecutionQueue.rejectExecutingIfNeed(
                        this._needRejectBeforeApply.bind(this)
                    )
                ) {
                    this._rejectBeforeApplyPromise();
                }
            } else {
                // Подготовка экшенов к исполнению.
                // Удаление лишних экшенов происходит по this.state, т.к. он наиболее актуален и изменения не ожидаются
                const filteredActions = this._actionsExecutionQueue.prepareForExecution(this.state);
                if (!filteredActions?.length) {
                    // Не запускаем обновление, если нет экшенов к исполнению
                    return;
                }
            }
            // Если сейчас что-то выполняется, то будет запланировано обновление через AbstractList.executingQueue
            // иначе запускается обновление
            super.setState(partialState);
        } else {
            this._addAction(
                AbstractListActionCreators.interactorCore.publicSetState(partialState) as TAction
            );
        }
    }

    protected _initActions({ itemActionsMap }: TState, collection: ICollection): void {
        if (itemActionsMap) {
            collection.updateInteractorStateProps({
                itemActionsMap,
            });
        }
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
}

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
