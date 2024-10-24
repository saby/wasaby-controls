/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/BrowserTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    ControllerClass as OperationsController,
    getListCommandsSelection,
} from 'Controls/operations';
import {
    ControllerClass as SearchController,
    IHierarchySearchOptions,
} from 'Controls/searchDeprecated';
import type {
    IFilterItem,
    IPrefetchOptions,
    THistoryData,
    IFilterHistoryData,
} from 'Controls/filter';
import {
    ControllerClass as FilterControllerClass,
    IFilterControllerOptions,
} from 'Controls/filterOld';
import { EventUtils } from 'UI/Events';
import { RecordSet } from 'Types/collection';
import { IContextOptionsValue } from 'Controls/context';
import { RegisterClass } from 'Controls/event';
import {
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import {
    Direction,
    IExpandedItemsOptions,
    IFilterChanged,
    IFilterOptions,
    IHierarchyOptions,
    INavigation,
    INavigationSourceConfig,
    ISearchOptions,
    ISearchValueOptions,
    ISelectFieldsOptions,
    ISelectionObject,
    ISourceOptions,
    TItemsOrder,
    TKey,
    TSelectionType,
    TSelectionViewMode,
    TStoreImport,
} from 'Controls/interface';
import { ErrorViewConfig, ErrorViewMode } from 'Controls/error';
import { SHADOW_VISIBILITY } from 'Controls/scroll';
import { detection } from 'Env/Env';
import {
    ICrud,
    ICrudPlus,
    IData,
    PrefetchProxy,
    QueryOrderSelector,
    QueryWhereExpression,
} from 'Types/source';
import type { IMarkerListOptions } from 'Controls/_marker/interface';
import { IShadowsOptions } from 'Controls/_scroll/Container/Interface/IShadows';
import { IControllerState } from 'Controls/_dataSource/Controller';
import { isEqual } from 'Types/object';
import { DataLoader, IDataLoaderOptions, ILoadDataResult } from 'Controls/dataSourceOld';
import { Logger } from 'UI/Utils';
import { descriptor, Model } from 'Types/entity';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { URL as PageUrl } from 'Browser/Transport';
import { ITreeControlOptions } from 'Controls/tree';
import { object } from 'Types/util';
import 'Controls/listDataOld';
import type { TColumns, THeader } from 'Controls/grid';
import { IRouter } from 'Router/router';

type Key = string | number | null;

type TViewMode = 'search' | 'tile' | 'table' | 'list';

export interface IListConfiguration
    extends IControlOptions,
        ISearchOptions,
        ISourceOptions,
        Required<IFilterOptions>,
        Required<IHierarchyOptions>,
        IHierarchySearchOptions,
        IMarkerListOptions,
        IShadowsOptions,
        ISelectFieldsOptions,
        ISearchValueOptions,
        IExpandedItemsOptions,
        ITreeControlOptions,
        IPrefetchOptions {
    searchNavigationMode?: string;
    groupHistoryId?: string;
    filterButtonSource?: IFilterItem[];
    useStore?: boolean;
    dataLoadCallback?: Function;
    dataLoadErrback?: Function;
    viewMode?: TViewMode;
    root?: Key;
    sorting?: QueryOrderSelector;
    historyItems?: IFilterItem[];
    sourceController?: SourceController;
    filterController?: FilterControllerClass;
    historyId: string;
    id?: string;
    displayProperty?: string;
    preloadData?: boolean;
    historySaveCallback?: Function;
    disableContextUpdate?: boolean;
}

export interface IBrowserOptions
    extends IListConfiguration,
        IPrefetchOptions,
        IFilterChanged,
        INavigation {
    listsOptions: IListConfiguration[];
    sourceControllerId?: string;
    operationsController?: OperationsController;
    _dataOptionsValue?: IContextOptionsValue;
}

interface IReceivedState {
    data: RecordSet | void | Error;
    historyItems: IFilterItem[] | IFilterHistoryData;
}

type TReceivedState = IReceivedState[] | Error | void;

type TErrbackConfig = ErrorViewConfig & { error: Error };

type TRootLoadPromise = Record<
    string,
    {
        listId: string;
        loadPromise: Promise<RecordSet | Error>;
    }
>;

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

export default class Browser extends Control<IBrowserOptions, TReceivedState> {
    protected _template: TemplateFunction = template;
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    private _isMounted: boolean;

    protected _topShadowVisibility: SHADOW_VISIBILITY | 'gridauto' = SHADOW_VISIBILITY.AUTO;
    protected _bottomShadowVisibility: SHADOW_VISIBILITY | 'gridauto' = SHADOW_VISIBILITY.AUTO;
    protected _contextState: IContextOptionsValue;

    protected _listMarkedKey: Key = null;
    private _root: Key = null;
    private _rootLoadPromise: TRootLoadPromise = {};
    private _deepReload: boolean = undefined;

    protected _sourceControllerState: IControllerState;
    protected _items: RecordSet;

    private _filter: QueryWhereExpression<unknown>;
    protected _filterButtonItems: IFilterItem[];

    protected _groupHistoryId: string;
    private _errorRegister: RegisterClass;
    private _rootChangedRegister: RegisterClass;
    private _storeCallbackIds: string[];
    private _storeCtxCallbackId: string;

    private _source: ICrudPlus | (ICrud & ICrudPlus & IData);
    private _dataLoader: DataLoader = null;
    private _loading: boolean = false;

    private _operationsController: OperationsController = null;
    private _operationsPanelExpanded: boolean;
    protected _selectedKeysCount: number | null = 0;
    protected _showSelectedCount: number;
    protected _selectionBeforeShowSelectedApply: ISelectionObject;
    protected _listCommandsSelection: ISelectionObject;
    protected _selectionType: TSelectionType = 'all';
    protected _isAllSelected: boolean = false;
    protected _multiSelectVisibility: string = '';
    protected _itemsOrder: TItemsOrder;
    protected _selectionViewMode: string = '';
    private _columns: TColumns;
    private _header: THeader;

    private _previousViewMode: TViewMode = null;
    private _viewMode: TViewMode = undefined;
    private _inputSearchValue: string = '';
    private _searchValue: string;
    private _misspellValue: string = '';
    private _searchMisspellValue: string = '';
    private _returnedOnlyByMisspellValue: boolean = false;
    private _listsOptions: IListConfiguration[];
    // Функция обратного вызова, которая через события устанавливается из ПМО.
    // Позволяет вызвать прикладной обработчик действия ПМО.
    private _callListActionCallback: (actionParams: { id?: string; actionName?: string }) => void;
    private _historySaveCallbackOption: Function;

    protected _beforeMount(
        options: IBrowserOptions,
        _: unknown,
        receivedState?: TReceivedState
    ): void | Promise<TReceivedState | Error | void> {
        this._initStates(options, receivedState);
        this._dataLoader = new DataLoader(this._getDataLoaderOptions(options, receivedState));
        this._operationsPanelOpen = this._operationsPanelOpen.bind(this);

        if (options.sourceController) {
            this._validateSourceControllerOptions(options.sourceController, options);
            options.sourceController.updateOptions({
                ...options,
                ...this._getSourceControllerOptions(options),
                source: this._getOriginalSource(options),
            });
        }

        return this._loadDependencies<TReceivedState | Error | void>(options, () => {
            return this._beforeMountInternal(options, undefined, receivedState);
        });
    }

    private _selectionViewModeChanged(
        event: SyntheticEvent,
        type: TSelectionViewMode,
        id?: string
    ): void {
        if (this._selectionViewMode === 'selected' && type === 'all') {
            if (!this._options.deepReload) {
                this._getSourceController(id).setExpandedItems([]);
                this._notify('expandedItemsChanged', [[], id]);
            }
            this._reload(this._options, id);
        }
        if (type === 'selected') {
            this._showSelectedCount = this._selectedKeysCount;
            this._selectionBeforeShowSelectedApply = {
                selected: this._options.selectedKeys,
                excluded: this._options.excludedKeys,
            };
            this._listCommandsSelection = this._getListCommandsSelection(this._options);

            let resultFilter;

            if (this._searchValue && !this._options.listsOptions) {
                resultFilter = this._getSearchControllerSync().reset(true);
                if (!isEqual(this._filter, resultFilter)) {
                    this._filterChanged(null, resultFilter);
                }
                if (this._options.useStore) {
                    getStore().sendCommand('resetSearch');
                }
                this._setSearchValue('');
                this._inputSearchValue = '';
            }

            if (this._hasFilterSourceInOptions(this._options) && !this._options.listsOptions) {
                const filterController = this._dataLoader.getFilterController();
                filterController?.resetFilterDescription();
                resultFilter = filterController?.getFilter();
            }

            if (resultFilter) {
                this._getSourceController(id).setFilter(resultFilter);
            }
        } else if (type === 'all') {
            this._showSelectedCount = null;
            this._selectionBeforeShowSelectedApply = null;
            this._listCommandsSelection = this._getListCommandsSelection(this._options);
        }
        this._selectionViewMode = type;
    }

    private _beforeMountInternal(
        options: IBrowserOptions,
        _: unknown,
        receivedState?: TReceivedState
    ): void | Promise<TReceivedState | Error | void> {
        if (Browser._checkLoadResult(options, receivedState as IReceivedState[])) {
            this._updateFilterAndFilterItems(options);
            const items = receivedState?.[0].data || options.sourceController?.getItems();
            this._defineShadowVisibility(items);
            this._defineMultiSelectVisibility(options);
            this._setItemsAndUpdateContext(options, true);
            this._setSelectionViewMode(options);
            this._defineItemsOrder(options.itemsOrder, options.useStore);

            if (options.source && options.dataLoadCallback && items) {
                options.dataLoadCallback(items);
            }
        } else if (options.source || options.filterButtonSource || options.listsOptions) {
            return this._dataLoader
                .load<ILoadDataResult>(void 0, void 0, options.Router)
                .then((result) => {
                    this._updateFilterAndFilterItems(options);
                    this._defineShadowVisibility(result[0].data);
                    this._defineItemsOrder(result[0].itemsOrder, options.useStore);
                    this._defineMultiSelectVisibility(options);
                    this._setSelectionViewMode(options);

                    if (Browser._checkLoadResult(options, result as IReceivedState[])) {
                        this._setItemsAndUpdateContext(options);
                        return result.map(({ data, historyItems }) => {
                            return {
                                historyItems,
                                data,
                            };
                        });
                    } else {
                        this._subscribeOnControllersEvents(options);
                        this._updateContext(options);
                        return result[0].error;
                    }
                });
        } else {
            this._subscribeOnControllersEvents(options);
            this._updateContext(options);
        }
    }

    private _loadDependencies<T>(options: IBrowserOptions, callback: Function): Promise<T> | void {
        const deps = [];

        if (Browser._hasSearchParamInOptions(options) && !isLoaded('Controls/search')) {
            deps.push(loadAsync('Controls/search'));
        }

        if (Browser._hasSearchParamInOptions(options) && !isLoaded('Controls/searchDeprecated')) {
            deps.push(loadAsync('Controls/searchDeprecated'));
        }

        if (this._hasFilterSourceInOptions(options) && !isLoaded('Controls/filterOld')) {
            deps.push(loadAsync('Controls/filterOld'));
        }

        if (this._hasFilterSourceInOptions(options) && !isLoaded('Controls/filter')) {
            deps.push(loadAsync('Controls/filter'));
        }

        if (deps.length) {
            return Promise.all(deps).then(() => {
                return callback();
            });
        } else {
            return callback();
        }
    }

    private _initStates(options: IBrowserOptions, receivedState: TReceivedState): void {
        this._itemOpenHandler = this._itemOpenHandler.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._dataLoadErrback = this._dataLoadErrback.bind(this);
        this._rootChanged = this._rootChanged.bind(this);
        this._dataLoadStart = this._dataLoadStart.bind(this);
        this._sortingChanged = this._sortingChanged.bind(this);
        this._notifyNavigationParamsChanged = this._notifyNavigationParamsChanged.bind(this);
        this._searchStartCallback = this._searchStartCallback.bind(this);
        this._itemsChanged = this._itemsChanged.bind(this);
        this._filterChanged = this._filterChanged.bind(this);
        this._selectionViewModeChanged = this._selectionViewModeChanged.bind(this);
        this._operationsPanelExpandedChanged = this._operationsPanelExpandedChanged.bind(this);
        this._actionClick = this._actionClick.bind(this);
        this._contextChangedCallback = this._contextChangedCallback.bind(this);
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._historySaveCallbackOption = options.historySaveCallback;
        if (options.operationsController) {
            this._operationsController = this._createOperationsController(options);
        }

        if (options.root !== undefined) {
            this._root = options.root;
        }
        if (Browser._hasSearchParamInOptions(options)) {
            this._searchValue = '';
        }
        // в опциях могут передать PrefetchProxy источник и sourceController,
        // в таком случае мы построимся по записям из sourceController'a и в PrefetchProxy останется кэш
        // поэтому из PrefetchProxy источника надо брать target (оригинальный источник)
        this._source =
            receivedState || options.sourceController
                ? this._getOriginalSource(options)
                : options.source;

        if (options.useStore) {
            this._inputSearchValue = this._searchValue =
                (getStore().getState().searchValue as unknown as string) || '';
        } else if (options.searchValue) {
            this._inputSearchValue = this._searchValue = options.searchValue;
        }

        this._filter = options.filter || {};
        this._groupHistoryId = options.groupHistoryId;

        // на mount'e не доступен searchController, т.к. он грузится асинхронно, поэтому логика тут нужна
        this._previousViewMode = this._viewMode = options.viewMode;
        if (this._inputSearchValue && this._inputSearchValue.length >= options.minSearchLength) {
            this._updateViewMode('search');
        } else {
            this._updateViewMode(options.viewMode);
        }
        this._columns = options.columns;
        this._header = options.header;
        this._listsOptions = Browser._getListsOptions(options);
    }

    protected _afterMount(options: IBrowserOptions): void {
        this._isMounted = true;
        if (options.useStore) {
            this._subscribeOnStoreChanges(options);
        }
    }

    private _subscribeOnStoreChanges(options: IBrowserOptions): void {
        this._storeCallbackIds = this._createNewStoreObservers();
        this._storeCtxCallbackId = getStore().onPropertyChanged(
            '_contextName',
            () => {
                this._storeCallbackIds.forEach((id) => {
                    return getStore().unsubscribe(id);
                });
                this._storeCallbackIds = this._createNewStoreObservers();
                if (!options.hasOwnProperty('searchValue') && this._searchValue) {
                    this._setSearchValueAndNotify('');
                    this._getSearchControllerSync()?.reset(true);
                }
            },
            true
        );
    }

    private _unsubscribeFromStoreChanges(): void {
        if (this._storeCallbackIds) {
            this._storeCallbackIds.forEach((id) => {
                return getStore().unsubscribe(id);
            });
        }
        if (this._storeCtxCallbackId) {
            getStore().unsubscribe(this._storeCtxCallbackId);
        }
    }

    private _validateSearchOptions(options: IBrowserOptions): void {
        if (options.hasOwnProperty('searchValue') && options.searchValue === undefined) {
            Logger.error(
                'Controls/browser:Browser опция searchValue имеет некорректный тип, необходимо передавать строкой',
                this
            );
        }
    }

    private _validateSourceControllerOptions(
        sourceController: SourceController,
        options: IBrowserOptions
    ): void {
        const sourceControllerOptions = sourceController.getState();
        const optionsToValidate = ['filter', 'navigation', 'root'];

        optionsToValidate.forEach((optionName) => {
            if (
                options[optionName] !== undefined &&
                !isEqual(options[optionName], sourceControllerOptions[optionName])
            ) {
                Logger.error(
                    `Controls/browser:Browser отличается значения опции "${optionName}"
                     заданное для контрола и для sourceController'a, переданного в опциях Browser'a.
                     Проверьте опции указанные в загрузчике SabyPage, они должны совпадать с опциями
                     переданными в Browser.`,
                    this
                );
            }
        });
    }

    private _validateHistoryIdFilterItems(historyId: string): void {
        if (historyId && this._filterButtonItems) {
            const filterItem = this._filterButtonItems.find((item) => {
                return item.historyId === historyId;
            });
            if (filterItem) {
                Logger.error(
                    `Controls/browser:Browser у фильтра с именем "${filterItem.name}" задан неверный параметр historyId,
             он не должен совпадать с общим historyId реестра`,
                    this
                );
            }
        }
    }

    protected _createNewStoreObservers(): string[] {
        const store = getStore();
        const sourceCallbackId = store.onPropertyChanged(
            'filterSource',
            (filterSource: IFilterItem[]) => {
                if (filterSource || !isEqual(filterSource, this._filterButtonItems)) {
                    const historyIdFromSource = filterSource.historyId;
                    const sourceFromFilterSource = filterSource.source;
                    const controllerFromFilterSource = filterSource.sourceController;
                    const isSourceDifferent =
                        sourceFromFilterSource !== undefined
                            ? sourceFromFilterSource !== this._options.source
                            : controllerFromFilterSource &&
                              controllerFromFilterSource !== this._options.sourceController;
                    delete filterSource.source;
                    delete filterSource.sourceController;

                    if (
                        (historyIdFromSource && historyIdFromSource !== this._options.historyId) ||
                        isSourceDifferent
                    ) {
                        return;
                    } else {
                        this._filterItemsChanged(null, filterSource);
                    }
                }
            }
        );
        const selectedTypeChangedCallbackId = store.onPropertyChanged(
            'selectedType',
            (type: string) => {
                this._selectedTypeChangedHandler(null, type);
            }
        );
        const filterSourceCallbackId = store.onPropertyChanged(
            'filter',
            (filter: QueryWhereExpression<unknown>) => {
                return this._filterChanged(null, filter);
            }
        );
        const searchValueCallbackId = store.onPropertyChanged(
            'searchValue',
            (searchValue: string) => {
                if (searchValue) {
                    this._search(null, searchValue);
                } else if (
                    this._searchValue ||
                    this._getSearchControllerSync()?.isSearchInProcess()
                ) {
                    this._searchResetHandler();
                }
            }
        );
        return [
            sourceCallbackId,
            filterSourceCallbackId,
            searchValueCallbackId,
            selectedTypeChangedCallbackId,
        ];
    }

    protected _beforeUpdate(newOptions: IBrowserOptions): void | Promise<RecordSet> {
        const currentOptions = this._options;
        return this._loadDependencies(newOptions, () => {
            return this._beforeUpdateInternal(newOptions, currentOptions);
        });
    }

    protected _beforeUpdateInternal(
        newOptions: IBrowserOptions,
        currentOptions: IBrowserOptions
    ): void | Promise<RecordSet> {
        if (newOptions.listsOptions) {
            const listsIdsAreEqual = newOptions.listsOptions.every(({ id }) => {
                return this._listsOptions.find((listOption) => {
                    return listOption.id === id;
                });
            });
            if (!isEqual(newOptions.listsOptions, currentOptions.listsOptions)) {
                this._listsOptions = Browser._getListsOptions(newOptions);
            }
            if (!listsIdsAreEqual) {
                this._dataLoader = null;
                this._dataLoader = new DataLoader(this._getDataLoaderOptions(newOptions));
            }
            this._listsOptions.forEach((options, index) => {
                this._update(
                    {
                        ...currentOptions,
                        ...currentOptions.listsOptions?.[index],
                    },
                    { ...newOptions, ...options },
                    options.id
                );
            });
        } else {
            this._listsOptions = Browser._getListsOptions(newOptions);
            return this._update(currentOptions, newOptions);
        }
    }

    private _update(
        options: IBrowserOptions,
        newOptions: IBrowserOptions,
        id?: string
    ): void | Promise<RecordSet> {
        const sourceChanged = options.source !== newOptions.source;
        const hasSearchValueInOptions = newOptions.searchValue !== undefined;
        const isInputSearchValueLongerThenMinSearchLength =
            this._inputSearchValue?.length >= options.minSearchLength;
        const searchValueOptionsChanged = options.searchValue !== newOptions.searchValue;
        const searchValueChanged = this._searchValue !== newOptions.searchValue;
        const rootChanged = newOptions.root !== options.root;
        const searchController = this._getSearchControllerSync(id);
        const sourceControllerChanged = options.sourceController !== newOptions.sourceController;
        let newSource = newOptions.source;
        let methodResult;
        let rootAlreadyLoaded;

        if (newOptions.useStore !== options.useStore) {
            if (newOptions.useStore) {
                this._subscribeOnStoreChanges(newOptions);
            } else {
                this._unsubscribeFromStoreChanges();
            }
        }

        this._updateOperationsController(newOptions);
        this._defineMultiSelectVisibility(newOptions);

        if (options.filterController !== newOptions.filterController) {
            this._setFilterController(newOptions.filterController, id);
            this._updateFilterAndFilterItems(newOptions);
        } else {
            this._updateFilterController(options, newOptions, id);
        }
        this._updateFilterItemsInStore(newOptions);

        if (sourceControllerChanged) {
            this._setSourceController(newOptions.sourceController, newOptions, id);

            if (sourceChanged) {
                newSource = this._getOriginalSource(newOptions);
            }
            this._setSelectionViewMode(newOptions);
        }

        if (sourceChanged) {
            this._source = newSource;
        }

        const sourceController = this._getSourceController(id);
        let source;

        if (rootChanged) {
            this._root = newOptions.root;
            const rootLoadPromise = this._rootLoadPromise[this._root];
            rootAlreadyLoaded =
                rootLoadPromise &&
                ((rootLoadPromise.listId === undefined && !id) || rootLoadPromise.listId === id);

            if (rootAlreadyLoaded) {
                sourceController.setRoot(this._root);
            }
        }

        if (
            rootChanged ||
            (Browser._hasRootInOptions(newOptions, id) &&
                searchController?.getRoot() !== newOptions.root)
        ) {
            searchController?.setRoot(newOptions.root);
        }

        if (options.viewMode !== newOptions.viewMode) {
            if (this._isSearchViewMode()) {
                this._previousViewMode = newOptions.viewMode;
            } else {
                this._updateViewMode(newOptions.viewMode);
            }
        }

        if (sourceChanged) {
            source = newSource;
        } else if (sourceController.getSource() !== newSource) {
            source = this._getOriginalSource(newOptions);
        } else if (!id) {
            source = this._source;
        } else {
            source = newSource;
        }

        // sourceController может сбросить expandedItems. Мы кинем событие, но прикладник оставим старые expandedItems
        // Поэтому на beforeUpdate нужно вернуть expandedItems из опций. Из-за этого сравниваем стейт и опции.
        const expandedItemsChanged =
            !isEqual(sourceController.getExpandedItems(), newOptions.expandedItems) &&
            newOptions.hasOwnProperty('expandedItems');

        const isChanged = sourceController.updateOptions({
            ...newOptions,
            ...this._getSourceControllerOptions(newOptions),
            source,
        });

        if (isChanged || rootChanged) {
            this._selectionViewMode = 'hidden';
        }

        if (searchValueOptionsChanged && searchValueChanged) {
            this._inputSearchValue = newOptions.searchValue;

            if (!newOptions.searchValue && (sourceChanged || rootChanged) && searchController) {
                // сброс поиска производим без выполнения запроса с новым фильтров
                // из-за смены корня/источника и так будет перезапрос данных
                this._resetSearch(false);
                sourceController.setFilter(this._filter);
            }
        }

        if (isChanged && sourceController.getSource()) {
            methodResult = this._reload(newOptions, id);
        } else if (!isChanged && rootChanged && rootAlreadyLoaded) {
            methodResult = this._rootLoadPromise[this._root].loadPromise
                .then((items) => {
                    sourceController.setItemsAfterLoad(items as RecordSet);
                    return items;
                })
                .catch((error) => {
                    if (!error?.isCanceled) {
                        sourceController.setLoadError(error);
                    }
                    return error;
                });
            delete this._rootLoadPromise[this._root];
        } else if (isChanged || sourceControllerChanged) {
            const items = this._getSourceController(id).getItems();
            if (sourceControllerChanged && newOptions.dataLoadCallback && items) {
                newOptions.dataLoadCallback(items, undefined, id);
            }
            this._afterSourceLoad(sourceController, newOptions);
        } else {
            if (!isEqual(options.columns, newOptions.columns)) {
                this._columns = newOptions.columns;
            }
            if (!isEqual(options.header, newOptions.header)) {
                this._header = newOptions.header;
            }
            this._updateItemsOnState();
        }

        const selectedKeysChanged = !isEqual(options.selectedKeys, newOptions.selectedKeys);
        const excludedKeysChanged = !isEqual(options.excludedKeys, newOptions.excludedKeys);
        if (selectedKeysChanged || excludedKeysChanged || expandedItemsChanged) {
            if (!isChanged) {
                this._updateContext();
            }
        }
        if (selectedKeysChanged || excludedKeysChanged || rootChanged || searchValueChanged) {
            this._setSelectionViewMode(newOptions);
        }
        if (selectedKeysChanged || excludedKeysChanged) {
            this._listCommandsSelection = this._getListCommandsSelection(newOptions);
        }
        if (expandedItemsChanged) {
            sourceController.setExpandedItems(newOptions.expandedItems);
        }

        if (
            isChanged &&
            isInputSearchValueLongerThenMinSearchLength &&
            hasSearchValueInOptions &&
            !newOptions.searchValue
        ) {
            this._inputSearchValue = '';
        }

        if (
            (hasSearchValueInOptions && searchValueOptionsChanged && searchValueChanged) ||
            options.searchParam !== newOptions.searchParam ||
            options.startingWith !== newOptions.startingWith ||
            sourceControllerChanged
        ) {
            if (!methodResult && newOptions.searchParam) {
                methodResult = this._updateSearchController(newOptions, id).catch((error) => {
                    this._processLoadError(error);
                    return error;
                });
            }
        }

        return methodResult;
    }

    private _setSourceController(
        sourceController: SourceController,
        options: IBrowserOptions,
        id: string
    ): void {
        this._dataLoader.setSourceController(id, sourceController);
        this._getSearchControllerSync(id)?.setSourceController(sourceController);
        this._subscribeOnSourceControllerEvents(options);
    }

    private _setFilterController(filterController: FilterControllerClass, id: string): void {
        this._dataLoader.setFilterController(id, filterController);
        this._subscribeOnFilterControllerEvents();
    }

    private _updateFilterController(
        options: IBrowserOptions,
        newOptions: IBrowserOptions,
        id?: string
    ): void {
        const filterController = this._dataLoader.getFilterController(id);
        const filterControllerOptions = this._getFilterControllerOptions(newOptions);
        const filterChanged = !isEqual(options.filter, newOptions.filter);

        if (filterController?.update(filterControllerOptions) || filterChanged) {
            const currentFilter = this._filter;
            if (
                Browser._hasInOptions(options, ['filterButtonSource']) ||
                !options.disableContextUpdate
            ) {
                this._updateFilterAndFilterItems(newOptions);
            }
            this._validateHistoryIdFilterItems(newOptions.historyId);
            const filterStructureChanged = !isEqual(
                options.filterButtonSource,
                newOptions.filterButtonSource
            );
            const selectionWithPathChanged =
                options.selectionViewMode !== newOptions.selectionViewMode;

            const filterChanged =
                !isEqual(currentFilter, this._filter) && !isEqual(newOptions.filter, this._filter);
            if ((filterStructureChanged && filterChanged) || selectionWithPathChanged) {
                this._notify('filterChanged', [this._filter, id]);
            }
        }
    }

    private _updateOperationsController(newOptions: IBrowserOptions): void {
        this._getOperationsController().update(newOptions);
        if (newOptions.hasOwnProperty('markedKey') && newOptions.markedKey !== undefined) {
            this._listMarkedKey = this._getOperationsController().setListMarkedKey(
                newOptions.markedKey
            );
            this._listCommandsSelection = this._getListCommandsSelection(this._options);
        }
    }

    private _updateSearchController(newOptions: IBrowserOptions, id?: string): Promise<unknown> {
        return this._getSearchController(id).then((searchController): unknown => {
            if (this._destroyed) {
                return Promise.resolve();
            }
            this._validateSearchOptions(newOptions);
            const searchControllerOptions = {
                ...newOptions,
                sourceController: this._getSourceController(id),
                root: this._root,
            };
            // Чтобы не было утечки памяти
            delete searchControllerOptions._dataOptionsValue;
            const updateSearchControllerResult = searchController.update(searchControllerOptions);

            if (updateSearchControllerResult) {
                if (newOptions.searchValue) {
                    return this._search(null, newOptions.searchValue);
                } else {
                    return Promise.resolve(this._searchResetHandler());
                }
            } else {
                return Promise.resolve(updateSearchControllerResult);
            }
        });
    }

    private _afterSourceLoad(sourceController: SourceController, options: IBrowserOptions): void {
        // TODO filter надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
        this._filter = sourceController.getState().filter;
        this._columns = options.columns;
        this._header = options.header;
        this._updateContext();
        this._groupHistoryId = options.groupHistoryId;
        this._setSelectionViewMode(options);
    }

    protected _operationsPanelExpandedChanged(event: SyntheticEvent, state: boolean): void {
        this._operationsPanelExpanded = state;
        this._notify('operationsPanelExpandedChanged', [state]);
        this._setSelectionViewMode(this._options);
    }

    protected _actionClick(event: SyntheticEvent, item: Model, nativeEvent: MouseEvent): void {
        this._notify('operationsPanelItemClick', [
            item,
            nativeEvent,
            this._operationsController.getSelection(),
        ]);
    }

    protected _beforeUnmount(): void {
        if (this._operationsController) {
            this._operationsController.destroy();
            this._operationsController.unsubscribe(
                'selectionViewModeChanged',
                this._selectionViewModeChanged
            );
            this._operationsController.unsubscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged
            );
            this._operationsController.unsubscribe('actionClick', this._actionClick);
            this._operationsController = null;
        }
        this._rootLoadPromise = null;

        const searchController = this._getSearchControllerSync();

        if (searchController) {
            searchController.destroy();
        }
        this._items?.unsubscribe('onCollectionChange', this._onCollectionChange);
        this._dataLoader.each((config, id) => {
            if (config instanceof Object && config.sourceController) {
                const sourceController = this._getSourceController(id);
                if (sourceController) {
                    sourceController.unsubscribe('rootChanged', this._rootChanged);
                    sourceController.unsubscribe('dataLoadStarted', this._dataLoadStart);
                    sourceController.unsubscribe('dataLoadError', this._dataLoadErrback);
                    sourceController.unsubscribe('sortingChanged', this._sortingChanged);
                    sourceController.unsubscribe('itemsChanged', this._itemsChanged);
                    sourceController.unsubscribe('filterChanged', this._filterChanged);
                }
            }
        });

        if (this._errorRegister) {
            this._errorRegister.destroy();
            this._errorRegister = null;
        }

        this._unsubscribeFromStoreChanges();

        const hasSourceController = Browser._hasInOptions(this._options, ['sourceController']);
        if (!hasSourceController) {
            this._dataLoader.destroy();
        }
    }

    private _getErrorRegister(): RegisterClass {
        if (!this._errorRegister) {
            this._errorRegister = new RegisterClass({ register: 'dataError' });
        }
        return this._errorRegister;
    }

    private _getRootChangedRegister(): RegisterClass {
        if (!this._rootChangedRegister) {
            this._rootChangedRegister = new RegisterClass({
                register: 'rootChanged',
            });
        }
        return this._rootChangedRegister;
    }

    private _setSelectionViewMode(options: IBrowserOptions): void {
        if (isLoaded('Controls/operations')) {
            const { getSelectionViewMode } =
                loadSync<typeof import('Controls/operations')>('Controls/operations');
            const sourceController = this._getSourceController();
            this._selectionViewMode = getSelectionViewMode(this._selectionViewMode, {
                ...options,
                isAllSelected: this._isAllSelected,
                sourceController,
            });

            if (this._selectionViewMode !== 'selected') {
                this._showSelectedCount = null;
                this._selectionBeforeShowSelectedApply = null;
                this._listCommandsSelection = this._getListCommandsSelection(options);
            }
        }
    }

    private _getListCommandsSelection(browserOptions: IBrowserOptions): ISelectionObject {
        if (browserOptions.selectedKeys && browserOptions.excludedKeys) {
            return getListCommandsSelection(
                browserOptions,
                this._listMarkedKey,
                this._selectionBeforeShowSelectedApply
            );
        }
    }

    private _setItemsAndUpdateContext(
        options: IBrowserOptions,
        receiveState: boolean = false
    ): void {
        this._updateItemsOnState();
        this._subscribeOnControllersEvents(options);
        if (options.useStore) {
            this._updateFilterItemsInStore(options);
        }
        this._updateContext(options);
    }

    private _subscribeOnSourceControllerEvents(options: IBrowserOptions): void {
        const sourceController = this._getSourceController();
        this._dataLoader.each((config, id) => {
            this._getSourceController(id)?.subscribe('rootChanged', this._rootChanged);
            if (options.task1187611584) {
                this._getSourceController(id)?.subscribe('filterChanged', this._filterChanged);
            }
        });
        sourceController.subscribe('dataLoadStarted', this._dataLoadStart);
        sourceController.subscribe('dataLoadError', this._dataLoadErrback);
        sourceController.subscribe('sortingChanged', this._sortingChanged);
        sourceController.subscribe('itemsChanged', this._itemsChanged);
    }

    private _subscribeOnFilterControllerEvents(): void {
        // Для совместимости, пока контролы вынуждены работать и от опций и от настроек на странице
        // + пока нет виджета filter/View
        this._dataLoader.getFilterController().subscribe('filterSourceChanged', () => {
            const currentFilter = this._filter;
            this._updateFilterAndFilterItems(this._options);
            this._updateFilterItemsInStore(this._options);
            if (!isEqual(currentFilter, this._filter)) {
                this._filterChanged(null, this._filter);
            }
        });
    }

    private _subscribeOnControllersEvents(options: IBrowserOptions): void {
        this._subscribeOnSourceControllerEvents(options);

        if (this._hasFilterSourceInOptions(options)) {
            this._subscribeOnFilterControllerEvents();
        }
    }

    private _updateItemsOnState(): void {
        // TODO items надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
        const sourceControllerItems = this._getSourceController().getItems();
        if (!this._items || this._items !== sourceControllerItems) {
            this._items?.unsubscribe('onCollectionChange', this._onCollectionChange);
            this._items = sourceControllerItems;
            this._items?.subscribe('onCollectionChange', this._onCollectionChange);
        }
    }

    private _onCollectionChange(
        event: SyntheticEvent,
        action: string,
        newItems: Model[],
        newItemsIndex: number[],
        oldItems: Model[]
    ): void {
        if (action === 'rm' && oldItems.length) {
            if (!this._items.getCount()) {
                if (this._selectionViewMode !== 'hidden' || this._showSelectedCount) {
                    this._selectedTypeChangedHandler(null, 'all');
                }
            } else if (this._showSelectedCount) {
                this._showSelectedCount -= oldItems.length;
            }
        }
    }

    private _itemsChanged(): void {
        this._updateContext();
    }

    protected _getSourceController(id?: string): SourceController {
        return this._dataLoader.getSourceController(id);
    }

    protected _cancelLoading(): void {
        this._dataLoader.each((config) => {
            if (config instanceof Object && config.sourceController) {
                config.sourceController.cancelLoading();
            }
        });
    }

    private _getSearchController(id?: string): Promise<SearchController> {
        return this._dataLoader.getSearchController(id);
    }

    private _getSearchControllerSync(id?: string): SearchController {
        return this._dataLoader.getSearchControllerSync(id);
    }

    private _callSearchController<T>(
        callback: (controller: SearchController) => T
    ): T | Promise<T> {
        const dataLoader = this._dataLoader;
        if (dataLoader.getSearchControllerSync()) {
            return callback(dataLoader.getSearchControllerSync());
        } else {
            return this._getSearchController().then(callback);
        }
    }

    protected _handleItemOpen(root: Key, items: RecordSet): void {
        const currentRoot = this._root;
        const searchController = this._getSearchControllerSync();

        if (this._isSearchViewMode() && this._options.searchNavigationMode === 'expand') {
            this._notify('expandedItemsChanged', [
                searchController.getExpandedItemsForOpenRoot(root, items),
            ]);

            if (!this._deepReload) {
                this._deepReload = true;
            }
        } else if (!this._options.hasOwnProperty('root')) {
            searchController?.setRoot(root);
            this._root = root;
        }
        if (root !== currentRoot) {
            this._resetSearchOnRootChanged();
        }
    }

    private _resetSearchOnRootChanged(): void {
        let hasSearch = false;

        this._inputSearchValue = '';
        this._listsOptions.forEach(({ id }) => {
            const searchController = this._getSearchControllerSync(id);
            if (searchController && this._searchValue) {
                searchController.resetSavedRootBeforeSearch();
                hasSearch = true;
            }
        });

        if (hasSearch) {
            this._resetSearch();
            if (this._options.useStore) {
                getStore().sendCommand('resetSearch');
            }
        }
    }

    private _isSearchViewMode(): boolean {
        return this._viewMode === 'search';
    }

    protected _dataLoadStart(event: SyntheticEvent, direction: Direction): void {
        if (!direction && !this._options.listsOptions) {
            this._loading = true;
        }
    }

    protected _filterChanged(
        event: SyntheticEvent,
        filter: QueryWhereExpression<unknown>,
        id?: string
    ): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        const hasFilterInOptions = Browser._hasInOptions(this._options, ['filter']);
        const listOptions = this._getListOptionsById(id);
        const filterController = this._dataLoader.getFilterController(id);
        if (filterController) {
            filterController.setFilter(filter);
            filter = filterController.getFilter();
        }
        if (listOptions && id) {
            listOptions.filter = listOptions.filter || filter;
        }
        if (!hasFilterInOptions || !this._options.task1182865383) {
            this._filter = filter;
        }
        if (!hasFilterInOptions) {
            // _filter - состояние, которое используется, когда не передают опцию filter.
            // это состояние не рекативное, т.к. в шаблоне не используется
            // из-за этого необходимо звать _forceUpdate
            this._forceUpdate();
        }
        this._selectionViewMode = 'hidden';
        this._notify('filterChanged', [filter, id]);
    }

    protected _breadCrumbsItemClick(event: SyntheticEvent, root: Key): void {
        this._getRootChangedRegister().start(root);
    }

    _beforeRootChanged(event: SyntheticEvent, root: TKey, id: string): void {
        const sourceController = this._getSourceController(id);
        const loadPromises = this._rootLoadPromise;
        if (
            this._options.preloadData &&
            !loadPromises[root] &&
            sourceController &&
            !sourceController.isLoading()
        ) {
            loadPromises[root] = {
                listId: id,
                loadPromise: sourceController
                    .load(undefined, root, undefined, false)
                    .catch((error) => {
                        return error;
                    }),
            };
        }
    }

    protected _rootChanged(event: SyntheticEvent, root: Key, id?: string): void {
        const searchController = this._getSearchControllerSync(id);
        let currentRoot;

        if (id && this._getListOptionsById(id)?.root !== undefined) {
            currentRoot = this._getListOptionsById(id)?.root;
        } else {
            currentRoot = this._root;
        }

        if (!Browser._hasRootInOptions(this._options, id)) {
            this._setRoot(root, id);
            // Стейт _root не реактивный, поэтому необходимо звать forceUpdate
            this._forceUpdate();
        }
        if (this._isMounted && currentRoot !== root) {
            this._notify('rootChanged', [root, id]);
        }
        if (
            !searchController?.isSearchInProcess() &&
            searchController?.getRoot() !== root &&
            this._options.resetSearchOnRootChanged
        ) {
            this._resetSearchOnRootChanged();
        }
    }

    protected _setRoot(root: Key, id?: string): void {
        const listOptions = this._getListOptionsById(id);
        if (listOptions && id) {
            this._listsOptions = object.clonePlain(this._listsOptions);
            this._getListOptionsById(id).root = root;
        } else {
            this._root = root;
        }
    }

    protected _getListOptionsById(id: string): IListConfiguration | void {
        return this._listsOptions.find((options: IBrowserOptions) => {
            return options.id === id;
        });
    }

    protected _sortingChanged(event: SyntheticEvent, sorting: Key, id?: string): void {
        this._notify('sortingChanged', [sorting, id]);
    }

    protected _historySaveCallback(historyData: Record<string, any>, items: IFilterItem[]): void {
        const history = historyData[this._options.historyId] || historyData;
        if (this._historySaveCallbackOption) {
            this._historySaveCallbackOption(history, items);
        } else if (this._mounted && !this._destroyed) {
            this?._notify('historySave', [history, items]);
        }
    }

    protected _filterItemsChanged(event: SyntheticEvent, items: IFilterItem[]): void {
        if (!this._hasFilterSourceInOptions(this._options)) {
            Logger.error(
                'Browser: для корректной работы фильтра необходимо передать опцию filterButtonSource',
                this
            );
        }
        this._listsOptions.forEach(({ id, filterButtonSource }) => {
            if (filterButtonSource) {
                const filterController = this._dataLoader.getFilterController(id);
                filterController.updateFilterItems(items);
                const newFilter = filterController.getFilter();
                const filterChanged = !isEqual(this._filter, newFilter);

                if (filterChanged || this._listsOptions.length > 1) {
                    this._filterChanged(null, newFilter, id);
                }
            }
        });
    }

    private _contextChangedCallback(state): void {
        Object.keys(state).forEach((key) => {
            this._dataLoader.updateState(key, state[key]);
        });
        this._updateContext();
    }

    protected _defineMultiSelectVisibility(options: IBrowserOptions): void {
        let multiSelectVisibility = options.multiSelectVisibility;

        const hasOperationsPanel =
            options.hasOwnProperty('operationsPanel') ||
            options.hasOwnProperty('newOperationsPanel');
        // Если multiSelectVisibility пришло сверху, то оставляем прикладную логику,
        // иначе работаем от условия: Если в опциях передали operationsPanel или
        // operationsPanel нет в опциях, но есть selectedKeys или excludedKeys. то:
        // При закрытой ПМО видимость чекбоксов - "по ховеру".
        // При закрытой ПМО видимость чекбоксов - "по ховеру".
        // При открытой ПМО все чекбоксы "видимые"
        if (
            !multiSelectVisibility &&
            ((hasOperationsPanel && (options.operationsPanel || options.newOperationsPanel)) ||
                (!hasOperationsPanel && (options.selectedKeys || options.excludedKeys)))
        ) {
            const operationsPanelVisible =
                this._getOperationsController(options).getOperationsPanelVisible();
            multiSelectVisibility =
                this._operationsPanelExpanded && operationsPanelVisible ? 'visible' : 'onhover';
        }
        if (this._multiSelectVisibility !== multiSelectVisibility) {
            this._multiSelectVisibility = multiSelectVisibility;
        }
    }

    private _updateContext(options: IBrowserOptions = this._options): void {
        if (this._contextState && this._options.disableContextUpdate) {
            return;
        }

        const sourceControllerState = this._getSourceController().getState();
        const operationsController = this._getOperationsController();
        const dataLoader = this._dataLoader;
        const dataLoaderState = dataLoader.getState();

        this._contextState = {
            ...sourceControllerState,
            ...dataLoaderState,
            listsConfigs: dataLoader.getState(),
            listsSelectedKeys: operationsController.getSelectedKeysByLists(),
            listsExcludedKeys: operationsController.getExcludedKeysByLists(),
            operationsController,
            filterController: dataLoader.getFilterController(),
            searchMisspellValue: this._searchMisspellValue,
            __isBrowser: true,
        };
    }

    protected _filterHistoryApply(event: SyntheticEvent, history: THistoryData): void {
        this._listsOptions.forEach(({ id, filterButtonSource, historyId }) => {
            if (filterButtonSource && historyId) {
                this._dataLoader.getFilterController(id).updateHistory(history);
            }
        });
    }

    private _updateFilterAndFilterItems(options: IBrowserOptions): void {
        if (this._hasFilterSourceInOptions(options)) {
            const filterController = this._dataLoader.getFilterController();
            this._filter = filterController.getFilter() as QueryWhereExpression<unknown>;
            this._filterButtonItems = filterController.getFilterButtonItems();
        } else {
            this._filter = options.filter || {};
        }
    }

    private _updateFilterItemsInStore(options: IBrowserOptions): void {
        if (options.useStore) {
            const filterItems = getStore().getState().filterSource;
            const filterButtonItems = this._dataLoader
                ?.getFilterController()
                ?.getFilterButtonItems();
            if (
                this._hasFilterSourceInOptions(options) &&
                filterButtonItems &&
                !isEqual(filterItems, filterButtonItems)
            ) {
                // При переключении вкладок маунт Browser'a срабатывает раньше чем разрушится контент другой вкладки
                // и там тоже может быть Browser, который слушает изменения в Store
                filterButtonItems.historyId = options.historyId;
                // у двух реестров может быть одинаковый historyId, но разная структура фильтров
                filterButtonItems.sourceController = options.sourceController;
                getStore().dispatch('filterSource', filterButtonItems);
            }
        }
    }

    protected _processLoadError(error: Error): void {
        if (error && !error.isCanceled) {
            this._onDataError(null, {
                error,
                mode: ErrorViewMode.include,
            } as TErrbackConfig);
        }
    }

    protected _onDataError(event: SyntheticEvent, errbackConfig: TErrbackConfig): void {
        this._getErrorRegister().start(errbackConfig);
    }

    protected _registerHandler(
        event: Event,
        registerType: string,
        component: unknown,
        callback: Function,
        config: object
    ): void {
        this._getErrorRegister().register(event, registerType, component, callback, config);
        this._getOperationsController().registerHandler(
            event,
            registerType,
            component,
            callback,
            config
        );
        this._getRootChangedRegister().register(event, registerType, component, callback, config);
    }

    protected _unregisterHandler(
        event: Event,
        registerType: string,
        component: unknown,
        config: object
    ): void {
        this._getErrorRegister().unregister(event, registerType, component, config);
        this._getOperationsController().unregisterHandler(event, registerType, component, config);
        this._getRootChangedRegister().unregister(event, registerType, component, config);
    }

    protected _selectedTypeChangedHandler(
        event: SyntheticEvent<null>,
        typeName: string,
        limit?: number
    ): void {
        this._getOperationsController().selectionTypeChanged(typeName, limit);
    }

    protected _selectedKeysCountChanged(
        e: SyntheticEvent,
        count: number | null,
        isAllSelected: boolean,
        id?: string
    ): void {
        e.stopPropagation();
        const result = this._getOperationsController().updateSelectedKeysCount(
            count,
            isAllSelected,
            id || this._options.storeId
        );
        this._selectedKeysCount = result.count;
        this._isAllSelected = result.isAllSelected;
    }

    protected _listSelectionTypeForAllSelectedChanged(
        event: SyntheticEvent,
        selectionType: TSelectionType
    ): void {
        event.stopPropagation();
        this._selectionType = selectionType;
    }

    protected _excludedKeysChanged(
        event: SyntheticEvent,
        ...args: [TKey[], TKey[], TKey[], string?]
    ): void {
        args[0] = args[3] ? this._getOperationsController().updateExcludedKeys(...args) : args[0];
        this._notify('excludedKeysChanged', args);
    }

    protected _selectedKeysChanged(
        event: SyntheticEvent,
        ...args: [TKey[], TKey[], TKey[], string?]
    ): void {
        args[0] = args[3] ? this._getOperationsController().updateSelectedKeys(...args) : args[0];
        this._notify('selectedKeysChanged', args);
    }

    protected _itemOpenHandler(newCurrentRoot: Key, items: RecordSet, dataRoot: Key = null): void {
        this._getOperationsController().itemOpenHandler(newCurrentRoot, items, dataRoot);
        this._handleItemOpen(newCurrentRoot, items, dataRoot);
        if (this._options.itemOpenHandler instanceof Function) {
            return this._options.itemOpenHandler(newCurrentRoot, items, dataRoot);
        }
    }

    protected _listMarkedKeyChangedHandler(event: SyntheticEvent<null>, markedKey: TKey): unknown {
        this._listMarkedKey = this._getOperationsController().setListMarkedKey(markedKey);
        this._listCommandsSelection = this._getListCommandsSelection(this._options);
        return this._notify('markedKeyChanged', [markedKey]);
    }

    protected _markedKeyChangedHandler(event: SyntheticEvent<null>): void {
        event.stopPropagation();
    }

    protected _operationsPanelOpen(
        event: unknown,
        callback?: (actionParams: { id?: string; actionName?: string }) => void
    ): void {
        this._listMarkedKey = this._getOperationsController().setOperationsPanelVisible(true);
        this._listCommandsSelection = this._getListCommandsSelection(this._options);
        this._defineMultiSelectVisibility(this._options);
        // При открытии ПМО в callback приходит функция из OperationsPanel,
        // Которая позволяет выполнить прикладной обработчик действия.
        this._callListActionCallback = callback;
    }

    protected _operationsPanelClose(): void {
        this._getOperationsController().setOperationsPanelVisible(false);
        this._defineMultiSelectVisibility(this._options);
        if (this._selectionViewMode !== 'hidden') {
            this._selectedTypeChangedHandler(null, 'all');
        }
    }

    /**
     * Обработчик события списка, позволяющий вызвать прикладную обработку действия ПМО.
     * Используется, когда в списке нажали, например, клавишу del
     * @param event
     * @param actionParams
     * @protected
     */
    protected _onCallListAction(
        event: SyntheticEvent,
        actionParams: { id?: string; actionName?: string }
    ): void {
        // Этот колбек устанавливается, как только открылось ПМО.
        if (this._callListActionCallback) {
            this._callListActionCallback(actionParams);
        }
        event.stopPropagation();
    }

    private _createOperationsController(options: IBrowserOptions): OperationsController {
        const controller = options.operationsController || new OperationsController({ ...options });
        controller.subscribe('selectionViewModeChanged', this._selectionViewModeChanged);
        controller.subscribe('operationsPanelVisibleChanged', this._operationsPanelExpandedChanged);
        controller.subscribe('actionClick', this._actionClick);
        return controller;
    }

    private _getOperationsController(
        options?: IBrowserOptions = this._options
    ): OperationsController {
        if (!this._operationsController) {
            this._operationsController = this._createOperationsController(options);
        }

        return this._operationsController;
    }

    private _defineShadowVisibility(items: RecordSet | Error | void): void {
        if (detection.isMobilePlatform) {
            // На мобильных устройствах тень верхняя показывается, т.к. там есть уже загруженные данные вверху
            return;
        }

        if (items instanceof RecordSet) {
            const more = items.getMetaData().more;
            if (more) {
                this._topShadowVisibility = more.before ? 'gridauto' : SHADOW_VISIBILITY.AUTO;
                this._bottomShadowVisibility = more.after ? 'gridauto' : SHADOW_VISIBILITY.AUTO;
            }
        }
    }

    private _defineItemsOrder(itemsOrder: TItemsOrder | void, useStore?: boolean): void {
        if (itemsOrder && this._itemsOrder !== itemsOrder) {
            if (useStore) {
                getStore().dispatch('itemsOrderChanged', itemsOrder);
            }
            this._itemsOrder = itemsOrder;
        }
    }

    private _getSourceControllerOptions(options: IListConfiguration): ISourceControllerOptions {
        const root = options.id && options.root !== undefined ? options.root : this._root;
        let filter;

        if (options.id && this._listsOptions?.length > 1) {
            filter =
                this._dataLoader?.getFilterController(options.id)?.getFilter() || options.filter;
        } else {
            filter = this._filter;
        }

        return {
            filter,
            navigationParamsChangedCallback: this._notifyNavigationParamsChanged,
            dataLoadCallback: this._dataLoadCallback,
            root,
            sorting: options.sorting,
        };
    }

    private _getDataLoaderOptions(
        options: IBrowserOptions,
        receivedState?: TReceivedState
    ): IDataLoaderOptions {
        const loadDataConfigs = Browser._getListsOptions(options).map((listOptions, index) => {
            const listOptionsForDataLoader = {
                ...listOptions,
                id: listOptions.id ?? options.storeId ?? index,
                ...this._getSourceControllerOptions(listOptions),
                type: 'list',
                searchValue: this._getSearchValue(options),
                items: receivedState?.[index]?.data,
                historyItems: receivedState?.[index]?.historyItems || listOptions.historyItems,
                source: receivedState
                    ? this._getOriginalSource(listOptions as IBrowserOptions)
                    : listOptions.source,
                searchStartCallback: this._searchStartCallback,
                sourceController: Browser._getSourceControllerForDataLoader(options, listOptions),
                prefetchSessionId: options.prefetchSessionId,
                historySaveCallback: this._historySaveCallback.bind(this),
                // Чтобы не было утечки памяти
                _dataOptionsValue: null,
                sliceOwnedByBrowser: true,
            };
            delete listOptionsForDataLoader._dataOptionsValue;
            return listOptionsForDataLoader;
        });

        return { loadDataConfigs } as IDataLoaderOptions;
    }

    private _getSearchValue(options: IBrowserOptions): string {
        return options.hasOwnProperty('searchValue') ? options.searchValue : this._searchValue;
    }

    private _getFilterControllerOptions(options: IBrowserOptions): IFilterControllerOptions {
        const { filterButtonSource, filterController } = options;
        const controllerOptions = {
            filterButtonItems: options.fiterButtonItems,
            filterButtonSource: filterButtonSource || filterController?.getFilterButtonItems(),
            filter: options.filter,
            historyId: options.historyId,
            historyItems: options.historyItems,
            historySaveCallback: this._historySaveCallback.bind(this),
            prefetchParams: options.prefetchParams,
            prefetchSessionId: options.prefetchSessionId,
            saveToUrl: options.saveToUrl,
            useStore: options.useStore,
            selectedKeys: options.selectedKeys,
            excludedKeys: options.excludedKeys,
            selectionViewMode: options.selectionViewMode,
            searchParam: options.searchParam,
            minSearchLength: options.minSearchLength,
            source: options.source,
            parentProperty: options.parentProperty,
        };

        if (!this._options.task1187611584) {
            controllerOptions.searchValue = this._getSearchValue(options);
        }
        return controllerOptions as unknown as IFilterControllerOptions;
    }

    private _notifyNavigationParamsChanged(params: unknown): void {
        if (this._isMounted && !this._destroyed) {
            this._notify('navigationParamsChanged', [params]);
        }
    }

    private _searchStartCallback(filter: QueryWhereExpression<unknown>): void {
        if (this._isMounted) {
            this._notify('searchStart', [filter]);
        }
    }

    private _getOriginalSource(options: IBrowserOptions): ICrudPlus | (ICrud & ICrudPlus & IData) {
        let source;

        if (options.source instanceof PrefetchProxy) {
            source = options.source.getOriginal();
        } else {
            source = options.source;
        }

        return source;
    }

    protected _search(event: SyntheticEvent, value: string): Promise<Error | RecordSet[] | void> {
        const searchPromises = [];
        const searchCallback = (id: string, index: number): void => {
            if (!this._destroyed) {
                this._afterSourceLoad(
                    this._getSourceController(id),
                    this._listsOptions[index] as IBrowserOptions
                );
                this._updateItemsOnState();
            }
        };

        this._selectionViewMode = 'hidden';
        this._inputSearchValue = value;
        event?.stopPropagation();
        this._listsOptions.forEach(({ searchParam, id }, index) => {
            if (searchParam) {
                this._loading = true;
                searchPromises.push(
                    this._dataLoader.getSearchController(id).then((searchController) => {
                        if (!this._destroyed) {
                            return searchController
                                .search(value)
                                .then(() => {
                                    searchCallback(id, index);
                                })
                                .catch((error) => {
                                    if (!error.isCanceled) {
                                        searchCallback(id, index);
                                        return Promise.reject(error);
                                    }
                                })
                                .finally(() => {
                                    if (!this._destroyed) {
                                        this._loading = false;
                                    }
                                });
                        }
                    })
                );
            }
        });

        return Promise.all(searchPromises).catch((error) => {
            return this._processSearchError(error);
        });
    }

    private _resetSearch(): void {
        const configsCount = Object.keys(this._dataLoader.getState()).length;

        if (configsCount > 1) {
            this._dataLoader.each((config) => {
                if (config instanceof Object && config.sourceController) {
                    const sourceController = config?.sourceController;
                    const searchController = config?.searchController;
                    const id = config.id;
                    const newFilter = searchController?.reset(true);
                    sourceController?.cancelLoading();
                    if (searchController && !isEqual(sourceController?.getFilter(), newFilter)) {
                        this._filterChanged(null, newFilter, id);
                    }
                }
            });
        } else {
            const filter = this._getSearchControllerSync().reset(true);
            if (!isEqual(this._filter, filter)) {
                this._filterChanged(null, filter);
            }
        }

        this._setSearchValue('');
        this._returnedOnlyByMisspellValue = false;
    }

    protected _inputSearchValueChanged(event: SyntheticEvent, value: string): void {
        this._inputSearchValue = value;
        this._getSearchControllerSync()?.setInputSearchValue(value);
    }

    private _processSearchError(error: Error): void | Error {
        if (!error.isCanceled) {
            this._loading = false;
            this._updateParams();
            this._filterChanged(null, this._dataLoader.getSearchControllerSync().getFilter());
            this._getErrorRegister().start({
                error,
                mode: ErrorViewMode.include,
            });
            return error;
        }
    }

    private _searchResetHandler(): void {
        this._cancelLoading();
        this._callSearchController(() => {
            if (!this._destroyed) {
                this._resetSearch();
                this._updateRootAfterSearch();
            }
        });
    }

    private _afterSearch(recordSet: RecordSet, id?: string): void {
        this._updateParams(id);
        this._filterChanged(null, this._getSearchControllerSync(id).getFilter(), id);
        this._updateContext();
    }

    private _setMisspell(items: RecordSet, id: string): void {
        const search = loadSync<typeof import('Controls/search')>('Controls/search');
        // Состояние для работы с Controls-widgets/newBrowser:View, который частично работает через контекст
        this._searchMisspellValue = search.getSwitcherStrFromData(items);
        this._misspellValue = search.getSwitcherStrFromData(items);
        this._returnedOnlyByMisspellValue =
            this._getSearchControllerSync(id).needChangeSearchValueToSwitchedString(items) &&
            !!this._misspellValue;
    }

    private _setSearchValue(value: string): void {
        this._setSearchValueAndNotify(value);
    }

    private _setSearchValueAndNotify(value: string): void {
        this._searchValue = value;
        this._notify('searchValueChanged', [value]);
    }

    private _updateParams(id?: string): void {
        if (this._viewMode !== 'search') {
            this._updateViewMode('search');
            this._updateRootAfterSearch(id);
        }
        this._setSearchValue(this._getSearchControllerSync(id).getSearchValue());
    }

    private _updateRootAfterSearch(id?: string): void {
        const newRoot = this._getSearchControllerSync(id).getRoot();

        if (newRoot !== this._root) {
            this._rootChanged(null, newRoot);
        }
    }

    private _updateViewMode(newViewMode: TViewMode): void {
        this._previousViewMode = this._viewMode;
        this._viewMode = newViewMode;
    }

    private _handleDataLoad(data: RecordSet, direction?: Direction, id?: string): void {
        const searchController = this._getSearchControllerSync(id);
        const sourceController = this._getSourceController(id);

        if (this._deepReload) {
            this._deepReload = undefined;
        }

        if (this._loading) {
            this._afterSourceLoad(sourceController, this._options);
            this._loading = false;
        }

        if (!direction && (this._selectionViewMode === 'selected' || this._showSelectedCount)) {
            this._selectionViewMode = 'hidden';
            this._setSelectionViewMode(this._options);
        }

        if (searchController) {
            // В случае, если на поиск происходит через виджет на странице,
            // то Browser не обновит searchValue и в списке не будет работать подсветка,
            // для совместимости (которая сейчас включается опцией task1187611584),
            // проставляем searchValue из фильтра
            const newSearchValue = this._options.task1187611584
                ? sourceController.getFilter()[this._options.searchParam] || ''
                : searchController.getSearchValue();

            if (!direction) {
                this._setMisspell(data, id);
            }

            if (
                !this._options.task1187611584 &&
                (searchController.isSearchInProcess() || newSearchValue !== this._searchValue)
            ) {
                this._afterSearch(data, id);
            } else if (this._options.task1187611584) {
                this._searchValue = newSearchValue;
            }
        }

        if (this._isSearchViewMode() && !this._searchValue) {
            this._updateViewMode(this._previousViewMode);
            this._previousViewMode = null;
        }
    }

    private _dataLoadCallback(
        data: RecordSet,
        direction?: Direction,
        id?: string,
        navigationSourceConfig?: INavigationSourceConfig
    ): void {
        if (!this._destroyed) {
            const filterController = this._dataLoader.getFilterController(id);

            if (this._isMounted) {
                filterController?.handleDataLoad(data);

                if (id && filterController) {
                    const listOptions = this._getListOptionsById(id);

                    if (
                        listOptions.prefetchParams &&
                        !isEqual(listOptions.filter, filterController.getFilter())
                    ) {
                        this._filterChanged(null, filterController.getFilter(), id);
                    }
                }
            }

            this._handleDataLoad(data, direction, id);

            if (this._options.dataLoadCallback) {
                this._options.dataLoadCallback(data, direction, id, navigationSourceConfig);
            }
        }
    }

    private _dataLoadErrback(
        event: SyntheticEvent,
        error: Error,
        key?: TKey,
        direction?: Direction,
        id?: string
    ): void {
        this._dataLoader.getFilterController(id)?.handleDataError();
    }

    private _reload(options: IBrowserOptions, id?: string): Promise<RecordSet> {
        const sourceController = this._getSourceController(id);

        return sourceController
            .reload()
            .then((items) => {
                this._updateItemsOnState();
                return items;
            })
            .catch((error) => {
                this._processLoadError(error);
                return error;
            })
            .finally(() => {
                if (!this._destroyed) {
                    this._loading = false;
                    this._afterSourceLoad(sourceController, options);
                }
            })
            .then((result) => {
                const isLoadCanceled = result instanceof Error && result.isCanceled;
                if (!this._destroyed && options.searchParam && !isLoadCanceled) {
                    return this._updateSearchController(options, id).then(() => {
                        return result;
                    });
                }
            });
    }

    _misspellCaptionClick(): void {
        if (this._options.useStore) {
            getStore().dispatch('searchValue', this._misspellValue);
        } else {
            this._search(null, this._misspellValue);
        }
        this._misspellValue = '';
    }

    resetPrefetch(): void {
        this._listsOptions.forEach(({ prefetchParams, id }, index) => {
            if (prefetchParams && !this._getSourceController(id).isLoading()) {
                const filterController = this._dataLoader.getFilterController(id);
                filterController.resetPrefetch();
                this._filterChanged(null, filterController.getFilter(), id);
            }
        });
    }

    getFilterController(listId?: string): FilterControllerClass {
        return this._dataLoader.getFilterController(listId);
    }

    private _hasFilterSourceInOptions(options: IBrowserOptions): boolean {
        return (
            Browser._hasInOptions(options, ['filterButtonSource', 'selectionViewMode']) ||
            (!!this._getSearchValue(options) && !options.filter?.[options.searchParam])
        );
    }

    private static _getSourceControllerForDataLoader(
        { sourceController, _dataOptionsValue }: IBrowserOptions,
        listOptions?: IListConfiguration
    ): SourceController | void {
        let browserSourceController;

        // Поддержка для работы Browser'a, вложенного в Browser
        // Сейчас для этого внутреннему Browser'у в опциях явно задают sourceController как null,
        // чтобы он не получал от внешнего Browser'a sourceController
        // До 22.4000 работало, т.к. в Browser'e не было consumer'a
        if (sourceController !== undefined) {
            browserSourceController = sourceController;
        }

        if (!browserSourceController && listOptions) {
            browserSourceController = listOptions.sourceController;
        }

        return browserSourceController;
    }

    private static _checkLoadResult(
        options: IBrowserOptions,
        loadResult: IReceivedState[] = []
    ): boolean {
        const listsOptions = Browser._getListsOptions(options);
        const syncMountByReceivedState =
            loadResult?.filter((result, index) => {
                return (
                    (!listsOptions[index].filterButtonSource ||
                        result.historyItems !== undefined) &&
                    result.data !== undefined &&
                    !result.error
                );
            }).length > 0;
        const syncMountByOptions =
            !!options.sourceController ||
            listsOptions.filter(({ sourceController }) => {
                return !!sourceController;
            }).length === listsOptions.length;

        return syncMountByReceivedState || syncMountByOptions;
    }

    private static _getListsOptions(options: IBrowserOptions): IListConfiguration[] {
        return options.listsOptions || [{ ...options }];
    }

    private static _hasInOptions(
        browserOptions: IBrowserOptions,
        options: string[],
        id?: string
    ): boolean {
        return options.some((option) => {
            return (
                Browser._getListsOptions(browserOptions).filter((listOptions) => {
                    if (id !== undefined) {
                        if (listOptions.id !== id) {
                            return false;
                        }
                    }
                    return listOptions[option] !== undefined;
                }).length > 0
            );
        });
    }

    private static _hasSearchParamInOptions(options: IBrowserOptions): boolean {
        return Browser._hasInOptions(options, ['searchParam']);
    }

    private static _hasRootInOptions(options: IBrowserOptions, id: string): boolean {
        return Browser._hasInOptions(options, ['root'], id);
    }

    static getDefaultOptions(): object {
        return {
            minSearchLength: 3,
            searchDelay: 500,
            startingWith: 'root',
            filter: {},
            resetSearchOnRootChanged: true,
        };
    }

    static getOptionTypes(): object {
        return {
            searchValue: descriptor(String),
        };
    }
}

/**
 * @name Controls/browser:Browser#listOptions
 * @cfg {Array.<Controls/browser:IBrowser>} Конфигурация для настройки списка в браузере.
 * @see Controls/browser:IBrowser
 */
