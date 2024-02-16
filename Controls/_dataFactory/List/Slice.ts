/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import type { IItemsState, TItemsChange, TMetaDataChange } from 'Controls/itemsListAspect';
import type { IFilterItem } from 'Controls/filter';
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
import type { ISelection, TFilter, TKey, TViewMode } from 'Controls-DataEnv/interface';
import type {
    Direction,
    IBaseSourceConfig,
    INavigationOptionValue,
    INavigationSourceConfig,
    ISelectionObject,
    TSearchNavigationMode,
    TSelectionCountMode,
    TSelectionViewMode,
    TSortingOptionValue,
} from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { Collection } from 'Controls/display';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { CrudEntityKey, Rpc } from 'Types/source';
import type { IErrorConfig, IListState } from './_interface/IListState';
import type { IListLoadResult } from './_interface/IListLoadResult';
import type { IListDataFactoryArguments } from './_interface/IListDataFactoryArguments';
import type { IListAspects } from '../AbstractList/_interface/IAspectTypes';

// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import {
    calculateAddItemsChanges,
    calculateBreadcrumbsData,
    getControllerState,
    INavigationChanges,
    ISourceControllerOptions,
    NewSourceController as SourceController,
    Path,
    saveControllerState,
} from 'Controls/dataSource';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UICommon/Events';
import { Logger } from 'UI/Utils';
import { IReloadItemOptions, IReloadItemResult, IReloadItemsResult } from 'Controls/listCommands';
import { Model, PromiseCanceledError } from 'Types/entity';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import resolveCollectionType from '../AbstractList/collections/resolveCollectionType';
import { AspectsNames } from '../AbstractList/_interface/AspectsNames';
import { AbstractListSlice } from '../AbstractList/AbstractListSlice';
import { resolveSearchViewMode } from './utils';

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
    searchNavigationMode?: TSearchNavigationMode;
}

interface IStateBeforeShowSelected extends ISelectionObject {
    breadCrumbsItems: Path;
}

function hasItemInArray(items: Model[], key: TKey): boolean {
    return !!items.find((item) => {
        return item.getKey() === key;
    });
}

