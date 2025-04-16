import type { TAbstractAction, TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';
import type { SyntheticEvent } from 'UICommon/Events';
import type { TFilter, TKey } from 'Controls-DataEnv/interface';
import type {
    TSelectionOptions,
    TSelectionRecordContent,
    TViewCommand,
} from 'Controls-DataEnv/listTypes';
import type { CrudEntityKey } from 'Types/source';
import type * as DebugLib from 'Controls-DataEnv/listDebug';
import type {
    Collection as ICollection,
    IInteractorStateProps,
    ISourceCollection,
} from 'Controls/display';
import type { Model } from 'Types/entity';
import type { RecordSet } from 'Types/collection';
import type { IAbstractListState } from './interface/IAbstractListState';
import type { ChangeAction, TItemsChange } from './interface/IAbstractListStateParts/IItemsState';
import type { IAbstractListAPI } from './interface/IAbstractListAPI';
import type { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import type { TCollectionType } from './collection/types';
import type {
    TAbstractListMiddlewareContext,
    TAbstractListMiddlewareContextGetter,
    TListMiddlewareContextExtension,
} from './types/TAbstractListMiddlewareContext';

import { Slice } from 'Controls-DataEnv/slice';
import { Dispatcher } from 'Controls-DataEnv/dispatcher';
import { getUnloadedDeps, LibPaths } from 'Controls-DataEnv/staticLoader';
import getError from './utils/getError';
import { Initializer } from './Initializer';
import ExecutingQueue from './ExecutingQueue';
import { getCollectionType, resolveCollectionType } from './collection/utils/getCollectionType';
import { interactorCore } from './middlewares/interactorCore';
import { getDecomposedPromise, type TDecomposedPromise } from './utils/DecomposedPromise';
import eventRaisingMuteWrapper from './utils/eventRaisingMuteWrapper';
import { isValidActions } from './validators/actions';
import { default as AbstractListActionCreators, type TAbstractListActions } from './actions';
import * as CollectionFactory from './collection/factory';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { logger } from 'Application/Env';

const { isLoaded, loadAsync, loadSync } = ModulesLoader;
const { createCollection, getCollectionOptions } = CollectionFactory;
const {
    interactorCore: { startUpdate, beforeApplyState, endUpdate, publicSetState, connect },
    items: { setItemsChanges },
    operationsPanel: { openOperationsPanel, closeOperationsPanel },
    filter: { openFilterDetailPanel, closeFilterDetailPanel, setFilter },
    root: { changeRoot },
    expandCollapse: { expand, collapse },
    marker: { mark },
    source: { loadPrev, loadNext },
    selection: { select, selectAll, resetSelection, invertSelection },
    search: { startSearch, resetSearch },
} = AbstractListActionCreators;

/**
 * Абстрактный интерактор любого списка.
 * Предоставляет {@link Controls-DataEnv/abstractList:IAbstractListState состояние}, доступное в любом типе списка и {@link Controls-DataEnv/abstractList:IAbstractListAPI API} для его модификации.
 *
 * @remark
 * {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d Архитектура списков и интеракторов}
 * {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Интерактор для работы со списочными компонентами в web окружении}
 * {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/mobile-slice/ Интерактор для работы со списочными компонентами на базе мобильного контроллера}
 * @abstract
 * @extends Slice
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
     * Очередь действий, запланированных к распространению
     */
    private readonly _actionsExecutionQueue: ExecutingQueue = new ExecutingQueue();

    /**
     * Диспатчер любого списка
     */
    private __dispatcher?: Dispatcher<TState, TAction, TMiddlewareContext>;

    private _debugger?: DebugLib.Debugger;

    // В некоторых случаях (например replaceAllItems) необходимо игнорировать skipSetCollection и принудительно обновлять items в случае изменения
    private _forceCollectionUpdate?: boolean;

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * @private
     */
    get collection(): ICollection | undefined {
        return this._collection;
    }

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * @private
     */
    protected _collection?: ICollection;

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * Поднимается в true во всех списках с BaseControl.
     * В них на модель и в RecordSet записи добавляет сам BaseControl.
     * @private
     */
    protected _skipSetCollection: boolean = false;

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * Является ли коллекция в поле _collection более актуальным, чем на состоянии.
     * Такое бывает только в текущих списках, которые сами создают коллекцию на уровне View.
     * @private
     */
    protected _isPrivateCollectionMoreActual: boolean = false;

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * Флаг, определяющий выполняется ли сейчас обновление слайса.
     * @private
     */
    protected _isSliceUpdating: boolean = false;

    constructor(...[props, ...args]: ConstructorParameters<typeof Slice<TState>>) {
        super(
            {
                ...props,
                onChange: (...[state, ...onChangeArgs]: unknown[]) => {
                    const { _debugger: sliceDebugger } = this;
                    sliceDebugger?.logSliceChangeStart();
                    const result = props.onChange?.(state, ...onChangeArgs);
                    sliceDebugger?.logSliceChangeEnd((state as object) || {});
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

        const { state, _debugger: sliceDebugger } = this;
        // Никто кроме абстрактного слайса не в силах устанавливать данное состояние.
        state.isDebugging = !!sliceDebugger?.isEnabled();

        sliceDebugger?.onSliceInitialized(props.loadResult, props.config, state);

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
                logger.error(e);
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

            // Промис необходим для ожидания завершения выполнения beforeApplyState при отмене обновления.
            // Его резолв должен находиться в точке, откуда код beforeApplyState завершится синхронно.
            // Если после этой проверки будет асинхронный код, то он может пропустить setState, запускающий отмену. В этом случае
            // _rejectPromise будет создан и никогда не зарезолвится, заблокировав работу слайса.
            if (this._rejectPromise) {
                this._rejectPromise.resolve();
                this._rejectPromise = undefined;
            }
            return stateAfterEndUpdate;
        };
    }

    /**
     * Фозвращает флаг, находится ли интерактор в состоянии покоя.
     * Состояние покоя - это состояние при котором не происходит обновления и нет ожидания асинхронных операций,
     * например ожидания ответа запроса за данными.
     * Промежуток между запросом и ответом может быть длительным, и за это время интерактор может бездействовать.
     * Такое состояние НЕ является покоем, т.к. интерактивность уже была запрошена и даже при отсутствии дополнительных
     * действий, состояние интерактора поменяется.
     * */
    isIdle(): boolean {
        const { _isSliceUpdating: isSliceUpdating, __dispatcher: dispatcher } = this;
        // Слайс считается в состоянии простоя, если не происходит обновления состояния и нету незавершенных промисов.
        // Только _dispatcher.isIdle нельзя использовать, поскольку обновление слайса состоит из нескольких фаз.
        return !isSliceUpdating && (dispatcher ? dispatcher.isIdle() : true);
    }

    //# region Slice lifecycle API

    protected _initState(
        loadResult: IAbstractListDataFactoryLoadResult,
        config: IAbstractListDataFactoryArguments
    ): TState {
        this._collectionType = getCollectionType(config.collectionType, config.viewMode);

        this._forceCollectionUpdate = !!config.task88221034059907;

        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._onAfterCollectionChange = this._onAfterCollectionChange.bind(this);

        return Initializer.getState(loadResult, config) as TState;
    }

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
    protected _onAfterInitState(state: TState): void {
        if (typeof this._collectionType === 'string' && state.items) {
            // Запоминаем, чтобы знать что коллекция создана нами. Потом ее нужно уничтожить.
            state.collection = createCollection(this._collectionType, state);
        }

        if (state.collection) {
            this._collection = state.collection;
        }
        if (this._collection) {
            state.selectionModel = Initializer.selection.createSelectionModel(state);
            this._collection.setSelectionModel(state.selectionModel);
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
            return nextState;
        }
    }

    private async _startUpdate(_nextState: TState): Promise<TState> {
        const {
            _actionsExecutionQueue: actionsExecutionQueue,
            _debugger: sliceDebugger,
            state: currentState,
        } = this;
        const actions = actionsExecutionQueue.getExecuting();
        sliceDebugger?.onStartUpdateSession(currentState, actions || []);

        const onForceEnd = (state: TState): TState => {
            sliceDebugger?.endSessionPhase(state);
            return state;
        };

        if (this.isDestroyed()) {
            return onForceEnd(currentState);
        }

        if (this._dispatcher.isDispatching()) {
            await getError('UPDATE_STATE_COLLISION');
            return onForceEnd(currentState);
        }

        const result = await this._dispatcher.dispatch(
            startUpdate(
                currentState,
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
        const { _debugger: sliceDebugger, state: currentState } = this;
        sliceDebugger?.nextSessionPhase(nextState);

        const onForceEnd = (state: TState): TState => {
            sliceDebugger?.endSessionPhase(state);
            return state;
        };

        if (this.isDestroyed()) {
            return onForceEnd(currentState);
        }

        if (this._dispatcher.isDispatching()) {
            await getError('UPDATE_STATE_COLLISION');
            return onForceEnd(currentState);
        }

        const result = await this._dispatcher.dispatch(
            beforeApplyState(currentState, nextState) as TAction
        );

        this._debugger?.nextSessionPhase(result);

        return result;
    }

    private async _endUpdate(nextState: TState): Promise<TState> {
        const { _debugger: sliceDebugger, state: currentState } = this;
        sliceDebugger?.nextSessionPhase(nextState);

        const onForceEnd = (state: TState): TState => {
            sliceDebugger?.endSessionPhase(nextState);
            return state;
        };

        if (this.isDestroyed()) {
            return onForceEnd(currentState);
        }

        const result = await this._dispatcher.dispatch(
            endUpdate(currentState, nextState) as TAction
        );

        if (this._rejectPromise) {
            return onForceEnd(result);
        }

        // Временное решение
        // https://online.sbis.ru/opendoc.html?guid=09f6c2ca-021a-4a1c-a7b6-22b765e24cc3&client=3
        // Прикладники могут менять itemActions и другие опции уже после исполнения платформенного bas.
        // Чтобы изменения, рассчитываемые в мидлварах, применились, необходимо запустить экшен reduceState, но пока
        // неясно, надо ли применять такие меры.
        // Пока обновляем только модель экшенов
        if (
            result.itemActions !== currentState.itemActions &&
            result.items &&
            isValidActions(result.itemActions)
        ) {
            result.itemActionsMap = Initializer.actions.createItemActionsMap(result.items, result);
        }

        // Никто кроме абстрактного слайса не в силах устанавливать данное состояние.
        result.isDebugging = !!this._debugger?.isEnabled();

        let { _collectionType: collectionType } = this;
        const newCollectionType = getCollectionType(collectionType, result.viewMode);
        await getUnloadedDeps({ ...result, collectionType: newCollectionType });

        if (collectionType !== newCollectionType) {
            this._destroyCollection();
            this._collectionType = collectionType = newCollectionType;
            if (collectionType) {
                result.collection = createCollection(collectionType, result);
                if (!result.isThinInteractor) {
                    // Если создание коллекции произойдет после загрузки данных, то новые items применятся
                    // и отобразятся раньше, чем будет рассчитано состояние по их изменениям, по itemsChanges.
                    // Убрать по ошибке: https://online.sbis.ru/opendoc.html?guid=74bd1c14-b5d0-4c98-b150-4c8d047190e5&client=3
                    result.needShowStub = Initializer.emptyView.needShowEmptyView(result.items);
                }
            }
        }

        this._debugger?.nextSessionPhase(result);

        return result;
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        this._rejectPromise = getDecomposedPromise<void>();
        await this.__dispatcher?.rejectDispatch();
        await this._rejectPromise.promise;
        this._debugger?.rejectUpdateSession();
    }

    destroy() {
        const { _debugger: sliceDebugger, state: currentState, __dispatcher: dispatcher } = this;
        sliceDebugger?.onSliceDestroyed();

        if (isLoaded(LibPaths.SliceDebug)) {
            loadSync<typeof DebugLib>(LibPaths.SliceDebug).deleteLabel(this);
        }

        if (currentState.items) {
            this._updateSubscriptionOnItems(currentState.items, null);
        }

        this._unsubscribe(currentState);

        dispatcher?.destroy();
        sliceDebugger?.destroy();
        this._destroyCollection();
        this._destroyOperationsController();
        super.destroy();
    }

    //# endregion Lifecycle

    //# region OldControllers

    // TODO: Сделать приватными когда удалятся аспекты, вызов будет из startBas
    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
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
    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
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
        const { state } = this;
        if (!state.sliceOwnedByBrowser && state.operationsController) {
            state.operationsController.destroy();
        }
    }

    //# endregion OldControllers

    //# region Collection
    private _onCollectionChange(
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

    private _onAfterCollectionChange(): void {
        const { _cachedItemsChanges: cachedItemsChanges } = this;
        // TODO: Убрать условие после слияния старых и новых схем списков
        if (cachedItemsChanges?.length) {
            this._addAction(setItemsChanges(cachedItemsChanges) as TAction);
            this._cachedItemsChanges = [];
        }
    }

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
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
    private _applyChangesToCollection(nextState: TState): void {
        const {
            _collection: collection,
            _collectionType: currentCollectionType,
            _skipSetCollection: skipSetCollection,
            state: currentState,
            _forceCollectionUpdate: forceCollectionUpdate,
        } = this;
        // Проверка на destroyed нужна пока:
        // 1) BaseControl сам создает и разрушает коллекцию в схеме с синтетическим слайсом;
        // 2) Не будет отвечено на вопрос как к одному слайсу присоединить больше одной вьюхи (а значит и вьюмодели).
        // https://online.sbis.ru/opendoc.html?guid=d82beb6c-0173-4b5b-b465-82bc76e2b8c5&client=3
        // this._collection здесь может не быть когда слайс построен для композитного дерева.
        if (!collection || collection.destroyed) {
            return;
        }

        // Таких кейсов по факту не может быть, т.к. мы обложены проверками, но TS этого не поймет.
        // Когда мы перейдем на collectionType или сделаем collection обязательной, то сможем удалить
        // Эту проверку
        const collectionType = currentCollectionType || resolveCollectionType(collection);
        if (!collectionType) {
            return;
        }

        // Глушим события, если они уже не заглушены.
        // Изначально, нужно было глушить и рекордсет, но этого не сделали.
        // Теперь включать опасно, дела только для мобильного слайса.
        const collectionMute = eventRaisingMuteWrapper(collection).mute();

        if ('items' in nextState && nextState.items) {
            const prevMetaData = currentState.items?.getMetaData?.();
            const nextMetaData = nextState.items.getMetaData();
            if (prevMetaData?.path !== nextMetaData?.path) {
                const recordSet = collection.getSourceCollection();
                recordSet.setMetaData({
                    ...recordSet.getMetaData(),
                    path: nextState.breadCrumbsItems,
                });
            }
        }

        const collectionOptions = getCollectionOptions(
            collectionType,
            nextState
        ) as IInteractorStateProps;

        collection.updateInteractorStateProps(collectionOptions);

        // items middleware
        if (currentCollectionType) {
            if (currentState.items !== nextState.items && !skipSetCollection) {
                collection.setCollection(nextState.items as ISourceCollection<any>);
            }

            if (nextState.metaData && currentState.metaData !== nextState.metaData) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _collection.setMetaData(nextState.metaData);
            }
        } else if (forceCollectionUpdate && currentState.items !== nextState.items) {
            collection.setCollection(nextState.items as ISourceCollection<any>);
        }

        // Возвращаем способность отстрела событиями как была до нас.
        collectionMute.unmute();
    }

    private _destroyCollection(): void {
        const {
            state: { collection },
            _collectionType: collectionType,
        } = this;
        if (collection && collectionType) {
            // Уничтожаем коллекцию, если сами ее создали.
            // Если ее нам проставил список, то ее трогать нельзя.
            collection.destroy();
        }
    }

    //# endregion Collection

    //# region Dispatcher

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * protected только пока мобильный Slice не полностью сведен.
     *
     * @private
     */
    // FIXME: Закрыть доступ, сделать приватным.
    protected get _dispatcher(): Dispatcher<TState, TAction, TMiddlewareContext> {
        let dispatcher = this.__dispatcher;
        if (!dispatcher) {
            this.__dispatcher = dispatcher = this._createDispatcher();
        }
        return dispatcher;
    }

    private _createDispatcher(): Dispatcher<TState, TAction, TMiddlewareContext> {
        return new Dispatcher<TState, TAction, TMiddlewareContext>({
            _disableAsyncValidation: this.state._disableAsyncValidation,
            debuggerInstance: this._debugger,
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

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
    protected abstract _getMiddlewares(): TAbstractMiddleware<
        TState,
        TAction,
        TMiddlewareContext
    >[];

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
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
        } as ReturnType<TAbstractListMiddlewareContextGetter<TState, TAction, TMiddlewareContext>>;
    }

    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * Добавляет асинхронное действие в очередь для распространения.
     * Асинхронное действие - действие, за результатом выполнения которого можно слудить через возвращаемый Promise.
     * @private
     */
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
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Метод исключительно для внутреннего использования и может быть удален/изменен в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     *
     * Добавляет действие в очередь для распространения
     * @private
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

    openOperationsPanel(): void {
        this._addAction(openOperationsPanel() as TAction);
    }

    closeOperationsPanel(): void {
        this._addAction(closeOperationsPanel() as TAction);
    }

    openFilterDetailPanel(): void {
        this._addAction(openFilterDetailPanel() as TAction);
    }

    closeFilterDetailPanel(): void {
        this._addAction(closeFilterDetailPanel() as TAction);
    }

    //# endregion ListEnv API

    //# region List API

    abstract getSelection(): Promise<TSelectionRecordContent>;

    setState(partialState: Partial<TState> | ((prevState: TState) => Partial<TState>)) {
        const { _actionsExecutionQueue: actionsExecutionQueue } = this;
        if (actionsExecutionQueue.checkUpdateToken(partialState)) {
            if (actionsExecutionQueue.isExecuting()) {
                // Отменяем обновление, если добавленный экшен проходит по условиям отмены и сейчас что-то исполняется
                if (
                    actionsExecutionQueue.rejectExecutingIfNeed(
                        this._needRejectBeforeApply.bind(this)
                    )
                ) {
                    this._rejectBeforeApplyPromise();
                }
            } else {
                // Подготовка экшенов к исполнению.
                // Удаление лишних экшенов происходит по this.state, т.к. он наиболее актуален и изменения не ожидаются
                const filteredActions = actionsExecutionQueue.prepareForExecution(this.state);
                if (!filteredActions?.length) {
                    // Не запускаем обновление, если нет экшенов к исполнению
                    return;
                }
            }
            // Если сейчас что-то выполняется, то будет запланировано обновление через AbstractList.executingQueue
            // иначе запускается обновление
            super.setState(partialState);
        } else {
            this._addAction(publicSetState(partialState) as TAction);
        }
    }

    connect(): void {
        this._addAction(connect() as TAction);
    }

    disconnect(): void {
        // FIXME: Тут падает ошибка React. Пока это не требуется - переношу в тонкий интерактор.
        // this._addAction(AbstractListActionCreators.interactorCore.disconnect() as TAction);
    }

    changeRoot(key: TKey): void {
        this._addAction(changeRoot(key) as TAction);
    }

    expand(key: CrudEntityKey, params?: { markItem?: boolean }): void {
        this._addAction(expand(key, params?.markItem) as TAction);
    }

    collapse(key: CrudEntityKey, params?: { markItem?: boolean }): void {
        this._addAction(collapse(key, params?.markItem) as TAction);
    }

    mark(key?: TKey): void {
        this._addAction(mark(key) as TAction);
    }

    prev(_key?: TKey): void {
        // Т.к. мобильный контроллер находится на начальной стадии развития,
        // для загрузки данных в узел он использует API.expand на уже развернутом узле.
        // При таком подходе сложно поддержать загрузку данных вверх внутри узла по кнопке еще.
        // Придетсяя добавлять параметр direction в метод expand, что противоречит его ответственности.
        this._addAction(loadPrev() as TAction);
    }

    next(key?: TKey): void {
        // Т.к. мобильный контроллер находится на начальной стадии развития,
        // для загрузки данных в узел он использует API.expand на уже развернутом узле.
        // При таком подходе сложно поддержать загрузку данных вверх внутри узла по кнопке еще.
        // Придетсяя добавлять параметр direction в метод expand, что противоречит его ответственности.
        this._addAction(loadNext(undefined, undefined, undefined, undefined, key) as TAction);
    }

    select(key: CrudEntityKey, options?: TSelectionOptions): void {
        this._addAction(select(key, options?.direction, options?.isRangeSelection) as TAction);
    }

    selectAll(): void {
        this._addAction(selectAll() as TAction);
    }

    resetSelection(): void {
        this._addAction(resetSelection() as TAction);
    }

    invertSelection(): void {
        this._addAction(invertSelection() as TAction);
    }

    search(searchValue: string): void {
        this._addAction(startSearch(searchValue) as TAction);
    }

    resetSearch(): void {
        this._addAction(resetSearch() as TAction);
    }

    setFilter(filter: TFilter): void {
        this._addAction(setFilter(filter) as TAction);
    }

    /**
     * Сбросить команду скролла
     * */
    onExecutedViewCommand(executedCommand: TViewCommand): void {
        this.setState(
            (prevState) =>
                ({
                    viewCommands: prevState.viewCommands.filter(
                        (command) => command !== executedCommand
                    ),
                }) as Partial<TState>
        );
    }

    //# endregion List API
}
