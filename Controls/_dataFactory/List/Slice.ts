/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { Slice } from 'Controls-DataEnv/slice';
import {
    ControllerClass as FilterController,
    IFilterControllerOptions,
    IFilterItem,
} from 'Controls/filter';
import {
    ControllerClass as SearchController,
    ISearchControllerOptions,
} from 'Controls/search';
import {
    resolveSearchViewMode
} from './utils';
import {
    NewSourceController as SourceController,
    ISourceControllerOptions,
} from 'Controls/dataSource';
import {
    INavigationSourceConfig,
    IBaseSourceConfig,
    Direction,
    TSortingOptionValue,
} from 'Controls/interface';
import { ControllerClass as OperationsController } from 'Controls/operations';
import {
    TViewMode,
    TKey,
    TFilter,
    ISelection,
} from 'Controls-DataEnv/interface';
import { IListState, IErrorConfig } from './_interface/IListState';
import { IListLoadResult } from './_interface/IListLoadResult';
import { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';
import { loadSync, loadAsync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { Rpc } from 'Types/source';
import { SyntheticEvent } from 'UICommon/Events';
import { Logger } from 'UI/Utils';
import { IReloadItemOptions, IReloadItemResult } from 'Controls/listCommands';
import { PromiseCanceledError } from 'Types/entity';

interface ICountConfig {
    rpc: Rpc;
    command: string;
    data: object;
}

export type TLoadResult = RecordSet | Error;

function resolveModuleWithCallback<T>(
    moduleName: string,
    callback: (module: T) => void
): void {
    if (isLoaded(moduleName)) {
        callback(loadSync(moduleName));
    } else {
        loadAsync(moduleName).then((module: T) => {
            callback(module);
        });
    }
}

/**
 * Класс реализующий слайс списка.
 * Является дженериком. Принимает параметр T - тип состояния слайса. Должен наследоваться от IListState.
 * @class Controls/_dataFactory/List/Slice
 * @implements Controls/_dataFactory/List/_interface/IListState
 * @extends Controls-DataEnv/slice:Slice
 * @public
 */
export default class ListSlice<
    T extends IListState = IListState
> extends Slice<T> {
    readonly '[IListSlice]': boolean = true;
    private _sourceController: SourceController;
    private _searchController: SearchController;
    private _filterController: FilterController;
    private _operationsController: OperationsController;
    private _subscribeOnFilter: boolean;
    private _rootBeforeSearch: TKey;
    private _previousMultiSelectVisibility: IListState['multiSelectVisibility'];
    private _previousViewMode: TViewMode;

    private _loadCount(
        selection: ISelection,
        countConfig: ICountConfig
    ): Promise<number | void> {
        return loadAsync<typeof import('Controls/operations')>(
            'Controls/operations'
        ).then(({ getCount }) => {
            return getCount
                .getCount(selection, countConfig)
                .then((newCount) => {
                    return newCount;
                });
        });
    }

    private _rootChanged(e: SyntheticEvent, root: TKey): void {
        if (root !== this.state.root) {
            this.state.root = root;
        }
    }

    private _filterChanged(e: SyntheticEvent, filter: TFilter): void {
        if (!isEqual(filter, this.state.filter)) {
            this.state.filter = filter;
        }
    }

    protected _getViewByViewMode(viewMode: TViewMode): string {
        if (viewMode === 'list') {
            return 'Controls/list';
        }
        if (viewMode === 'tile') {
            if (this.state.nodeProperty) {
                return 'Controls/treeTile';
            }
            return 'Controls/tile';
        }
        if (viewMode === 'table') {
            return 'Controls/treeGrid';
        }
        if (viewMode === 'search') {
            return 'Controls/searchBreadcrumbsGrid';
        }
        if (viewMode === 'searchTile') {
            return 'Controls/searchBreadcrumbsTile';
        }
        if (viewMode === 'composite') {
            return 'Controls/expandedCompositeTree';
        }
    }

    private _isViewModeLoaded(viewMode: TViewMode): boolean {
        return isLoaded(this._getViewByViewMode(viewMode));
    }

    private _loadViewMode(viewMode: TViewMode, callback: Function): void {
        const view = this._getViewByViewMode(viewMode);
        if (!view || isLoaded(view)) {
            callback();
        } else {
            loadAsync(view).finally(() => {
                return callback();
            });
        }
    }

    private _operationsPanelExpandedChanged(
        e: SyntheticEvent,
        expanded: boolean
    ): void {
        if (this.state.operationsPanelVisible !== expanded) {
            if (expanded) {
                this.openOperationsPanel();
            } else {
                this.closeOperationsPanel();
            }
        }
    }

    private _sortingChanged(
        e: SyntheticEvent,
        sorting: TSortingOptionValue
    ): void {
        this.state.sorting = sorting;
    }

    private _filterDescriptionChanged(
        e: SyntheticEvent,
        filterDescription: IFilterItem[]
    ): void {
        if (!isEqual(filterDescription, this.state.filterDescription)) {
            this._applyState({ filterDescription });
        }
    }

    private _subscribeOnControllersChanges(): void {
        if (this._sourceController) {
            this._sourceController.subscribe(
                'rootChanged',
                this._rootChanged,
                this
            );
            if (this._subscribeOnFilter) {
                this._sourceController.subscribe(
                    'filterChanged',
                    this._filterChanged,
                    this
                );
                this._sourceController.subscribe(
                    'sortingChanged',
                    this._sortingChanged,
                    this
                );
            }
        }
        if (this._operationsController) {
            this._operationsController.subscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
                this
            );
        }

        if (this._filterController) {
            this._filterController.subscribe(
                'filterSourceChanged',
                this._filterDescriptionChanged,
                this
            );
        }
    }

    private _unsubscribeFromControllersChanged(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe(
                'rootChanged',
                this._rootChanged,
                this
            );
            this._sourceController.unsubscribe(
                'filterChanged',
                this._filterChanged,
                this
            );
            this._sourceController.unsubscribe(
                'sortingChanged',
                this._sortingChanged,
                this
            );
        }
        if (this._operationsController) {
            this._operationsController.unsubscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
                this
            );
        }

        if (this._filterController) {
            this._filterController.unsubscribe(
                'filterSourceChanged',
                this._filterDescriptionChanged,
                this
            );
        }
    }

    private _getFilterDescription(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): IFilterItem[] {
        return (
            loadResult.filterDescription ||
            loadResult.filterButtonSource ||
            config.filterButtonSource ||
            config.filterDescription
        );
    }

    private _initExpandedItems(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): TKey[] {
        return loadResult.expandedItems || config.expandedItems;
    }

    private _initSorting(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): any {
        return loadResult.sorting || config.sorting;
    }

    /**
     * Метод инициализации состояния
     * @function Controls/_dataFactory/List/Slice#_initState
     * @protected
     * @param {IListLoadResult} loadResult
     * @param {IListDataFactoryArguments} config
     * @protected
     * @return {IListState}
     */
    protected _initState(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): IListState {
        this._subscribeOnFilter = config.task1186833531;
        let listActions;
        let searchController;
        let searchMisspellValue = '';
        let filterController;
        const filterDescription = this._getFilterDescription(
            loadResult,
            config
        );
        this._sourceController = config.sourceController;
        this._operationsController = config.operationsController;
        this._searchController = config.searchController;
        this._filterController = config.filterController;
        const sourceController = this._getSourceController({
            items: loadResult.items,
            expandedItems: this._initExpandedItems(loadResult, config),
            source: config.source,
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
        });
        if (config.searchParam) {
            searchController = this._getSearchController({
                searchParam: config.searchParam,
                searchValue: config.searchValue,
                sourceController,
                startingWith: config.searchStartingWith,
                parentProperty: sourceController.getParentProperty(),
                nodeProperty: config.nodeProperty,
                root: sourceController.getRoot(),
                viewMode: config.viewMode,
                navigation: sourceController.getNavigation(),
                addItemsAfterSearch: false,
                adaptiveSearchMode: config.adaptiveSearchMode,
            });

            if (config.searchValue) {
                searchMisspellValue = this._getSearchMisspellValue();
            }
        }
        if (filterDescription) {
            filterController = this._getFilterController({
                filterDescription,
                filterButtonSource: filterDescription,
                historyId: config.historyId,
                prefetchParams: config.prefetchParams,
            });
        }
        const operationsController = this._getOperationsController({
            root: sourceController.getRoot(),
            selectedKeys: config.selectedKeys || [],
            excludedKeys: config.excludedKeys || [],
        });

        if (config.listActions) {
            listActions = Array.isArray(config.listActions)
                ? config.listActions
                : loadSync(config.listActions);
        }

        // Костыль для newBrowser'a
        // Удалить код добавленный по этому коммиту,
        // после перехода на работу через чистые слайсы (без Controls/browser'a)
        if (config.previousViewMode && config.fallbackImage) {
            this._previousViewMode = config.previousViewMode;
        }
        this._subscribeOnControllersChanges();
        let state = {
            filterDescription: filterController?.getFilterButtonItems(),
            filterDetailPanelVisible: false,
            operationsPanelVisible: false,
            activeElement: config.activeElement,
            displayProperty: config.displayProperty,
            command: null,
            countLoading: false,
            items: sourceController.getItems(),
            data: sourceController.getItems(),
            sorting: sourceController.getSorting(),
            selectFields: config.selectFields,
            keyProperty: sourceController.getKeyProperty(),
            expandedItems: sourceController.getExpandedItems(),
            nodeProperty: config.nodeProperty,
            parentProperty: sourceController.getParentProperty(),
            loading: false,
            breadCrumbsItems: sourceController.getState().breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceController.getState().breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceController.getState().backButtonCaption,
            searchController,
            sourceController,
            filterController,
            operationsController,
            listActions,
            filter: sourceController.getFilter(),
            historyId: filterController?.getHistoryId() || config.historyId,
            source: sourceController.getSource(),
            root: sourceController.getRoot(),
            navigation: sourceController.getNavigation(),
            searchParam: config.searchParam,
            searchValue: config.searchValue || '',
            searchInputValue:
                config.searchInputValue || config.searchValue || '',
            searchMisspellValue,
            minSearchLength:
                config.minSearchLength === undefined
                    ? 3
                    : config.minSearchLength,
            searchDelay: config.searchDelay,
            selectedKeys: config.selectedKeys || [],
            excludedKeys: config.excludedKeys || [],
            viewMode: config.viewMode || loadResult.viewMode,
            previousViewMode: config.previousViewMode,
            fallbackImage: config.fallbackImage,
            markerVisibility: config.markerVisibility || 'onactivated',
            multiSelectVisibility: config.multiSelectVisibility || 'hidden',
            selectionViewMode: config.selectionViewMode,
            groupHistoryId: config.groupHistoryId,
            markedKey: config.markedKey,
            isAllSelected: false,
            count: undefined,
            selectedCountConfig: config.selectedCountConfig,
            editorsViewMode: config.editorsViewMode,
            columns: config.columns,
            errorConfig: null,
            // FIXME Костыль для совместимости, будет удалён по проекту https://online.sbis.ru/opendoc.html?guid=3ccfe8ae-17d7-4796-acf4-682b3b690637&client=3
            // Флаг нужен, чтобы слайс не разрушал sourceController, если слайс был порождён внутри Browser'a
            // В этом случае сам Browser разрушает sourceController
            sliceOwnedByBrowser: config.sliceOwnedByBrowser,
            adaptiveSearchMode: config.adaptiveSearchMode,
            propStorageId:
                config.propStorageId ||
                this._sourceController.getState().propStorageId,
        };

        if (loadResult.error) {
            state = this._getStateAfterLoadError(
                { error: loadResult.error, loadKey: state.root },
                state
            );
        }

        return state;
    }

    private _getCountConfig(
        selectedCountConfig: ICountConfig,
        filter: TFilter
    ): ICountConfig {
        const data = selectedCountConfig.data || {};
        const selectedFilter = data.filter
            ? { ...filter, ...data.filter }
            : filter;
        return {
            ...selectedCountConfig,
            data: {
                filter: {
                    selectedFilter,
                },
            },
        };
    }

    private _getSourceControllerOptions(state: T): ISourceControllerOptions {
        return {
            filter: state.filter,
            source: state.source,
            keyProperty: state.keyProperty,
            sorting: state.sorting,
            root: state.root,
            navigation: state.navigation,
            displayProperty: state.displayProperty,
            parentProperty: state.parentProperty,
            nodeProperty: state.nodeProperty,
            groupHistoryId: state.groupHistoryId,
            selectFields: state.selectFields,
            selectedKeys: state.selectedKeys,
            excludedKeys: state.excludedKeys,
            propStorageId: state.propStorageId,
        };
    }

    protected _beforeApplyState(nextState: T): T | Promise<T> {
        this._unsubscribeFromControllersChanged();
        const nextStateResult = this.__beforeApplyStateInternal(nextState);
        this._subscribeOnControllersChanges();
        return nextStateResult;
    }

    private __beforeApplyStateInternal(nextState: T): T | Promise<T> {
        const operationsPanelVisibleChanged =
            this.state.operationsPanelVisible !==
            nextState.operationsPanelVisible;
        const selectedKeysChanged = !isEqual(
            this.state.selectedKeys,
            nextState.selectedKeys
        );
        const excludedKeysChanged = !isEqual(
            this.state.excludedKeys,
            nextState.excludedKeys
        );
        const expandedItemsChanged = !isEqual(
            this.state.expandedItems,
            nextState.expandedItems
        );
        const searchValueChanged = !isEqual(
            this.state.searchValue,
            nextState.searchValue
        );
        const rootChanged = this.state.root !== nextState.root;
        const filterDescriptionChanged = !isEqual(
            this.state.filterDescription,
            nextState.filterDescription
        );
        nextState.searchController?.setRoot(nextState.root);
        if (rootChanged) {
            if (nextState.searchValue) {
                nextState.filter = this._searchController.reset(true);
                nextState.searchValue = '';
                nextState.searchInputValue = '';
                nextState.searchMisspellValue = '';
                this._rootBeforeSearch = undefined;
            }
        }
        // FIXME: sourceController не должен стрелять событиями при простом апдейте
        this._unsubscribeFromControllersChanged();
        const needReload = nextState.sourceController.updateOptions(
            this._getSourceControllerOptions(nextState)
        );
        this._subscribeOnControllersChanges();
        const countChanged = this.state.count !== nextState.count;
        const filterDetailPanelVisibleChanged =
            this.state.filterDetailPanelVisible !==
            nextState.filterDetailPanelVisible;

        if (operationsPanelVisibleChanged) {
            if (nextState.operationsPanelVisible) {
                this._previousMultiSelectVisibility =
                    this.state.multiSelectVisibility;
                nextState.multiSelectVisibility = 'visible';
                nextState.markerVisibility = 'visible';
            } else {
                nextState.multiSelectVisibility =
                    this._previousMultiSelectVisibility || 'hidden';
                nextState.selectedKeys = [];
                nextState.excludedKeys = [];
                nextState.markerVisibility = undefined;
                this._previousMultiSelectVisibility = null;
            }
        }
        if (selectedKeysChanged) {
            if (
                nextState.selectedKeys.length &&
                !this.state.operationsPanelVisible
            ) {
                nextState.operationsPanelVisible = true;
                this.openOperationsPanel();
            }
            nextState.operationsController.setSelectedKeys(
                nextState.selectedKeys
            );
        }

        if (excludedKeysChanged) {
            nextState.operationsController.setExcludedKeys(
                nextState.excludedKeys
            );
        }

        if (countChanged) {
            if (typeof nextState.count === 'number') {
                const operationsController = nextState.operationsController;
                if (
                    operationsController.getCounterConfig()?.count !==
                    nextState.count
                ) {
                    operationsController.updateSelectedKeysCount(
                        nextState.count,
                        nextState.isAllSelected,
                        nextState.listId
                    );
                }
            } else if (
                nextState.count === null &&
                nextState.selectedCountConfig
            ) {
                const selection = {
                    selected: nextState.selectedKeys,
                    excluded: nextState.excludedKeys,
                };
                const countConfig = this._getCountConfig(
                    nextState.selectedCountConfig,
                    nextState.filter
                );
                nextState.countLoading = true;
                this._loadCount(selection, countConfig).then((newCount) => {
                    this.setState({
                        count: newCount,
                        countLoading: false,
                    });
                });
            } else {
                nextState.operationsController.updateSelectedKeysCount(
                    nextState.count as unknown as number,
                    nextState.isAllSelected,
                    nextState.listId
                );
            }
        }

        if (filterDetailPanelVisibleChanged) {
            if (nextState.filterDetailPanelVisible) {
                nextState.filterController.openFilterDetailPanel();
            } else {
                nextState.filterController.closeFilterDetailPanel();
            }
        }

        const searchViewMode = resolveSearchViewMode(
            this.state.adaptiveSearchMode,
            nextState.viewMode
        );
        if (nextState.viewMode !== searchViewMode) {
            this._previousViewMode = nextState.viewMode;
        }

        if (expandedItemsChanged) {
            nextState.sourceController.setExpandedItems(
                nextState.expandedItems
            );
        } else if (needReload && !nextState.sourceController.isExpandAll()) {
            nextState.expandedItems = [];
        }

        if (searchValueChanged) {
            if (nextState.searchValue) {
                return this._search(nextState.searchValue)
                    .then(() => {
                        const stateAfterSearch = {
                            ...nextState,
                            ...this._getLoadResult(nextState),
                            searchValue: nextState.searchValue,
                            searchMisspellValue: this._getSearchMisspellValue(),
                        };
                        stateAfterSearch.sourceController.updateOptions(
                            this._getSourceControllerOptions(stateAfterSearch)
                        );
                        return stateAfterSearch;
                    })
                    .catch((error: Error) => {
                        return this._getStateAfterLoadError(
                            { error, loadKey: this.state.root },
                            nextState
                        );
                    });
            } else {
                return this._resetSearch()
                    .then((newItems) => {
                        this._rootBeforeSearch = undefined;
                        this._sourceController.setItemsAfterLoad(
                            newItems as RecordSet
                        );
                        const newState = {
                            ...nextState,
                            ...this._getLoadResult(nextState),
                            searchValue: '',
                            searchMisspellValue: '',
                        };
                        this._applyState(newState);
                        return newState;
                    })
                    .catch((error) => {
                        return this._getStateAfterLoadError(
                            { error, loadKey: this.state.root },
                            nextState
                        );
                    });
            }
        }

        if (needReload) {
            if (filterDescriptionChanged) {
                this._applyState({
                    filterDescription: nextState.filterDescription,
                });
            }
            if (rootChanged) {
                nextState.searchController?.setRoot(nextState.root);
            }
            return this._reload()
                .then((items) => {
                    this.state.sourceController.setItemsAfterLoad(items);
                    return {
                        ...nextState,
                        ...this._getLoadResult(nextState),
                        searchValue:
                            this._searchController?.getSearchValue() || '',
                    };
                })
                .catch((error) => {
                    return this._getStateAfterLoadError(
                        { error, loadKey: nextState.root },
                        nextState
                    );
                });
        }
        return nextState;
    }

    /**
     * Перезагрузить список
     * @function Controls/_dataFactory/List/Slice#reload
     * @param {INavigationSourceConfig} sourceConfig Параметры навигации.
     * @public
     * @return {Promise<RecordSet>}
     */
    reload(sourceConfig?: INavigationSourceConfig): Promise<RecordSet> {
        this._applyState({
            loading: true,
        });
        return this.state.sourceController
            .reload(sourceConfig)
            .then((items: RecordSet) => {
                this.setState({
                    items: this.state.sourceController.getItems(),
                    loading: false,
                });
                return items;
            });
    }

    /**
     * Перезагрузить элемент списка
     * @function Controls/_dataFactory/List/Slice#reloadItem
     * @param {TKey} itemKey Ключ записи для перезагрузки
     * @param {Controls/_listCommands/ReloadItem/IReloadItemOptions} options Параметры перезагрузки
     * @public
     * @return {Promise<IReloadItemResult>}
     */
    reloadItem(itemKey: TKey, options: IReloadItemOptions): IReloadItemResult {
        return new Promise((resolve) => {
            resolveModuleWithCallback<typeof import('Controls/listCommands')>(
                'Controls/listCommands',
                ({ ReloadItem }) => {
                    const reloadItemCommand = new ReloadItem();
                    resolve(
                        reloadItemCommand.execute({
                            ...options,
                            itemKey,
                            sourceController: this._sourceController,
                        })
                    );
                }
            );
        });
    }

    load(
        direction: Direction,
        key: TKey,
        filter?: TFilter,
        addItemsAfterLoad?: boolean,
        navigationSourceConfig?: IBaseSourceConfig
    ): Promise<TLoadResult> {
        this.setState({
            loading: true,
        });
        if (filter) {
            this.state.sourceController.setFilter(filter);
        }
        return this.state.sourceController
            .load(
                direction,
                key,
                filter,
                addItemsAfterLoad,
                navigationSourceConfig
            )
            .then((result: TLoadResult) => {
                this.setState({
                    loading: false,
                    filter: filter || this.state.filter,
                });
                return result;
            })
            .catch((error) => {
                if (!error || !error.isCanceled) {
                    this.setState({
                        loading: false,
                        filter,
                    });
                    this.state.sourceController.setFilter(filter);
                }
                return Promise.reject(error);
            });
    }

    setExpandedItems(expandedItems: TKey[]): void {
        this.setState({ expandedItems });
    }

    setRoot(root: TKey): void {
        this.setState({ root });
    }

    executeCommand(commandName: string): void {
        this.setState({
            command: commandName,
        });
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

    hasLoaded(key: TKey): boolean {
        return this.state.sourceController.hasLoaded(key);
    }

    hasMoreData(direction: Direction, key: TKey): boolean {
        return this.state.sourceController.hasMoreData(direction, key);
    }

    setItems(items: RecordSet): void {
        const sourceController = this.state.sourceController;
        sourceController.setItemsAfterLoad(items);
        this.setState({
            items: sourceController.getItems(),
            breadCrumbsItems: sourceController.getState().breadCrumbsItems,
            backButtonCaption: sourceController.getState().backButtonCaption,
        });
    }

    /**
     * Открыть панель массовых операций
     * @function Controls/_dataFactory/List/Slice#openOperationsPanel
     * @public
     * @return {void}
     */
    openOperationsPanel(): void {
        this.setState({
            operationsPanelVisible: true,
        });
        this.state.operationsController.openOperationsPanel();
    }

    /**
     * Закрыть панель массовых операций
     * @function Controls/_dataFactory/List/Slice#closeOperationsPanel
     * @public
     * @return {void}
     */
    closeOperationsPanel(): void {
        this.setState({
            operationsPanelVisible: false,
        });
        this.state.operationsController.closeOperationsPanel();
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

    setSelectionCount(
        count: number,
        isAllSelected: boolean,
        listId?: string
    ): void {
        if (
            count !== this.state.count ||
            isAllSelected !== this.state.isAllSelected
        ) {
            this.setState({
                count,
                isAllSelected,
                countLoading: this.state.countLoading,
                listId,
            });
        }
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
     * @public
     * @return {void}
     */
    applyFilterDescription(filterDescription: IFilterItem[]): void {
        const filterController = this.state.filterController;
        // this.state.sourceController - пока считаем, что в sourceController'e самый актуальный фильтр
        // это чинит кейс, когда на виджете фильтре установлен storeId, но список обёрнут в Browser.
        // В таком случае Browser может обновить фильтр в sourceController'e,
        // а слайс об этом ничего не узнает и стейте будет неактульный фильтр
        // откатить в 23.1000 тут
        // https://online.sbis.ru/opendoc.html?guid=5f4048af-5b22-4191-8aa3-097adc792a01&client=3
        filterController.setFilter(this.state.sourceController.getFilter());
        const newFilterDescription =
            filterController.applyFilterDescription(filterDescription);
        const newFilter = filterController.getFilter();
        this.setState({
            filterDescription: newFilterDescription,
            filter: newFilter,
        });
    }

    /**
     * Сбросить фильтры.
     * @function Controls/_dataFactory/List/Slice#resetFilterDescription
     * @public
     * @return {void}
     */
    resetFilterDescription(): void {
        this.state.filterController.setFilter(this.state.filter);
        const newFilterDescription =
            this.state.filterController.resetFilterDescription();
        const newFilter = this.state.filterController.getFilter();
        this.setState({
            filterDescription: newFilterDescription,
            filter: newFilter,
        });
    }

    /**
     * Сбросить поиск.
     * @function Controls/_dataFactory/List/Slice#resetSearch
     * @public
     * @return {void}
     */
    resetSearch(): void {
        this.setState({
            searchValue: '',
            searchInputValue: '',
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
                'ListSlice::Не указан searchParam в слайсе списка. Поис не будет запущен'
            );
        } else {
            this.setState({
                searchValue,
                searchInputValue: searchValue,
            });
        }
    }

    setSearchInputValue(value: string): void {
        this.setState({
            searchInputValue: value,
        });
    }

    private _search(value: string): Promise<unknown> {
        const promises = [];
        const searchViewMode = resolveSearchViewMode(
            this.state.adaptiveSearchMode,
            this.state.viewMode
        );
        this._rootBeforeSearch = this.state.sourceController.getRoot();
        if (this.state.viewMode !== searchViewMode) {
            this._previousViewMode = this.state.viewMode;
        }
        if (!this._isViewModeLoaded(searchViewMode)) {
            promises.push(loadAsync(this._getViewByViewMode(searchViewMode)));
        }
        promises.push(this.state.searchController.search(value));
        return Promise.all(promises).then(() => {
            this._searchController.setRoot(this._sourceController.getRoot());
        });
    }

    private _resetSearch(): Promise<TLoadResult> {
        const filter = this._searchController.reset(true);
        if (this._rootBeforeSearch !== undefined && this.state.parentProperty) {
            this._sourceController.setRoot(this._rootBeforeSearch);
            this._searchController.setRoot(this._rootBeforeSearch);
        }
        this._sourceController.setFilter(filter);
        const sourceControllerOptions = this._getSourceControllerOptions(
            this.state
        );
        this._sourceController.updateOptions({
            ...sourceControllerOptions,
            root: this._sourceController.getRoot(),
            filter,
        });
        return this._reload();
    }

    private _getSearchMisspellValue(): string {
        return loadSync<typeof import('Controls/search')>(
            'Controls/search'
        ).getSwitcherStrFromData(this._sourceController.getItems());
    }

    private _reload(): Promise<TLoadResult> {
        return this.state.sourceController.reload(undefined, undefined, false);
    }

    private _getLoadResult(nextState: IListState): Partial<IListState> {
        const sourceController = nextState.sourceController;
        const sourceControllerState = sourceController.getState();
        const searchViewMode = resolveSearchViewMode(
            this.state.adaptiveSearchMode,
            this._previousViewMode
        );
        const rootWithoutSearch =
            this._rootBeforeSearch === undefined && nextState.searchController
                ? nextState.searchController.getRoot()
                : this._rootBeforeSearch;
        return {
            loading: false,
            items: sourceControllerState.items,
            breadCrumbsItems: sourceControllerState.breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceControllerState.breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceControllerState.backButtonCaption,
            filter: sourceControllerState.filter,
            root:
                nextState.searchValue || rootWithoutSearch === undefined
                    ? sourceControllerState.root
                    : rootWithoutSearch,
            sorting: sourceControllerState.sorting,
            viewMode: nextState.searchValue
                ? searchViewMode
                : this._previousViewMode,
            previousViewMode: this._previousViewMode,
            errorConfig: null,
        };
    }

    private _getStateAfterLoadError<T extends IListState>(
        errorConfig: IErrorConfig,
        state: T
    ): T {
        const isCancelablePromiseError =
            errorConfig.error instanceof PromiseCanceledError;
        if (errorConfig.error && !isCancelablePromiseError) {
            return {
                ...state,
                errorConfig,
                loading: false,
            };
        } else {
            return state;
        }
    }

    private _getSearchController(
        props: Partial<ISearchControllerOptions>
    ): SearchController {
        if (!this._searchController) {
            if (!isLoaded('Controls/search')) {
                Logger.error(`Controls/dataFactory:List в конфигурации загрузчика указана опция searchParam,
                              но на странице нет строки поиска, проверьте настройки шаблона страницы.`);
            }
            const searchLib =
                loadSync<typeof import('Controls/search')>('Controls/search');
            this._searchController = new searchLib.ControllerClass(
                props as ISearchControllerOptions
            );
        }
        return this._searchController;
    }

    private _getSourceController(
        props: ISourceControllerOptions
    ): SourceController {
        if (!this._sourceController) {
            const dataSource = loadSync<typeof import('Controls/dataSource')>(
                'Controls/dataSource'
            );
            this._sourceController = new dataSource.NewSourceController(props);
        }
        return this._sourceController;
    }

    private _getFilterController(
        props: IFilterControllerOptions
    ): FilterController {
        if (!this._filterController) {
            if (!isLoaded('Controls/filter')) {
                Logger.error(`Controls/dataFactory:List в конфигурации загрузчика указана опция filterDescription,
                              но на странице нет контролов фильтрации, проверьте настройки шаблона страницы.`);
            }
            const filterLib =
                loadSync<typeof import('Controls/filter')>('Controls/filter');
            this._filterController = new filterLib.ControllerClass(props);
        }
        return this._filterController;
    }

    private _getOperationsController(props: object): OperationsController {
        if (!this._operationsController) {
            const operationsLib = loadSync<
                typeof import('Controls/operations')
            >('Controls/operations');
            this._operationsController = new operationsLib.ControllerClass(
                props
            );
        }
        return this._operationsController;
    }

    destroy(): void {
        this._unsubscribeFromControllersChanged();

        if (!this.state.sliceOwnedByBrowser) {
            if (this._sourceController) {
                this._sourceController.destroy();
                this._sourceController = null;
            }

            if (this._operationsController) {
                this._operationsController.destroy();
                this._operationsController = null;
            }
        }
    }
}
