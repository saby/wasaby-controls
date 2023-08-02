/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { Slice } from 'Controls-DataEnv/slice';
import {
    ControllerClass as FilterController,
    IFilterControllerOptions,
    IFilterItem,
} from 'Controls/filter';
import { resolveSearchViewMode } from './utils';
import {
    NewSourceController as SourceController,
    ISourceControllerOptions,
    saveControllerState,
} from 'Controls/dataSource';
import {
    INavigationSourceConfig,
    IBaseSourceConfig,
    Direction,
    TSortingOptionValue,
    INavigationOptionValue,
    TSelectionCountMode,
} from 'Controls/interface';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { TViewMode, TKey, TFilter, ISelection } from 'Controls-DataEnv/interface';
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
import { PromiseCanceledError, Model } from 'Types/entity';

interface ICountConfig {
    rpc: Rpc;
    command: string;
    data: object;
}

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
}

const MIN_SEARCH_LENGTH = 3;

const SERVICE_FILTERS = {
    HIERARCHY: {
        Разворот: 'С разворотом',
        usePages: 'full',
    },
};

const SEARCH_STARTED_ROOT_FIELD = 'searchStartedFromRoot';

const SWITCHED_STR_FIELD = 'switchedStr';

function getSwitcherStrFromData(data) {
    const metaData = data?.getMetaData?.();
    const switchedStr = metaData?.[SWITCHED_STR_FIELD] ?? '';
    const switchedStrResults = metaData?.results?.get?.(SWITCHED_STR_FIELD) || '';
    return switchedStr || switchedStrResults;
}

function resolveModuleWithCallback<T>(moduleName: string, callback: (module: T) => void): void {
    if (isLoaded(moduleName)) {
        callback(loadSync(moduleName));
    } else {
        loadAsync(moduleName).then((module: T) => {
            callback(module);
        });
    }
}

function hasHierarchyFilter(filter: TFilter): boolean {
    return !!Object.entries(SERVICE_FILTERS.HIERARCHY)[0].find((key: string) => {
        return filter.hasOwnProperty(key) && filter[key] === SERVICE_FILTERS.HIERARCHY[key];
    })?.length;
}

function prepareFilterWithExpandedItems(
    filter: TFilter,
    expandedItems: TKey[],
    parentProperty: string,
    root: TKey
): TFilter {
    const resultFilter = { ...filter };
    // Набираем все раскрытые узлы
    if (expandedItems?.length && expandedItems?.[0] !== null) {
        resultFilter[parentProperty] = Array.isArray(resultFilter[parentProperty])
            ? resultFilter[parentProperty]
            : [];
        // Добавляет root в фильтр expanded узлов
        if (resultFilter[parentProperty].indexOf(root) === -1) {
            resultFilter[parentProperty].push(root);
        }
        // Добавляет отсутствующие expandedItems в фильтр expanded узлов
        resultFilter[parentProperty] = resultFilter[parentProperty].concat(
            expandedItems.filter((key) => {
                return resultFilter[parentProperty].indexOf(key) === -1;
            })
        );
    } else if (root !== undefined) {
        resultFilter[parentProperty] = root;
    }

    return resultFilter;
}

function getRootForSearch(
    path: Model[],
    curRoot: TKey,
    parentProperty: string,
    searchStartingWith: string = 'root'
): TKey {
    let root;

    if (searchStartingWith === 'root' && path?.length > 0) {
        root = path[0].get(parentProperty);
    } else {
        root = curRoot;
    }

    return root;
}

function getFilterForSearch(
    state: IListState,
    searchValue: string,
    rootBeforeSearch: TKey
): TFilter {
    let root;
    const { parentProperty, searchParam, searchStartingWith, filter } = state;
    let searchFilter = { ...filter } as TFilter;
    searchFilter[searchParam] = searchValue;

    if (parentProperty) {
        if (state.root !== undefined) {
            root = getRootForSearch(
                state.breadCrumbsItems,
                state.root,
                parentProperty,
                searchStartingWith
            );

            if (root !== undefined) {
                if (state.deepReload) {
                    searchFilter = prepareFilterWithExpandedItems(
                        searchFilter,
                        state.sourceController.getExpandedItems(),
                        parentProperty,
                        root
                    );
                } else {
                    searchFilter[parentProperty] = root;
                }
            } else {
                delete searchFilter[parentProperty];
            }
        }
        if (
            searchStartingWith === 'root' &&
            rootBeforeSearch !== undefined &&
            rootBeforeSearch !== root
        ) {
            searchFilter[SEARCH_STARTED_ROOT_FIELD] = rootBeforeSearch;
        }
        Object.assign(searchFilter, SERVICE_FILTERS.HIERARCHY);
    }

    return searchFilter;
}

