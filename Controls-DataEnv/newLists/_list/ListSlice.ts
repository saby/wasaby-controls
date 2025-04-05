import {
    _private_predicates,
    _private_extractUtil,
    AbstractListSlice,
    getError,
    Initializer,
    type TListMiddlewareContextExtension,
} from 'Controls-DataEnv/abstractList';
import type { IFilterDescriptionItem, TFilter, TKey, TViewMode } from 'Controls-DataEnv/interface';
import {
    Direction,
    IBaseSourceConfig,
    INavigationPositionSourceConfig,
    INavigationSourceConfig,
    IReloadItemOptions,
    IReloadItemResult,
    TItemsOrder,
    TSelectionRecordContent,
    TSelectionViewMode,
    TSortingOptionValue,
} from 'Controls-DataEnv/listTypes';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { isEqual } from 'Types/object';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

import type { IListState } from './interface/IListState';
import type { TListMiddlewareContext } from './types/TListMiddlewareContext';
import type { TMiddlewaresPropsForMigrationToDispatcher } from './actions/types/complexUpdate';
import type { ISnapshotsStore } from './types/ISnapshotsStore';
import type { IListDataFactoryArguments } from './interface/factory/IListDataFactoryArguments';
import type { TListMiddleware } from './types/TListMiddleware';
import type { TAnyListAction } from './actions/types';
import type { TOldSliceLoadAction } from './actions/types/source';
import type { IListDataFactoryLoadResult } from './interface/factory/IListDataFactoryLoadResult';
import type { IFlatSelectionState, IHierarchySelectionState } from 'Controls/multiselection';
import type { IListSavedState } from 'Controls/dataSource';
import { LibPaths } from 'Controls-DataEnv/staticLoader';
import {
    createSourceController,
    getSourceControllerOptions,
    initHasMoreStorage,
} from './ListWebInitializer/source';
import { getCount, getListCommandsSelection } from './ListWebInitializer/operationsPanel';
import { calculateFilterByFilterDescription } from './loadData/calculateFilterByFilterDescription';
import { getActiveElementByItems } from './loadData/getActiveElementByItems';
import { getFilterModuleSync } from './loadData/getFilterModuleSync';
import { ListActionCreators } from './actions/creators';
import { isStateHierarchy } from './loadData/isStateHierarchy';
import {
    filterMiddleware,
    filterPanelMiddleware,
    rootMiddleware,
    itemsMiddleware,
    operationsPanelMiddleware,
    markerMiddleware,
    breadCrumbsMiddleware,
    itemActionsMiddleware,
    highlightFieldsMiddleware,
    stubMiddleware,
    errorMiddleware,
    sourceMiddleware,
    searchMiddleware,
    selectionMiddleware,
    expandCollapseMiddleware,
    complexUpdateMiddleware,
} from './middlewares/middlewaresAsync';
import { complexUpdate } from './middlewares/complexUpdate';

const { isDefined } = _private_predicates;

const {
    source: { reload, reloadItem, reloadItems, oldSliceLoad },
    operationsPanel: { setSelectionViewMode },
    selection: { setSelectionCount },
} = ListActionCreators;

const MIDDLEWARES = [
    complexUpdate,
    operationsPanelMiddleware,
    markerMiddleware,
    selectionMiddleware,
    sourceMiddleware,
    searchMiddleware,
    filterMiddleware,
    filterPanelMiddleware,
    rootMiddleware,
    itemsMiddleware,
    expandCollapseMiddleware,
    breadCrumbsMiddleware,
    itemActionsMiddleware,
    highlightFieldsMiddleware,
    stubMiddleware,
    errorMiddleware,
    complexUpdateMiddleware,
];

/**
 * Класс, реализующий легковесный слайс списка.
 *
 * Является дженериком и принимает параметр TState - тип состояния слайса.
 * @remark
 * {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d Архитектура списков и интеракторов}
 * {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Интерактор для работы со списочными компонентами в web окружении}
 * {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/mobile-slice/ Интерактор для работы со списочными компонентами на базе мобильного контроллера}
 */
export class ListSlice<
    TState extends IListState = IListState,
    TAction extends TAbstractAction = TAnyListAction<TState>,
    TMiddlewareContext extends TListMiddlewareContext<TState, TAction> = TListMiddlewareContext<
        TState,
        TAction
    >,
