/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import type { IItemsState, TItemsChange, TMetaDataChange } from 'Controls/listAspects';
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
import type { TFilter, TKey, TViewMode } from 'Controls-DataEnv/interface';
import type {
    Direction,
    IBaseSourceConfig,
    INavigationOptionValue,
    INavigationSourceConfig,
    MarkerDirection,
    TSearchNavigationMode,
    TSortingOptionValue,
} from 'Controls/interface';
import { TSelectionRecordContent } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { Collection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import { PrefetchProxy } from 'Types/source';
import type { IListState } from './_interface/IListState';
import type { IListLoadResult } from './_interface/IListLoadResult';
import type { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';
import type { IListAspects } from '../AbstractList/_interface/IAspectTypes';
import { getDecomposedPromise } from '../helpers/DecomposedPromise';
import type { TListAction } from '../ListWebDispatcher/types/TListAction';

// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import {
    calculateAddItemsChanges,
    getControllerState,
    INavigationChanges,
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UICommon/Events';
import { Logger } from 'UI/Utils';
import { IReloadItemOptions, IReloadItemResult, IReloadItemsResult } from 'Controls/listCommands';
import { Model, PromiseCanceledError } from 'Types/entity';
import resolveCollectionType from '../AbstractList/collections/resolveCollectionType';
import { AspectsNames } from '../AbstractList/_interface/AspectsNames';
import { AbstractListSlice } from '../AbstractList/AbstractListSlice';
import getStateAfterLoadError from './resources/error';
import { ListWebDispatcher } from '../ListWebDispatcher/ListWebDispatcher';
import { getSourceControllerOptions } from '../ListWebDispatcher/middlewares/_loadData';
import { resolveModuleWithCallback } from '../ListWebDispatcher/middlewares/_loadModule';
import { getSearchMisspellValue } from '../ListWebDispatcher/middlewares/_search';
import { getActiveElementByItems } from '../ListWebDispatcher/middlewares/_navigation';
import { processMarkedKey } from '../ListWebDispatcher/middlewares/marker';
import { dataLoadedInner } from '../ListWebDispatcher/middlewares/beforeApplyState';
import { reload } from '../ListWebDispatcher/actions/reload';

import {
    beforeApplyState as beforeApplyStateAction,
    TBASMiddlewarePrivateState,
    TMiddlewaresPropsForMigrationToDispatcher,
} from '../ListWebDispatcher/actions/beforeApplyState';
import { Logger as DispatcherLogger } from '../ListWebDispatcher/utils';
import { hasItemInArray } from '../AbstractList/utils/itemUtils';

export type TLoadResult = RecordSet | Error;

let LABELS_COUNT: number;
let LABELS: WeakMap<
    ListSlice<IListState>,
    {
        name: string;
        isSynthetic: boolean;
    }
>;
(() => {
    LABELS_COUNT = 0;
    LABELS = new WeakMap();
})();
const SYNTHETIC_NAME = '_dataSyntheticStoreId';

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
export default class ListSlice<T extends IListState = IListState> extends AbstractListSlice<T> {
    readonly '[IListSlice]': boolean = true;

    // Временное решение, до полного перевода _bas на экшены.
    // Уйдет в мидлвару.
    private _bASMiddlewarePrivateState: TBASMiddlewarePrivateState;

    private _propsForMigrationToDispatcher: TMiddlewaresPropsForMigrationToDispatcher;

    private _subscribeOnFilter: boolean;

    protected _aspectStateManagers: IListAspects;
    protected _cachedItemsChanges: IItemsState['itemsChanges'] = [];

    private _dispatcher: ListWebDispatcher;
    private _stateAfterDispatch: T | null;
    private _updateSessionId: number = 1;

    constructor(...args: ConstructorParameters<typeof AbstractListSlice>) {
        super(...args);

        if (this._name === SYNTHETIC_NAME) {
            LABELS_COUNT++;
            LABELS.set(this, `LIST_SLICE_${LABELS_COUNT}`);
        } else {
            LABELS.set(this, this._name);
        }
    }

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

    private _initExpandedItems(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): TKey[] {
        return loadResult.expandedItems || config.expandedItems || [];
    }

    private _initSorting(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): IListDataFactoryArguments['sorting'] {
        return loadResult.sorting || config.sorting;
    }

    private _initSearch(config: IListDataFactoryArguments): ISearchInitResult {
        let searchMisspellValue = '';
        if (config.searchValue) {
            searchMisspellValue = getSearchMisspellValue(
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

    private _initSourceController(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): SourceController {
        return this._getSourceController({
            items: loadResult.items,
            error: loadResult.error,
            expandedItems: this._initExpandedItems(loadResult, config),
            source:
                config.source instanceof PrefetchProxy
                    ? config.source.getOriginal()
                    : config.source,
            navigation: config.navigation,
            filter: loadResult.filter || config.filter,
            parentProperty: config.parentProperty,
            keyProperty: config.keyProperty,
            selectFields: config.selectFields,
            sorting: this._initSorting(loadResult, config),
            root: loadResult.root || config.root,
            displayProperty: config.displayProperty,
            groupHistoryId: config.groupHistoryId,
            selectedKeys: config.selectedKeys,
            excludedKeys: config.excludedKeys,
            nodeHistoryType: config.nodeHistoryType,
            nodeTypeProperty: config.nodeTypeProperty,
            nodeHistoryId: config.nodeHistoryId,
            deepReload: config.deepReload,
            deepScrollLoad: config.deepScrollLoad,
            propStorageId: config.propStorageId,
        });
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

        this._bASMiddlewarePrivateState = {
            rootBeforeSearch: undefined,
            hasHierarchyFilterBeforeSearch: false,
            hasRootInFilterBeforeSearch: false,
            stateBeforeShowSelected: null,
            previousMultiSelectVisibility: undefined,
        };

        this._propsForMigrationToDispatcher = {
            dataCallbacks: {
                dataLoaded: this.__dataLoaded.bind(this),
                nodeDataLoaded: this._nodeDataLoaded.bind(this),
            },
            sliceCallbacks: {
                applyState: this._applyState.bind(this),
                setState: this.setState.bind(this),
                load: this._load.bind(this),
                getSourceController: this._getSourceController.bind(this),
                isDestroyed: this.isDestroyed.bind(this),
                openOperationsPanel: this.openOperationsPanel.bind(this),
                unsubscribeFromSourceController: this._unsubscribeFromSourceController.bind(this),
                updateSubscriptionOnItems: this._updateSubscriptionOnItems.bind(this),
            },
            sliceProperties: {
                loadConfig: null,
                newItems: undefined,
                previousViewMode: undefined,
                sourceController: undefined,
                aspectStateManagers: undefined,
            },
        };

        this._dispatcher = new ListWebDispatcher(
            {
                getState: () => this.state,
                setState: (state, applyStateStrategy) => {
                    switch (applyStateStrategy) {
                        case 'internal': {
                            this._stateAfterDispatch = state;
                            break;
                        }
                        case 'async': {
                            this.setState(state);
                            break;
                        }
                        case 'immediate': {
                            this._applyState(state);
                            break;
                        }
                    }
                },
            },
            () => this._aspectStateManagers,
            () => this.state.collection || this._collection,
            () => ({
                _propsForMigrationToDispatcher: this._propsForMigrationToDispatcher,
                _bASMiddlewarePrivateState: this._bASMiddlewarePrivateState,
            })
        );
        this._dispatcher.init();

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
        this._propsForMigrationToDispatcher.sliceProperties.sourceController =
            config.sourceController;
        const sourceController = this._initSourceController(loadResult, config);

        if (config.searchParam) {
            searchState = this._initSearch(config);
        }

        const items = sourceController.getItems();
        const activeElement = config.activeElement ?? getActiveElementByItems(items);

        const selectedKeys = config.selectedKeys || [];
        const excludedKeys = config.excludedKeys || [];

        const state: T = {
            ...this._getInitialState(loadResult, {
                ...config,
                root: sourceController.getRoot(),
            }),
            filterDetailPanelVisible: false,
            activeElement,
            displayProperty: config.displayProperty,
            command: null,
            countLoading: false,
            items,
            data: items,
            sorting: sourceController.getSorting(),
            selectFields: config.selectFields,
            keyProperty: sourceController.getKeyProperty(),
            expandedItems: loadResult.expandedItems || sourceController.getExpandedItems() || [],
            collapsedItems: config.collapsedItems || [],
            singleExpand: config.singleExpand,
            nodeProperty: config.nodeProperty,
            parentProperty: sourceController.getParentProperty(),
            loading: false,
            breadCrumbsItems: sourceController.getState().breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceController.getState().breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceController.getState().backButtonCaption,
            sourceController,
            filter: sourceController.getFilter(),
            historyId: config.historyId,
            source: sourceController.getSource(),
            root: sourceController.getRoot(),
            navigation: sourceController.getNavigation(),
            selectedKeys,
            excludedKeys,
            listConfigStoreId: config.listConfigStoreId,
            viewMode: config.viewMode || loadResult.viewMode,
            markerVisibility: config.markerVisibility || 'onactivated',
            multiSelectVisibility: config.multiSelectVisibility || 'hidden',
            supportSelection: config.supportSelection,
            selectionViewMode: 'hidden',
            groupHistoryId: config.groupHistoryId,
            markedKey: config.markedKey,
            isAllSelected: false,
            count: undefined,
            selectedCountConfig: config.selectedCountConfig,
            editorsViewMode: config.editorsViewMode,
            // FIXME Костыль для совместимости, будет удалён по проекту https://online.sbis.ru/opendoc.html?guid=3ccfe8ae-17d7-4796-acf4-682b3b690637&client=3
            // Флаг нужен, чтобы слайс не разрушал sourceController, если слайс был порождён внутри Browser'a
            // В этом случае сам Browser разрушает sourceController
            sliceOwnedByBrowser: config.sliceOwnedByBrowser,
            adaptiveSearchMode: config.adaptiveSearchMode,
            propStorageId:
                config.propStorageId ||
                this._propsForMigrationToDispatcher.sliceProperties.sourceController.getState()
                    .propStorageId,
            hasChildrenProperty: config.hasChildrenProperty,
            // Чисто интерфейсная опция, её тут быть не должно.
            expanderVisibility: config.expanderVisibility || 'visible',
            selectionCountMode: config.selectionCountMode,
            recursiveSelection: config.recursiveSelection,
            ...searchState,
            rootHistoryId: config.rootHistoryId,
            nodeHistoryId: config.nodeHistoryId,
            nodeHistoryType: config.nodeHistoryType,
            nodeTypeProperty: config.nodeTypeProperty,
            deepReload: config.deepReload,
            deepScrollLoad: config.deepScrollLoad,
            selectionType: config.selectionType || 'all',
            isMassSelectMode:
                typeof config.isMassSelectMode === 'boolean' ? config.isMassSelectMode : true,
            selectAncestors:
                typeof config.selectAncestors === 'boolean' ? config.selectAncestors : true,
            selectDescendants:
                typeof config.selectDescendants === 'boolean' ? config.selectDescendants : true,
            moveMarkerOnScrollPaging: config.moveMarkerOnScrollPaging,
            // FIXME удалить, когда перенесём коллекцию из списка
            collectionType: config.collectionType,
            selectionModel: new Map(),
            searchInputFocused: false,
            error: loadResult.error,
            errorViewConfig: loadResult.errorViewConfig,
            countFilterValue: config.countFilterValue,
            countFilterLinkedNames: config.countFilterLinkedNames,
            countFilterValueConverter: config.countFilterValueConverter,
        };

        this._subscribeOnControllersChanges(state);

        this._updateSubscriptionOnItems(null, items);

        this._propsForMigrationToDispatcher.sliceProperties.previousViewMode = state.viewMode;

        this._initCollection(initConfig.collectionType, state);
        // TODO: Сделать init стейта слайса через аспекты.
        this._initAspects(initConfig.collectionType, state);

        state.collection = this.collection;
        this._propsForMigrationToDispatcher.sliceProperties.collection = this._collection;
        this._propsForMigrationToDispatcher.sliceProperties.aspectStateManagers =
            this._aspectStateManagers;

        // Чистой новой схеме маркер инициализируется правильно, как надо.
        // Для всех остальных список сам дергает и
        // проставляет в модель значение на маунте.
        // Затем, после построения, обновляется слайс
        if (this.collection) {
            const MarkerStateManager = this._aspectStateManagers.get(AspectsNames.Marker);
            if (MarkerStateManager) {
                state.markedKey = MarkerStateManager.initMarker(state, this.collection);
            }

            const ItemActionsStateManager = this._aspectStateManagers.get(AspectsNames.ItemActions);
            if (ItemActionsStateManager) {
                ItemActionsStateManager.initItemActions(state, this.collection);
            }
        }

        return state;
    }

    protected async _beforeApplyState(nextStateProp: T): Promise<T> {
        if (this.isDestroyed()) {
            return this.state;
        }

        this.unobserveChanges(this.state);

        const nextState = super._beforeApplyState(nextStateProp);

        // Первая фаза расчета nextState
        // Проверка будет удалена по проекту (старый список без CollectionType).
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

        // Вторая фаза расчета nextState
        const nextStateResult = await this.__beforeApplyStateInternal(draftNextState);
        this.observeChanges(nextStateResult);

        return nextStateResult;
    }

    protected _onSnapshot(nextState: T): T {
        // Третья фаза расчета nextState синхронная. Применение изменений к коллекции
        return this._resolveNextState(nextState);
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        this.state.sourceController.cancelLoading();
        this.state.sourceController.updateOptions(getSourceControllerOptions(this.state));
        await this._dispatcher.dispatch({
            type: 'rejectSetState',
            payload: {},
        });
    }
    private executingActionToDispatch?: Map<string, TListAction>;
    protected async __beforeApplyStateInternal(draftStateProp: T): Promise<T> {
        this.executingActionToDispatch = draftStateProp._actionToDispatch || new Map();

        if (draftStateProp._actionToDispatch) {
            delete draftStateProp._actionToDispatch;
        }

        const logger = DispatcherLogger.create(
            `[${LABELS?.get(this) || this._name}]: Update №${this._updateSessionId}`,
            this.state,
            draftStateProp
        );

        logger.start();
        for (const action of (
            this.executingActionToDispatch as Map<string, TListAction>
        ).values()) {
            await this._dispatcher.dispatch(action);
        }
        await this._dispatcher.dispatch(
            beforeApplyStateAction(
                this._stateAfterDispatch || draftStateProp,
                this._propsForMigrationToDispatcher,
                this._bASMiddlewarePrivateState
            )
        );

        logger.end();

        this._updateSessionId++;
        this.executingActionToDispatch = undefined;
        // Может быть null, если отменили диспатч.
        const nextState = this._stateAfterDispatch || draftStateProp;
        this._stateAfterDispatch = null;

        return nextState;
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

    private __dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        if (nextState.promiseResolverForReloadOnly) {
            nextState.promiseResolverForReloadOnly();
        }
        return this._dataLoaded(items, direction, nextState);
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
     * Добавляет экшен
     * @function Controls/_dataFactory/List/Slice#_addAction
     * @param {TListAction} action
     * @private
     * @return void
     */
    private _addAction(action: TListAction): void {
        this.setState((prevState) => {
            const notExecutingActions = new Map();
            if (prevState._actionToDispatch) {
                for (const action of prevState._actionToDispatch.values()) {
                    if (this.executingActionToDispatch?.get(action.type) !== action) {
                        notExecutingActions.set(action.type, action);
                    }
                }
            }
            notExecutingActions.set(action.type, action);
            return {
                _actionToDispatch: notExecutingActions,
            };
        });
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
        const { promise, resolve: onResolve, reject: onReject } = getDecomposedPromise();

        this._addAction(reload(sourceConfig, keepNavigation, onResolve, onReject));

        return promise;
    }

    /**
     * Перезагрузить элемент списка
     * @function Controls/_dataFactory/List/Slice#reloadItem
     * @param {TKey} itemKey Ключ записи для перезагрузки
     * @param {Controls/_listCommands/ReloadItem/IReloadItemOptions} options Параметры перезагрузки
     * @public
     * @return {Promise<IReloadItemResult>}
     */
    reloadItem(itemKey: CrudEntityKey, options?: IReloadItemOptions): IReloadItemResult {
        return new Promise((resolve) => {
            resolveModuleWithCallback<typeof import('Controls/listCommands')>(
                'Controls/listCommands',
                ({ ReloadItem }) => {
                    const reloadItemCommand = new ReloadItem();
                    resolve(
                        reloadItemCommand.execute({
                            sourceController:
                                this._propsForMigrationToDispatcher.sliceProperties
                                    .sourceController,
                            keyProperty: this.state.keyProperty,
                            nodeProperty: this.state.nodeProperty,
                            parentProperty: this.state.parentProperty,
                            root: this.state.root,
                            items: this.state.items,
                            filter: this.state.filter,
                            ...options,
                            itemKey,
                        })
                    );
                }
            );
        });
    }

    /**
     * Перезагружает указанные записи списка
     * @function Controls/_dataFactory/List/Slice#reloadItem
     * @param {Array<TKey>} keys Ключ записи для перезагрузки
     * @public
     * @return {Promise<IReloadItemsResult>}
     */
    reloadItems(keys: TKey[]): IReloadItemsResult {
        return new Promise((resolve) => {
            resolveModuleWithCallback<typeof import('Controls/listCommands')>(
                'Controls/listCommands',
                ({ ReloadItems }) => {
                    const reloadItemsCommand = new ReloadItems();
                    resolve(
                        reloadItemsCommand.execute({
                            keys,
                            keyProperty: this.state.keyProperty,
                            nodeProperty: this.state.nodeProperty,
                            parentProperty: this.state.parentProperty,
                            expandedItems: this.state.expandedItems,
                            root: this.state.root,
                            items: this.state.items,
                            filter: this.state.filter,
                            sourceController:
                                this._propsForMigrationToDispatcher.sliceProperties
                                    .sourceController,
                        })
                    );
                }
            );
        });
    }

    load(
        direction?: Direction,
        key?: TKey,
        filter?: TFilter,
        addItemsAfterLoad?: boolean,
        navigationSourceConfig?: IBaseSourceConfig
    ): Promise<TLoadResult> {
        return this._load.apply(this, [void 0, ...arguments]).catch((error) => {
            // TODO: !!!!!!

            if (this._needProcessError(error)) {
                this.setState({
                    loading: false,
                });
            }
            return Promise.reject(error);
        });
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

    /**
     * Открыть окна фильтров
     * @function Controls/_dataFactory/List/Slice#openFilterDetailPanel
     * @public
     * @return {void}
     */
    openFilterDetailPanel(): void {
        this.setState({
            filterDetailPanelVisible: true,
        });
    }

    /**
     * Закрыть окна фильтров
     * @function Controls/_dataFactory/List/Slice#openFilterDetailPanel
     * @public
     * @return {void}
     */
    closeFilterDetailPanel(): void {
        this.setState({
            filterDetailPanelVisible: false,
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
        return AbstractListSlice.getFilterModuleSync().FilterLoader.reloadFilterItem(
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

    private __addLoadingPromise<PromiseType>(promise: Promise<PromiseType>) {
        if (this.loadingPromises === undefined) {
            this.loadingPromises = new Set();
        }
        this.loadingPromises.add(promise);
        promise.finally(() => {
            this.loadingPromises?.delete?.(promise);
        });
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
        this._applyState({
            loading: true,
        });
        const loadPromise = (state || this.state).sourceController.load(
            direction,
            key,
            filter,
            addItemsAfterLoad,
            navigationSourceConfig
        );

        this.__addLoadingPromise(loadPromise);

        return loadPromise
            .then((result: TLoadResult) => {
                if (this.isDestroyed()) {
                    return result;
                }

                if (addItemsAfterLoad === false) {
                    return result;
                }
                const nextState = state || this.state;

                return dataLoadedInner({
                    items: result as RecordSet,
                    direction,
                    nextState: {
                        ...nextState,
                        loading: false,
                        filter: filter || nextState.filter,
                    },
                    additionalPromise: null,
                    key,
                    currentState: this.state,
                    privateState: this._bASMiddlewarePrivateState,
                    props: this._propsForMigrationToDispatcher,
                }).then((newState) => {
                    if (!disableSetState) {
                        if (filter) {
                            newState.sourceController.setFilter(filter);
                        }
                        this.setState(newState);
                    }
                    return result;
                });
            })
            .catch((error) => {
                // TODO: !!!!!!

                this._applyState({
                    loading: false,
                });
                if (this._needProcessError(error)) {
                    state.sourceController.setFilter(filter);
                }
                return Promise.reject(error);
            });
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

    private _getSourceController(props: ISourceControllerOptions): SourceController {
        if (!this._propsForMigrationToDispatcher.sliceProperties.sourceController) {
            const dataSource =
                loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
            this._propsForMigrationToDispatcher.sliceProperties.sourceController =
                new dataSource.NewSourceController(props);
        }
        return this._propsForMigrationToDispatcher.sliceProperties.sourceController;
    }

    private _needProcessError(error: Error): boolean {
        return !error || !(error as PromiseCanceledError).isCanceled;
    }

    destroy(): void {
        this._updateSubscriptionOnItems(this.state.items, null);

        if (!this.state.sliceOwnedByBrowser) {
            this._onRejectBeforeApplyState();
            if (this._propsForMigrationToDispatcher.sliceProperties.sourceController) {
                this._propsForMigrationToDispatcher.sliceProperties.sourceController.destroy();
            }
        }

        this._dispatcher.destroy();
        LABELS.delete(this);

        if (this._propsForMigrationToDispatcher) {
            this._propsForMigrationToDispatcher.sliceProperties = null;
            this._propsForMigrationToDispatcher.sliceCallbacks = null;
            this._propsForMigrationToDispatcher.dataCallbacks = null;
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

    // Возвращается значение для совместимости со старыми таблицами в WEB.
    setCollection<T extends Collection>(collection: T, isOnInitInOldLists?: boolean): boolean {
        // https://online.sbis.ru/opendoc.html?guid=78cd4cb6-ed7b-44c5-8cba-46b16af4a91d&client=3
        if (collection === this._collection) {
            return !!this._collection;
        }

        if (!collection['[Controls/display:Collection]']) {
            Logger.error(
                'Controls/dataFactory:ListSlice',
                this,
                new Error(
                    'Controls/dataFactory:ListSlice setCollection: коллекция должна быть наследником Controls/display:Collection'
                )
            );
            this._collection = undefined;
            this._initAspects(undefined, this.state);
            this._propsForMigrationToDispatcher.sliceProperties.collection = undefined;
            this._propsForMigrationToDispatcher.sliceProperties.aspectStateManagers =
                this._aspectStateManagers;
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

        this._propsForMigrationToDispatcher.sliceProperties.collection = this._collection;
        this._propsForMigrationToDispatcher.sliceProperties.aspectStateManagers =
            this._aspectStateManagers;

        // TODO. ItemsStateManager конфликтует с BaseControl
        // Необходимо разработать слой совместимости
        // Одни и те же операции происходят в Slice, а затем в BaseControl
        // Последствия такого поведения непредсказуемы
        const ItemsStateManager = this._aspectStateManagers.get(AspectsNames.Items);
        if (ItemsStateManager) {
            ItemsStateManager.disableSetCollection();
        }

        if (this._collection && isOnInitInOldLists) {
            const MarkerStateManager = this._aspectStateManagers.get(AspectsNames.Marker);
            if (MarkerStateManager) {
                this._collection.setMarkedKey(
                    MarkerStateManager.initMarker(this.state, this._collection)
                );
            }
        }

        return !!this._collection;
    }

    protected async _loadNewItems(direction: Direction): Promise<void> {
        if (
            this.state.loading ||
            !this._propsForMigrationToDispatcher.sliceProperties.sourceController.hasMoreData(
                direction
            )
        ) {
            return;
        }

        try {
            const items = await this._load(
                this.state,
                direction,
                this.state.root,
                undefined,
                false
            );

            if (items instanceof Error) {
                throw items;
            }
            let itemsChanges: TItemsChange[] = [];
            let metaDataChanges: TMetaDataChange[] = [];
            let hasMoreStorage = this.state.hasMoreStorage;
            const navigationChanges =
                this._propsForMigrationToDispatcher.sliceProperties.sourceController.calculateNavigationChanges(
                    items,
                    {
                        key: this.state.root,
                        direction,
                    }
                );

            const itemsAspectManager = this._aspectStateManagers.get(AspectsNames.Items);
            if (itemsAspectManager) {
                const recordSetChanges = calculateAddItemsChanges(
                    this.state.items,
                    items,
                    direction,
                    this.state.root,
                    this.state.root,
                    (this._collection as unknown as ITreeGridCollection)?.getChildrenProperty?.()
                );
                void ({ itemsChanges, metaDataChanges } =
                    itemsAspectManager.calculateItemsChanges(recordSetChanges));
                hasMoreStorage = itemsAspectManager.calculateHasMoreStorage(
                    this.state.hasMoreStorage,
                    items,
                    direction,
                    this.state.root
                );
            }

            this.setState({
                itemsChanges,
                metaDataChanges,
                navigationChanges,
                hasMoreStorage,
                loading: false,
            });
        } catch (error: unknown) {
            getStateAfterLoadError(this.state, this.state, error, this.state.root).then(
                (nextState: IListState) => {
                    this.setState(nextState);
                }
            );
        }
    }

    //# region ISliceOnCollectionScheme
    mark(key: CrudEntityKey | null): void {
        const markerAspect = this._aspectStateManagers.get(AspectsNames.Marker);
        if (markerAspect) {
            this.setState(markerAspect.setMarker(this.state, key));
        }
    }

    select(key: CrudEntityKey, direction?: MarkerDirection): void {
        let nextState: Partial<IListState> = {};

        const selectionAspect = this._aspectStateManagers.get(AspectsNames.Selection);
        if (selectionAspect) {
            nextState = {
                ...nextState,
                ...selectionAspect.toggleItemSelection(this.state, key),
            };
        }

        const markerAspect = this._aspectStateManagers.get(AspectsNames.Marker);
        if (markerAspect) {
            let nextMarkedKey = key;
            if (direction) {
                const strategy = loadSync<typeof import('Controls/listAspects')>(
                    'Controls/listAspects'
                ).MarkerUILogic.getMarkerStrategy(this._collection);
                nextMarkedKey = strategy.getMarkedKeyByDirection(
                    this.state,
                    this._collection,
                    direction
                );
            }
            nextState = {
                ...nextState,
                ...markerAspect.setMarker(this.state, nextMarkedKey),
            };
        }
        this.setState(nextState);
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
        this.setState((prevState) => {
            let nextState = {};

            const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
            if (expandCollapseAspect) {
                nextState = {
                    ...nextState,
                    ...expandCollapseAspect.expand(prevState, key),
                };
            }
            const markerAspect = this._aspectStateManagers.get(AspectsNames.Marker);
            if (markerAspect && markItem) {
                nextState = {
                    ...nextState,
                    ...markerAspect.setMarker(prevState, key),
                };
            }

            return nextState;
        });
    }

    collapse(
        key: CrudEntityKey,
        {
            markItem = true,
        }: {
            markItem?: boolean;
        } = {}
    ): void {
        this.setState((prevState) => {
            let nextState = {};

            const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
            if (expandCollapseAspect) {
                nextState = {
                    ...nextState,
                    ...expandCollapseAspect.collapse(prevState, key),
                };
            }
            const markerAspect = this._aspectStateManagers.get(AspectsNames.Marker);
            if (markerAspect && markItem) {
                nextState = {
                    ...nextState,
                    ...markerAspect.setMarker(prevState, key),
                };
            }

            return nextState;
        });
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
                        processMarkedKey(this.state, {
                            ...this.state,
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

    next(): void {
        this._loadNewItems('down');
    }

    prev(): void {
        this._loadNewItems('up');
    }

    async getSelection(): Promise<TSelectionRecordContent> {
        return {
            marked: this.state.selectedKeys,
            excluded: this.state.excludedKeys,
            recursive: this.state.recursiveSelection !== false,
            type: this.state.selectionType || 'all',
        };
    }

    //# endregion ISliceOnCollectionScheme
}
/**
 * @name Controls/_dataFactory/List/Slice#state
 * @cfg {Controls/_dataFactory/List/_interface/IListState} Состояние слайса списка
 */