function getResetSearchFilter(
    filter: TFilter,
    searchParam: string,
    parentProperty: string,
    removeHierarchyFilters: boolean,
    removeRoot: boolean
): TFilter {
    const resetedFilter = { ...filter };
    delete resetedFilter[searchParam];

    if (parentProperty) {
        delete resetedFilter[SEARCH_STARTED_ROOT_FIELD];
        if (removeHierarchyFilters) {
            for (const i in SERVICE_FILTERS.HIERARCHY) {
                if (SERVICE_FILTERS.HIERARCHY.hasOwnProperty(i)) {
                    delete resetedFilter[i];
                }
            }
        }

        if (removeRoot) {
            delete resetedFilter[parentProperty];
        }
    }

    return resetedFilter;
}

function getItemsFromDataSlice(config: IListDataFactoryArguments) {
    const { formDataSlice, name } = config;
    const [_, ...fields] = name;
    return formDataSlice.get(fields.join('.'));
}

/**
 * Класс реализующий слайс списка.
 * Является дженериком. Принимает параметр T - тип состояния слайса. Должен наследоваться от IListState.
 * @class Controls/_dataFactory/List/Slice
 * @implements Controls/dataFactory:IListState
 * @extends Controls-DataEnv/slice:Slice
 * @public
 */
export default class ListSlice<T extends IListState = IListState> extends Slice<T> {
    readonly '[IListSlice]': boolean = true;
    private _sourceController: SourceController;
    private _filterController: FilterController;
    private _operationsController: OperationsController;
    private _subscribeOnFilter: boolean;
    private _rootBeforeSearch: TKey;
    private _newItems: RecordSet;
    private _previousMultiSelectVisibility: IListState['multiSelectVisibility'];
    private _previousViewMode: TViewMode;
    private _hasHierarchyFilterBeforeSearch: boolean;
    private _hasRootInFilterBeforeSearch: boolean;
    private _beforeApplyReject: Function;

    private _loadCount(
        selection: ISelection,
        countConfig: ICountConfig,
        selectionCountMode: TSelectionCountMode,
        recursive: boolean
    ): Promise<number | void> {
        return loadAsync<typeof import('Controls/operations')>('Controls/operations').then(
            ({ getCount }) => {
                return getCount
                    .getCount(selection, countConfig, selectionCountMode, recursive)
                    .then((newCount) => {
                        return newCount;
                    });
            }
        );
    }

    private _rootChanged(e: SyntheticEvent, root: TKey): void {
        if (root !== this.state.root) {
            this.state.root = root;
        }
    }

    unobserveChanges(): void {
        this._unsubscribeFromControllersChanged();
    }

    observeChanges(): void {
        this._subscribeOnControllersChanges();
    }

    private _filterChanged(e: SyntheticEvent, filter: TFilter): void {
        if (!isEqual(filter, this.state.filter)) {
            this.state.filter = filter;
        }
    }

