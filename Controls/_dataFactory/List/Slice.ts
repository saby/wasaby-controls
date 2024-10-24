/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IItemsState } from 'Controls/listAspects';
import type { TFilter, TKey, TViewMode } from 'Controls-DataEnv/interface';
import type {
    Direction,
    IBaseSourceConfig,
    INavigationOptionValue,
    INavigationSourceConfig,
    TSearchNavigationMode,
    TSortingOptionValue,
} from 'Controls/interface';
import { type TItemsOrder, TSelectionRecordContent } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { Collection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import type { IListState } from './_interface/IListState';
import type { IListLoadResult } from './_interface/IListLoadResult';
import type { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';
import type { IListAspects } from '../AbstractList/_interface/IAspectTypes';
import type { ScrollControllerLib } from 'Controls/listsCommonLogic';
import type { IFilterItem } from 'Controls/filter';

// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { getControllerState, INavigationChanges } from 'Controls/dataSource';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UICommon/Events';
import { Logger } from 'UI/Utils';
import { IReloadItemOptions, IReloadItemResult, IReloadItemsResult } from 'Controls/listCommands';
import { Model, PromiseCanceledError } from 'Types/entity';
import resolveCollectionType from '../AbstractList/collections/resolveCollectionType';
import { AspectsNames } from '../AbstractList/_interface/AspectsNames';
import { AbstractListSlice } from '../AbstractList/AbstractListSlice';
import { getFilterModuleSync } from '../AbstractList/utils/getFilterModuleSync';
import { getActiveElementByItems } from '../ListWebDispatcher/middlewares/_navigation';
import { processMarkedKey } from '../ListWebDispatcher/middlewares/marker';

import { getSourceControllerOptions } from '../ListWebInitializer/source';
import { initMarker } from '../ListWebInitializer/marker';

// NEW
import {
    type TListActions,
    ListActionCreators,
    _privateForOldCode_SnapshotsStore as SnapshotsStore,
    sourceMiddleware,
    operationsPanelMiddleware,
    markerMiddleware,
    filterPanelMiddleware,
    beforeApplyStateMiddleware,
    selectionMiddleware,
    searchMiddleware,
    filterMiddleware,
    rootMiddleware,
    itemsMiddleware,
} from 'Controls-DataEnv/list';

import type {
    TListMiddlewareContext,
    TListMiddlewareContextGetter,
} from '../ListWebDispatcher/types/TListMiddlewareContext';

// NEW

import { hasItemInArray } from '../AbstractList/utils/itemUtils';
import { createSourceController } from 'Controls/_dataFactory/ListWebInitializer/source';
import { TCollectionType } from 'Controls/_dataFactory/AbstractList/_interface/IAbstractListSliceTypes';

export type TLoadResult = RecordSet | Error;

interface ISearchInitResult {
    searchValue: string;
    searchParam: string;
    searchInputValue: string;
    searchMisspellValue: string;
    minSearchLength: number;
    searchDelay: number;
    searchStartingWith: string;
    searchValueTrim: boolean;
    searchNavigationMode?: TSearchNavigationMode;
}

const MIDDLEWARES = [
    operationsPanelMiddleware,
    markerMiddleware,
    beforeApplyStateMiddleware,
    selectionMiddleware,
    sourceMiddleware,
    searchMiddleware,
    filterMiddleware,
    filterPanelMiddleware,
    rootMiddleware,
    itemsMiddleware,
];

/**
 * Класс, реализующий слайс списка.
 * Является дженериком. Принимает параметр T - тип состояния слайса. Должен наследоваться от IListState.
 * @remark
 * Полезные ссылки:
 * * Подробнее про слайс для работы со списочными компонентами читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ статье}
 * @class Controls/_dataFactory/List/Slice
 * @extends Controls-DataEnv/slice:AbstractSlice
 * @see Controls-ListEnv
 * @public
 */
export default class ListSlice<T extends IListState = IListState> extends AbstractListSlice<
    T,
    TListActions.TAnyListAction,
    TListMiddlewareContext<T>
> {
    readonly '[IListSlice]': boolean = true;

    private _propsForMigrationToDispatcher: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher;

    private _subscribeOnFilter: boolean;

    protected _aspectStateManagers: IListAspects;
    protected _cachedItemsChanges: IItemsState['itemsChanges'] = [];

    private _snapshots = new SnapshotsStore();

    private _rootChanged(e: SyntheticEvent, root: TKey): void {
        if (root !== this.state.root) {
            this.state.root = root;
        }
    }

    unobserveChanges(controllers: Pick<IListState, 'operationsController'> = this.state): void {
        this._unsubscribeFromControllersChanged(controllers);
    }

    observeChanges(controllers: Pick<IListState, 'operationsController'> = this.state): void {
        this._subscribeOnControllersChanges(controllers);
    }

    private _filterChanged(e: SyntheticEvent, filter: TFilter): void {
        if (!isEqual(filter, this.state.filter)) {
            this.state.filter = filter;
        }
    }

    protected _searchStarted(filter: TFilter): void {}

    private _sortingChanged(e: SyntheticEvent, sorting: TSortingOptionValue): void {
        this.state.sorting = sorting;
    }

    private _navigationChanged(
        e: SyntheticEvent,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        this.state.navigation = navigation;
    }

    protected _onCollectionChange(
        event: SyntheticEvent,
        action: string,
        newItems: Model[],
        newItemsIndex: number,
        removedItems: Model[],
        removedItemsIndex: number,
        reason?: string,
        changedPropertyItems?: object
    ): void {
        // TODO: Убрать условие после слияния старых и новых схем списков
        if (this._aspectStateManagers.has(AspectsNames.Items)) {
            this._cachedItemsChanges.push({
                action,
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
        if (this._aspectStateManagers.has(AspectsNames.Items) && this._cachedItemsChanges?.length) {
            this.setState({
                itemsChanges: this._cachedItemsChanges,
            });
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

    protected _subscribeOnControllersChanges(controllers: Pick<T, 'operationsController'>): void {
        const controller = this._propsForMigrationToDispatcher.sliceProperties.sourceController;
        if (controller) {
            if (this._subscribeOnFilter) {
                controller.subscribe('rootChanged', this._rootChanged, this);
                controller.subscribe('filterChanged', this._filterChanged, this);
                controller.subscribe('sortingChanged', this._sortingChanged, this);
                controller.subscribe('navigationChanged', this._navigationChanged, this);
            }
        }
        super._subscribeOnControllersChanges(controllers);
    }

    private _unsubscribeFromSourceController(): void {
        const controller = this._propsForMigrationToDispatcher?.sliceProperties?.sourceController;

        if (controller) {
            controller.unsubscribe('rootChanged', this._rootChanged, this);
            controller.unsubscribe('filterChanged', this._filterChanged, this);
            controller.unsubscribe('sortingChanged', this._sortingChanged, this);
            controller.unsubscribe('navigationChanged', this._navigationChanged, this);
        }
    }

    protected _unsubscribeFromControllersChanged(
        controllers: Pick<T, 'operationsController'>
    ): void {
        this._unsubscribeFromSourceController();
        super._unsubscribeFromControllersChanged(controllers);
    }

    private _initSearch(config: IListDataFactoryArguments): ISearchInitResult {
        let searchMisspellValue = '';
        if (config.searchValue) {
            searchMisspellValue = loadSync<typeof import('Controls/search')>(
                'Controls/search'
            ).FilterResolver.getSwitcherStrFromData(
                this._propsForMigrationToDispatcher.sliceProperties.sourceController.getItems()
            );
        }
        return {
            searchParam: config.searchParam,
            searchValue: config.searchValue || '',
            searchInputValue: config.searchInputValue || config.searchValue || '',
            searchMisspellValue,
            minSearchLength: config.minSearchLength === undefined ? 3 : config.minSearchLength,
            searchDelay: config.searchDelay,
            searchStartingWith: config.searchStartingWith,
            searchValueTrim: config.searchValueTrim,
            searchNavigationMode: config.searchNavigationMode,
        };
    }

    /**
     * Метод инициализации состояния
     * @function Controls/_dataFactory/List/Slice#_initState
     * @protected
     * @param {IListLoadResult} loadResult
     * @param {IListDataFactoryArguments} initConfig
     * @protected
     * @return {IListState}
     */
    protected _initState(loadResult: IListLoadResult, initConfig: IListDataFactoryArguments): T {
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._onAfterCollectionChange = this._onAfterCollectionChange.bind(this);

        this._propsForMigrationToDispatcher = {
            sliceCallbacks: {
                applyState: this._applyState.bind(this),
                setState: this.setState.bind(this),
                isDestroyed: this.isDestroyed.bind(this),
                openOperationsPanel: this.openOperationsPanel.bind(this),
                updateSubscriptionOnItems: this._updateSubscriptionOnItems.bind(this),
            },
            sliceProperties: {
                loadConfig: null,
                newItems: undefined,
                previousViewMode: undefined,
                sourceController: undefined,
            },
        };

        let config = { ...initConfig };
        if (initConfig.listConfigStoreId) {
            const storeFields: Partial<IListDataFactoryArguments> = getControllerState(
                initConfig.listConfigStoreId
            );
            config = {
                ...initConfig,
                ...storeFields,
            };
        }
        this._subscribeOnFilter = config.task1186833531;
        let searchState = {};

        const sourceController =
            config.sourceController || createSourceController(loadResult, config);

        this._propsForMigrationToDispatcher.sliceProperties.sourceController = sourceController;

        if (config.searchParam) {
            searchState = this._initSearch(config);
        }

        const items = sourceController.getItems();
        const activeElement = config.activeElement ?? getActiveElementByItems(items);

        const sourceOwnState = { sourceController, source: sourceController.getSource() };
        const state: T = {
            ...super._initState(loadResult, {
                ...config,
                root: sourceController.getRoot(),
            }),

            // CORE
            keyProperty: sourceController.getKeyProperty(),
            parentProperty: sourceController.getParentProperty(),
            nodeProperty: config.nodeProperty,
            hasChildrenProperty: config.hasChildrenProperty,
            nodeTypeProperty: config.nodeTypeProperty,
            displayProperty: config.displayProperty,
            loading: false,
            command: null,

            // SOURCE
            ...sourceOwnState,
            // или Core?
            selectFields: config.selectFields,

            // SAVED PARAMS AND HISTORY
            propStorageId: config.propStorageId || sourceController.getState().propStorageId,
            listConfigStoreId: config.listConfigStoreId,
            rootHistoryId: config.rootHistoryId,
            nodeHistoryId: config.nodeHistoryId,
            nodeHistoryType: config.nodeHistoryType,
            groupHistoryId: config.groupHistoryId,

            // NAVIGATION
            navigation: sourceController.getNavigation(),

            // EXPAND/COLLAPSE
            expandedItems: loadResult.expandedItems || sourceController.getExpandedItems() || [],
            collapsedItems: config.collapsedItems || [],
            singleExpand: config.singleExpand,
            // Чисто интерфейсная опция, её тут быть не должно.
            expanderVisibility: config.expanderVisibility || 'visible',

            // SORTING
            sorting: sourceController.getSorting(),

            // BC
            breadCrumbsItems: sourceController.getState().breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceController.getState().breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceController.getState().backButtonCaption,

            // FILTER
            filter: sourceController.getFilter(),
            historyId: config.historyId,

            // ROOT
            root: sourceController.getRoot(),

            // Selection
            multiSelectVisibility: config.multiSelectVisibility || 'hidden',
            supportSelection: config.supportSelection,
            isAllSelected: false,
            count: undefined,
            countLoading: false,
            selectedCountConfig: config.selectedCountConfig,
            selectionViewMode: 'hidden',
            selectionCountMode: config.selectionCountMode,
            recursiveSelection: config.recursiveSelection,
            selectionType: config.selectionType || 'all',
            isMassSelectMode:
                typeof config.isMassSelectMode === 'boolean' ? config.isMassSelectMode : true,
            selectAncestors:
                typeof config.selectAncestors === 'boolean' ? config.selectAncestors : true,
            selectDescendants:
                typeof config.selectDescendants === 'boolean' ? config.selectDescendants : true,
            selectionModel: new Map(),

            fix1193265616: initConfig.fix1193265616,
            filterDetailPanelVisible: false,
            activeElement,
            items,
            data: items,
            viewMode: config.viewMode || loadResult.viewMode,
            markerVisibility: config.markerVisibility || 'onactivated',
            markedKey: config.markedKey,
            editorsViewMode: config.editorsViewMode,
            // FIXME Костыль для совместимости, будет удалён по проекту https://online.sbis.ru/opendoc.html?guid=3ccfe8ae-17d7-4796-acf4-682b3b690637&client=3
            // Флаг нужен, чтобы слайс не разрушал sourceController, если слайс был порождён внутри Browser'a
            // В этом случае сам Browser разрушает sourceController
            sliceOwnedByBrowser: config.sliceOwnedByBrowser,
            adaptiveSearchMode: config.adaptiveSearchMode,

            ...searchState,
            deepReload: config.deepReload,
            deepScrollLoad: config.deepScrollLoad,
            moveMarkerOnScrollPaging: config.moveMarkerOnScrollPaging,
            // FIXME удалить, когда перенесём коллекцию из списка
            collectionType: config.collectionType,
            searchInputFocused: false,
            error: loadResult.error,
            errorViewConfig: loadResult.errorViewConfig,
            errorController: config.errorController,
            countFilterValue: config.countFilterValue,
            countFilterLinkedNames: config.countFilterLinkedNames,
            countFilterValueConverter: config.countFilterValueConverter,
            countFilterUserPeriods: config.countFilterUserPeriods,
            countFilterPeriodType: config.countFilterPeriodType,
        };

        this._onAfterInitState(state);

        this._subscribeOnControllersChanges(state);

        this._updateSubscriptionOnItems(null, items);

        this._propsForMigrationToDispatcher.sliceProperties.previousViewMode = state.viewMode;

        // TODO: Сделать init стейта слайса через аспекты.
        this._initAspects(initConfig.collectionType, state);

        // Чистой новой схеме маркер инициализируется правильно, как надо.
        // Для всех остальных список сам дергает и
        // проставляет в модель значение на маунте.
        // Затем, после построения, обновляется слайс
        if (this.collection) {
            state.markedKey = initMarker(state);

            const ItemActionsStateManager = this._aspectStateManagers.get(AspectsNames.ItemActions);
            if (ItemActionsStateManager) {
                ItemActionsStateManager.initItemActions(state, this.collection);
            }
        }

        return state;
    }

    protected _getMiddlewares() {
        return MIDDLEWARES;
    }

    protected _getMiddlewaresContext(): TListMiddlewareContext {
        return {
            getCollection: () => this.state.collection || this._collection,
            getAspects: () => this._aspectStateManagers,
            getTrashBox: () => ({
                _propsForMigrationToDispatcher: this._propsForMigrationToDispatcher,
            }),
            originalSliceSetState: (state) => {
                this.setState(state);
            },
            originalSliceGetState: () => this.state,
            scheduleDispatch: (action: TListActions.TAnyListAction) => {
                this._addAction(action);
            },
            snapshots: this._snapshots,
            onDataLoaded: this._dataLoaded.bind(this),
            onNodeDataLoaded: this._nodeDataLoaded.bind(this),
        } as ReturnType<TListMiddlewareContextGetter>;
    }

    protected _initAspects(
        collectionType: TCollectionType | undefined,
        state: T,
        _removedAspects?: AspectsNames[]
    ) {
        super._initAspects(collectionType, state, []);
    }

    protected async _beforeApplyState(nextStateProp: T): Promise<T> {
        if (this.isDestroyed()) {
            return this.state;
        }

        this.unobserveChanges(this.state);

        const nextState = super._beforeApplyState(nextStateProp);

        // Первая фаза расчета nextState
        // Проверка будет удалена по проекту (старый список без CollectionType).
        // TODO: удалить в октябре-ноябре 24.
        const draftNextState = this._collection
            ? {
                  ...nextState,
                  ...this._getNextState(
                      this.state,
                      this._resolveChanges(this.state, {
                          ...nextState,
                          collection: this._collection,
                      })
                  ),
              }
            : nextState;

        // TODO:
        // OLD: Вторая фаза расчета nextState.
        // NEW: Теперь это единственная фаза.
        // В промежутке между super._bas и _beforeApplyStateNew
        // расположен рудиментарный код аспектов.
        // Он удалится в октябре-ноябре 24.
        const nextStateResult = await super._beforeApplyStateNew({
            ...draftNextState,
            items: nextState.items,
        });

        this.observeChanges(nextStateResult);

        return nextStateResult;
    }

    protected _onSnapshot(nextState: T): T {
        if (this._collection !== nextState.collection) {
            this._collection = nextState.collection;
        }
        // Третья фаза расчета nextState синхронная. Применение изменений к коллекции
        return this._resolveNextState(nextState);
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        this.state.sourceController.cancelLoading();
        this.state.sourceController.updateOptions(getSourceControllerOptions(this.state));
        await super._onRejectBeforeApplyState();
    }

    // Третья фаза расчета nextState (потенциально асинхронная). Применение изменений к коллекции
    private _resolveNextState(nextState: T): T {
        // TODO: Проверка будет удалена по проекту (старый список без CollectionType).
        if (!this._collection) {
            return nextState;
        }
        const changes = this._resolveChanges(
            {
                ...this.state,
            },
            nextState
        );
        this._applyChangesToCollection(changes, nextState);
        this._applyChangesToSourceController(nextState.navigationChanges);
        return {
            // Новые изменения старой логики слайса
            ...nextState,
            // Новые изменения новой логики слайса, из аспектов
            ...this._getNextState(nextState, changes),
            // Не костыль, специчный код, вызванный мутабельностью RecordSet, SourceController.
            itemsChanges: undefined,
            navigationChanges: undefined,
        };
    }

    protected _applyChangesToSourceController(navigationChanges?: INavigationChanges): void {
        this._propsForMigrationToDispatcher.sliceProperties.sourceController.applyNavigationChanges(
            navigationChanges
        );
    }

    private _getAdditionalStateOnCommandExecute(command: string): Partial<T> {
        if (command === 'selected' || command === 'all') {
            return {
                showSelectedCount: command === 'all' ? null : this.state.count,
            } as Partial<T>;
        }
    }

    /**
     * Метод, вызываемый после загрузки данных.
     * Должен вернуть новое состояние
     * @function Controls/_dataFactory/List/Slice#_dataLoaded
     * @param {Types/collection:RecordSet} items загруженные записи.
     * @param {'down'|'up'|void} direction направление загрузки.
     * @param {Controls/dataFactory:IListState} nextState следующее состояние слайса.
     * @public
     * @example
     * В следующем примере демонстрируется класс наследник Controls/dataFactory:ListSlice,
     * в этом классе определён метод _dataLoaded в котором изменяется state на основании загруженных данных
     * <pre class="brush: js">
     *    import {ListSlice, IListState} from 'Controls/dataFactory';
     *    import {RecordSet} from 'Types/collection';
     *
     *    interface IMySliceState extends IListState {
     *        myState: boolean;
     *    }
     *
     *    export default class MyListSlice extends ListSlice<IMySliceState> {
     *          _dataLoaded(items: RecordSet, direction: , nextState): IMySliceState {
     *              nextState.myState = items.getCount() > 10;
     *              return nextState;
     *          }
     *    }
     * </pre>
     *
     * В этом примере метод _dataLoader возвращает Promise
     * state будет применён только после разрешения Promise
     * <pre class="brush: js">
     *    import { ListSlice, IListState } from 'Controls/dataFactory';
     *    import { RecordSet } from 'Types/collection';
     *    import { loadAsync } from 'WasabyLoader/ModulesLoader';
     *
     *    interface IMySliceState extends IListState {
     *        myState: boolean;
     *    }
     *
     *    export default class MyListSlice extends ListSlice<IMySliceState> {
     *          _dataLoaded(items: RecordSet, direction: , nextState): IMySliceState {
     *              return new Promise((resolve) => {
     *                  loadAsync('MyModule/myLib:Component').then(() => {
     *                      resolve(nextState);
     *                  })
     *              })
     *          }
     *    }
     * </pre>
     * @return {Controls/dataFactory:IListState|Promise<Controls/dataFactory:IListState>}
     * @remark Для обработки загрузки данных для узла используйте {@link _nodeDataLoaded}
     * @see _nodeDataLoaded
     */
    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        return nextState;
    }

    /**
     * Метод, вызываемый после загрузки данных для узла (разворот ветки дерева).
     * Должен вернуть новое состояние
     * @function Controls/_dataFactory/List/Slice#_nodeDataLoaded
     * @param {Types/collection:RecordSet} items загруженные записи.
     * @param {string|number} key Ключ узла, для которого выполнялась загрузка данных.
     * ВАЖНО: это не корень иерархии!
     * @param {'down'|'up'|void} direction направление загрузки.
     * @param {Controls/dataFactory:IListState} nextState следующее состояние слайса.
     * @public
     * @example
     * В следующем примере демонстрируется класс наследник Controls/dataFactory:ListSlice,
     * в этом классе определён метод _nodeDataLoaded в котором изменяется state на основании загруженных данных
     * <pre class="brush: js">
     *    import {ListSlice, IListState} from 'Controls/dataFactory';
     *    import {RecordSet} from 'Types/collection';
     *
     *    interface IMySliceState extends IListState {
     *        myState: boolean;
     *    }
     *
     *    export default class MyListSlice extends ListSlice<IMySliceState> {
     *          _nodeDataLoaded(items: RecordSet, key: TKey, direction: Direction, nextState: IMySliceState): IMySliceState {
     *              nextState.myState = items.getCount() > 10;
     *              return nextState;
     *          }
     *    }
     * </pre>
     *
     * В этом примере метод _dataLoader возвращает Promise
     * state будет применён только после разрешения Promise
     * <pre class="brush: js">
     *    import { ListSlice, IListState } from 'Controls/dataFactory';
     *    import { RecordSet } from 'Types/collection';
     *    import { loadAsync } from 'WasabyLoader/ModulesLoader';
     *
     *    interface IMySliceState extends IListState {
     *        myState: boolean;
     *    }
     *
     *    export default class MyListSlice extends ListSlice<IMySliceState> {
     *          _nodeDataLoaded(items: RecordSet, key: TKey, direction: Direction, nextState: IMySliceState): IMySliceState {
     *              return new Promise((resolve) => {
     *                  loadAsync('MyModule/myLib:Component').then(() => {
     *                      resolve(nextState);
     *                  })
     *              })
     *          }
     *    }
     * </pre>
     * @return {Controls/dataFactory:IListState|Promise<Controls/dataFactory:IListState>}
     * @remark Для обработки загрузки данных в корне используйте {@link _dataLoaded}.
     * @see _dataLoaded
     */
    protected _nodeDataLoaded(
        items: RecordSet,
        key: TKey,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        return nextState;
    }

    /**
     * Перезагрузить список
     * @function Controls/_dataFactory/List/Slice#reload
     * @param {INavigationSourceConfig} sourceConfig Параметры навигации.
     * @param {boolean} keepNavigation
     * @public
     * @return {Promise<RecordSet>}
     */
    reload(sourceConfig?: INavigationSourceConfig, keepNavigation?: boolean) {
        return this._addAsyncAction(ListActionCreators.source.reload(sourceConfig, keepNavigation));
    }

    /**
     * Перезагрузить элемент списка
     * @function Controls/_dataFactory/List/Slice#reloadItem
     * @param {TKey} itemKey Ключ записи для перезагрузки
     * @param {Controls/_listCommands/ReloadItem/IReloadItemOptions} options Параметры перезагрузки
     * @public
     * @return {Promise<IReloadItemResult>}
     */
    async reloadItem(itemKey: CrudEntityKey, options?: IReloadItemOptions): IReloadItemResult {
        return this._addAsyncAction(ListActionCreators.source.reloadItem(itemKey, options));
    }

    /**
     * Перезагружает указанные записи списка
     * @function Controls/_dataFactory/List/Slice#reloadItem
     * @param {Array<TKey>} keys Ключ записи для перезагрузки
     * @public
     * @return {Promise<IReloadItemsResult>}
     */
    reloadItems(keys: TKey[]): IReloadItemsResult {
        return this._addAsyncAction(ListActionCreators.source.reloadItems(keys));
    }

    load(
        ...args: [
            direction?: Direction,
            key?: TKey,
            filter?: TFilter,
            addItemsAfterLoad?: boolean,
            navigationSourceConfig?: IBaseSourceConfig,
        ]
    ): Promise<TLoadResult> {
        return this._load(void 0, ...args);
    }

    setExpandedItems(expandedItems: TKey[]): void {
        this.setState({ expandedItems });
    }

    setRoot(root: TKey): void {
        this.changeRoot(root);
    }

    executeCommand(command: string): void {
        const state = {
            command,
        };

        Object.assign(state, this._getAdditionalStateOnCommandExecute(command));

        this.setState(state);
    }

    onExecutedCommand(): void {
        this.setState({
            command: null,
        });
    }

    setSorting(sorting: TSortingOptionValue): void {
        this.setState({ sorting });
    }

    setFilter(filter: TFilter): void {
        this.setState({ filter });
    }

    applyFilterDescription(
        ...args: Parameters<AbstractListSlice<T>['applyFilterDescription']>
    ): IFilterItem[] | void {
        const filterDescription = super.applyFilterDescription(...args);

        if (!filterDescription) {
            this.reload();
        }

        return filterDescription;
    }

    setSelectionViewMode(selectionViewMode: string): void {
        this.setState({ selectionViewMode });
    }

    hasMoreData(direction: Direction, key: TKey): boolean {
        return this.state.sourceController.hasMoreData(direction, key);
    }

    setItems(items: RecordSet, root?: TKey): void {
        if (root !== undefined) {
            this._propsForMigrationToDispatcher.sliceProperties.newItems = items;
            this.setState({ root });
        } else {
            this.state.sourceController.setItemsAfterLoad(items);
        }
    }

    /**
     * Открыть панель массовых операций
     * @function Controls/_dataFactory/List/Slice#openOperationsPanel
     * @public
     * @return {void}
     */
    openOperationsPanel(): void {
        super.openOperationsPanel();
    }

    /**
     * Закрыть панель массовых операций
     * @function Controls/_dataFactory/List/Slice#closeOperationsPanel
     * @public
     * @return {void}
     */
    closeOperationsPanel(): void {
        super.closeOperationsPanel();
    }

    setSelectedKeys(selectedKeys: TKey[]): void {
        this.setState({
            selectedKeys,
        });
    }

    setExcludedKeys(excludedKeys: TKey[]): void {
        this.setState({
            excludedKeys,
        });
    }

    setSelectionCount(count: number, isAllSelected: boolean, listId?: string): void {
        this.setState((prevState) => {
            if (count !== prevState.count || isAllSelected !== prevState.isAllSelected) {
                return {
                    count,
                    isAllSelected,
                    countLoading: prevState.countLoading,
                    listId,
                };
            }
            return {};
        });
    }

    setActiveElement(activeElement: TKey): void {
        this.setState({
            activeElement,
        });
    }

    setViewMode(viewMode: TViewMode): void {
        this.setState({
            viewMode,
        });
    }

    /**
     * Применить структуру фильтров
     * @function Controls/_dataFactory/List/Slice#applyFilterDescription
     * @param filterDescription {Array.<Controls/filter:IFilterItem>} Новая структура фильтров.
     * @param newState
     * @param appliedFrom
     * @public
     * @return {void}
     */

    /**
     * Сбросить фильтры.
     * @function Controls/_dataFactory/List/Slice#resetFilterDescription
     * @public
     * @return {void}
     */

    /**
     * Перезагрузить данные для редактора фильтра
     * @function Controls/_dataFactory/List/Slice#reloadFilterItem
     * @param filterName {String} Имя фильтра
     * @param sourceConfig {Controls/_interface/INavigation/IBaseSourceConfig.typedef} Конфигурация навигации источника данных (например, размер и номер страницы для постраничной навигации), которую можно передать при вызове reload, чтобы перезагрузка произошла с этими параметрами.
     * По умолчанию перезагрузка происходит с параметрами, переданными в опции {@link Controls/interface:INavigation#navigation navigation}.
     * @param keepNavigation {boolean} Сохранить ли позицию скролла и состояние навигации после перезагрузки.
     * @public
     * @return {void | Promise<Types/collection:RecordSet | Error>}
     */
    reloadFilterItem(
        filterName: string,
        sourceConfig?: IBaseSourceConfig,
        keepNavigation: boolean = false
    ): void | Promise<RecordSet | Error> {
        return getFilterModuleSync().FilterLoader.reloadFilterItem(
            filterName,
            this.state.filterDescription,
            sourceConfig,
            keepNavigation
        );
    }

    /**
     * Сбросить поиск с очисткой строки поиска
     * @function Controls/_dataFactory/List/Slice#resetSearch
     * @public
     * @return {void}
     */
    resetSearch(): void {
        this.setSearchInputValue('');
        this.resetSearchQuery();
        this.setState({
            searchInputFocused: true,
        });
    }

    /**
     * Сбросить параметр поиска из списочного метода. Строка поиска не очищается
     * @function Controls/_dataFactory/List/Slice#resetSearch
     * @public
     * @return {void}
     * @remark используется если текст в строке поиска короче минимальной длины, необходимой поиску
     */
    resetSearchQuery(): void {
        this.setState({
            searchValue: '',
        });
    }

    /**
     * Запустить поиск
     * @function Controls/_dataFactory/List/Slice#search
     * @param {String} searchValue
     * @public
     * @return {void}
     */
    search(searchValue: string): void {
        if (!this.state.searchParam) {
            throw new Error(
                'ListSlice::Не указан searchParam в слайсе списка. Поиск не будет запущен'
            );
        } else if (this.state.searchValue === searchValue && !this.state.loading) {
            this.reload();
        } else {
            this.setSearchInputValue(searchValue);
            this.setState({
                searchValue,
            });
        }
    }

    setSearchInputValue(value: string): void {
        if (this.state.searchInputValue !== value) {
            this._applyState({
                searchInputValue: value,
            });
        }
    }

    setItemsOrder(itemsOrder: TItemsOrder): void {
        this._applyState({
            itemsOrder,
        });
    }

    protected _needRejectBeforeApply(
        partialState: Partial<T>,
        currentAppliedState?: Partial<T>
    ): boolean {
        const props = [
            'filter',
            'navigation',
            'source',
            'sorting',
            'sourceController',
            'searchValue',
        ];
        const isPropertyChanged = (propName) => {
            return (
                partialState.hasOwnProperty(propName) &&
                !isEqual(partialState[propName], this.state[propName]) &&
                // Если уже применяется state c таким же значением, то не надо прерывать обновление
                (!currentAppliedState ||
                    !isEqual(partialState[propName], currentAppliedState[propName]))
            );
        };
        return (
            !!props.find((propName) => isPropertyChanged(propName)) ||
            (this.state.parentProperty && isPropertyChanged('root'))
        );
    }

    _setPreloadedItems(items: RecordSet, direction: ScrollControllerLib.IDirection): Promise<void> {
        return this._addAsyncAction(
            ListActionCreators.source.setPreloadedItems({
                direction,
                items,
            })
        );
    }

    _loadItemsToDirection(
        direction: ScrollControllerLib.IDirection,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean
    ): Promise<RecordSet | Error> {
        return this._addAsyncAction(
            ListActionCreators.source.loadToDirectionOld({
                retryAction: () => {
                    this._loadItemsToDirection(direction, addItemsAfterLoad, useServicePool);
                },
                direction,
                addItemsAfterLoad,
            })
        );
    }

    private _load(
        state?: IListState,
        direction?: Direction,
        key?: TKey,
        filter?: TFilter,
        addItemsAfterLoad?: boolean,
        navigationSourceConfig?: IBaseSourceConfig,
        disableSetState?: boolean
    ): Promise<TLoadResult> {
        return this._addAsyncAction(
            ListActionCreators.source.oldSliceLoad({
                state,
                direction,
                key,
                filter,
                addItemsAfterLoad,
                navigationSourceConfig,
                disableSetState,
            })
        );
    }

    /**
     * Изменяет курсор перед загрузкой данных.
     * 1.При курсорной навигации после проваливания в папку нужно исключать ситуацию,
     * что данные в папки выше указанного крусора.
     * 2. При возврате по хлебным нужно вернуться к записи, от которой произошло проваливание.
     * 3. МЕТОД РАБОТАЕТ ТОЛЬКО ПРИ ВЫЗОВЕ slice.setRoot(). Если просто Slice.setState({root}) - не сработает.
     * @param nextState
     * @private
     * @see _processMarkedKey
     */
    private _changeCursorBeforeLoad(nextState: Partial<T>): void {
        // Делаем смену курсора только если настроена курсорная навигация.
        // При этом, если прикладник задал field, отличный от keyProperty, то
        // его значение не может быть равно this.state.root.
        // В этом случае тоже пропускаем эту логику.
        // TODO Надо полноценно перетаскивать сюда логику из explorer
        const rootChanged = nextState.root !== this.state.root;
        if (
            !rootChanged ||
            nextState.navigation?.source !== 'position' ||
            (nextState.navigation?.sourceConfig &&
                nextState.navigation.sourceConfig.field !== undefined &&
                nextState.navigation.sourceConfig.field !== nextState.keyProperty)
        ) {
            return;
        }
        // Пока поддерживаем только прямой переход по кнопке "назад",
        // Т.к. для некомпозитного списка может оказаться,
        // что все записи выше указанного курсора и папка покажется пустая или с неполными данными.
        // Надо переносить в слайс механизм запоминания и восстановления позиции курсора из explorer.
        const firstBreadCrumbsItem = this.state.breadCrumbsItems?.[0];
        if (
            firstBreadCrumbsItem &&
            (firstBreadCrumbsItem.getKey() === nextState.root ||
                firstBreadCrumbsItem.get(this.state.parentProperty) === nextState.root)
        ) {
            this._propsForMigrationToDispatcher.sliceProperties.loadConfig = {
                sourceConfig: { ...nextState.navigation.sourceConfig, position: this.state.root },
            };
        } else if (
            !firstBreadCrumbsItem ||
            !hasItemInArray(this.state.breadCrumbsItems, nextState.root)
        ) {
            this._propsForMigrationToDispatcher.sliceProperties.loadConfig = {
                sourceConfig: { ...nextState.navigation.sourceConfig, position: null },
            };
        }
    }

    private _needProcessError(error: Error): boolean {
        return !error || !(error as PromiseCanceledError).isCanceled;
    }

    destroy(): void {
        this._updateSubscriptionOnItems(this.state.items, null);

        if (!this.state.sliceOwnedByBrowser) {
            // TODO: Попробовать сделать экшен destroy, он будет распространяться в
            this._onRejectBeforeApplyState();
            if (this.state.sourceController) {
                this.state.sourceController.destroy();
            }
        }

        if (this._propsForMigrationToDispatcher) {
            this._propsForMigrationToDispatcher.sliceProperties = null;
            // Пока есть старый асинхронный код, необходимо сохранять функцию isDestroyed.
            // Обращение к методу всегда идет через объект _propsForMigrationToDispatcher,
            // поэтому сохранение идет в текущей ссылке.
            this._propsForMigrationToDispatcher.sliceCallbacks = {
                isDestroyed: this.isDestroyed.bind(this),
            };
            this._propsForMigrationToDispatcher = null;
        }
        super.destroy();
    }

    // Удаляем контроллер, только если он создан слайсом.
    protected _destroyOperationsController() {
        if (!this.state.sliceOwnedByBrowser) {
            super._destroyOperationsController();
        }
    }

    connect(): void {}

    // Возвращается значение для совместимости со старыми таблицами в WEB.
    setCollection<T extends Collection>(
        collection: T | null,
        isOnInitInOldLists?: boolean
    ): boolean {
        // https://online.sbis.ru/opendoc.html?guid=78cd4cb6-ed7b-44c5-8cba-46b16af4a91d&client=3
        if (collection === this._collection) {
            return !!this._collection;
        }

        if (collection && !collection['[Controls/display:Collection]']) {
            Logger.error(
                'Controls/dataFactory:ListSlice',
                this,
                new Error(
                    'Controls/dataFactory:ListSlice setCollection: коллекция должна быть наследником Controls/display:Collection'
                )
            );
            this._collection = undefined;
            this._initAspects(undefined, this.state);
            return false;
        }

        let alias;
        try {
            alias = resolveCollectionType(collection);
        } catch (e) {
            alias = undefined;
            Logger.error('Controls/dataFactory:ListSlice', this, e);
        }

        if (alias) {
            this._collection = collection;
        } else {
            this._collection = undefined;
        }
        // Не надо проверять alias на undefined.
        // Это поддерживаемое значение, в результате всё занулится.
        this._initAspects(alias, this.state);

        // TODO. ItemsStateManager конфликтует с BaseControl
        // Необходимо разработать слой совместимости
        // Одни и те же операции происходят в Slice, а затем в BaseControl
        // Последствия такого поведения непредсказуемы
        const ItemsStateManager = this._aspectStateManagers.get(AspectsNames.Items);
        if (ItemsStateManager) {
            ItemsStateManager.disableSetCollection();
        }

        if (this._collection && isOnInitInOldLists) {
            // TODO: избавиться, если возможно от рассинхрона со стейтом слайса по задаче
            // https://online.sbis.ru/opendoc.html?guid=28fc0b36-6e6c-4787-a277-28f34015769b&client=3
            this._collection.setMarkedKey(initMarker(this.state));
        }

        return !!this._collection;
    }

    //# region ISliceOnCollectionScheme

    select(key: CrudEntityKey, direction?: 'backward' | 'forward'): void {
        let nextState: Partial<IListState> = {};
        const state = this._getStateWithCollection();

        const selectionAspect = this._aspectStateManagers.get(AspectsNames.Selection);
        if (selectionAspect) {
            nextState = {
                ...nextState,
                ...selectionAspect.toggleItemSelection(state, key),
            };
        }

        if (direction) {
            this._addAction(ListActionCreators.marker.markNext(direction), nextState);
        } else {
            this._addAction(ListActionCreators.marker.setMarkedKey(key), nextState);
        }
    }

    selectAll() {
        this.executeCommand('selectAll');
    }

    resetSelection() {
        this.executeCommand('unselectAll');
    }

    invertSelection() {
        this.executeCommand('toggleAll');
    }

    expand(
        key: CrudEntityKey,
        {
            markItem = true,
        }: {
            markItem?: boolean;
        } = {}
    ): void {
        const getNextState = (prevState) => {
            let nextState = {};

            const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
            if (expandCollapseAspect) {
                nextState = {
                    ...nextState,
                    ...expandCollapseAspect.expand(prevState, key),
                };
            }
            return nextState;
        };

        if (markItem) {
            this._addAction(ListActionCreators.marker.setMarkedKey(key), getNextState);
        } else {
            this.setState(getNextState);
        }
    }

    collapse(
        key: CrudEntityKey,
        {
            markItem = true,
        }: {
            markItem?: boolean;
        } = {}
    ): void {
        const getNextState = (prevState) => {
            let nextState = {};

            const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
            if (expandCollapseAspect) {
                nextState = {
                    ...nextState,
                    ...expandCollapseAspect.collapse(prevState, key),
                };
            }
            return nextState;
        };

        if (markItem) {
            this._addAction(ListActionCreators.marker.setMarkedKey(key), getNextState);
        } else {
            this.setState(getNextState);
        }
    }

    resetExpansion(): void {
        const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
        if (expandCollapseAspect) {
            this.setState(expandCollapseAspect.reset(this.state));
        }
    }

    isExpanded(key: CrudEntityKey): boolean {
        const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
        if (expandCollapseAspect) {
            return expandCollapseAspect.isExpanded(this.state, key);
        }
        return false;
    }

    isExpandAll(): boolean {
        const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
        if (expandCollapseAspect) {
            return expandCollapseAspect.isExpandAll(this.state);
        }
        return false;
    }

    changeRoot(root: CrudEntityKey): void {
        let nextPartialState: Partial<IListState> = {};

        const rootAspect = this._aspectStateManagers.get(AspectsNames.Root);
        const state = this._getStateWithCollection();

        // Нельзя выполнять метод безусловно в _beforeApplyState, т.к.
        // он должен вызываться только при смене рута, а не при любой установке стейта.
        // Кейс: Есть два прайса рядом, у обоих root=null. Открываем первый, проваливаемся в любую папку
        // и тут же открываем другой прайс. В этом случае не должен обрабатываться переход "назад".
        this._changeCursorBeforeLoad({
            root,
            navigation: this.state.navigation,
            keyProperty: this.state.keyProperty,
        } as Partial<T>);

        if (rootAspect) {
            nextPartialState = {
                ...nextPartialState,
                ...rootAspect.changeRoot(this.state, root),
            };

            if (
                this.state.root !== nextPartialState.root &&
                this._aspectStateManagers.has(AspectsNames.Marker)
            ) {
                const newMarkerState = this._aspectStateManagers
                    .get(AspectsNames.Marker)
                    ?.setMarker(
                        nextPartialState,
                        processMarkedKey(state, {
                            ...state,
                            ...nextPartialState,
                        })
                    );

                nextPartialState = {
                    ...nextPartialState,
                    ...newMarkerState,
                };
            }
        } else {
            nextPartialState.root = root;
        }

        this.setState(nextPartialState);
    }

    async getSelection(): Promise<TSelectionRecordContent> {
        return {
            marked: this.state.selectedKeys,
            excluded: this.state.excludedKeys,
            recursive: this.state.recursiveSelection !== false,
            type: this.state.selectionType || 'all',
        };
    }

    getData(): Partial<T> {
        return {
            items: this.state.items,
        };
    }

    private _getStateWithCollection(state: IListState = this.state): IListState {
        return {
            ...state,
            collection: this._collection,
        };
    }
    //# endregion ISliceOnCollectionScheme
}

/**
 * @name Controls/_dataFactory/List/Slice#state
 * @cfg {Controls/_dataFactory/List/_interface/IListState} Состояние слайса списка
 */