function getNextItemFromArray(items: Model[], key: TKey): Model {
    const currentIndexByKey = items.findIndex((item) => {
        return item.getKey() === key;
    });
    return currentIndexByKey !== -1 ? items[currentIndexByKey + 1] : undefined;
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

function getFilterModule(): typeof import('Controls/filter') {
    return loadSync<typeof import('Controls/filter')>('Controls/filter');
}

function getSearchResolver(): typeof import('Controls/search').FilterResolver {
    return loadSync<typeof import('Controls/search')>('Controls/search').FilterResolver;
}

function getOperationsModule(): typeof import('Controls/operations') {
    return loadSync<typeof import('Controls/operations')>('Controls/operations');
}

/**
 * Класс реализующий слайс списка.
 * Является дженериком. Принимает параметр T - тип состояния слайса. Должен наследоваться от IListState.
 * @remark
 * Полезные ссылки:
 * * Подробнее про слайс для работы со списочными компонентами читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ статье}
 * @class Controls/_dataFactory/List/Slice
 * @extends Controls-DataEnv/slice:AbstractSlice
 * @see Controls-ListEnv
 * @public
 */
export default class ListSlice<T extends IListState = IListState> extends AbstractListSlice<T> {
    readonly '[IListSlice]': boolean = true;
    private _sourceController: SourceController;
    private _operationsController: OperationsController;
    private _subscribeOnFilter: boolean;
    private _rootBeforeSearch: TKey | void;
    private _stateBeforeShowSelected: IStateBeforeShowSelected;
    private _newItems: RecordSet;
    private _previousMultiSelectVisibility: IListState['multiSelectVisibility'];
    private _previousViewMode: string;
    private _hasHierarchyFilterBeforeSearch: boolean;
    private _hasRootInFilterBeforeSearch: boolean;
    private _loadConfig = null;

    protected _aspectStateManagers: IListAspects;
    protected _cachedItemsChanges: IItemsState['itemsChanges'] = [];

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
        const meta = this.state.items?.getMetaData();
        const viewTemplate = meta?.results?.get('ConfigurationTemplate');
        const resultDeps = [];
        if (viewTemplate) {
            if (viewMode === 'list') {
                resultDeps.push('Controls/list');
            }
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
            resultDeps.push('Controls-widgets/navigation');
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
        if (this._aspectStateManagers.has(AspectsNames.Items)) {
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

    protected _subscribeOnControllersChanges(): void {
        if (this._sourceController) {
            if (this._subscribeOnFilter) {
                this._sourceController.subscribe('rootChanged', this._rootChanged, this);
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
    }

    private _unsubscribeFromSourceController(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe('rootChanged', this._rootChanged, this);
            this._sourceController.unsubscribe('filterChanged', this._filterChanged, this);
            this._sourceController.unsubscribe('sortingChanged', this._sortingChanged, this);
            this._sourceController.unsubscribe('navigationChanged', this._navigationChanged, this);
        }
    }

    protected _unsubscribeFromControllersChanged(): void {
        this._unsubscribeFromSourceController();
        if (this._operationsController) {
            this._operationsController.unsubscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
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
        return loadResult.expandedItems || config.expandedItems || [];
    }

    private _initSorting(
        loadResult: IListLoadResult,
        config: IListDataFactoryArguments
    ): IListDataFactoryArguments['sorting'] {
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
            nodeTypeProperty: config.nodeTypeProperty,
            nodeHistoryId: config.nodeHistoryId,
            deepReload: config.deepReload,
            deepScrollLoad: config.deepScrollLoad,
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
        let listActions;
        let searchState = {};
        let filterDescription = this._getFilterDescription(loadResult, config);
        this._sourceController = config.sourceController;
        this._operationsController = config.operationsController;
        const sourceController = this._initSourceController(loadResult, config);

        if (filterDescription) {
            filterDescription =
                getFilterModule().FilterLoader.initFilterDescriptionFromData(filterDescription);
        }

        if (config.searchParam) {
            searchState = this._initSearch(config);
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
        this._subscribeOnControllersChanges();

        const items = sourceController.getItems();
        const activeElement = config.activeElement ?? this._getActiveElementByItems(items);

        const selectedKeys = config.selectedKeys || [];
        const excludedKeys = config.excludedKeys || [];

        this._updateSubscriptionOnItems(null, items);

        let state: T = {
            filterDescription,
            filterDetailPanelVisible: false,
            operationsPanelVisible: !!config.operationsPanelVisible,
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
            operationsController,
            listActions,
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
            columns: config.columns,
            errorConfig: null,
            // FIXME Костыль для совместимости, будет удалён по проекту https://online.sbis.ru/opendoc.html?guid=3ccfe8ae-17d7-4796-acf4-682b3b690637&client=3
            // Флаг нужен, чтобы слайс не разрушал sourceController, если слайс был порождён внутри Browser'a
            // В этом случае сам Browser разрушает sourceController
            sliceOwnedByBrowser: config.sliceOwnedByBrowser,
            adaptiveSearchMode: config.adaptiveSearchMode,
            propStorageId: config.propStorageId || this._sourceController.getState().propStorageId,
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
        };

        if (loadResult.error) {
            state = this._getStateAfterLoadError(
                {
                    error: loadResult.error,
                    loadKey: state.root,
                },
                state
            );
        }
        this._previousViewMode = state.viewMode;

        this._initCollection(initConfig.collectionType, state);
        // TODO: Сделать init стейта слайса через аспекты.
        this._initAspects(initConfig.collectionType, state);

        state.collection = this.collection;

        return state;
    }

    // возвращает первый элемент из navigationItems или из items
    private _getActiveElementByItems(items: RecordSet): TKey {
        let activeElement;
        const navigationItems = items?.getMetaData()?.navigation;
        if (navigationItems && navigationItems['[Types/_collection/RecordSet]']) {
            activeElement = navigationItems.at(0)?.getKey();
        } else {
            activeElement = items?.at(0)?.getKey();
        }
        return activeElement;
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
            nodeTypeProperty: state.nodeTypeProperty,
            expandedItems: state.expandedItems,
            deepReload: state.deepReload,
            deepScrollLoad: state.deepScrollLoad,
        };
    }

    protected _beforeApplyState(nextState: T): T | Promise<T> {
        this.unobserveChanges();

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
        const nextStateResult = this.__beforeApplyStateInternal(draftNextState);
        if (nextStateResult instanceof Promise) {
            return nextStateResult.finally(() => {
                this.observeChanges();
            });
        } else {
            this.observeChanges();
        }
        return nextStateResult;
    }

    protected _onSnapshot(nextState: T): T {
        // Третья фаза расчета nextState синхронная. Применение изменений к коллекции
        return this._resolveNextState(nextState);
    }

    private __beforeApplyStateInternal(nextState: T): T | Promise<T> {
        const multiSelectVisibilityChanged =
            nextState.multiSelectVisibility !== this.state.multiSelectVisibility;
        const operationsPanelVisibleChanged =
            this.state.operationsPanelVisible !== nextState.operationsPanelVisible;
        if (operationsPanelVisibleChanged) {
            if (nextState.operationsPanelVisible) {
                this._previousMultiSelectVisibility = this.state.multiSelectVisibility;
                nextState.multiSelectVisibility = 'visible';
                nextState.markerVisibility = 'visible';
            } else {
                Object.assign(nextState, this._getStateForSelectionViewModeReset());
                const multiSelectVisibilityOnClose =
                    this._previousMultiSelectVisibility || 'hidden';
                nextState.multiSelectVisibility = multiSelectVisibilityChanged
                    ? nextState.multiSelectVisibility
                    : multiSelectVisibilityOnClose;
                nextState.selectedKeys = [];
                nextState.excludedKeys = [];
                nextState.markerVisibility = undefined;
                this._previousMultiSelectVisibility = null;

                if (this.state.selectionViewMode === 'selected') {
                    nextState.command = 'all';
                }
            }
        }
        const needReloadBySelectionViewMode =
            (nextState.selectionViewMode === 'all' || nextState.selectionViewMode === 'hidden') &&
            this.state.selectionViewMode === 'selected';
        let viewModePromise;
        let excludedKeysChanged = !isEqual(this.state.excludedKeys, nextState.excludedKeys);
        let selectedKeysChanged = !isEqual(this.state.selectedKeys, nextState.selectedKeys);
        // Если заданы ListActions, значит точно используем OperationsPanel.
        // Иначе не меняем видимость OperationsPanel и, соответственно, видимость маркера и мультивыбора.
        const useOperationsPanel = this.state.listActions;
        if (useOperationsPanel && selectedKeysChanged) {
            if (nextState.selectedKeys.length && !this.state.operationsPanelVisible) {
                nextState.operationsPanelVisible = true;
                this._previousMultiSelectVisibility = this.state.multiSelectVisibility;
                nextState.multiSelectVisibility = 'visible';
                nextState.markerVisibility = 'visible';
                this.openOperationsPanel();
            }
            nextState.operationsController.setSelectedKeys(nextState.selectedKeys);
        }
        const viewModeChanged = nextState.viewMode !== this.state.viewMode;
        // Для правильной работы expandedCompositeTree.
        if (nextState.viewMode === 'composite') {
            nextState.expandedItems = [null];
        }
        const collapsedItemsChanged = !isEqual(this.state.collapsedItems, nextState.collapsedItems);
        let expandedItemsChanged = !isEqual(this.state.expandedItems, nextState.expandedItems);
        const searchValueChanged = !isEqual(this.state.searchValue, nextState.searchValue);
        let filterChanged = !isEqual(this.state.filter, nextState.filter);
        const sourceControllerChanged = nextState.sourceController !== this.state.sourceController;
        const loadingPromises = [];
        const rootChanged = this.state.root !== nextState.root;
        const filterDescriptionChanged = !isEqual(
            this.state.filterDescription,
            nextState.filterDescription
        );
        if (filterDescriptionChanged) {
            nextState.filter = getFilterModule().FilterCalculator.getFilterByFilterDescription(
                nextState.filter,
                nextState.filterDescription
            );
            filterChanged = true;
        }
        if (sourceControllerChanged) {
            this._unsubscribeFromSourceController();
            this._sourceController = nextState.sourceController;

            if (!nextState.sourceController) {
                nextState.sourceController = this._getSourceController(
                    this._getSourceControllerOptions(this.state)
                );
            } else {
                nextState.items = nextState.sourceController.getItems();
            }
        }

        // Если во время поиска поменяли фильтр, то надо сбросить корень перед поиском, т.к мы можем в него не вернуться
        if (filterDescriptionChanged || filterChanged || rootChanged) {
            this._rootBeforeSearch = null;
        }
        if (rootChanged) {
            RootHistoryUtils.store(nextState.rootHistoryId, nextState.root);

            if (nextState.searchValue) {
                Object.assign(nextState, this._getStateOnSearchReset(nextState));

                if (nextState.searchNavigationMode === 'expand') {
                    nextState.expandedItems = getSearchResolver().getExpandedItemsForRoot(
                        nextState.root,
                        this.state.root,
                        nextState.items,
                        nextState.parentProperty
                    );
                    nextState.root = this.state.root;
                    expandedItemsChanged = true;
                }
            }
        }
        if (this.state.items !== nextState.items) {
            this._updateSubscriptionOnItems(this.state.items, nextState.items);
        }
        const isAllSelectedInCurrentRoot =
            this.state.selectedKeys?.includes(this.state.root) &&
            this.state.excludedKeys?.includes(this.state.root);
        const shouldResetSelection =
            isAllSelectedInCurrentRoot &&
            nextState.searchValue !== this.state.searchValue &&
            nextState.searchValue === '' &&
            this.state.root !== this._rootBeforeSearch;

        if (shouldResetSelection) {
            nextState.selectedKeys = [];
            nextState.excludedKeys = [];
            selectedKeysChanged = true;
            excludedKeysChanged = true;
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

        const needReloadBySourceController = nextState.sourceController.updateOptions(
            this._getSourceControllerOptions(nextState)
        );

        if (
            (needReloadBySourceController || rootChanged || searchValueChanged || this._newItems) &&
            !needReloadBySelectionViewMode &&
            nextState.selectionViewMode === 'selected'
        ) {
            Object.assign(nextState, this._getStateForSelectionViewModeReset());
        }
        const needReload =
            needReloadBySourceController ||
            needReloadBySelectionViewMode ||
            (nextState.searchNavigationMode === 'expand' && rootChanged);

        if (this._newItems) {
            if (!needReload) {
                const newItems = this._newItems;
                const sourceConfig = this._loadConfig?.sourceConfig;
                const keepNavigation = this._loadConfig?.keepNavigation;
                this._newItems = null;
                this._loadConfig = null;
                return this.__dataLoadedInner(newItems, undefined, nextState, viewModePromise).then(
                    (newState) => {
                        nextState.sourceController.setItemsAfterLoad(
                            newItems,
                            sourceConfig,
                            keepNavigation
                        );
                        return {
                            ...nextState,
                            ...newState,
                            ...this._getStateAfterUpdateItems(newState),
                        };
                    }
                );
            } else {
                this._newItems = null;
            }
        }
        const countChanged = this.state.count !== nextState.count;

        if (
            nextState.selectionViewMode !== this.state.selectionViewMode &&
            nextState.selectionViewMode === 'selected'
        ) {
            this._stateBeforeShowSelected = this._getStateBeforeShowSelectedApply(nextState);
            Object.assign(nextState, this._getStateForOnlySelectedItems(nextState));
            nextState.sourceController.setFilter(nextState.filter);
            this._previousViewMode = null;
        }
        if (this.state.selectionViewMode === 'selected' && nextState.selectionViewMode === 'all') {
            this._stateBeforeShowSelected = null;
            nextState.isAllSelected = false;
            nextState.showSelectedCount = null;
            nextState.listCommandsSelection = this._getListCommandsSelection(nextState);
        }
        if (nextState.selectionViewMode === 'selected') {
            nextState.breadCrumbsItems = null;
            nextState.breadCrumbsItemsWithoutBackButton = null;
            nextState.backButtonCaption = '';
        }

        if (excludedKeysChanged) {
            nextState.operationsController.setExcludedKeys(nextState.excludedKeys);
        }

        if (
            excludedKeysChanged ||
            selectedKeysChanged ||
            this.state.markedKey !== nextState.markedKey
        ) {
            nextState.listCommandsSelection = this._getListCommandsSelection(nextState);
        }

        if (countChanged || filterChanged) {
            if (typeof nextState.count === 'number' && !filterChanged) {
                const operationsController = nextState.operationsController;
                if (operationsController.getCounterConfig()?.count !== nextState.count) {
                    operationsController.updateSelectedKeysCount(
                        nextState.count,
                        nextState.isAllSelected,
                        nextState.listId
                    );
                }
            } else if (
                nextState.selectedCountConfig &&
                (nextState.count === null || (filterChanged && nextState.selectedKeys.length))
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
                this._loadCount(
                    selection,
                    countConfig,
                    nextState.selectionCountMode,
                    nextState.recursiveSelection
                ).then((newCount) => {
                    if (!this.isDestroyed()) {
                        this.setState({
                            count: newCount,
                            countLoading: false,
                        });
                    }
                });
            } else if (countChanged) {
                nextState.operationsController.updateSelectedKeysCount(
                    nextState.count as unknown as number,
                    nextState.isAllSelected,
                    nextState.listId
                );
            }
        }

        const searchViewMode = resolveSearchViewMode(
            this.state.adaptiveSearchMode,
            nextState.viewMode
        );
        if (nextState.viewMode !== searchViewMode) {
            this._previousViewMode = nextState.viewMode;
        }

        // Поддержка смены viewMode в режиме поиска
        if (viewModeChanged && nextState.searchValue) {
            nextState.previousViewMode = nextState.viewMode;
            nextState.viewMode = searchViewMode;
        }

        if (expandedItemsChanged) {
            nextState.sourceController.setExpandedItems(nextState.expandedItems);
            if (nextState.nodeHistoryId) {
                nextState.sourceController.updateExpandedItemsInUserStorage();
            }
        } else if (
            needReload &&
            !(nextState.sourceController.isExpandAll() || nextState.deepReload)
        ) {
            nextState.expandedItems = [];
            nextState.sourceController.setExpandedItems([]);
        }

        if (searchValueChanged && nextState.searchParam) {
            if (nextState.searchValue) {
                this._applyState({ searchInputValue: nextState.searchInputValue });
                const loadPromise = this._search(nextState.searchValue, nextState)
                    .then(({ items, root, searchValue }) => {
                        const stateAfterSearch = {
                            ...nextState,
                            root,
                            searchValue,
                            searchInputValue: this.state.searchInputValue,
                        };
                        return this.__dataLoadedInner(
                            items,
                            undefined,
                            stateAfterSearch,
                            viewModePromise
                        ).then((resultState) => {
                            resultState.sourceController.updateOptions(
                                this._getSourceControllerOptions(resultState)
                            );
                            resultState.sourceController.setItemsAfterLoad(items as RecordSet);
                            return {
                                ...resultState,
                                ...this._getStateAfterUpdateItems(resultState),
                            };
                        });
                    })
                    .catch((error: Error) => {
                        return this._getStateAfterLoadError(
                            {
                                error,
                                loadKey: this.state.root,
                            },
                            nextState
                        );
                    });
                loadingPromises.push(loadPromise);
            } else {
                this._applyState({
                    loading: true,
                    searchMisspellValue: '',
                    searchInputValue: nextState.searchInputValue,
                });
                const loadingPromise = this._resetSearch(nextState)
                    .then((newItems) => {
                        let root;

                        if (this._rootBeforeSearch !== undefined) {
                            root = this._rootBeforeSearch;
                            this._rootBeforeSearch = undefined;
                        } else {
                            root = nextState.root;
                        }
                        return this.__dataLoadedInner(
                            newItems as RecordSet,
                            undefined,
                            {
                                ...nextState,
                                root,
                                searchValue: '',
                                searchMisspellValue: '',
                                searchInputValue: this.state.searchInputValue,
                            },
                            viewModePromise
                        ).then((newState) => {
                            newState.sourceController.setItemsAfterLoad(newItems as RecordSet);
                            return {
                                ...newState,
                                ...this._getStateAfterUpdateItems(newState),
                            };
                        });
                    })
                    .catch((error) => {
                        return this._getStateAfterLoadError(
                            {
                                error,
                                loadKey: this.state.root,
                            },
                            nextState
                        );
                    });
                loadingPromises.push(loadingPromise);
            }
        }

        if (viewModeChanged && !this._isViewModeLoaded(nextState.viewMode)) {
            viewModePromise = this._loadViewMode(nextState.viewMode);
            loadingPromises.push(viewModePromise);
        }

        if (needReload && (!searchValueChanged || !nextState.searchParam)) {
            const stateForApply: Partial<IListState> = {
                loading: true,
            };
            if (filterDescriptionChanged) {
                stateForApply.filterDescription = nextState.filterDescription;
            }
            if (this.state.searchInputValue !== nextState.searchInputValue) {
                stateForApply.searchInputValue = nextState.searchInputValue;
            }
            this._applyState(stateForApply);
            const loadingPromise = this._reload(nextState)
                .then((items) => {
                    const newState = { ...nextState };
                    return this.__dataLoadedInner(items, undefined, newState, viewModePromise).then(
                        (dataLoadedResult) => {
                            nextState.sourceController.setItemsAfterLoad(items as RecordSet);
                            const resultState = {
                                ...dataLoadedResult,
                                items: nextState.sourceController.getItems(),
                            };
                            return {
                                ...resultState,
                                ...this._getStateAfterUpdateItems(resultState),
                            };
                        }
                    );
                })
                .catch((error) => {
                    return this._getStateAfterLoadError(
                        {
                            error,
                            loadKey: nextState.root,
                        },
                        nextState
                    );
                });
            loadingPromises.push(loadingPromise);
        }

        if (
            this._collection &&
            !needReload &&
            !searchValueChanged &&
            (expandedItemsChanged || collapsedItemsChanged)
        ) {
            const expandedItemsDiff = ArrayUtil.getArrayDifference(
                this.state.expandedItems,
                nextState.expandedItems
            );

            if (expandedItemsDiff.added.length) {
                const nodeLoadersPromises = [];
                expandedItemsDiff.added.forEach((key: CrudEntityKey) => {
                    if (!this.hasLoaded(key)) {
                        nodeLoadersPromises.push(
                            // TODO: Тип direction - темная магия помноженная на издевательство,
                            //  в разных местах передается void 0, undefined, null и string.
                            //  При чем null делает одно, void 0 и undefined другое, а string третье.
                            //  Не зная не поймешь, такого быть не должно.
                            //
                            this._load(nextState, void 0, key)
                        );
                    }
                });

                if (nodeLoadersPromises.length) {
                    loadingPromises.push(
                        Promise.all(nodeLoadersPromises)
                            .then(() => {
                                return {
                                    ...nextState,
                                    hasMoreStorage: this._getHasMoreStorage(nextState),
                                };
                            })
                            .catch((error) => {
                                return this._getStateAfterLoadError(
                                    {
                                        error,
                                    },
                                    {
                                        ...nextState,
                                        expandedItems: this.state.expandedItems,
                                    }
                                );
                            })
                    );
                } else {
                    nextState.hasMoreStorage = this._getHasMoreStorage(nextState);
                }
            }
        }

        if (!loadingPromises.length) {
            nextState.selectionViewMode = this._getSelectionViewMode(nextState);
        }

        if (loadingPromises.length) {
            // @ts-ignore
            return Promise.all(loadingPromises).then((results: Partial<T>[]) => {
                let state = nextState;
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
        this._applyChangesToCollection(changes);
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
        this._sourceController.applyNavigationChanges(navigationChanges);
    }

    private _getStateForOnlySelectedItems(state: T): Partial<T> {
        const newState: Record<string, unknown> = {
            breadCrumbsItems: null,
            breadCrumbsItemsWithoutBackButton: null,
            backButtonCaption: '',
            filter: state.filter,
        };

        if (state.searchValue) {
            Object.assign(newState, this._getStateOnSearchReset(state));
            newState.viewMode = this._previousViewMode;
            state.sourceController.setFilter(newState.filter);
        }

        if (state.filterDescription) {
            const { FilterDescription, FilterCalculator } = getFilterModule();
            newState.filterDescription = FilterDescription.resetFilterDescription(
                state.filterDescription,
                true
            );
            newState.filter = FilterCalculator.getFilterByFilterDescription(
                newState.filter,
                newState.filterDescription
            );
            state.sourceController.setFilter(newState.filter);
        }

        if (state.count) {
            state.showSelectedCount = state.count;
        }
        state.listCommandsSelection = this._getListCommandsSelection(state);

        return newState as Partial<T>;
    }

    private _getStateBeforeShowSelectedApply({
        breadCrumbsItems,
        selectedKeys,
        excludedKeys,
    }: T): IStateBeforeShowSelected {
        return {
            breadCrumbsItems,
            selected: selectedKeys,
            excluded: excludedKeys,
        };
    }

    private _getListCommandsSelection(nextState: T): ISelection {
        if (isLoaded('Controls/operations')) {
            return getOperationsModule().getListCommandsSelection(
                nextState,
                nextState.markedKey,
                this._stateBeforeShowSelected
            );
        }
    }

    private _getStateOnSearchReset(state: T): Partial<T> {
        return {
            filter: getSearchResolver().getResetSearchFilter(
                state.filter,
                state.searchParam,
                state.parentProperty,
                !this._hasHierarchyFilterBeforeSearch,
                !this._hasRootInFilterBeforeSearch
            ),
            searchValue: '',
            searchInputValue: '',
            searchMisspellValue: '',
        } as Partial<T>;
    }

    private _getStateForSelectionViewModeReset(): Partial<T> {
        return {
            selectionViewMode: 'hidden',
            showSelectedCount: null,
        } as Partial<T>;
    }

    private _getStateAfterUpdateItems(state: Partial<T> = this.state) {
        const sourceControllerState = state.sourceController.getState();
        return {
            selectionViewMode: this._getSelectionViewMode(state),
            items: sourceControllerState.items,
            activeElement: this._calcActiveElementAfterUpdateItems(state),
            breadCrumbsItems: sourceControllerState.breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton:
                sourceControllerState.breadCrumbsItemsWithoutBackButton,
            backButtonCaption: sourceControllerState.backButtonCaption,
        };
    }

    private _getAdditionalStateOnCommandExecute(command: string): Partial<T> {
        if (command === 'selected' || command === 'all') {
            return {
                showSelectedCount: command === 'all' ? null : this.state.count,
            } as Partial<T>;
        }
    }

    // Делает вычисления активного элемента после того,
    // как данные загружены и установлены в state
    private _calcActiveElementAfterUpdateItems(nextState: Partial<T>) {
        let activeElement = nextState.activeElement;
        const rootChanged = nextState.root !== this.state.root;
        // при проваливании в папку _getStateAfterUpdateItems вызываются не только
        // когда реально подгрузились новые данные, но и до этого момента,
        // поэтому проверяем дополнительно itemsChanged.
        const itemsChanged = nextState.items !== this.state.items;
        if (rootChanged && itemsChanged) {
            if (
                nextState.root !== null &&
                (!this.state.breadCrumbsItems?.length ||
                    !hasItemInArray(this.state.breadCrumbsItems, nextState.root))
            ) {
                // При пеерходе в папку активной должна становиться первая запись.
                activeElement = this._getActiveElementByItems(nextState.items);
            } else {
                // При переходе назад активным должен становиться предыдущий корень.
                activeElement = this.state.root;
            }
        }
        return activeElement;
    }

    private __dataLoadedInner(
        items: TLoadResult,
        direction: Direction,
        nextState: T,
        additionalPromise?: Promise<unknown>,
        key?: TKey
    ): Promise<Partial<T>> {
        const loadedPromises = [];
        const returnState = (state): Partial<T> => {
            return {
                ...state,
                ...this._getLoadResult(state, items),
            };
        };
        const isNodeLoaded = key !== undefined && key !== nextState.root;
        let dataLoadResult;

        if (isNodeLoaded) {
            dataLoadResult = this._nodeDataLoaded(items as RecordSet, key, direction, nextState);
        } else {
            dataLoadResult = this._dataLoaded(items as RecordSet, direction, nextState);
        }

        if (isNodeLoaded && !direction) {
            nextState.hasMoreStorage = this._getHasMoreStorage(nextState);
        }

        if (dataLoadResult === undefined) {
            throw new Error(
                'Controls/dataFactory:ListSlice метод _dataLoaded не вернул новое состояние'
            );
        }

        if (dataLoadResult instanceof Promise) {
            loadedPromises.push(dataLoadResult);
        } else {
            loadedPromises.push(Promise.resolve(dataLoadResult));
        }
        if (additionalPromise) {
            loadedPromises.push(additionalPromise);
        }
        return Promise.all(loadedPromises).then(([dataLoadResult]) => {
            return returnState(dataLoadResult);
        });
    }

    /**
     * Метод, вызываемый после загрузки данных.
     * Должен вернуть новое состояние
     * @function Controls/_dataFactory/List/Slice#_dataLoaded
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
     * @protected
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
    reload(sourceConfig?: INavigationSourceConfig, keepNavigation?: boolean): Promise<RecordSet> {
        this._applyState({
            loading: true,
        });
        this._loadConfig = { sourceConfig, keepNavigation };
        return this.state.sourceController
            .reload(sourceConfig, false, false, keepNavigation)
            .then((items: RecordSet) => {
                this._newItems = items;
                if (this.state.loading) {
                    this.setState({
                        loading: false,
                    });
                } else {
                    //TODO: Перезагрузка должна всегда вешать промис. Это костыль на случай, когда за время загрузки сбросили флаг loading
                    this.setState({
                        reloading: false,
                    });
                }
                return items;
            })
            .catch((error) => {
                // TODO: !!!!!!
                if (!error?.isCanceled) {
                    this.setState({
                        loading: false,
                    });
                }
                return Promise.reject(error);
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
    reloadItem(itemKey: CrudEntityKey, options?: IReloadItemOptions): IReloadItemResult {
        return new Promise((resolve) => {
            resolveModuleWithCallback<typeof import('Controls/listCommands')>(
                'Controls/listCommands',
                ({ ReloadItem }) => {
                    const reloadItemCommand = new ReloadItem();
                    resolve(
                        reloadItemCommand.execute({
                            sourceController: this._sourceController,
                            keyProperty: this.state.keyProperty,
                            nodeProperty: this.state.nodeProperty,
                            parentProperty: this.state.parentProperty,
                            root: this.state.root,
                            items: this.state.items,
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
                            sourceController: this._sourceController,
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
    applyFilterDescription(filterDescription: IFilterItem[], newState?: Partial<IListState>): void {
        const newFilterDescription = getFilterModule().FilterDescription.applyFilterDescription(
            this.state.filterDescription,
            filterDescription,
            this.state.filter
        );
        if (newFilterDescription) {
            const newFilter = getFilterModule().FilterCalculator.getFilterByFilterDescription(
                this.state.filter,
                newFilterDescription
            );
            getFilterModule().FilterDescription.applyFilterDescriptionToURL(
                newFilterDescription,
                this.state.saveToUrl
            );
            if (this.state.historyId) {
                getFilterModule().FilterHistory.update(newFilterDescription, this.state.historyId);
            }
            this.setState({
                filterDescription: newFilterDescription,
                filter: newFilter,
                ...newState,
            });
        }
    }

    /**
     * Сбросить фильтры.
     * @function Controls/_dataFactory/List/Slice#resetFilterDescription
     * @public
     * @return {void}
     */
    resetFilterDescription(): void {
        const newFilterDescription = getFilterModule().FilterDescription.resetFilterDescription(
            this.state.filterDescription,
            true
        );
        this.applyFilterDescription(newFilterDescription);
    }

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
        return getFilterModule().FilterLoader.reloadFilterItem(
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

    protected _onRejectBeforeApplyState(): void {
        this.state.sourceController.cancelLoading();
        this.state.sourceController.updateOptions(this._getSourceControllerOptions(this.state));
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

    private _search(value: string, state: IListState = this.state): Promise<unknown> {
        return new Promise((resolve) => {
            resolveModuleWithCallback(
                'Controls/search',
                ({ FilterResolver }: typeof import('Controls/search')) => {
                    let searchValue = value;
                    if (this.state.searchValueTrim) {
                        searchValue = value && value.trim();
                    }
                    if (!this.state.searchValue) {
                        this._hasHierarchyFilterBeforeSearch = FilterResolver.hasHierarchyFilter(
                            state.filter
                        );
                        this._hasRootInFilterBeforeSearch = state.filter.hasOwnProperty(
                            this.state.parentProperty
                        );
                    }
                    const promises = [];
                    const { sourceController, viewMode, parentProperty } = state;
                    const searchViewMode = resolveSearchViewMode(
                        state.adaptiveSearchMode,
                        viewMode
                    );
                    if (viewMode !== searchViewMode) {
                        this._rootBeforeSearch = sourceController.getRoot();
                        this._previousViewMode = viewMode;
                    }
                    const breadCrumbsItems =
                        this._stateBeforeShowSelected?.breadCrumbsItems || state.breadCrumbsItems;
                    const rootForSearch = FilterResolver.getRootForSearch(
                        breadCrumbsItems,
                        state.root,
                        parentProperty,
                        state.searchStartingWith
                    );
                    const filterForSearch = FilterResolver.getFilterForSearch(
                        {
                            filter: state.filter,
                            root: state.root,
                            deepReload: state.deepReload,
                            parentProperty: state.parentProperty,
                            searchParam: state.searchParam,
                            searchStartingWith: state.searchStartingWith,
                            breadCrumbsItems,
                            sourceController: state.sourceController,
                        },
                        searchValue,
                        this._rootBeforeSearch
                    );
                    if (!state.deepReload && !sourceController.isExpandAll()) {
                        sourceController.setExpandedItems([]);
                    }
                    promises.push(
                        this._load(state, undefined, rootForSearch, filterForSearch, false)
                    );

                    if (!this._isViewModeLoaded(searchViewMode)) {
                        promises.push(this._loadViewMode(searchViewMode));
                    }
                    resolve(
                        Promise.all(promises).then(([items]) => {
                            return {
                                items,
                                root: rootForSearch,
                                searchValue: FilterResolver.needChangeSearchValueToSwitchedString(
                                    items
                                )
                                    ? FilterResolver.getSwitcherStrFromData(items)
                                    : searchValue,
                            };
                        })
                    );
                }
            );
        });
    }

    private _resetSearch(state: IListState): Promise<TLoadResult> {
        return new Promise((resolve) => {
            resolveModuleWithCallback(
                'Controls/search',
                ({ FilterResolver }: typeof import('Controls/search')) => {
                    const filter = FilterResolver.getResetSearchFilter(
                        state.filter,
                        state.searchParam,
                        state.parentProperty,
                        !this._hasHierarchyFilterBeforeSearch,
                        this._hasRootInFilterBeforeSearch
                    );
                    if (this._rootBeforeSearch !== undefined && this.state.parentProperty) {
                        this._sourceController.setRoot(this._rootBeforeSearch);
                    }
                    state.sourceController.setFilter(filter);
                    const sourceControllerOptions = this._getSourceControllerOptions(state);
                    state.sourceController.updateOptions({
                        ...sourceControllerOptions,
                        root: state.sourceController.getRoot(),
                        filter,
                    });
                    resolve(this._reload(state));
                }
            );
        });
    }

    private _getSearchMisspellValue(items: RecordSet = this._sourceController.getItems()): string {
        return getSearchResolver().getSwitcherStrFromData(items);
    }

    private _reload(state: IListState = this.state): Promise<TLoadResult> {
        return state.sourceController.reload(undefined, undefined, false);
    }

    private _load(
        state?: IListState,
        direction?: Direction,
        key?: TKey,
        filter?: TFilter,
        addItemsAfterLoad?: boolean,
        navigationSourceConfig?: IBaseSourceConfig
    ): Promise<TLoadResult> {
        this._applyState({
            loading: true,
        });
        return (state || this.state).sourceController
            .load(direction, key, filter, addItemsAfterLoad, navigationSourceConfig)
            .then((result: TLoadResult) => {
                if (addItemsAfterLoad === false) {
                    return result;
                }
                const nextState = state || this.state;
                return this.__dataLoadedInner(
                    result as RecordSet,
                    direction,
                    {
                        ...nextState,
                        loading: false,
                        filter: filter || nextState.filter,
                    },
                    null,
                    key
                ).then((newState) => {
                    if (filter) {
                        newState.sourceController.setFilter(filter);
                    }
                    this.setState(newState);
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

    private _getHasMoreStorage(nextState: T): IHasMoreStorage {
        return nextState.expandedItems.reduce<IHasMoreStorage>((result, key: CrudEntityKey) => {
            result[key] = {
                forward: nextState.sourceController.hasMoreData('down', key),
                backward: nextState.sourceController.hasMoreData('up', key),
            };
            return result;
        }, {});
    }

    private _getLoadResult(nextState: T, items: RecordSet): Partial<T> {
        const sourceController = nextState.sourceController;
        const searchViewMode = resolveSearchViewMode(
            this.state.adaptiveSearchMode,
            this._previousViewMode
        );
        const rootChanged = nextState.root !== this.state.root;
        const searchValue = nextState.searchValue;
        const searchParam = nextState.searchParam;
        const searchValueChanged = searchValue !== this.state.searchValue;
        const expandedItemsChanged = !isEqual(nextState.expandedItems, this.state.expandedItems);
        const hasSearch = !!searchParam && searchValue;
        let viewMode;

        if (hasSearch) {
            viewMode = searchViewMode;
        } else if (searchParam) {
            viewMode = this._previousViewMode;
        } else {
            viewMode = nextState.viewMode;
        }

        sourceController.setRoot(nextState.root);
        if (hasSearch) {
            sourceController.setFilter(nextState.filter);
        }

        if (expandedItemsChanged) {
            sourceController?.setExpandedItems(nextState.expandedItems);
        }
        const sourceControllerState = sourceController.getState();
        let newRoot = sourceControllerState.root;
        let stateAfterUpdateItems = this._getStateAfterUpdateItems(nextState);
        if (newRoot !== this.state.root) {
            const breadCrumbs = calculateBreadcrumbsData(items, nextState.displayProperty);
            stateAfterUpdateItems = {
                ...stateAfterUpdateItems,
                ...breadCrumbs,
            };
        }

        const markedState = {};

        if (!this._aspectStateManagers.has(AspectsNames.Root)) {
            markedState.markedKey = this._processMarkedKey(this.state, nextState);
        }

        if (
            nextState.searchStartingWith === 'root' &&
            searchParam &&
            searchValueChanged &&
            !searchValue &&
            nextState.parentProperty
        ) {
            newRoot = getSearchResolver().getRootForSearch(
                sourceControllerState.breadCrumbsItems,
                nextState.root,
                nextState.parentProperty,
                nextState.searchStartingWith
            );
        }

        if (searchParam) {
            let newFilter = sourceController.getFilter();
            if (searchValue) {
                newFilter = getSearchResolver().getFilterForSearch(
                    nextState,
                    nextState.searchValue,
                    this._rootBeforeSearch
                );
            } else if (this.state.searchParam) {
                newFilter = getSearchResolver().getResetSearchFilter(
                    nextState.filter,
                    nextState.searchParam,
                    nextState.parentProperty,
                    !this._hasHierarchyFilterBeforeSearch,
                    !this._hasRootInFilterBeforeSearch
                );
            }
            sourceController.setFilter(newFilter);
        }
        return {
            loading: false,
            items: sourceControllerState.items,
            ...stateAfterUpdateItems,
            filter: sourceController.getFilter(),
            ...markedState,
            root: newRoot,
            sorting: sourceControllerState.sorting,
            viewMode,
            previousViewMode: this._previousViewMode,
            errorConfig: null,
            expandedItems: sourceController.getExpandedItems(),
            selectionViewMode: this._getSelectionViewMode(nextState),
            searchMisspellValue: hasSearch ? this._getSearchMisspellValue(items) : '',
        } as Partial<T>;
    }

    /**
     * Сохраняет текущий маркер при проваливании в узел
     * и восстанавливает при переходе по хлебным крошкам назад.
     * @param nextState
     * @private
     * @see _changeCursorBeforeLoad
     */
    private _processMarkedKey(prevState: Partial<T>, nextState: Partial<T>): TKey {
        const rootChanged = nextState.root !== prevState.root;
        const markedKeyChanged = nextState.markedKey !== prevState.markedKey;
        // Если маркер изменили руками, например, через опции,
        // Не задействуем механизм восстановления маркера.
        if (!rootChanged || markedKeyChanged) {
            return nextState.markedKey;
        }

        let markedKey;
        const breadcrumbs = prevState.breadCrumbsItems || [];
        const isExistInPath = breadcrumbs?.length && hasItemInArray(breadcrumbs, nextState.root);
        const isGoingToRoot = nextState.root === null;
        const isGoingToDepth: boolean = !isGoingToRoot && !isExistInPath;
        if (isGoingToDepth) {
            // Если проваливаемся, то маркер нужно выставить в null.
            markedKey = null;
        } else {
            // Обратно востанавливаем маркер по текущим breadCrumbs
            const nextMarkedItem = isGoingToRoot
                ? breadcrumbs[0]
                : getNextItemFromArray(breadcrumbs, nextState.root);
            const nextMarkedKey = nextMarkedItem?.getKey();
            markedKey = nextMarkedKey !== undefined ? nextMarkedKey : prevState.root;
        }
        return markedKey;
    }

    /**
     * Изменяет курсор перед загрузкой данных.
     * 1.При курсорной навигации после проваливания в папку нужно исключать ситуацию,
     * что данные в папки выше указанного крусора.
     * 2. При возврате по хлебным нужно вернуться к записи, от которой произошло проваливание.
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
            nextState.navigation.sourceConfig.position = this.state.root;
        } else if (
            !firstBreadCrumbsItem ||
            !hasItemInArray(this.state.breadCrumbsItems, nextState.root)
        ) {
            nextState.navigation.sourceConfig.position = null;
        }
    }

    private _getStateAfterLoadError<T extends IListState>(errorConfig: IErrorConfig, state: T): T {
        const isCancelablePromiseError = errorConfig.error instanceof PromiseCanceledError;
        if (errorConfig.error && !isCancelablePromiseError) {
            // Выводим ошибку в консоль, иначе из-за того, что она произошла в Promise,
            // у которого есть обработка ошибок через catch, никто о ней не узнает
            if (!errorConfig.error.hasOwnProperty('httpError')) {
                Logger.error('Controls/dataFactory:ListSlice load error', this, errorConfig.error);
            }
            return {
                ...state,
                errorConfig,
                loading: false,
            };
        } else {
            return {
                ...state,
                loading: isCancelablePromiseError ? this.state.loading : state.loading,
            };
        }
    }

    private _getSelectionViewMode(nextState): TSelectionViewMode {
        let selectionViewMode = nextState.selectionViewMode;
        const needCalcSelectionViewMode =
            !isEqual(this.state.selectedKeys, nextState.selectedKeys) ||
            !isEqual(this.state.excludedKeys, nextState.excludedKeys) ||
            this.state.searchValue !== nextState.searchValue ||
            this.state.root !== nextState.root ||
            !isEqual(this.state.expandedItems, nextState.expandedItems);

        if (needCalcSelectionViewMode && isLoaded('Controls/operations')) {
            selectionViewMode = getOperationsModule().getSelectionViewMode(
                selectionViewMode,
                nextState
            );
        }

        return selectionViewMode;
    }

    private _getSourceController(props: ISourceControllerOptions): SourceController {
        if (!this._sourceController) {
            const dataSource =
                loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
            this._sourceController = new dataSource.NewSourceController(props);
        }
        return this._sourceController;
    }

    private _getOperationsController(props: object): OperationsController {
        if (!this._operationsController && isLoaded('Controls/operations')) {
            this._operationsController = new (getOperationsModule().ControllerClass)(props);
        }
        return this._operationsController;
    }

    private _needProcessError(error: Error): boolean {
        return !error || !(error as PromiseCanceledError).isCanceled;
    }

    destroy(): void {
        this._unsubscribeFromControllersChanged();
        this._updateSubscriptionOnItems(this.state.items, null);

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

    setCollection<T extends Collection>(collection: T): void {
        // https://online.sbis.ru/opendoc.html?guid=78cd4cb6-ed7b-44c5-8cba-46b16af4a91d&client=3
        if (collection === this._collection) {
            return;
        }
        if (!collection['[Controls/_display/Collection]']) {
            throw new Error(
                'Controls/dataFactory:ListSlice setCollection: коллекция должна быть наследником Controls/display:Collection'
            );
        }
        this._collection = collection;

        this._initAspects(resolveCollectionType(collection), this.state);
        // TODO. ItemsStateManager конфликтует с BaseControl
        // Необходимо разработать слой совместимости
        // Одни и те же операции происходят в Slice, а затем в BaseControl
        // Последствия такого поведения непредсказуемы
        const ItemsStateManager = this._aspectStateManagers.get(AspectsNames.Items);
        if (ItemsStateManager) {
            ItemsStateManager.disableSetCollection();
        }
        if (this._aspectStateManagers.has(AspectsNames.Marker)) {
            this._aspectStateManagers.delete(AspectsNames.Marker);
        }
    }

    protected async _loadNewItems(direction: Direction): Promise<void> {
        if (this.state.loading || !this._sourceController.hasMoreData(direction)) {
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
            const navigationChanges = this._sourceController.calculateNavigationChanges(items, {
                key: this.state.root,
                direction,
            });

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
            this.setState(
                this._getStateAfterLoadError(
                    {
                        error: error as Error,
                        loadKey: this.state.root,
                    },
                    this.state
                )
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

    select(key: CrudEntityKey): void {
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
            nextState = {
                ...nextState,
                ...markerAspect.setMarker(this.state, key),
            };
        }
        this.setState(nextState);
    }

    expand(
        key: CrudEntityKey,
        {
            markItem = true,
        }: {
            markItem?: boolean;
        } = {}
    ): void {
        let nextState: Partial<IListState> = {};

        const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
        if (expandCollapseAspect) {
            nextState = {
                ...nextState,
                ...expandCollapseAspect.expand(this.state, key),
            };
        }
        const markerAspect = this._aspectStateManagers.get(AspectsNames.Marker);
        if (markerAspect && markItem) {
            nextState = {
                ...nextState,
                ...markerAspect.setMarker(this.state, key),
            };
        }

        this.setState(nextState);
    }

    collapse(
        key: CrudEntityKey,
        {
            markItem = true,
        }: {
            markItem?: boolean;
        } = {}
    ): void {
        let nextState: Partial<IListState> = {};

        const expandCollapseAspect = this._aspectStateManagers.get(AspectsNames.ExpandCollapse);
        if (expandCollapseAspect) {
            nextState = {
                ...nextState,
                ...expandCollapseAspect.collapse(this.state, key),
            };
        }
        const markerAspect = this._aspectStateManagers.get(AspectsNames.Marker);
        if (markerAspect && markItem) {
            nextState = {
                ...nextState,
                ...markerAspect.setMarker(this.state, key),
            };
        }

        this.setState(nextState);
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
        // Нельзя выполнять метод безусловно в _beforeApplyState, т.к.
        // он должен вызываться только при смене рута, а не при любой установке стейта.
        // Кейс: Есть два прайса рядом, у обоих root=null. Открываем первый, проваливаемся в любую папку
        // и тут же открываем другой прайс. В этом случае не должен обрабатываться переход "назад".
        let nextPartialState: Partial<IListState> = {};

        const rootAspect = this._aspectStateManagers.get(AspectsNames.Root);

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
                        this._processMarkedKey(this.state, {
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

    //# endregion ISliceOnCollectionScheme
}
/**
 * @name Controls/_dataFactory/List/Slice#state
 * @cfg {Controls/_dataFactory/List/_interface/IListState} Состояние слайса списка
 */