    protected _getViewModeDependencies(viewMode: TViewMode): string[] {
        const meta = this.state.items.getMetaData();
        const viewTemplate = meta?.results?.get('ConfigurationTemplate');
        const resultDeps = [];
        if (viewTemplate)
            if (viewMode === 'list') {
                resultDeps.push('Controls/list');
            }
        if (viewMode === 'tile') {
            if (this.state.nodeProperty) {
                resultDeps.push('Controls/treeTile');
            }
            resultDeps.push('Controls/tile');
        }
        if (viewMode === 'table') {
            resultDeps.push('Controls/treeGrid');
        }
        if (viewMode === 'search') {
            resultDeps.push('Controls/searchBreadcrumbsGrid');
        }
        if (viewMode === 'searchTile') {
            resultDeps.push('Controls/searchBreadcrumbsTile');
        }
        if (viewMode === 'composite') {
            resultDeps.push('Controls/expandedCompositeTree');
        }
        if (viewTemplate) {
            const viewModeTemplate = viewTemplate[viewMode];
            if (viewModeTemplate && viewMode === 'tile' && viewModeTemplate?.navigation?.scheme) {
                const navigationScheme = viewModeTemplate.navigation.scheme;
                // TODO убрать подгрузку чипсов https://online.sbis.ru/opendoc.html?guid=e4c4a491-e777-453a-b526-1c993542715e&client=3
                if (navigationScheme === 'showcaseNavigation') {
                    resultDeps.push('Controls-widgets/navigation');
                    resultDeps.push('Controls/Chips:Control');
                    resultDeps.push('Controls/RadioGroup:Control');
                } else if (navigationScheme === 'showcaseColumns') {
                    resultDeps.push('Controls/columns:ItemsView');
                } else if (navigationScheme === 'showcaseTile') {
                    resultDeps.push('Controls/treeTile:ItemsView');
                }
                if (navigationScheme !== 'tile') {
                    resultDeps.push('Controls/expandedCompositeTree');
                    resultDeps.push('Controls-widgets/navigation');
                }
            }
        }

        return resultDeps;
    }

    protected _searchStarted(filter: TFilter): void {}

    private _getUnloadedDependencies(deps: string[]): string[] {
        return deps.filter((dep) => {
            return !isLoaded(dep);
        });
    }

    private _isLoadedDependencies(deps: string[]): boolean {
        return deps.every((dep) => {
            return isLoaded(dep);
        });
    }

    private _isViewModeLoaded(viewMode: TViewMode): boolean {
        return this._isLoadedDependencies(this._getViewModeDependencies(viewMode));
    }

    private _loadDeps(deps: string[]): Promise<unknown> {
        const unloadedDeps = this._getUnloadedDependencies(deps);
        const promises = unloadedDeps.map((unloadDep) => {
            return loadAsync(unloadDep);
        });
        if (promises.length) {
            return Promise.all(promises);
        } else {
            return Promise.resolve();
        }
    }

    private _loadViewMode(viewMode: TViewMode): Promise<unknown> {
        return this._loadDeps(this._getViewModeDependencies(viewMode));
    }

    private _operationsPanelExpandedChanged(e: SyntheticEvent, expanded: boolean): void {
        if (this.state.operationsPanelVisible !== expanded) {
            if (expanded) {
                this.openOperationsPanel();
            } else {
                this.closeOperationsPanel();
            }
        }
    }

    private _sortingChanged(e: SyntheticEvent, sorting: TSortingOptionValue): void {
        this.state.sorting = sorting;
    }

    private _navigationChanged(
        e: SyntheticEvent,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        this.state.navigation = navigation;
    }

    private _filterDescriptionChanged(e: SyntheticEvent, filterDescription: IFilterItem[]): void {
        if (!isEqual(filterDescription, this.state.filterDescription)) {
            this._applyState({ filterDescription });
        }
    }

