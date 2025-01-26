/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */
import { QueryWhereExpression } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { NewSourceController } from 'Controls/dataSource';
import { Model } from 'Types/entity';
import { Logger } from 'UI/Utils';
import {
    IHierarchyOptions,
    ISearchOptions,
    TKey,
    ISearchValueOptions,
    INavigationOptions,
    INavigationSourceConfig,
    IFilterOptions,
} from 'Controls/interface';
// eslint-disable-next-line deprecated-anywhere
import { IHierarchySearchOptions } from 'Controls/_searchDeprecated/IHierarchySearch';
import { factory as chainFactory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { TViewMode } from 'Controls-DataEnv/interface';

export interface ISearchControllerOptions
    extends ISearchOptions,
        IHierarchyOptions,
        IHierarchySearchOptions,
        ISearchValueOptions,
        INavigationOptions<INavigationSourceConfig>,
        IFilterOptions {
    sourceController?: NewSourceController;
    root?: TKey;
    viewMode?: TViewMode;
    items?: RecordSet;
    searchStartCallback?: Function;
    deepReload?: boolean;
    addItemsAfterSearch?: boolean;
    filterOnSearchCallback?: (searchValue: string, item: Model) => boolean;
}

function getSearchResolver(): typeof import('Controls/search').FilterResolver {
    return loadSync<typeof import('Controls/search')>('Controls/search').FilterResolver;
}

/**
 * Класс контроллер, реализующий поиск по заданному значению, либо сброс поиска.
 * Имеется возможность поиска в дереве и плоском списке.
 * @remark
 * Если при инициализации экземпляра класса не передавать опцию sourceController,
 * то рекомендуется его передать в опциях в метод {@link /docs/js/Controls/search/ControllerClass/methods/update/ ControllerClass#update}, иначе при попытке поиска или сброса возникнут ошибки.
 * Если в методе update в опциях передать новые sourceController и searchValue, то поиск или сброс будут произведены
 * на новом sourceController.
 * Если же передать только новый sourceController, то будет произведен поиск или сброс по старому searchValue.
 * Поле, переданное через опцию searchParam, при сбросе поиска будет удалено из фильтра.
 *
 * @example
 * При создании экзепмляра класса можно передать опцией {@link Controls/dataSource:NewSourceController sourceController}
 * <pre>
 * const controllerClass = new ControllerClass({
 *   sourceController: new SourceController(...)
 * });
 * </pre>
 * Поиск по значению "test". Результат поиска в then
 * <pre>
 *    controllerClass.search('test').then((result) => {...});
 * </pre>
 * Сброс поиска. Может вернуть фильтр без загрузки, если предеать аргументом true
 * <pre>
 *    controllerClass.reset().then((result) => {...}); // Будут сброшены все фильтры, результат загрузки в result
 *
 *    const filter = controllerClass.reset(true); // Вернет фильтр после сброса. Загрузка произведена не будет
 * </pre>
 * Обновление контроллера с передачей новых опций
 * <pre>
 *    controllerClass.update({
 *       searchValue: 'new test',
 *       root: 'newRoot'
 *    }).then((result) => {...}); // Результат поиска после передачи нового значения посредством опций
 * </pre>
 *
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:IHierarchy
 * @implements Controls/searchDeprecated:IHierarchySearch
 * @public
 * @demo Controls-demo/Search/FlatList/Index Поиск в плоском списке
 */

export default class ControllerClass {
    protected _options: ISearchControllerOptions = null;

    private _searchValue: string = '';
    private _misspellValue: string = '';
    private _searchInProgress: boolean = false;
    private _sourceController: NewSourceController = null;
    private _searchPromise: Promise<RecordSet | Error>;

    private _root: TKey = null;
    private _rootBeforeSearch: TKey = null;
    private _path: Model[] = null;
    private _hasHiearchyFilterBeforeSearch: boolean = false;
    private _hasRootInFilterBeforeSearch: boolean = false;

    private _viewMode: TViewMode;
    private _previousViewMode: TViewMode;

    constructor(options: ISearchControllerOptions) {
        this._options = options;
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._itemsChanged = this._itemsChanged.bind(this);

        if (options.sourceController) {
            this._initSourceController(options.sourceController);
            this._path = this._sourceController.getState().breadCrumbsItems;
        }

        if (options.searchValue !== undefined) {
            this._setSearchValue(options.searchValue);
        }

        if (options.root !== undefined) {
            this.setRoot(options.root);
        }

        if (options.items) {
            const meta = options.items.getMetaData();
            this._path = meta.path ? (chainFactory(meta.path).toArray() as Model[]) : null;
        }

        this._previousViewMode = this._viewMode = options.viewMode;
    }

    /**
     * Сброс поиска.
     * Производит очистку фильтра, затем загрузку в sourceController с обновленными параметрами.
     * Если аргумент dontLoad установлен в true, то функция вернет просто фильтр без загрузки.
     * @param {boolean} [dontLoad] Производить ли загрузку из источника, или вернуть обновленный фильтр
     */
    reset(): Promise<RecordSet | Error>;
    reset(dontLoad: boolean): QueryWhereExpression<unknown>;
    reset(dontLoad?: boolean): Promise<RecordSet | Error> | QueryWhereExpression<unknown> {
        this._checkSourceController();

        let resetResult;

        this._setSearchValue('');
        this._misspellValue = '';
        this._viewMode = this._previousViewMode;
        this._previousViewMode = null;
        if (this._rootBeforeSearch && this._root !== this._rootBeforeSearch) {
            this._root = this._rootBeforeSearch;
        }
        if (!this._isSearchMode() && this._options.parentProperty) {
            this._sourceController.setRoot(this._root);
        }
        this._rootBeforeSearch = null;
        const filter = this._getFilter();

        if (!dontLoad) {
            this._resetNavigation();
            resetResult = this._updateFilterAndLoad(filter, this._getRoot());
        } else {
            resetResult = filter;
        }
        this._hasHiearchyFilterBeforeSearch = false;
        this._hasRootInFilterBeforeSearch = false;

        return resetResult;
    }

    /**
     * Произвести поиск по значению.
     * @param {string} value Значение, по которому будет производиться поиск
     */
    search(value: string): Promise<RecordSet | Error | null> {
        const newSearchValue = this._trim(value);
        let searchResult;

        this._checkSourceController();

        if (this._viewMode !== 'search') {
            this._previousViewMode = this._viewMode;
            this._viewMode = 'search';
            const filter = this._sourceController.getFilter();
            this._hasHiearchyFilterBeforeSearch = getSearchResolver().hasHierarchyFilter(filter);
            this._hasRootInFilterBeforeSearch = filter.hasOwnProperty(this._options.parentProperty);
        }

        if (this._searchValue !== newSearchValue || (!this._searchPromise && newSearchValue)) {
            this._setSearchValue(newSearchValue);
            this._saveRootBeforeSearch();

            if (this._options.filterOnSearchCallback) {
                this._preFilterItemsAndUpdateFilter(value);
            } else {
                this._resetNavigation();
            }
            searchResult = this._updateFilterAndLoad(this._getFilter(), this._getRoot());
        } else if (this._searchPromise) {
            searchResult = this._searchPromise;
        } else {
            searchResult = Promise.resolve(null);
        }

        return searchResult;
    }

    /**
     * Обновить опции контроллера.
     * Если в новых опциях будет указано отличное от старого searchValue, то будет произведен поиск, или же сброс,
     * если новое значение - пустая строка.
     * @param {Partial<ISearchControllerOptions>} options Новые опции
     * @example
     * Поиск будет произведен по новому значению searchValue через новый sourceController, которые переданы в опциях.
     * <pre>
     *    searchController.update({
     *       sourceController: new SourceController(...),
     *       searchValue: 'new value'
     *    }).then((result) => {...});
     * </pre>
     * Поиск будет произведен по старому значению searchValue, но посредством нового sourceController
     * <pre>
     *    searchController.update({
     *       sourceController: new SourceController(...)
     *    }).then((result) => {...});
     * </pre>
     */
    update(options: Partial<ISearchControllerOptions>): boolean {
        let updateResult = false;
        const searchValue = options.hasOwnProperty('searchValue')
            ? options.searchValue
            : this._options.searchValue;
        const { sourceController, root, filter } = options;
        const rootChanged = root !== this._options.root;
        const filterChanged = !isEqual(
            this._getFilter(filter),
            this._getFilter(this._options.filter)
        );

        // Если фильтр был изменён, то корень, из которого начинался поиск может не попасть под фильтр
        // и сброс поиска приведёт к некорректному результату (окажемся в разделе, которого нет в данных)
        if ((rootChanged && this._root !== root) || filterChanged) {
            this._rootBeforeSearch = null;
        }

        if (rootChanged) {
            this.setRoot(root);
        }

        if (sourceController && sourceController !== this._sourceController) {
            this._initSourceController(sourceController);

            if (searchValue) {
                updateResult = true;
            }
        }

        if (options.hasOwnProperty('searchValue')) {
            if (searchValue !== this._searchValue) {
                updateResult = true;
            }
        }
        // TODO: Должны ли использоваться новые опции в reset или search?
        this._options = {
            ...this._options,
            ...options,
        };
        return updateResult;
    }

    /**
     * Установить корень для поиска в иерархическом списке.
     * @param {string|number|null} value Значение корня
     */
    setRoot(value: TKey): void {
        this._root = value;
    }

    /**
     * Получить корень поиска по иерархическому списку.
     */
    getRoot(): TKey {
        return this._root;
    }

    /**
     * Получить значение по которому производился поиск
     */
    getSearchValue(): string {
        return this._searchValue;
    }

    isSearchInProcess(): boolean {
        return this._searchInProgress;
    }

    getFilter(): QueryWhereExpression<unknown> {
        return this._getFilter();
    }

    setPath(path: RecordSet): void {
        this._path = chainFactory(path).toArray();
    }

    setSourceController(sourceController: NewSourceController): void {
        if (sourceController) {
            this._initSourceController(sourceController);
        } else {
            this._sourceController = null;
        }
    }

    setInputSearchValue(value: string): void {
        if (this.isSearchInProcess()) {
            this._sourceController?.cancelLoading();
        }
    }

    needChangeSearchValueToSwitchedString(items: RecordSet): boolean {
        const metaData = items && items.getMetaData();
        return metaData ? metaData.returnSwitched : false;
    }

    getExpandedItemsForOpenRoot(root: TKey, items: RecordSet): TKey[] {
        const expandedItems = [];
        let item;
        let nextItemKey = root;
        do {
            item = items.getRecordById(nextItemKey);
            nextItemKey = item.get(this._options.parentProperty);
            expandedItems.unshift(item.getId());
        } while (nextItemKey !== this.getRoot());

        return expandedItems;
    }

    getViewMode(): TViewMode {
        return this._viewMode;
    }

    getMisspellValue(): string {
        return this._misspellValue;
    }

    resetSavedRootBeforeSearch(): void {
        this._rootBeforeSearch = null;
    }

    handleDataLoad(items: RecordSet): void {
        this._dataLoadCallback(null, items);
    }

    private _dataLoadCallback(event: unknown, items: RecordSet): void {
        const filter = this._getFilter();
        const sourceController = this._sourceController;
        const isSearchMode = this._isSearchMode();

        if (
            (this.isSearchInProcess() || this._options.addItemsAfterSearch === false) &&
            this._searchValue
        ) {
            this._sourceController.setFilter(filter);
            if (!this._options.deepReload && !sourceController.isExpandAll()) {
                sourceController.setExpandedItems([]);
            }

            if (
                this._options.startingWith === 'root' &&
                !isSearchMode &&
                this._options.parentProperty
            ) {
                const newRoot = getSearchResolver().getRootForSearch(
                    this._path,
                    this._root,
                    this._options.parentProperty,
                    this._options.startingWith
                );

                if (newRoot !== this._root) {
                    this._root = newRoot;
                }
            }

            sourceController.setFilter(this._getFilter());
        } else if (!this._searchValue) {
            this._misspellValue = '';
        }
        if (this._searchValue) {
            this._misspellValue = getSearchResolver().getSwitcherStrFromData(items);
        }
    }

    private _itemsChanged(): void {
        this._path = this._sourceController.getState().breadCrumbsItems;
    }

    private _getFilter(filter?: QueryWhereExpression<unknown>): QueryWhereExpression<unknown> {
        if (this._searchValue) {
            return this._getFilterWithSearchValue(filter);
        } else {
            return this._getFilterWithoutSearchValue(filter);
        }
    }

    private _getRoot(): TKey {
        return getSearchResolver().getRootForSearch(
            this._path,
            this._root,
            this._options.parentProperty,
            this._options.startingWith
        );
    }

    private _setSearchValue(searchValue: string): void {
        this._searchValue = searchValue;
    }

    private _saveRootBeforeSearch(): void {
        if (!this._rootBeforeSearch && this._root !== this._rootBeforeSearch) {
            this._rootBeforeSearch = this._root;
        }
    }

    private _getFilterWithSearchValue(
        searchFilter: QueryWhereExpression<unknown>
    ): QueryWhereExpression<unknown> {
        const sourceController = this._sourceController;
        const filter = {
            ...(searchFilter || sourceController.getFilter()),
        } as QueryWhereExpression<unknown>;
        const { parentProperty, searchParam, startingWith } = this._options;
        return getSearchResolver().getFilterForSearch(
            {
                parentProperty,
                searchParam,
                searchStartingWith: startingWith,
                filter,
                root: this._root,
                breadCrumbsItems: this._path,
                deepReload: this._options.deepReload,
                sourceController,
            },
            this._searchValue,
            this._rootBeforeSearch
        );
    }

    private _getFilterWithoutSearchValue(
        searchFilter?: QueryWhereExpression<unknown>
    ): QueryWhereExpression<unknown> {
        const filter = {
            ...(searchFilter || this._sourceController.getFilter()),
        };
        return getSearchResolver().getResetSearchFilter(
            filter,
            this._options.searchParam,
            this._options.parentProperty,
            !this._hasHiearchyFilterBeforeSearch,
            !this._hasRootInFilterBeforeSearch
        );
    }

    private _updateFilterAndLoad(
        filter: QueryWhereExpression<unknown>,
        root: TKey
    ): Promise<RecordSet | Error> {
        let searchPromise;
        const executeLoad = () => {
            this._sourceController.setRoot(root);
            if (this._searchInProgress) {
                return this._sourceController
                    .load(undefined, undefined, filter, this._options.addItemsAfterSearch)
                    .catch((error) => {
                        if (!error || !error.isCanceled) {
                            this._sourceController.setFilter(filter);
                        }
                        return Promise.reject(error);
                    })
                    .finally(() => {
                        // Проверка на случай, если был запущен новый поиск
                        if (searchPromise === this._searchPromise) {
                            this._searchEnded();
                        }
                    });
            }
        };
        this._searchStarted(filter);

        if (this._options.parentProperty && !isLoaded('Controls/searchBreadcrumbsGrid')) {
            return (searchPromise = this._searchPromise =
                loadAsync('Controls/searchBreadcrumbsGrid').then(() => {
                    return executeLoad();
                }));
        } else {
            return (searchPromise = this._searchPromise = executeLoad());
        }
    }

    private _trim(value: string): string {
        return this._options.searchValueTrim && value ? value.trim() : value;
    }

    private _checkSourceController(): void {
        if (!this._sourceController) {
            Logger.error(
                '_search/ControllerClass: sourceController не обнаружен. ' +
                    'Если sourceController не был передан при инициализации, ' +
                    'то рекомендуется передать его в метод _search/ControllerClass#update'
            );
        }
    }

    private _searchStarted(filter: QueryWhereExpression<unknown>): void {
        this._searchInProgress = true;
        if (this._options.searchStartCallback) {
            this._options.searchStartCallback(filter);
        }
    }

    private _searchEnded(): void {
        this._searchInProgress = false;
        this._searchPromise = null;
    }

    private _isSearchMode(): boolean {
        return !!this._sourceController.getFilter()[this._options.searchParam];
    }

    private _resetNavigation(): void {
        // Перезададим параметры навигации т.к. они могли измениться.
        // Сейчас explorer хранит у себя ссылку на объект navigation и меняет в нем значение position
        // Правим по задаче https://online.sbis.ru/opendoc.html?guid=4f23b2e1-89ea-4a1d-bd58-ce7f9d00b58d
        if (!this._sourceController.isLoading()) {
            this._sourceController.setNavigation(null);
            this._sourceController.setNavigation(this._options.navigation);
        }
    }

    private _preFilterItemsAndUpdateFilter(searchValue: string): RecordSet {
        const sourceController = this._sourceController;
        const items = sourceController.getItems();

        sourceController.setFilter(this._getFilter());
        items.assign(this._preFilterItemsBySearchValue(items, searchValue));
        return items;
    }

    private _preFilterItemsBySearchValue(items: RecordSet, searchValue: string): Model[] {
        return chainFactory(items)
            .filter((item) => {
                return !!this._options.filterOnSearchCallback(searchValue, item);
            })
            .value();
    }

    private _initSourceController(sourceController: NewSourceController): void {
        this._sourceController = sourceController;
        if (this._options.addItemsAfterSearch !== false) {
            this._sourceController.subscribe('dataLoad', this._dataLoadCallback);
        }
        this._sourceController.subscribe('itemsChanged', this._itemsChanged);
    }

    destroy(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe('dataLoad', this._dataLoadCallback);
            this._sourceController.unsubscribe('itemsChanged', this._itemsChanged);
            this._sourceController = null;
        }
        this._options = null;
    }
}

/**
 * @name Controls/_search/ControllerClass#sourceController
 * @cfg {NewSourceController} Экземпляр контроллера источника для выполнения поиска
 */

/**
 * @name Controls/_search/ControllerClass#searchValue
 * @cfg {string} Значение по которому будет осуществляться поиск
 */

/**
 * @name Controls/_search/ControllerClass#root
 * @cfg {string | number | null} Корень для поиска по иерархии
 */