> extends AbstractListSlice<TState, TAction, TMiddlewareContext> {
    readonly '[IListSlice]': boolean = true;

    protected _propsForMigrationToDispatcher: TMiddlewaresPropsForMigrationToDispatcher<TState> | null;

    private _snapshots: ISnapshotsStore = new Map();

    constructor(...args: ConstructorParameters<typeof AbstractListSlice<TState>>) {
        super(...args);

        // коллекция должна иницализироваться уже после формирования полного состояния
        // _initState не подходит т.к. после нашего метода идут прикладные
        this._onAfterInitState(this.state);
    }

    /**
     * Метод инициализации состояния
     */
    protected _initState(
        loadResult: IListDataFactoryLoadResult,
        initConfig: IListDataFactoryArguments
    ): TState {
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
                newItems: null,
                previousViewMode: undefined,
                sourceController: undefined,
            },
        };

        let storeFields: IListSavedState = {};
        if (initConfig.listConfigStoreId) {
            storeFields =
                loadSync<typeof import('Controls/dataSource')>(
                    LibPaths.DataSource
                ).getControllerState(initConfig.listConfigStoreId) || {};
        }
        // сохраненное в listConfigStoreId состояние должно обрабатываться в web версии Initializer.getState,
        // т.к. может содержать специфику прикладной логики. Пример проблемного кейса:
        // прикладники всегда ставят viewMode: table, даже при наличии searchValue.
        // В abstract Initializer отвалится валидация и принудительно проставится search.
        // web Initializer должен игнорировать валидацию и ставить как есть, если viewMode пришел из listConfigStoreId.
        // Пока viewMode будет считаться без учета searchValue при наличии listConfigStoreId
        const { searchValue: storeSearchValue, ...storeConfig } = storeFields;

        const config = { ...initConfig, ...storeConfig };

        const searchState = {};

        const sourceController =
            config.sourceController || createSourceController(loadResult, config);

        const { _propsForMigrationToDispatcher: propsForMigration } = this;
        if (propsForMigration?.sliceProperties) {
            propsForMigration.sliceProperties.sourceController = sourceController;
        }

        const items = sourceController.getItems();
        const activeElement = config.activeElement ?? getActiveElementByItems(items);
        const expandedItems = loadResult.expandedItems || sourceController.getExpandedItems() || [];

        const sourceOwnState = { sourceController, source: sourceController.getSource() };
        const state: TState = {
            ...super._initState(
                {
                    ...loadResult,
                    sorting: undefined,
                },
                {
                    ...config,
                    root: sourceController.getRoot(),
                    parentProperty: sourceController.getParentProperty(),
                    keyProperty: sourceController.getKeyProperty() as string | undefined,
                    items,
                    sorting: sourceController.getSorting(),
                    filter: sourceController.getFilter(),
                    expandedItems,
                }
            ),
            searchValue: Initializer.search.initSearchValue(
                config.searchValue || storeSearchValue,
                config.searchParam
            ),

            ..._private_extractUtil<IListDataFactoryArguments>(config, [
                // Из абстрактного, надо доразобраться
                'itemActionVisibilityCallback',
                'stickyHeader',
                'headerVisibility',
                'rowSeparatorSize',
                'rowSeparatorVisibility',
                'emptyTemplate',
                'emptyTemplateOptions',
                'itemPadding',
                'roundBorder',
                'getRowProps',

                // CORE?
                'hasChildrenProperty',
                'nodeTypeProperty',

                // SOURCE или Core?
                'selectFields',

                // SAVED PARAMS AND HISTORY
                'propStorageId',
                'rootHistoryId',
                'nodeHistoryId',
                'nodeHistoryType',
                'groupHistoryId',
                'listConfigStoreId',

                // FILTER
                'historyId',

                // selection
                'multiSelectTemplate',
                'multiSelectPosition',
                'supportSelection',
                'selectedCountConfig',
                'selectionCountMode',
                'recursiveSelection',

                'fix1193265616',
                'fix88221034174482',
                'fix88221034303402',

                'editorsViewMode',
                'adaptiveSearchMode',

                'deepReload',
                'deepScrollLoad',
                'moveMarkerOnScrollPaging',

                'countFilterValue',
                'countFilterLinkedNames',
                'countFilterValueConverter',
                'countFilterUserPeriods',
                'countFilterPeriodType',
            ]),

            // SOURCE
            ...sourceOwnState,

            // NAVIGATION
            navigation: sourceController.getNavigation(),

            // EXPAND/COLLAPSE
            // Чисто интерфейсная опция, её тут быть не должно.
            expanderVisibility: config.expanderVisibility || 'visible',

            // BC
            breadCrumbsItems: sourceController.getState().breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceController.getState().breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceController.getState().backButtonCaption,

            // Selection
            countLoading: false,
            selectionViewMode: 'hidden',
            selectionType: config.selectionType || 'all',
            isMassSelectMode:
                typeof config.isMassSelectMode === 'boolean' ? config.isMassSelectMode : true,
            selectAncestors:
                typeof config.selectAncestors === 'boolean' ? config.selectAncestors : true,
            selectDescendants:
                typeof config.selectDescendants === 'boolean' ? config.selectDescendants : true,

            activeElement,
            data: items,
            hasMoreStorage: initHasMoreStorage({
                expandedItems,
                sourceController,
            }),

            ...searchState,
            searchInputFocused: false,
        };

        this._updateSubscriptionOnItems(null, items);

        this._subscribe(state);

        return state;
    }

    protected _onAfterInitState(state: TState) {
        super._onAfterInitState(state);
        if (state.operationsPanelVisible && state.collection) {
            const calculatedCount = getCount(state);
            let storedCount;
            if (state.listConfigStoreId) {
                const storedState = loadSync<typeof import('Controls/dataSource')>(
                    LibPaths.DataSource
                ).getControllerState(state.listConfigStoreId);
                storedCount = storedState && storedState.count;
            }
            state.count =
                calculatedCount === null && isDefined(storedCount) ? storedCount : calculatedCount;
            state.isAllSelected = Initializer.selection
                .getSelectionStrategy(state)
                .isAllSelected(
                    state as unknown as IFlatSelectionState & IHierarchySelectionState,
                    state.collection.hasMoreData(),
                    state.collection.getCount(),
                    0
                );
            state.listCommandsSelection = getListCommandsSelection(state, undefined);
        }
    }

    protected _getMiddlewares(): TListMiddleware<TState, TAction>[] {
        return MIDDLEWARES as unknown as TListMiddleware<TState, TAction>[];
    }

    protected _getMiddlewaresContextExtension(): TListMiddlewareContextExtension<
        TState,
        TAction,
        TMiddlewareContext
    > {
        return {
            getTrashBox: () => ({
                _propsForMigrationToDispatcher: this._propsForMigrationToDispatcher,
            }),
            originalSliceGetState: () => this.state,
            snapshots: this._snapshots,
            onDataLoaded: this._dataLoaded.bind(this),
            onNodeDataLoaded: this._nodeDataLoaded.bind(this),
        } as TListMiddlewareContextExtension<TState, TAction, TMiddlewareContext>;
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        await super._onRejectBeforeApplyState();
        const { sourceController } = this.state;
        if (sourceController) {
            sourceController.cancelLoading();
            sourceController.updateOptions(getSourceControllerOptions(this.state));
        }
    }

    protected _onSnapshot(nextState: TState): TState {
        const result = super._onSnapshot(nextState);

        if (this._collection) {
            this._propsForMigrationToDispatcher?.sliceProperties?.sourceController?.applyNavigationChanges(
                nextState.navigationChanges
            );
        }

        return { ...result, navigationChanges: undefined };
    }

    private _getAdditionalStateOnCommandExecute(command: string): Partial<TState> | undefined {
        if (command === 'selected' || command === 'all') {
            return {
                showSelectedCount: command === 'all' ? null : this.state.count,
            } as unknown as Partial<TState>;
        }
    }

    /**
     * Метод, вызываемый после загрузки данных.
     * Должен вернуть новое состояние
     */
    protected _dataLoaded(
        _items: RecordSet,
        _direction: Direction,
        nextState: TState
    ): Partial<TState> | Promise<Partial<TState>> {
        return nextState;
    }

    /**
     * Метод, вызываемый после загрузки данных для узла (разворот ветки дерева).
     * Должен вернуть новое состояние
     * _items загруженные записи.
     * _key Ключ узла, для которого выполнялась загрузка данных.
     * ВАЖНО: это не корень иерархии!
     */
    protected _nodeDataLoaded(
        _items: RecordSet,
        _key: TKey,
        _direction: Direction,
        nextState: TState
    ): Partial<TState> | Promise<Partial<TState>> {
        return nextState;
    }

    /**
     * Перезагрузить список
     */
    reload(sourceConfig?: INavigationSourceConfig, keepNavigation?: boolean) {
        return this._addAsyncAction(reload(sourceConfig, keepNavigation) as TAction);
    }

    /**
     * Перезагрузить элемент списка
     */
    async reloadItem(
        itemKey: CrudEntityKey,
        options?: IReloadItemOptions
    ): Promise<IReloadItemResult> {
        return this._addAsyncAction(reloadItem(itemKey, options) as TAction);
    }

    /**
     * Перезагружает указанные записи списка
     */
    reloadItems(keys: TKey[]): Promise<RecordSet> {
        // @ts-expect-error Надо понять что за 2 разных типа TKey и CrudEntityKey. Постоянно пересекаются
        return this._addAsyncAction(reloadItems(keys) as TAction);
    }

    prev(key?: TKey) {
        if (isDefined(key)) {
            this._load(void 0, 'up', key);
        } else {
            super.prev();
        }
    }

    next(key?: TKey) {
        if (isDefined(key)) {
            this._load(void 0, 'down', key);
        } else {
            super.next();
        }
    }

    setExpandedItems(expandedItems: TKey[]): void {
        this.setState({ expandedItems } as Partial<TState>);
    }

    setRoot(root: TKey): void {
        this.changeRoot(root);
    }

    executeCommand(command: string): void {
        const state = {
            command,
        };

        Object.assign(state, this._getAdditionalStateOnCommandExecute(command));

        this.setState(state as Partial<TState>);
    }

    onExecutedCommand(): void {
        this.setState({
            command: null,
        } as Partial<TState>);
    }

    setSorting(sorting: TSortingOptionValue): void {
        this.setState({ sorting } as Partial<TState>);
    }

    setFilter(filter: TFilter): void {
        this.setState({ filter } as Partial<TState>);
    }

    applyFilterDescription(
        filterDescription: IFilterDescriptionItem[],
        newState?: Partial<TState>,
        appliedFrom?: string
    ): void {
        this.setState((nextState) => {
            const state = calculateFilterByFilterDescription(
                nextState,
                filterDescription,
                newState,
                appliedFrom
            );
            const shouldReload = !state || isEqual(state.filter, nextState.filter);

            if (shouldReload) {
                this.reload();
            }

            return state || nextState;
        });
    }

    setSelectionViewMode(selectionViewMode: TSelectionViewMode): void {
        this._addAction(setSelectionViewMode(selectionViewMode) as TAction);
    }

    hasMoreData(direction: Direction, key: TKey): boolean {
        return !!this.state.sourceController?.hasMoreData(direction, key);
    }

    setItems(items: RecordSet, root?: TKey): void {
        if (root !== undefined) {
            const { _propsForMigrationToDispatcher: propsForMigration } = this;
            if (propsForMigration?.sliceProperties) {
                propsForMigration.sliceProperties.newItems = items;
                this.setState({ root } as TState);
            }
        } else {
            this.state.sourceController?.setItemsAfterLoad(items);
        }
    }

    setSelectedKeys(selectedKeys: TKey[]): void {
        this.setState({
            selectedKeys,
        } as Partial<TState>);
    }

    setExcludedKeys(excludedKeys: TKey[]): void {
        this.setState({
            excludedKeys,
        } as Partial<TState>);
    }

    setSelectionCount(count: number, isAllSelected: boolean, listId?: string): void {
        this._addAction(setSelectionCount(count, isAllSelected, listId) as TAction);
    }

    setActiveElement(activeElement: TKey): void {
        this.setState({
            activeElement,
        } as Partial<TState>);
    }

    setViewMode(viewMode: TViewMode): void {
        this.setState({
            viewMode,
        } as Partial<TState>);
    }

    /**
     * Сбросить фильтры.
     */
    resetFilterDescription(): void {
        const { resetFilterDescription } = getFilterModuleSync().FilterDescription;
        const newFilterDescription = resetFilterDescription(
            this.state.filterDescription ?? [],
            true
        );
        this.applyFilterDescription(newFilterDescription);
    }

    /**
     * Перезагрузить данные для редактора фильтра
     */
    reloadFilterItem(
        filterName: string,
        sourceConfig?: IBaseSourceConfig,
        keepNavigation: boolean = false
    ): void | Promise<RecordSet | Error> {
        return getFilterModuleSync().FilterLoader.reloadFilterItem(
            filterName,
            this.state.filterDescription ?? [],
            sourceConfig,
            keepNavigation
        );
    }

    resetSearch(): void {
        this.setSearchInputValue('');
        this.resetSearchQuery();
        this.setState({
            searchInputFocused: true,
        } as Partial<TState>);
    }

    /**
     * Сбросить параметр поиска из списочного метода. Строка поиска не очищается
     * @remark используется если текст в строке поиска короче минимальной длины, необходимой поиску
     */
    resetSearchQuery(): void {
        this.setState({
            searchValue: '',
        } as Partial<TState>);
    }

    /**
     * Запустить поиск
     */
    search(searchValue: string): void {
        if (!this.state.searchParam) {
            getError('MISSING_SEARCH_PARAM');
            return;
        } else if (this.state.searchValue === searchValue && !this.state.loading) {
            this.reload();
        } else {
            this.setSearchInputValue(searchValue);
            this.setState({
                searchValue,
            } as Partial<TState>);
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
        partialState: Partial<TState>,
        currentAppliedState?: Partial<TState>
    ): boolean {
        // Добавить source по ошибке https://online.sbis.ru/opendoc.html?guid=0365f7ad-842f-43d2-9b3a-f0a0353e9470&client=3
        const props: (keyof Partial<TState>)[] = [
            'filter',
            'navigation',
            'sorting',
            'sourceController',
            'searchValue',
        ];
        const isPropertyChanged = (propName: keyof Partial<TState>) => {
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
            (!!this.state.parentProperty && isPropertyChanged('root'))
        );
    }

    protected _load(
        state?: IListState,
        direction?: Direction,
        key?: TKey,
        filter?: TFilter,
        addItemsAfterLoad?: boolean,
        navigationSourceConfig?: IBaseSourceConfig,
        disableSetState?: boolean
    ): Promise<TOldSliceLoadAction> {
        return this._addAsyncAction(
            oldSliceLoad({
                state,
                direction,
                key,
                filter,
                addItemsAfterLoad,
                navigationSourceConfig,
                disableSetState,
            }) as TAction
        );
    }

    /**
     * Изменяет курсор перед загрузкой данных.
     * 1.При курсорной навигации после проваливания в папку нужно исключать ситуацию,
     * что данные в папки выше указанного крусора.
     * 2. При возврате по хлебным нужно вернуться к записи, от которой произошло проваливание.
     * 3. МЕТОД РАБОТАЕТ ТОЛЬКО ПРИ ВЫЗОВЕ slice.setRoot(). Если просто Slice.setState({root}) - не сработает.
     */
    private _changeCursorBeforeLoad(nextState: Partial<TState>): void {
        const {
            _propsForMigrationToDispatcher: propsForMigration,
            state: {
                root: currentRoot,
                breadCrumbsItems: currentBreadCrumbsItem,
                parentProperty: currentParentProperty,
            },
        } = this;
        const { navigation: nextNavigation, root: nextRoot } = nextState;
        // Делаем смену курсора только если настроена курсорная навигация.
        // При этом, если прикладник задал field, отличный от keyProperty, то
        // его значение не может быть равно this.state.root.
        // В этом случае тоже пропускаем эту логику.
        // TODO Надо полноценно перетаскивать сюда логику из explorer
        const rootChanged = nextState.root !== currentRoot;
        if (
            !propsForMigration?.sliceProperties ||
            !rootChanged ||
            nextNavigation?.source !== 'position' ||
            (nextNavigation?.sourceConfig &&
                (nextNavigation.sourceConfig as INavigationPositionSourceConfig).field !==
                    undefined &&
                (nextNavigation.sourceConfig as INavigationPositionSourceConfig).field !==
                    nextState.keyProperty)
        ) {
            return;
        }
        // Пока поддерживаем только прямой переход по кнопке "назад",
        // Т.к. для некомпозитного списка может оказаться,
        // что все записи выше указанного курсора и папка покажется пустая или с неполными данными.
        // Надо переносить в слайс механизм запоминания и восстановления позиции курсора из explorer.
        const firstBreadCrumbsItem = currentBreadCrumbsItem?.[0];
        if (
            currentParentProperty &&
            firstBreadCrumbsItem &&
            (firstBreadCrumbsItem.getKey() === nextRoot ||
                firstBreadCrumbsItem.get(currentParentProperty) === nextRoot)
        ) {
            propsForMigration.sliceProperties.loadConfig = {
                sourceConfig: { ...nextNavigation.sourceConfig, position: currentRoot },
            };
        } else if (
            !firstBreadCrumbsItem ||
            !currentBreadCrumbsItem?.some((item) => item.getKey() === nextRoot)
        ) {
            propsForMigration.sliceProperties.loadConfig = {
                sourceConfig: { ...nextNavigation.sourceConfig, position: null },
            };
        }
    }

    destroy(): void {
        const { state: currentState, _propsForMigrationToDispatcher: propsForMigration } = this;
        if (!currentState.sliceOwnedByBrowser) {
            // TODO: Попробовать сделать экшен destroy, он будет распространяться в
            this._onRejectBeforeApplyState();
            if (currentState.sourceController) {
                currentState.sourceController.destroy();
            }
        }

        if (propsForMigration) {
            propsForMigration.sliceProperties = null;
            // Пока есть старый асинхронный код, необходимо сохранять функцию isDestroyed.
            // Обращение к методу всегда идет через объект _propsForMigrationToDispatcher,
            // поэтому сохранение идет в текущей ссылке.
            propsForMigration.sliceCallbacks = {
                isDestroyed: this.isDestroyed.bind(this),
            };
            this._propsForMigrationToDispatcher = null;
        }
        super.destroy();
    }

    connect(): void {}

    //# region ISliceOnCollectionScheme

    resetExpansion(): void {
        this._addAction(ListActionCreators.expandCollapse.resetExpansion() as TAction);
    }

    /**
     * @deprecated
     * @private
     */
    isExpanded(key: CrudEntityKey): boolean {
        // TODO: Смело можно удалять помле 25.1200.
        // Если аткнулись - удаляем.
        return this._getDeprecated('isExpanded', key);
    }

    /**
     * @deprecated
     * @private
     */
    isExpandAll(): boolean {
        // TODO: Смело можно удалять помле 25.1200.
        // Если аткнулись - удаляем.
        return this._getDeprecated('isExpandAll');
    }

    private _getDeprecated(name: 'isExpanded', key: CrudEntityKey): boolean;
    private _getDeprecated(name: 'isExpandAll'): boolean;
    private _getDeprecated(name: 'isExpanded' | 'isExpandAll', key?: CrudEntityKey): boolean {
        getError('DEPRECATED_USED', 'error', name, void 0, '25.1100');
        if (isStateHierarchy(this.state) && isLoaded('Controls/listsCommonLogic')) {
            const lib = loadSync<typeof import('Controls/listsCommonLogic')>(
                'Controls/listsCommonLogic'
            ).UILogic.Hierarchy;
            return lib[name](this.state, key as CrudEntityKey);
        }
        return false;
    }

    changeRoot(root: TKey): void {
        const { navigation, keyProperty } = this.state;
        this._changeCursorBeforeLoad({
            root,
            navigation,
            keyProperty,
        } as Partial<TState>);
        super.changeRoot(root);
    }

    async getSelection(): Promise<TSelectionRecordContent> {
        const { selectedKeys, excludedKeys, recursiveSelection, selectionType } = this.state;
        return {
            marked: selectedKeys,
            excluded: excludedKeys,
            recursive: recursiveSelection !== false,
            type: selectionType || 'all',
        };
    }

    getData(): Partial<TState> {
        return {
            items: this.state.items,
        } as Partial<TState>;
    }

    //# endregion ISliceOnCollectionScheme
}