    private _subscribeOnControllersChanges(): void {
        if (this._sourceController) {
            this._sourceController.subscribe('rootChanged', this._rootChanged, this);
            if (this._subscribeOnFilter) {
                this._sourceController.subscribe('filterChanged', this._filterChanged, this);
                this._sourceController.subscribe('sortingChanged', this._sortingChanged, this);
                this._sourceController.subscribe(
                    'navigationChanged',
                    this._navigationChanged,
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
            this._sourceController.unsubscribe('rootChanged', this._rootChanged, this);
            this._sourceController.unsubscribe('filterChanged', this._filterChanged, this);
            this._sourceController.unsubscribe('sortingChanged', this._sortingChanged, this);
            this._sourceController.unsubscribe('navigationChanged', this._navigationChanged, this);
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

    private _initSorting(loadResult: IListLoadResult, config: IListDataFactoryArguments): any {
        return loadResult.sorting || config.sorting;
    }

    private _initOperationsController(
        root: TKey,
        config: IListDataFactoryArguments
    ): OperationsController {
        return this._getOperationsController({
            root,
            selectedKeys: config.selectedKeys || [],
            excludedKeys: config.excludedKeys || [],
        });
    }

    private _initSearch(config: IListDataFactoryArguments): ISearchInitResult {
        let searchMisspellValue = '';
        if (config.searchValue) {
            searchMisspellValue = this._getSearchMisspellValue();
        }
        return {
            searchParam: config.searchParam,
            searchValue: config.searchValue || '',
            searchInputValue: config.searchInputValue || config.searchValue || '',
            searchMisspellValue,
            minSearchLength:
                config.minSearchLength === undefined ? MIN_SEARCH_LENGTH : config.minSearchLength,
            searchDelay: config.searchDelay,
            searchStartingWith: config.searchStartingWith,
            searchValueTrim: config.searchValueTrim,
        };
    }

    private _initSourceController(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): SourceController {
        const isDataSliceUsed = config.formDataSlice && config.name && Array.isArray(config.name);

        return this._getSourceController({
            items: isDataSliceUsed ? getItemsFromDataSlice(config) : loadResult.items,
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
            nodeHistoryType: config.nodeHistoryType,
            nodeHistoryId: config.nodeHistoryId,
        });
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
    protected _initState(loadResult: IListLoadResult, config: IListDataFactoryArguments): T {
        this._subscribeOnFilter = config.task1186833531;
        let listActions;
        let filterController;
        let searchState = {};
        const filterDescription = this._getFilterDescription(loadResult, config);
        this._sourceController = config.sourceController;
        this._operationsController = config.operationsController;
        this._filterController = config.filterController;
        const sourceController = this._initSourceController(loadResult, config);

        if (config.searchParam) {
            searchState = this._initSearch(config);
        }
        if (filterDescription) {
            filterController = this._getFilterController({
                filterDescription,
                filterButtonSource: filterDescription,
                historyId: config.historyId,
                prefetchParams: config.prefetchParams,
            });
        }
        const operationsController = this._initOperationsController(
            sourceController.getRoot(),
            config
        );

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

        const items = sourceController.getItems();
        const navigationItems = items?.getMetaData()?.navigation;
        let activeElement;
        if (config.activeElement !== undefined) {
            activeElement = config.activeElement;
        } else if (navigationItems && navigationItems['[Types/_collection/RecordSet]']) {
            activeElement = navigationItems.at(0)?.getKey();
        } else {
            activeElement = items?.at(0)?.getKey();
        }

        let state = {
            filterDescription: filterController?.getFilterButtonItems(),
            filterDetailPanelVisible: false,
            operationsPanelVisible: false,
            activeElement,
            displayProperty: config.displayProperty,
            command: null,
            countLoading: false,
            items,
            data: items,
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
            sourceController,
            filterController,
            operationsController,
            listActions,
            filter: sourceController.getFilter(),
            historyId: filterController?.getHistoryId() || config.historyId,
            source: sourceController.getSource(),
            root: sourceController.getRoot(),
            navigation: sourceController.getNavigation(),
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
            propStorageId: config.propStorageId || this._sourceController.getState().propStorageId,
            hasChildrenProperty: config.hasChildrenProperty,
            expanderVisibility: config.expanderVisibility || 'visible',
            selectionCountMode: config.selectionCountMode,
            recursiveSelection: config.recursiveSelection,
            ...searchState,
            nodeHistoryId: config.nodeHistoryId,
            nodeHistoryType: config.nodeHistoryType,
        };

        if (loadResult.error) {
            state = this._getStateAfterLoadError(
                { error: loadResult.error, loadKey: state.root },
                state
            );
        }

        return state;
    }

    private _getCountConfig(selectedCountConfig: ICountConfig, filter: TFilter): ICountConfig {
        const data = selectedCountConfig.data || {};
        const selectedFilter = data.filter ? { ...filter, ...data.filter } : filter;
        return {
            ...selectedCountConfig,
            data: {
                filter: {
                    ...selectedFilter,
                },
            },
        };
    }

    private _getSourceControllerOptions(state: Partial<T>): ISourceControllerOptions {
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
            nodeHistoryId: state.nodeHistoryId,
            nodeHistoryType: state.nodeHistoryType,
        };
    }

    protected _beforeApplyState(nextState: T): T | Promise<T> {
        this.unobserveChanges();
        const nextStateResult = this.__beforeApplyStateInternal(nextState);
        if (nextStateResult instanceof Promise) {
            return new Promise<T>((resolve, reject) => {
                this._beforeApplyReject = reject;
                return nextStateResult.then((result) => resolve(result));
            }).finally(() => {
                this.observeChanges();
                this._beforeApplyReject = null;
            });
        } else {
            this.observeChanges();
            return nextStateResult;
        }
    }

    private __beforeApplyStateInternal(nextState: T): T | Promise<T> {
        const selectedKeysChanged = !isEqual(this.state.selectedKeys, nextState.selectedKeys);
        if (selectedKeysChanged) {
            if (nextState.selectedKeys.length && !this.state.operationsPanelVisible) {
                nextState.operationsPanelVisible = true;
                this.openOperationsPanel();
            }
            nextState.operationsController.setSelectedKeys(nextState.selectedKeys);
        }
        const operationsPanelVisibleChanged =
            this.state.operationsPanelVisible !== nextState.operationsPanelVisible;
        const excludedKeysChanged = !isEqual(this.state.excludedKeys, nextState.excludedKeys);
        const expandedItemsChanged = !isEqual(this.state.expandedItems, nextState.expandedItems);
        const searchValueChanged = !isEqual(this.state.searchValue, nextState.searchValue);
        const filterChanged = !isEqual(this.state.filter, nextState.filter);
        const viewModeChanged = nextState.viewMode !== this.state.viewMode;
        const loadingPromises = [];
        const rootChanged = this.state.root !== nextState.root;
        const filterDescriptionChanged = !isEqual(
            this.state.filterDescription,
            nextState.filterDescription
        );
        // Если во время поиска поменяли фильтр, то надо сбросить корень перед поиском, т.к мы можем в него не вернуться
        if (filterDescriptionChanged || filterChanged || rootChanged) {
            this._rootBeforeSearch = null;
        }
        if (rootChanged) {
            if (nextState.searchValue) {
                nextState.filter = getResetSearchFilter(
                    nextState.filter,
                    nextState.searchParam,
                    nextState.parentProperty,
                    !this._hasHierarchyFilterBeforeSearch,
                    !this._hasRootInFilterBeforeSearch
                );
                nextState.searchValue = '';
                nextState.searchInputValue = '';
                nextState.searchMisspellValue = '';
            }
        }
        if (
            (selectedKeysChanged ||
                excludedKeysChanged ||
                searchValueChanged ||
                expandedItemsChanged ||
                this.state.markedKey !== nextState.markedKey) &&
            this.state.listConfigStoreId
        ) {
            saveControllerState(this.state.listConfigStoreId, {
                selectedKeys: nextState.selectedKeys,
                excludedKeys: nextState.excludedKeys,
                searchValue: nextState.searchValue,
                expandedItems: nextState.expandedItems,
                markedKey: nextState.markedKey,
            });
        }
        const needReload = nextState.sourceController.updateOptions(
            this._getSourceControllerOptions(nextState)
        );
        if (rootChanged && !needReload && this._newItems) {
            this.state.sourceController.setItemsAfterLoad(this._newItems);
            nextState = { ...nextState, ...this._getBreadCrumbsState() };
            this._newItems = null;
        }
        const countChanged = this.state.count !== nextState.count;
        const filterDetailPanelVisibleChanged =
            this.state.filterDetailPanelVisible !== nextState.filterDetailPanelVisible;

        if (operationsPanelVisibleChanged) {
            if (nextState.operationsPanelVisible) {
                this._previousMultiSelectVisibility = this.state.multiSelectVisibility;
                nextState.multiSelectVisibility = 'visible';
                nextState.markerVisibility = 'visible';
            } else {
                nextState.multiSelectVisibility = this._previousMultiSelectVisibility || 'hidden';
                nextState.selectedKeys = [];
                nextState.excludedKeys = [];
                nextState.markerVisibility = undefined;
                this._previousMultiSelectVisibility = null;
            }
        }

        if (excludedKeysChanged) {
            nextState.operationsController.setExcludedKeys(nextState.excludedKeys);
        }

        if (countChanged) {
            if (typeof nextState.count === 'number') {
                const operationsController = nextState.operationsController;
                if (operationsController.getCounterConfig()?.count !== nextState.count) {
                    operationsController.updateSelectedKeysCount(
                        nextState.count,
                        nextState.isAllSelected,
                        nextState.listId
                    );
                }
            } else if (nextState.count === null && nextState.selectedCountConfig) {
                const selection = {
                    selected: nextState.selectedKeys,
                    excluded: nextState.excludedKeys,
                };
                const countConfig = this._getCountConfig(
                    nextState.selectedCountConfig,
                    nextState.filter
                );
                nextState.countLoading = true;
                this._loadCount(
                    selection,
                    countConfig,
                    nextState.selectionCountMode,
                    nextState.recursiveSelection
                ).then((newCount) => {
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
            nextState.sourceController.setExpandedItems(nextState.expandedItems);
            if (nextState.nodeHistoryId) {
                nextState.sourceController.updateExpandedItemsInUserStorage();
            }
        } else if (needReload && !nextState.sourceController.isExpandAll()) {
            nextState.expandedItems = [];
        }

        if (searchValueChanged) {
            if (nextState.searchValue) {
                const loadPromise = this._search(nextState.searchValue)
                    .then(({ items, root }) => {
                        const stateAfterSearch = {
                            ...nextState,
                            root,
                            searchValue: nextState.searchValue,
                            searchMisspellValue: this._getSearchMisspellValue(items),
                        };
                        return this.__dataLoadedInner(items, undefined, stateAfterSearch).then(
                            (resultState) => {
                                this._sourceController.updateOptions(
                                    this._getSourceControllerOptions(resultState)
                                );
                                this._sourceController.setItemsAfterLoad(items as RecordSet);
                                return { ...resultState, ...this._getBreadCrumbsState() };
                            }
                        );
                    })
                    .catch((error: Error) => {
                        return this._getStateAfterLoadError(
                            { error, loadKey: this.state.root },
                            nextState
                        );
                    });
                loadingPromises.push(loadPromise);
            } else {
                const loadingPromise = this._resetSearch()
                    .then((newItems) => {
                        const root = this._rootBeforeSearch;
                        this._rootBeforeSearch = undefined;
                        return this.__dataLoadedInner(newItems as RecordSet, undefined, {
                            ...nextState,
                            root,
                            searchValue: '',
                            searchMisspellValue: '',
                        }).then((newState) => {
                            this._sourceController.setItemsAfterLoad(newItems as RecordSet);
                            this._applyState(newState);
                            return { ...newState, ...this._getBreadCrumbsState() };
                        });
                    })
                    .catch((error) => {
                        return this._getStateAfterLoadError(
                            { error, loadKey: this.state.root },
                            nextState
                        );
                    });
                loadingPromises.push(loadingPromise);
            }
        }

        if (viewModeChanged && !this._isViewModeLoaded(nextState.viewMode)) {
            loadingPromises.push(
                this._loadViewMode(nextState.viewMode).then(() => {
                    return {
                        ...this.state,
                        viewMode: nextState.viewMode,
                    };
                })
            );
        }

        if (needReload && !searchValueChanged) {
            if (filterDescriptionChanged) {
                this._applyState({
                    filterDescription: nextState.filterDescription,
                });
            }
            const loadingPromise = this._reload()
                .then((items) => {
                    const newState = { ...nextState };
                    return this.__dataLoadedInner(items, undefined, newState).then(
                        (resultState) => {
                            this.state.sourceController.setItemsAfterLoad(items as RecordSet);
                            return { ...resultState, ...this._getBreadCrumbsState() };
                        }
                    );
                })
                .catch((error) => {
                    return this._getStateAfterLoadError(
                        { error, loadKey: nextState.root },
                        nextState
                    );
                });
            loadingPromises.push(loadingPromise);
        }

        if (loadingPromises.length) {
            // @ts-ignore
            return Promise.all(loadingPromises).then((results: Partial<T>[]) => {
                let state = {};
                results.forEach((loadStateResult) => {
                    state = {
                        ...state,
                        ...loadStateResult,
                    };
                });
                return state;
            });
        } else {
            return nextState;
        }
    }

    private _getBreadCrumbsState() {
        const sourceControllerState = this.state.sourceController.getState();
        return {
            items: sourceControllerState.items,
            breadCrumbsItems: sourceControllerState.breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceControllerState.breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceControllerState.backButtonCaption,
        };
    }

    private __dataLoadedInner(
        items: TLoadResult,
        direction: Direction,
        nextState: T
    ): Promise<Partial<T>> {
        const dataLoadResult = this._dataLoaded(items as RecordSet, direction, nextState);

        const returnState = (state): Partial<T> => {
            return {
                ...state,
                ...this._getLoadResult(state),
            };
        };

        if (dataLoadResult === undefined) {
            throw new Error(
                'Controls/dataFactory:ListSlice метод _dataLoaded не вернул новое состояние'
            );
        }

        if (dataLoadResult instanceof Promise) {
            return dataLoadResult.then(returnState);
        } else {
            return Promise.resolve(returnState(dataLoadResult));
        }
    }

    /**
     * Метод, вызываемый после загрузки данных.
     * Должен вернуть новое состояние
     * @function Controls/_dataFactory/List/Slice#_beforeApplyState
     * @param {Types/collection:RecordSet} items загруженные записи.
     * @param {'down'|'up'|void} direction направление загрузки.
     * @param {Controls/dataFactory:IListState} nextState следующее состояние слайса.
     * @protected
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
     */
    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
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
        return this.state.sourceController.reload(sourceConfig).then((items: RecordSet) => {
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
        key?: TKey,
        filter?: TFilter,
        addItemsAfterLoad?: boolean,
        navigationSourceConfig?: IBaseSourceConfig
    ): Promise<TLoadResult> {
        return this.state.sourceController
            .load(direction, key, filter, addItemsAfterLoad, navigationSourceConfig)
            .then((result: TLoadResult) => {
                if (addItemsAfterLoad === false) {
                    return result;
                }
                return this.__dataLoadedInner(result as RecordSet, direction, {
                    ...this.state,
                    loading: false,
                    root: key !== undefined ? key : this.state.root,
                    filter: filter || this.state.filter,
                }).then((newState) => {
                    if (filter) {
                        this.state.sourceController.setFilter(filter);
                    }
                    this.setState(newState);
                    return result;
                });
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

    setItems(items: RecordSet, root?: TKey): void {
        if (root !== undefined) {
            this._newItems = items;
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

    setSelectionCount(count: number, isAllSelected: boolean, listId?: string): void {
        if (count !== this.state.count || isAllSelected !== this.state.isAllSelected) {
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
        const oldFilterDescription = this.state.filterController.getFilterButtonItems();
        // this.state.sourceController - пока считаем, что в sourceController'e самый актуальный фильтр
        // это чинит кейс, когда на виджете фильтре установлен storeId, но список обёрнут в Browser.
        // В таком случае Browser может обновить фильтр в sourceController'e,
        // а слайс об этом ничего не узнает и стейте будет неактульный фильтр
        // откатить в 23.1000 тут
        // https://online.sbis.ru/opendoc.html?guid=5f4048af-5b22-4191-8aa3-097adc792a01&client=3
        filterController.setFilter(this.state.sourceController.getFilter());
        const newFilterDescription = filterController.applyFilterDescription(filterDescription);
        const newFilter = filterController.getFilter();

        if (this._beforeApplyReject && !isEqual(oldFilterDescription, newFilterDescription)) {
            this.state.sourceController.cancelLoading();
            this._beforeApplyReject(new PromiseCanceledError());
        }

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
        const newFilterDescription = this.state.filterController.resetFilterDescription();
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
        } else if (this.state.searchValue === searchValue) {
            this.reload();
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
        let searchValue = value;
        if (this.state.searchValueTrim) {
            searchValue = value && value.trim();
        }
        this._hasHierarchyFilterBeforeSearch = hasHierarchyFilter(this.state.filter);
        this._hasRootInFilterBeforeSearch = this.state.filter.hasOwnProperty(
            this.state.parentProperty
        );
        const promises = [];
        const { sourceController, viewMode, parentProperty } = this.state;
        const searchViewMode = resolveSearchViewMode(this.state.adaptiveSearchMode, viewMode);
        if (viewMode !== searchViewMode) {
            this._rootBeforeSearch = sourceController.getRoot();
            this._previousViewMode = viewMode;
        }
        const rootForSearch = getRootForSearch(
            this.state.breadCrumbsItems,
            this.state.root,
            parentProperty,
            this.state.searchStartingWith
        );
        const filterForSearch = getFilterForSearch(this.state, searchValue, this._rootBeforeSearch);
        promises.push(this.load(undefined, rootForSearch, filterForSearch, false));

        if (!this._isViewModeLoaded(searchViewMode)) {
            promises.push(this._loadViewMode(searchViewMode));
        }
        return Promise.all(promises).then(([items]) => {
            return { items, root: rootForSearch };
        });
    }

    private _resetSearch(): Promise<TLoadResult> {
        const filter = getResetSearchFilter(
            this.state.filter,
            this.state.searchParam,
            this.state.parentProperty,
            !this._hasHierarchyFilterBeforeSearch,
            this._hasRootInFilterBeforeSearch
        );
        if (this._rootBeforeSearch !== undefined && this.state.parentProperty) {
            this._sourceController.setRoot(this._rootBeforeSearch);
        }
        this._sourceController.setFilter(filter);
        const sourceControllerOptions = this._getSourceControllerOptions(this.state);
        this._sourceController.updateOptions({
            ...sourceControllerOptions,
            root: this._sourceController.getRoot(),
            filter,
        });
        return this._reload();
    }

    private _getSearchMisspellValue(items: RecordSet = this._sourceController.getItems()): string {
        return getSwitcherStrFromData(items);
    }

    private _reload(): Promise<TLoadResult> {
        return this.state.sourceController.reload(undefined, undefined, false);
    }

    private _getLoadResult(nextState: IListState): Partial<IListState> {
        const sourceController = nextState.sourceController;
        const searchViewMode = resolveSearchViewMode(
            this.state.adaptiveSearchMode,
            this._previousViewMode
        );
        const searchValue = nextState.searchValue;
        const searchValueChanged = searchValue !== this.state.searchValue;
        const hasSearch = !!nextState.searchParam && nextState.searchValue;
        nextState.sourceController.setRoot(nextState.root);
        if (hasSearch) {
            if (nextState.searchValue) {
                nextState.sourceController.setFilter(nextState.filter);
            }
            if (!nextState.deepReload && !nextState.sourceController.isExpandAll()) {
                nextState.sourceController.setExpandedItems([]);
            }
        }
        const sourceControllerState = sourceController.getState();
        let newRoot = sourceControllerState.root;
        const breadcrumbsState = this._getBreadCrumbsState();
        if (
            nextState.searchStartingWith === 'root' &&
            searchValueChanged &&
            !nextState.searchValue &&
            nextState.parentProperty
        ) {
            newRoot = getRootForSearch(
                breadcrumbsState.breadCrumbsItems,
                nextState.root,
                nextState.parentProperty,
                nextState.searchStartingWith
            );
        }
        let newFilter;
        if (searchValue) {
            newFilter = getFilterForSearch(
                nextState,
                nextState.searchValue,
                this._rootBeforeSearch
            );
        } else {
            newFilter = getResetSearchFilter(
                nextState.filter,
                nextState.searchParam,
                nextState.parentProperty,
                !this._hasHierarchyFilterBeforeSearch,
                !this._hasRootInFilterBeforeSearch
            );
        }
        sourceController.setFilter(newFilter);
        return {
            loading: false,
            items: sourceControllerState.items,
            ...breadcrumbsState,
            filter: sourceController.getFilter(),
            root: newRoot,
            sorting: sourceControllerState.sorting,
            viewMode: hasSearch ? searchViewMode : this._previousViewMode,
            previousViewMode: this._previousViewMode,
            errorConfig: null,
        };
    }

    private _getStateAfterLoadError<T extends IListState>(errorConfig: IErrorConfig, state: T): T {
        const isCancelablePromiseError = errorConfig.error instanceof PromiseCanceledError;
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

    private _getSourceController(props: ISourceControllerOptions): SourceController {
        if (!this._sourceController) {
            const dataSource =
                loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
            this._sourceController = new dataSource.NewSourceController(props);
        }
        return this._sourceController;
    }

    private _getFilterController(props: IFilterControllerOptions): FilterController {
        if (!this._filterController) {
            if (!isLoaded('Controls/filter')) {
                Logger.error(`Controls/dataFactory:List в конфигурации загрузчика указана опция filterDescription,
                              но на странице нет контролов фильтрации, проверьте настройки шаблона страницы.`);
            }
            const filterLib = loadSync<typeof import('Controls/filter')>('Controls/filter');
            this._filterController = new filterLib.ControllerClass(props);
        }
        return this._filterController;
    }

    private _getOperationsController(props: object): OperationsController {
        if (!this._operationsController) {
            const operationsLib =
                loadSync<typeof import('Controls/operations')>('Controls/operations');
            this._operationsController = new operationsLib.ControllerClass(props);
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
        super.destroy();
    }
}
