/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    ICrud,
    ICrudPlus,
    IData,
    PrefetchProxy,
    QueryOrderSelector,
    QueryWhereExpression,
    CrudEntityKey,
    IDecorator,
    ServicePoolCallHandler,
    Rpc,
} from 'Types/source';
import type {
    Direction,
    IBaseSourceConfig,
    IFilterOptions,
    IGroupingOptions,
    IHierarchyOptions,
    INavigationOptions,
    INavigationOptionValue,
    INavigationSourceConfig,
    IPromiseSelectableOptions,
    ISortingOptions,
    ISourceOptions,
    TKey,
    TNavigationPagingMode,
    ISelectFieldsOptions,
    TFilter,
    TSortingOptionValue,
    IIgnoreNavigationConfig,
} from 'Controls/interface';
import type { IQueryParams } from 'Controls/interface';
import type { IReloadItemOptions, TArrayGroupId } from 'Controls/list';
import type { TNodeLoadCallback } from 'Controls/baseTree';
import type { INavigationControllerOptions, INavigationChanges } from './NavigationController';
import type { Path } from './calculatePath';

// @ts-ignore
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
// @ts-ignore
import * as randomId from 'Core/helpers/Number/randomId';
import { RecordSet } from 'Types/collection';
import {
    CancelablePromise,
    EventRaisingMixin,
    Model,
    ObservableMixin,
    Record as EntityRecord,
    relation,
} from 'Types/entity';
import { Logger } from 'UI/Utils';
import { fetch, HTTPStatus } from 'Browser/Transport';
import { Object as EventObject } from 'Env/Event';
import { process } from 'Controls/error';
import { USER } from 'ParametersWebAPI/Scope';

import { CrudWrapper } from './CrudWrapper';
import NavigationController from './NavigationController';
import { isEqual } from 'Types/object';
import { mixin } from 'Types/util';
import groupUtil from './GroupUtil';
import { nodeHistoryUtil } from './nodeHistoryUtil';
import { RecordSetDiffer, calculateAddItemsChanges } from './RecordSetDiffer';
import { calculateBreadcrumbsData } from './calculateBreadcrumbsData';
import { getRecordSetByHierarchyStrategy } from './getRecordSetByHierarchyStrategy';

/**
 * Состояние SourceController
 * @private
 */
export interface IControllerState {
    keyProperty: string;
    source: ICrud | ICrudPlus;

    sorting: QueryOrderSelector;
    filter: QueryWhereExpression<unknown>;
    navigation: INavigationOptionValue<INavigationSourceConfig>;

    parentProperty?: string;
    root?: TKey;

    items: RecordSet;
    breadCrumbsItems: Path;
    backButtonCaption: string;
    breadCrumbsItemsWithoutBackButton: Path;

    sourceController: Controller;
    dataLoadCallback: Function;

    expandedItems: CrudEntityKey[];
}

export interface IControllerOptions
    extends IFilterOptions,
        ISortingOptions,
        IHierarchyOptions,
        IGroupingOptions,
        ISourceOptions,
        IPromiseSelectableOptions,
        INavigationOptions<INavigationSourceConfig>,
        ISelectFieldsOptions {
    dataLoadErrback?: Function;
    dataLoadCallback?: Function;
    nodeLoadCallback?: Function;
    root?: TKey;
    expandedItems?: TKey[];
    deepReload?: boolean;
    collapsedGroups?: TArrayGroupId;
    navigationParamsChangedCallback?: Function;
    loadTimeout?: number;
    items?: RecordSet;
    deepScrollLoad?: boolean;
    nodeTypeProperty?: string;
    error?: Error;
    displayProperty?: string;
    hasChildrenProperty?: string;
    childrenProperty?: string;
    propStorageId?: string;
}

interface ILoadConfig {
    filter?: QueryWhereExpression<unknown>;
    sorting?: QueryOrderSelector;
    key?: TKey;
    navigationSourceConfig?: IBaseSourceConfig;
    direction?: Direction;
    isFirstLoad?: boolean;
    addItemsAfterLoad?: boolean;
    keepNavigation?: boolean;
    useServicePool?: boolean;
}

type LoadPromiseResult = RecordSet | Error;
export type LoadResult = Promise<LoadPromiseResult>;

export const SORTING_USER_PARAM_POSTFIX = '-sorting';

enum NAVIGATION_DIRECTION_COMPATIBILITY {
    up = 'backward',
    down = 'forward',
}

function clearCollapsedNode(key: TKey, items: RecordSet, parentProperty: string): void {
    const removedIndices = items.getIndicesByValue(parentProperty, key);
    const removedItems: Model[] = [];

    removedIndices.forEach((index) => {
        removedItems.push(items.at(index));
    });

    removedItems.forEach((removedItem) => {
        items.remove(removedItem);
    });
}

const OPTIONS_FOR_UPDATE_AFTER_LOAD = [
    'groupProperty',
    'sorting',
    'nodeProperty',
    'nodeTypeProperty',
    'dataLoadCallback',
];

const SOURCE_CONTROLLER_OPTIONS = [
    'source',
    'navigation',
    'navigationParamsChangedCallback',
    'filter',
    'sorting',
    'keyProperty',
    'root',
    'parentProperty',
    'nodeProperty',
    'hasChildrenProperty',
    'childrenProperty',
    'nodeTypeProperty',
    'nodeHistoryId',
    'nodeHistoryType',
    'expandedItems',
    'selectedKeys',
    'excludedKeys',
    'groupProperty',
    'collapsedGroups',
    'groupHistoryId',
    'historyIdCollapsedGroups',
    'dataLoadCallback',
    'dataLoadErrback',
    'nodeLoadCallback',
    'displayProperty',
    'propStorageId',
    'error',
    'selectFields',
    'loadTimeout',
    'items',
    'deepScrollLoad',
    'deepReload',
    'id',
    'observeMetaData',
    'task1183145150',
];

/**
 * @typedef {Object} SourceConfig
 * @description Конфигурация навигации ({@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#cursor по курсору} или {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#page постраничная}).
 * Также, в конфигурации можно передать опцию multiNavigation, если метод БЛ поддерживает работу с {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/managing-node-expand/#multi-navigation множественной навигацией}.
 */

/**
 * Класс-загрузчик данных
 * Поддерживает работу с навигацией и фильтрацией
 * Подготавливает параметры для запроса
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISelectFields
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:IItems
 * @example
 * <pre class="brush: js>
 *      import {NewSourceController} from 'Controls/dataSource';
 *      import {Memory} from 'Types/source';
 *
 *     _beforeMount() {
 *         const source = new Memory({
 *             rawData: [
 *                 {
 *                     id: 0,
 *                     cityName: 'Yaroslavl'
 *                 },
 *                 {
 *                     id: 1,
 *                     cityName: 'Moscow'
 *                 },
 *                 {
 *                     id: 2,
 *                     cityName: 'St. Petersburg'
 *                 }
 *             ],
 *             keyProperty: 'id'
 *         });
 *         const sourceController = new NewSourceController({
 *             source: source,
 *             filter: {
 *                 cityName: 'Yaroslavl'
 *             },
 *             keyProperty: 'id';
 *         })
 *
 *         sourceController.reload().then((items) => {
 *             ...
 *         });
 *     }
 * </pre>
 * @public
 */

export default class Controller extends mixin<ObservableMixin>(ObservableMixin) {
    private _options: IControllerOptions;
    private _filter: QueryWhereExpression<unknown>;
    private _items: RecordSet;
    /**
     * Данные хлебных крошек, которые спускаем дочерним контролам
     */
    private _breadCrumbsItems: Path;
    /**
     * Заголовок кнопки назад, вычисленный на основании текущих хлебных крошек.
     * Спускаем дочерним контролам.
     */
    private _backButtonCaption: string;
    /**
     * Данные хлебных крошек, которые спускаем дочерним контролам,
     * без итема, который используется для вывода кнопки назад
     */
    private _breadCrumbsItemsWithoutBackButton: Path;
    /**
     * RecordSet в котором хранятся данные хлебных крошек.
     * Нужен только для того, что бы иметь возможность подписаться и отписаться от события
     * onCollectionChange. Т.к. данные хлебных крошек могут меняться из UI, например,
     * при редактировании названия папки в которой находимся.
     */
    private _breadcrumbsRecordSet: RecordSet;
    private _dragRandomId: string;
    private _loadPromise: CancelablePromise<RecordSet | Error>;
    private _prepareFilterPromise: CancelablePromise<QueryWhereExpression<unknown> | Error>;
    private _loadError: Error;
    private _processCollectionChangeEvent: boolean = true;

    private _dataLoadCallback: Function;
    // Это костыль, чтобы работали списки с иерархией без storeId,
    // они сейчас внутри работают через слайс, в слайсе callback'ов нет
    // поэтому для совместимости callback'и (dataLoadCallback и nodeLoadCallback)
    // хранятся на sourceController'e
    private _nodeLoadCallback: TNodeLoadCallback | void;
    private _nodeDataMoreLoadCallback: Function;
    // Необходимо для совместимости в случае, если dataLoadCallback задают на списке, а где-то сверху есть dataContainer
    private _dataLoadCallbackFromOptions: Function;

    private _crudWrapper: CrudWrapper;
    private _navigationController: NavigationController;
    private _navigationParamsChangedCallback: Function;
    private _navigation: INavigationOptionValue<INavigationSourceConfig>;

    private _parentProperty: string;
    private _root: TKey = null;
    private _sorting: TSortingOptionValue = null;
    private _hierarchyRelation: relation.Hierarchy;

    private _expandedItems: TKey[];
    private _deepReload: boolean;
    private _collapsedGroups: TArrayGroupId;
    private _destroyed: boolean;

    constructor(cfg: IControllerOptions) {
        super();
        EventRaisingMixin.initMixin(this);

        const { root, sorting, dataLoadCallback, error, expandedItems, groupHistoryId, items } =
            cfg;
        this._initRecordSetDiffer();
        this._resolveNavigationParamsChangedCallback(cfg);
        this._collectionChange = this._collectionChange.bind(this);
        this._collectionPropertyChange = this._collectionPropertyChange.bind(this);
        this._onBreadcrumbsCollectionChanged = this._onBreadcrumbsCollectionChanged.bind(this);
        this._dragRandomId = randomId();
        this._options = Controller._getOptions(cfg);
        this._setFilter(cfg.filter || {});
        this._setNavigation(cfg.navigation);

        if (root !== undefined) {
            this._setRoot(root);
        }
        if (sorting !== undefined) {
            this._setSorting(sorting);
        }
        if (dataLoadCallback !== undefined) {
            this._setDataLoadCallbackFromOptions(dataLoadCallback);
        }
        if (expandedItems !== undefined) {
            this.setExpandedItems(expandedItems);
        }
        if (groupHistoryId) {
            this._restoreCollapsedGroups(groupHistoryId, cfg.collapsedGroups);
        }
        this.setParentProperty(cfg.parentProperty);

        if (items) {
            this.setItems(items);
        }

        if (error instanceof Error) {
            this._loadError = error;
        }
    }

    protected _initRecordSetDiffer() {
        const setItems = () => {
            this._unsubscribeBreadcrumbsChange();
            this._breadcrumbsRecordSet =
                this._items instanceof RecordSet ? this._items.getMetaData().path : null;
            this._subscribeBreadcrumbsChange(this._breadcrumbsRecordSet);
            this._updateBreadcrumbsData();
        };
        const replaceItems = (_: unknown, newItems: RecordSet) => {
            this._subscribeItemsCollectionChangeEvent(newItems);
            this._items = newItems;
            setItems();
        };
        const assignItems = () => {
            setItems();
        };

        this._recordSetDiffer = new RecordSetDiffer({
            replaceItems,
            assignItems,
        });
    }
    protected _recordSetDiffer: RecordSetDiffer;

    /**
     * Выполняет загрузку из источника данных
     * @param {string} direction Направление загрузки данных, поддерживаются значения: up, down
     * @param {string|number|null} key Корень, для которого необходимо выполнить загрузку данных
     * @param {object} filter Фильтр, с которым будет выполнена загрузка данных
     * @param {boolean} addItemsAfterLoad Определяет, будут ли добавлены данные в RecordSet
     * @param {object} navigationSourceConfig Параметры навигации
     * @param {boolean} keepNavigation Сохранить ли состояние навигации при перезагрузке
     * @param {boolean} useServicePool Будет ли запрос перенаправлен в служебный пул
     * @return {Types/collection:RecordSet}
     */
    load(
        direction?: Direction,
        key: TKey = this._root,
        filter: QueryWhereExpression<unknown> = void 0,
        addItemsAfterLoad: boolean = true,
        navigationSourceConfig?: IBaseSourceConfig,
        keepNavigation?: boolean,
        useServicePool?: boolean
    ): LoadResult {
        return this._load({
            direction,
            key,
            filter,
            addItemsAfterLoad,
            navigationSourceConfig,
            keepNavigation,
            useServicePool,
        });
    }

    /**
     * Перезагружает данные из источника данных
     * @param {SourceConfig} sourceConfig Конфигурация навигации источника данных (например, размер и номер страницы для постраничной навигации), которую можно передать при вызове reload, чтобы перезагрузка произошла с этими параметрами. По умолчанию перезагрузка происходит с параметрами, переданными в опции {@link Controls/interface:INavigation#navigation navigation}.
     * @param {Boolean} isFirstLoad Флаг первичной загрузки.
     * @return {Types/collection:RecordSet}
     */
    reload(
        sourceConfig?: IBaseSourceConfig,
        isFirstLoad?: boolean,
        addItemsAfterLoad?: boolean,
        keepNavigation?: boolean
    ): LoadResult {
        const shouldAddItems = addItemsAfterLoad !== false;
        return this._load({
            key: this._root,
            navigationSourceConfig: sourceConfig,
            isFirstLoad,
            addItemsAfterLoad: shouldAddItems,
            keepNavigation,
        });
    }

    reloadItem(key: TKey, options: IReloadItemOptions = {}): Promise<Model | RecordSet> {
        const items = this.getItems();
        const keyProperty = this.getKeyProperty();

        let reloadItemPromise;
        let itemsCount;

        const getReloadableItemIndex = () => {
            return items.getIndexByValue(keyProperty, key);
        };

        const loadCallback = (item): void => {
            // За время загрузки элемент мог быть удалён или перемещён,
            // надо брать актуальный индекс элемента в RecordSet'e
            const itemIndex = getReloadableItemIndex();

            if (itemIndex !== -1) {
                if (options.replace) {
                    items.replace(item, itemIndex);
                } else {
                    items.at(itemIndex).merge(item);
                }
            }
        };

        if (getReloadableItemIndex() === -1) {
            throw new Error('BaseControl::reloadItem no item with key ' + key);
        }

        if (options.method === 'query') {
            const filter = { ...this.getFilter(), [keyProperty]: [key] };
            reloadItemPromise = this.executeLoad({ filter }).then((loadedItems) => {
                if (loadedItems instanceof RecordSet) {
                    itemsCount = loadedItems.getCount();

                    if (itemsCount === 1) {
                        this._loadFinished(loadedItems, this._root);
                        loadCallback(loadedItems.at(0));
                    } else if (itemsCount > 1) {
                        Logger.error(
                            'Controls/dataSource:Controller reloadItem::query returns wrong amount of items for reloadItem call with key: ' +
                                key
                        );
                    } else {
                        Logger.info(
                            'Controls/dataSource:Controller: reloadItem::query returns empty recordSet.'
                        );
                    }
                }
                return loadedItems;
            });
            this._addFinallyToLoadPromise(reloadItemPromise);
        } else {
            reloadItemPromise = this.read(key, options.readMeta).then((item) => {
                if (item) {
                    loadCallback(item);
                } else {
                    Logger.info(
                        'Controls/dataSource:Controller: reloadItem::read do not returns record.'
                    );
                }
                return item;
            });
        }

        return reloadItemPromise.catch((error) => {
            return process({ error });
        });
    }

    /**
     * Читает запись из источника данных
     * @param {string|number} key Первичный ключ записи
     * @param {object} meta Дополнительные мета данные
     */
    read(key: TKey, meta?: object): Promise<EntityRecord> {
        return this._callSourceMethod<EntityRecord>('read', key, meta);
    }

    /**
     * Обновляет запись в источнике данных
     * @param {Types/entity:Record} item Обновляемая запись или рекордсет
     */
    update(item: Model): Promise<void> {
        return this._callSourceMethod<void>('update', item);
    }

    /**
     * Создает пустую запись через источник данных (при этом она не сохраняется в хранилище)
     * @param {object} meta Дополнительные мета данные, которые могут понадобиться для создания записи
     * @return {Promise<Record>}
     */
    create(meta?: object): Promise<EntityRecord> {
        return this._callSourceMethod<EntityRecord>('create', meta);
    }

    /**
     * Устанавливает новый набор элементов коллекции.
     * @param {Types/collection:RecordSet} items набор элементов коллекции.
     */
    setItems(items: RecordSet): RecordSet {
        if (this._hasNavigationBySource() && items) {
            this._destroyNavigationController();
            this._updateQueryPropertiesByItems(items, { key: this._root });
        }
        this._addItems(items, this._root);
        return this._items;
    }

    setItemsAfterLoad(
        items: RecordSet,
        sourceConfig?: IBaseSourceConfig,
        keepNavigation?: boolean
    ): RecordSet {
        this._processQueryResult(items, {
            key: this._root,
            navigationSourceConfig: sourceConfig,
            keepNavigation,
        });
        return this._items;
    }

    prependItems(items: RecordSet, key: TKey = this._root): RecordSet {
        if (this._hasNavigationBySource() && items) {
            this._updateQueryPropertiesByItems(items, { key, direction: 'up' });
        }
        this._addItems(items, key, 'up');
        return this._items;
    }

    appendItems(items: RecordSet, key: TKey = this._root): RecordSet {
        this._addItems(items, key, 'down');
        return this._items;
    }

    mergeItems(items: RecordSet, key: TKey = this._root): RecordSet {
        this._addItems(items, key);
        return this._items;
    }

    /**
     * Возвращает элементы коллекции
     * @return {Types/collection:RecordSet} коллекция
     */
    getItems(): RecordSet {
        return this._items;
    }

    getKeyProperty(): string {
        const { keyProperty } = this._options;
        const source = Controller._getSource(this._options.source);
        let result;

        if (keyProperty) {
            result = keyProperty;
        } else if (source?.getKeyProperty) {
            result = source.getKeyProperty();
        }

        return result;
    }

    getParentProperty(): string {
        return this._parentProperty;
    }

    getLoadError(): Error {
        return this._loadError;
    }

    setLoadError(error: Error): void {
        this._processQueryError(error, this._root);
    }

    setFilter(filter: TFilter): QueryWhereExpression<unknown> {
        if (!isEqual(filter, this._filter)) {
            this._notify('filterChanged', filter, this._options.id);
        }
        return this._setFilter(filter);
    }

    getFilter(): QueryWhereExpression<unknown> {
        return this._filter;
    }

    getSorting(): TSortingOptionValue {
        return this._sorting;
    }

    setNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): void {
        if (this._navigation !== navigation) {
            this._setNavigation(navigation);
            this._notify('navigationChanged', this._navigation);
        }
    }

    _setNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): void {
        this._navigation = navigation;

        if (navigation && this._hasNavigationBySource(navigation)) {
            if (this._navigationController) {
                this._navigationController.updateOptions(
                    this._getNavigationControllerOptions(navigation)
                );
            }
        } else {
            this._destroyNavigationController();
        }
    }

    getNavigation(): INavigationOptionValue<INavigationSourceConfig> {
        return this._navigation;
    }

    /**
     * Устанавливает узел, относительно которого будет производиться выборка данных
     * @param {string|number} key
     */
    setRoot(key: TKey, byPage?: boolean): void {
        const currentRoot = this.getRoot();

        if (key !== currentRoot) {
            // Костыль до 22.1100, убираем полностью логику перезагрузки из sabyPage при нажатии на кнопку "назад"
            if (!byPage || !this._options.task1183145150) {
                this._setRoot(key);
            }

            if (byPage && !this._options.task1183145150) {
                this.setExpandedItems([]);
                this.reload().catch((error) => {
                    return error;
                });
            }

            this._notify('rootChanged', key, this._options.id);
        }
    }

    /**
     * Устанавливает сортировку
     * @param {TSortingOptionValue} sorting
     */
    setSorting(sorting: TSortingOptionValue): void {
        const currentSorting = this.getSorting();
        const { propStorageId } = this._options;

        if (!isEqual(sorting, currentSorting)) {
            this._setSorting(sorting);

            if (propStorageId) {
                USER.set(propStorageId + SORTING_USER_PARAM_POSTFIX, JSON.stringify(sorting));
            }
            this._notify('sortingChanged', sorting);
        }
    }

    /**
     * Возвращает узел, относительно которого будет производиться выборка данных списочным методом
     * @return {string|number} Идентификатор корня.
     */
    getRoot(): TKey {
        return this._root;
    }

    // FIXME, если parentProperty задаётся на списке, а не на data(browser)
    setParentProperty(parentProperty: string): void {
        this._parentProperty = parentProperty;
        this._hierarchyRelation?.setParentProperty(parentProperty);
    }

    updateOptions(newOptions: IControllerOptions): boolean {
        const isFilterChanged = this._isOptionChanged('filter', newOptions);
        const isSourceChanged = newOptions.source !== this._options.source;
        const isNavigationChanged = !isEqual(newOptions.navigation, this._options.navigation);
        const rootChanged = this._isOptionChanged('root', newOptions);
        const sortingChanged = this._isOptionChanged('sorting', newOptions);
        const isExpandedItemsChanged = this._isOptionChanged('expandedItems', newOptions);
        const dataLoadCallbackChanged =
            newOptions.dataLoadCallback !== undefined &&
            newOptions.dataLoadCallback !== this._options.dataLoadCallback;

        if (isNavigationChanged) {
            this.setNavigation(newOptions.navigation);
        }

        if (
            newOptions.navigationParamsChangedCallback !==
            this._options.navigationParamsChangedCallback
        ) {
            this._resolveNavigationParamsChangedCallback(newOptions);
            this._navigationController?.updateOptions(
                this._getNavigationControllerOptions(newOptions.navigation)
            );
        }

        if (isFilterChanged) {
            this.setFilter(newOptions.filter);
        }

        if (
            newOptions.parentProperty !== undefined &&
            newOptions.parentProperty !== this._options.parentProperty
        ) {
            this.setParentProperty(newOptions.parentProperty);
        }

        if (rootChanged) {
            this.setRoot(newOptions.root);
        }

        if (sortingChanged) {
            this.setSorting(newOptions.sorting);
        }

        if (dataLoadCallbackChanged) {
            this._setDataLoadCallbackFromOptions(newOptions.dataLoadCallback);
        }

        if (newOptions.expandedItems !== undefined && isExpandedItemsChanged) {
            this.setExpandedItems(newOptions.expandedItems);
        }

        if (isSourceChanged) {
            if (newOptions.source) {
                this._crudWrapper?.updateOptions({
                    source: newOptions.source as ICrud,
                });
            } else {
                this._crudWrapper = null;
            }
        }

        if (newOptions.groupHistoryId !== this._options.groupHistoryId) {
            this._restoreCollapsedGroups(newOptions.groupHistoryId, newOptions.collapsedGroups);
        }

        const isChanged =
            isFilterChanged ||
            isNavigationChanged ||
            isSourceChanged ||
            sortingChanged ||
            (this._parentProperty && rootChanged);

        const resetExpandedItemsOnDeepReload = newOptions.deepReload && !rootChanged;
        if (
            isChanged &&
            !(isExpandedItemsChanged || resetExpandedItemsOnDeepReload || this.isExpandAll())
        ) {
            this.setExpandedItems([]);
        }
        this._options = Controller._getOptions(newOptions);
        return isChanged;
    }

    getState(): IControllerState {
        const source = Controller._getSource(this._options.source);
        const state = {
            keyProperty: this.getKeyProperty(),
            source,

            filter: this._filter,
            navigation: this._navigation,

            hasChildrenProperty: this._options.hasChildrenProperty,
            displayProperty: this._options.displayProperty,
            nodeProperty: this._options.nodeProperty,
            parentProperty: this._parentProperty,
            root: this._root,

            items: this._items,
            breadCrumbsItems: this._breadCrumbsItems,
            backButtonCaption: this._backButtonCaption,
            breadCrumbsItemsWithoutBackButton: this._breadCrumbsItemsWithoutBackButton,
            dragControlId: this._dragRandomId,
            sourceController: this,
            expandedItems: this._options.hasOwnProperty('expandedItems')
                ? this._expandedItems
                : void 0,
            selectedKeys: this._options.selectedKeys,
            excludedKeys: this._options.excludedKeys,
        };
        OPTIONS_FOR_UPDATE_AFTER_LOAD.forEach((optionName) => {
            state[optionName] = this._options[optionName];
        });
        return state;
    }

    getCollapsedGroups(): TArrayGroupId {
        return this._collapsedGroups;
    }

    // FIXME для работы дерева без bind'a опции expandedItems
    setExpandedItems(expandedItems: TKey[]): void {
        this._expandedItems = expandedItems;
    }

    resetCollapsedNodes(newExpandedItems: TKey[]): void {
        const oldExpandedItems: TKey[] = this._expandedItems;
        const navigationController: NavigationController = this._navigationController;
        const items: RecordSet = this._items;
        const parentProperty: string = this._parentProperty;
        const hasOldExpandedItems = oldExpandedItems instanceof Array && oldExpandedItems.length;
        const hasNewExpandedItems = newExpandedItems instanceof Array && newExpandedItems.length;
        const collapsedItems: TKey[] = [];

        // без navigationController или без items нет смысла обрабатывать свернутые узлы
        if (!navigationController || !items) {
            return;
        }

        // если не было развернутых узлов, то свернутых точно не будет
        if (!hasOldExpandedItems) {
            return;
        }

        // если развернули все узлы, то свернутых узлов точно не будет
        if (hasNewExpandedItems && newExpandedItems[0] === null) {
            return;
        }

        oldExpandedItems.forEach((key) => {
            // запоминаем узлы, которые стали свернутыми (отсутствие newExpandedItems также приводит к сворачиванию)
            if (!hasNewExpandedItems || !newExpandedItems.includes(key)) {
                collapsedItems.push(key);
            }
        });

        // если нет свернутых узлов - выходим сразу, обрабатывать нечего
        if (!collapsedItems.length) {
            return;
        }

        items.setEventRaising(false, true);
        collapsedItems.forEach((key) => {
            // сбрасываем навигацию для свернутых узлов
            navigationController.reset(key);

            // удаляем из RecordSet дочерние элементы свернутых узлов
            clearCollapsedNode(key, items, parentProperty);
        });
        items.setEventRaising(true, true);
    }

    updateExpandedItemsInUserStorage(): void {
        let expandedItems: TKey[];
        if (
            !this._expandedItems ||
            this._expandedItems.length === 0 ||
            !this._options.nodeTypeProperty
        ) {
            expandedItems = this._expandedItems;
        } else {
            // Запрашиваем список последних сохранённых id раскрытых записей
            const lastSavedHistory = nodeHistoryUtil.getCached(this._options.nodeHistoryId);
            expandedItems = this._expandedItems.filter((key) => {
                const record = this._items.getRecordById(key);
                // Если записи нет в текущем списке, но она оказалась в expandedItems, проверяем,
                // есть ли она в списке последних сохранённых id.
                if (!record) {
                    return lastSavedHistory ? lastSavedHistory.indexOf(key) !== -1 : false;
                }
                const nodeTypeProperty = record.get(this._options.nodeTypeProperty);
                if (this._options.nodeHistoryType === 'node') {
                    return nodeTypeProperty !== 'group';
                } else if (this._options.nodeHistoryType === 'all') {
                    return true;
                }
                return nodeTypeProperty === 'group';
            });
        }
        nodeHistoryUtil.store(expandedItems, this._options.nodeHistoryId);
    }

    getExpandedItems(): TKey[] {
        return this._expandedItems;
    }

    /**
     * Возвращает, есть ли ещё данные для загрузки
     * @param direction {Direction} Направление, для которого необходимо проверить, если ли ещё данные для загрузки
     * @param key {TKey} Идентификатор узла
     */
    hasMoreData(direction: Direction, key: TKey = this._root): boolean {
        let hasMoreData = false;

        if (this._hasNavigationBySource()) {
            hasMoreData = this._getNavigationController(this._navigation).hasMoreData(
                NAVIGATION_DIRECTION_COMPATIBILITY[direction],
                key
            );
        }

        return hasMoreData;
    }

    getDataLoadCallback(): Function {
        return this._dataLoadCallback;
    }

    setDataLoadCallback(callback: Function): void {
        this._dataLoadCallback = callback;
    }

    setNodeLoadCallback(nodeLoadCallback?: TNodeLoadCallback): void {
        this._nodeLoadCallback = nodeLoadCallback;
    }

    setNodeDataMoreLoadCallback(callback: Function): void {
        this._nodeDataMoreLoadCallback = callback;
    }

    /**
     * Выполняет сброс навигации
     * @param {string|number} key Идентификатор узла, для которого надо выполнить сброс навигации
     * @remark Если в функцию не передать индентификатор узла, то навигация будет сброшена для всех узлов и корня
     */
    resetNavigation(key?: TKey): void {
        if (key !== undefined && this._navigationController) {
            this._navigationController.reset(key);
        } else {
            this._destroyNavigationController();
        }
    }

    /**
     * Возвращает признак, была ли выполнена загрузка узла по переданному идентификатору
     * @param {string|number} key Идентификатор узла
     */
    hasLoaded(key: TKey): boolean {
        let loadedResult;

        // По сути костыль для решения ошибки, когда устанавливают source и selectedKeys одновременно в список
        // Опция selectedKeys не тормозится и сразу уходит в список, хотя данные ещё не загружены
        // Удалить после перехода на слайс
        if (!this._items) {
            return false;
        }

        if (this._hasNavigationBySource()) {
            loadedResult = this._getNavigationController(this._navigation).hasLoaded(key);
        } else if (this._parentProperty) {
            loadedResult =
                this._items &&
                this._getHierarchyRelation().getChildren(key, this._getChildren(this._items, key))
                    .length;
        }

        if (!loadedResult && this._options.hasChildrenProperty) {
            loadedResult = !this._items.getRecordById(key)?.get(this._options.hasChildrenProperty);
        }

        return loadedResult;
    }

    /**
     * Возвращает, выполняется ли в данный момент загрузка данных
     * @returns {boolean}
     */
    isLoading(): boolean {
        return !!this._loadPromise;
    }

    shiftToEdge(
        direction: Direction,
        id: TKey,
        shiftMode: TNavigationPagingMode
    ): IBaseSourceConfig {
        if (this._hasNavigationBySource()) {
            return this._getNavigationController(this._navigation).shiftToEdge(
                NAVIGATION_DIRECTION_COMPATIBILITY[direction],
                id,
                shiftMode
            );
        }
    }

    /**
     * Отменяет текущий активный запрос к источнику данных
     */
    cancelLoading(): void {
        if (this._loadPromise) {
            this._loadPromise.cancel();
            this._loadPromise = null;
        }
        if (this._prepareFilterPromise) {
            this._prepareFilterPromise.cancel();
            this._prepareFilterPromise = null;
        }
    }

    getOptions(): IControllerOptions {
        return this._options;
    }

    isExpandAll(): boolean {
        const expandedItems = this.getExpandedItems();
        return expandedItems instanceof Array && expandedItems[0] === null;
    }

    /**
     * Возвращает источник, переданный в опции {@link source}
     * @return {Types/source:ICrud | Types/source:ICrudPlus} источник данных
     */

    getSource(): ICrudPlus | (ICrud & ICrudPlus & IData) {
        return this._options.source;
    }

    /**
     * Разрушает экземпляр класса.
     * Выполняет отмену запросов, а так же необходимые отписки от событий.
     */
    destroy(): void {
        this.cancelLoading();

        this._unsubscribeItemsCollectionChangeEvent();
        this._destroyNavigationController();
        this._unsubscribeBreadcrumbsChange();
        this._destroyed = true;
        this._options = {};
    }

    private _setRoot(key: TKey): void {
        this._root = key;
    }

    private _setFilter(filter: TFilter): QueryWhereExpression<unknown> {
        return (this._filter = filter);
    }

    private _setSorting(sorting: TSortingOptionValue): void {
        if (Array.isArray(sorting)) {
            this._sorting = sorting.slice();
        } else if (sorting instanceof Object) {
            this._sorting = { ...sorting };
        } else {
            this._sorting = sorting;
        }
    }

    private _getCrudWrapper(sourceOption: ICrud): CrudWrapper {
        if (!this._crudWrapper) {
            this._crudWrapper = new CrudWrapper({ source: sourceOption });
        }
        return this._crudWrapper;
    }

    private _getNavigationController(
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): NavigationController {
        if (!this._navigationController) {
            this._navigationController = this._createNavigationController(navigation);
        }

        return this._navigationController;
    }

    private _createNavigationController(
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): NavigationController {
        return new NavigationController(this._getNavigationControllerOptions(navigation));
    }

    private _getNavigationControllerOptions(
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): INavigationControllerOptions {
        return {
            navigationType: navigation.source,
            navigationConfig: navigation.sourceConfig,
            navigationParamsChangedCallback: this._navigationParamsChangedCallback,
        };
    }

    hasHierarchyRelation(navigationSourceConfig?: IBaseSourceConfig): boolean {
        const isMultiNavigation = this._isMultiNavigation(navigationSourceConfig);
        const hasExpandedItems = !!this.getExpandedItems()?.length;
        return Boolean(this._options.parentProperty && (isMultiNavigation || hasExpandedItems));
    }

    applyNavigationChanges(changes?: INavigationChanges) {
        if (!changes) {
            return;
        }
        const navigationController = this._getNavigationController(this._navigation);
        navigationController.applyChanges(changes);
    }

    calculateNavigationChanges(
        list: RecordSet,
        loadConfig: ILoadConfig
    ): INavigationChanges | undefined {
        const { key, navigationSourceConfig, direction, keepNavigation } = loadConfig;

        if (this._hasNavigationByConfig(navigationSourceConfig) && this._hasNavigationBySource()) {
            const isMultiNavigation = this._isMultiNavigation(navigationSourceConfig);
            const isRoot = this._root === key;
            const resetNavigation = this._deepReload || (!direction && isRoot && !keepNavigation);
            const resetMultiNavigation = !isMultiNavigation || (isRoot && !keepNavigation);
            const hasExpandedItems = !!this.getExpandedItems()?.length;
            if (
                resetNavigation &&
                (resetMultiNavigation || !hasExpandedItems || this.isExpandAll())
            ) {
                this._destroyNavigationController();
            }
            const hierarchyRelation = this.hasHierarchyRelation(this, navigationSourceConfig)
                ? this._getHierarchyRelation()
                : undefined;

            const navigationController = this._getNavigationController(this._navigation);
            const changes = navigationController.calculateNextQueryProperties(
                list,
                key,
                navigationSourceConfig,
                NAVIGATION_DIRECTION_COMPATIBILITY[direction],
                hierarchyRelation,
                isRoot && !this.isExpandAll() && !direction
            );
            return changes;
        }
    }

    private _updateQueryPropertiesByItems(list: RecordSet, loadConfig: ILoadConfig): void {
        const changes = this.calculateNavigationChanges(list, loadConfig);
        this.applyNavigationChanges(changes);
    }

    private _prepareQueryParams(
        { filter, sorting, select }: IQueryParams,
        { key, navigationSourceConfig, direction, addItemsAfterLoad, keepNavigation }: ILoadConfig
    ): IQueryParams | IQueryParams[] {
        // Когда выполняется запрос без добавления данных (addItemsAfterLoad=false),
        // то навигация для этого узла не должна кэшироваться,
        // иначе при развороте узла он просто развернётся без запроса данных
        const navigationController =
            addItemsAfterLoad || key === this._root
                ? this._getNavigationController(this._navigation)
                : this._createNavigationController(this._navigation);
        const userQueryParams = {
            filter,
            sorting,
            select,
        };
        const isMultiNavigation = this._isMultiNavigation(navigationSourceConfig);
        const expandedItems = this.getExpandedItems();
        const isHierarchyQueryParamsNeeded =
            isMultiNavigation &&
            expandedItems?.length &&
            !this.isExpandAll() &&
            (!direction || this._options.deepScrollLoad) &&
            (key === this._root || keepNavigation);
        let resultQueryParams;

        if (isHierarchyQueryParamsNeeded) {
            resultQueryParams = navigationController.getQueryParamsForHierarchy(
                userQueryParams,
                navigationSourceConfig,
                !keepNavigation,
                filter[this.getParentProperty()]
            );
        }

        if (!isHierarchyQueryParamsNeeded || !resultQueryParams || !resultQueryParams.length) {
            const resetNavigation =
                !isMultiNavigation ||
                (key !== this._root && !keepNavigation) ||
                !!direction ||
                ((!!navigationSourceConfig || !isHierarchyQueryParamsNeeded) && !keepNavigation);
            resultQueryParams = navigationController.getQueryParams(
                userQueryParams,
                key,
                navigationSourceConfig,
                NAVIGATION_DIRECTION_COMPATIBILITY[direction],
                resetNavigation
            );
        }

        return resultQueryParams;
    }

    private _isMultiNavigation(navigationSourceConfig?: IBaseSourceConfig): boolean {
        return (
            navigationSourceConfig?.multiNavigation ||
            this._options.navigation?.sourceConfig?.multiNavigation
        );
    }

    private _getChildren(items: RecordSet, key: TKey): RecordSet {
        return getRecordSetByHierarchyStrategy(
            this._options.childrenProperty,
            this._root,
            items,
            key
        );
    }

    private _addItems(items: RecordSet, key: TKey, direction?: Direction): RecordSet {
        this._toggleProcessOfCollectionChangeEvent(false);

        const { childrenProperty } = this._options;

        this._recordSetDiffer.applyChanges(
            calculateAddItemsChanges(
                this._items,
                items,
                direction,
                key,
                this._root,
                childrenProperty,
                true
            )
        );

        this._toggleProcessOfCollectionChangeEvent(true);
        this._notify('itemsChanged', items, key, direction);

        return items;
    }

    private _resolveNavigationParamsChangedCallback(cfg: IControllerOptions): void {
        if (cfg.navigationParamsChangedCallback) {
            this._navigationParamsChangedCallback = cfg.navigationParamsChangedCallback;
        }
    }

    private _toggleProcessOfCollectionChangeEvent(allowProcess: boolean): void {
        this._processCollectionChangeEvent = allowProcess;
    }

    private _isNeedProcessCollectionChangeEvent(): boolean {
        return this._processCollectionChangeEvent;
    }

    private executeLoad(loadConfig: ILoadConfig): LoadResult {
        if (this._options.source) {
            const { direction, isFirstLoad, key, filter, useServicePool } = loadConfig;
            const filterPromise =
                filter && !direction
                    ? Promise.resolve(filter)
                    : this._prepareFilterForQuery(
                          filter || this._filter,
                          key,
                          isFirstLoad,
                          direction
                      );
            this.cancelLoading();
            this._notifyLoadStarted(key, direction);
            this._prepareFilterPromise = new CancelablePromise(filterPromise);

            const callHandler = new ServicePoolCallHandler();
            const source = this.getSource();
            if (source instanceof Rpc && source && useServicePool) {
                source.callHandlers.add(callHandler);
            }

            this._loadPromise = new CancelablePromise(
                this._prepareFilterPromise.promise.then(
                    (preparedFilter: QueryWhereExpression<unknown>) => {
                        let requestResult;
                        if (this._options.loadTimeout) {
                            requestResult = wrapTimeout(
                                this._query({
                                    ...loadConfig,
                                    filter: preparedFilter,
                                }),
                                this._options.loadTimeout
                            ).catch((error) => {
                                return Promise.reject(
                                    error instanceof Error
                                        ? error
                                        : new fetch.Errors.HTTP({
                                              httpError: HTTPStatus.GatewayTimeout,
                                              message: undefined,
                                              url: undefined,
                                          })
                                );
                            });
                        } else {
                            requestResult = this._query({
                                ...loadConfig,
                                filter: preparedFilter,
                            });
                        }
                        if (source && source instanceof Rpc && useServicePool) {
                            source.callHandlers.remove(callHandler);
                        }
                        return requestResult;
                    }
                )
            );

            return this._loadPromise.promise;
        } else {
            const message = `Controls/dataSource:SourceController: не задан источник данных.
                             Проверьте, что вы передали источник для списочного контрола.
                             Если SourceController создаётся из кода, проверьте, что источник передан в конструктор.`;
            Logger.error(message);
            return Promise.reject(new Error(message));
        }
    }

    private _load(loadConfig: ILoadConfig): LoadResult {
        if (this._destroyed) {
            return Promise.reject(
                new Error(
                    'Controls/dataSource:SourceController попытка загрузки данных через разрушенный SourceController.'
                )
            );
        }

        const { key, direction, addItemsAfterLoad } = loadConfig;
        const loader = this.executeLoad(loadConfig);

        if (addItemsAfterLoad !== false) {
            return loader
                .then((result: RecordSet) => {
                    if (this._destroyed) {
                        return;
                    }
                    if (result instanceof RecordSet) {
                        return this._processQueryResult(result, loadConfig);
                    } else {
                        Logger.error('source/Controller: query returns incorrect result', this);
                        return result;
                    }
                })
                .catch((error) => {
                    if (error) {
                        if (!error.isCanceled && !error.canceled) {
                            this._processQueryError(error, key, direction);
                        } else {
                            this._notify('dataLoadCancel', error, this._options.id);
                        }
                    }
                    return Promise.reject(error);
                });
        } else {
            return this._addFinallyToLoadPromise(loader);
        }
    }

    private _query(loadConfig: ILoadConfig): Promise<RecordSet> {
        const { direction, navigationSourceConfig, filter } = loadConfig;
        // В source может лежать prefetchProxy
        // При подгрузке вниз/вверх данные необходимо брать не из кэша prefetchProxy
        const source =
            direction !== undefined
                ? Controller._getSource(this._options.source)
                : this._options.source;
        const crudWrapper = this._getCrudWrapper(source as ICrud);

        let params: IQueryParams | IQueryParams[] = {
            filter,
            sorting: this.getSorting() as unknown as QueryOrderSelector,
            select: this._options.selectFields,
        };

        if (this._hasNavigationByConfig(navigationSourceConfig) && this._hasNavigationBySource()) {
            params = this._prepareQueryParams(params, loadConfig);
        }
        return crudWrapper.query(params, this.getKeyProperty());
    }

    private _getFilterHierarchy(
        initialFilter: QueryWhereExpression<unknown>,
        options: IControllerOptions,
        root: TKey = this._root,
        isFirstLoad: boolean,
        direction: Direction
    ): Promise<QueryWhereExpression<unknown>> {
        const parentProperty = this._parentProperty;
        let resultFilter: QueryWhereExpression<unknown>;

        if (parentProperty) {
            return this._resolveExpandedHierarchyItems(options, isFirstLoad).then(
                (expandedItems) => {
                    this.setExpandedItems(expandedItems);
                    resultFilter = { ...initialFilter };
                    const isLoadToDirectionWithExpandedItems =
                        direction && this._options.deepScrollLoad;
                    const isDeepReload =
                        (!direction || isLoadToDirectionWithExpandedItems) && root === this._root;

                    // Набираем все раскрытые узлы
                    if (expandedItems?.length && expandedItems?.[0] !== null && isDeepReload) {
                        resultFilter = Controller.prepareFilterWithExpandedItems(
                            resultFilter,
                            expandedItems,
                            parentProperty,
                            root
                        );
                    } else if (root !== undefined) {
                        resultFilter[parentProperty] = root;
                    }

                    // Учитываем в запросе выбранные в multiSelect элементы
                    if (options.selectedKeys && options.selectedKeys.length) {
                        return import('Controls/operations').then((operations) => {
                            resultFilter.entries = operations.selectionToRecord(
                                {
                                    selected: options.selectedKeys,
                                    excluded: options.excludedKeys || [],
                                },
                                Controller._getSource(options.source).getAdapter()
                            );
                            return resultFilter;
                        });
                    }

                    return resultFilter;
                }
            );
        }
        return Promise.resolve(initialFilter);
    }

    private _getHierarchyRelation(): relation.Hierarchy {
        if (!this._hierarchyRelation) {
            this._hierarchyRelation = new relation.Hierarchy({
                parentProperty: this._options.parentProperty,
                nodeProperty: this._options.nodeProperty,
                keyProperty: this.getKeyProperty(),
            });
        }
        return this._hierarchyRelation;
    }

    /**
     * Возвращает Promise с идентификаторами раскрытых узлов
     * @param options
     * @param isFirstLoad
     * @private
     */
    private _resolveExpandedHierarchyItems(
        options: IControllerOptions,
        isFirstLoad: boolean
    ): Promise<CrudEntityKey[]> {
        const expandedItems = this._expandedItems || options.expandedItems;
        if (options.nodeHistoryId && isFirstLoad) {
            return nodeHistoryUtil
                .restore(options.nodeHistoryId)
                .then((restored) => {
                    return restored || expandedItems || [];
                })
                .catch((e) => {
                    Logger.warn(e.message);
                    return expandedItems;
                });
        }
        return Promise.resolve(expandedItems);
    }

    private _prepareFilterForQuery(
        filter: QueryWhereExpression<unknown>,
        key: TKey,
        isFirstLoad: boolean,
        direction: Direction
    ): Promise<QueryWhereExpression<unknown>> {
        return this._getFilterHierarchy(filter, this._options, key, isFirstLoad, direction);
    }

    private _processQueryResult(result: RecordSet, loadConfig: ILoadConfig): LoadPromiseResult {
        const { key, navigationSourceConfig, direction } = loadConfig;
        const loadedInCurrentRoot = key === this._root;

        let methodResult;
        let dataLoadCallbackResult;
        this._updateQueryPropertiesByItems(result, loadConfig);

        if (loadedInCurrentRoot && this._dataLoadCallback) {
            dataLoadCallbackResult = this._dataLoadCallback(result, direction, this._options.id);
        } else if (this._nodeDataMoreLoadCallback) {
            // Вызываем только когда подгружают узел, определяется по loadedInCurrentRoot
            this._nodeDataMoreLoadCallback(key, result);
        }

        if (loadedInCurrentRoot) {
            dataLoadCallbackResult = this._notify(
                'dataLoad',
                result,
                direction,
                navigationSourceConfig
            );
        }

        if (dataLoadCallbackResult instanceof Promise) {
            methodResult = dataLoadCallbackResult.then(() => {
                this._loadFinished(result, key, direction, navigationSourceConfig);
                return this._addItems(result, key, direction);
            });
        } else {
            this._loadFinished(result, key, direction, navigationSourceConfig);
            methodResult = this._addItems(result, key, direction);
        }

        return methodResult;
    }

    private _loadFinished(
        result: RecordSet,
        key: TKey,
        direction?: Direction,
        navigationSourceConfig?: IBaseSourceConfig
    ): void {
        const nodeLoadCallback = this._options.nodeLoadCallback || this._nodeLoadCallback;
        this._loadPromise = null;
        this._loadError = null;
        this._prepareFilterPromise = null;
        // dataLoadCallback не надо вызывать если загружают узел,
        // определяем это по тому, что переданный ключ в метод load не соответствует текущему корню
        if (key === this._root) {
            this._dataLoadCallbackFromOptions?.call(
                void 0,
                result,
                direction,
                this._options.id,
                navigationSourceConfig
            );
        } else if (nodeLoadCallback) {
            nodeLoadCallback(result, key, direction);
        }
    }

    private _processQueryError(queryError: Error, key?: TKey, direction?: Direction): Error {
        // Если упала ошибка при загрузке в каком-то направлении,
        // то контроллер навигации сбрасывать нельзя,
        // Т.к. в этом направлении могут продолжить загрузку
        if (!direction) {
            this._navigationController = null;
        }
        this._loadPromise = null;
        if (this._options.dataLoadErrback) {
            this._options.dataLoadErrback(queryError, this._options.id);
        }
        this._loadError = queryError;
        this._notifyLoadError(queryError, key, direction);
        // Выводим ошибку в консоль, иначе из-за того, что она произошла в Promise,
        // у которого есть обработка ошибок через catch, никто о ней не узнает
        if (!queryError.processed && !queryError.hasOwnProperty('httpError')) {
            Logger.error('dataSource/Controller load error', this, queryError);
        }
        return queryError;
    }

    private _notifyLoadError(error: Error, key?: TKey, direction?: Direction): void {
        this._notify('dataLoadError', error, key, direction, this._options.id);
    }

    private _callSourceMethod<T>(
        ...args: [methodName: string, ...callArgs: unknown[]]
    ): Promise<T> {
        const source = this._options.source as ICrud;
        const methodName = args[0];
        return source[methodName]
            .apply(source, Array.prototype.slice.call(arguments, 1))
            .catch((error) => {
                this._notifyLoadError(error);

                if (!error?.processed) {
                    return Promise.reject(error);
                }
            });
    }

    private _subscribeItemsCollectionChangeEvent(items: RecordSet): void {
        this._unsubscribeItemsCollectionChangeEvent();
        if (items) {
            items.subscribe('onCollectionChange', this._collectionChange);
            items.subscribe('onPropertyChange', this._collectionPropertyChange);
        }
    }

    private _unsubscribeItemsCollectionChangeEvent(): void {
        if (this._items) {
            this._items.unsubscribe('onCollectionChange', this._collectionChange);
            this._items.unsubscribe('onPropertyChange', this._collectionPropertyChange);
        }
    }

    /**
     * Обновляет подписку на изменение данных хлебных крошек
     */
    private _subscribeBreadcrumbsChange(breadcrumbs: RecordSet): void {
        if (breadcrumbs) {
            breadcrumbs.subscribe('onCollectionChange', this._onBreadcrumbsCollectionChanged);
        }
    }

    private _unsubscribeBreadcrumbsChange(): void {
        if (this._breadcrumbsRecordSet) {
            this._breadcrumbsRecordSet.unsubscribe(
                'onCollectionChange',
                this._onBreadcrumbsCollectionChanged
            );
        }
    }

    private _notifyLoadStarted(key: TKey, direction: Direction): void {
        if (key === this._root) {
            this._notify('dataLoadStarted', direction);
        }
    }

    private _collectionChange(): void {
        if (this._hasNavigationBySource() && this._isNeedProcessCollectionChangeEvent()) {
            // Навигация при изменении ReocrdSet'a должно обновляться только по записям из корня,
            // поэтому получение элементов с границ recordSet'a
            // нельзя делать обычным получением первого и последнего элемента,
            // надо так же проверять, находится ли элемент в корне
            const firstItem = this._getFirstItemFromRoot();
            const lastItem = this._getLastItemFromRoot();

            if (this._items.getCount() && firstItem && lastItem) {
                this._getNavigationController(this._navigation).updateQueryRange(
                    this._items,
                    this._root,
                    this._getFirstItemFromRoot(),
                    this._getLastItemFromRoot()
                );
            }
        }
    }

    private _collectionPropertyChange(
        event: EventObject,
        changedProps: Record<string, unknown>
    ): void {
        // FIXME observeMetaData нужен до внедрения схемы работы через контекст
        // сейчас проблема, что в странице и в контроле разные sourceController'ы, у которых ссылка на один recordSet
        if (
            this._options.observeMetaData &&
            this._isNeedProcessCollectionChangeEvent() &&
            changedProps.metaData
        ) {
            this._updateQueryPropertiesByItems(this._items, {});
        }
    }

    private _updateBreadcrumbsData(): void {
        const { breadCrumbsItems, backButtonCaption, breadCrumbsItemsWithoutBackButton } =
            calculateBreadcrumbsData(this._items, this._options.displayProperty);

        this._breadCrumbsItems = breadCrumbsItems;
        this._backButtonCaption = backButtonCaption;
        this._breadCrumbsItemsWithoutBackButton = breadCrumbsItemsWithoutBackButton;
    }

    private _onBreadcrumbsCollectionChanged(): void {
        this._updateBreadcrumbsData();
        this._notify('breadcrumbsDataChanged');
    }

    private _getFirstItemFromRoot(): Model | void {
        const itemsCount = this._items.getCount();
        let firstItem;
        for (let i = 0; i < itemsCount; i++) {
            firstItem = this._getItemFromRootByIndex(i);
            if (firstItem) {
                break;
            }
        }
        return firstItem;
    }

    private _getLastItemFromRoot(): Model | void {
        const itemsCount = this._items.getCount();
        let lastItem;
        for (let i = itemsCount - 1; i > 0; i--) {
            lastItem = this._getItemFromRootByIndex(i);
            if (lastItem) {
                break;
            }
        }
        return lastItem;
    }

    private _getItemFromRootByIndex(index: number): Model | void {
        let item;
        if (this._options.parentProperty && this._root !== undefined) {
            if (this._items.at(index).get(this._options.parentProperty) === this._root) {
                item = this._items.at(index);
            }
        } else {
            item = this._items.at(index);
        }
        return item;
    }

    private _destroyNavigationController(): void {
        if (this._navigationController) {
            this._navigationController.destroy();
            this._navigationController = null;
        }
    }

    private _hasNavigationBySource(navigation?: INavigationOptionValue<unknown>): boolean {
        const navigationOption = navigation || this._navigation;
        return Boolean(navigationOption && navigationOption.source);
    }

    private _hasNavigationByConfig(navigationConfig?: IBaseSourceConfig): boolean {
        return (
            !navigationConfig ||
            (navigationConfig as IIgnoreNavigationConfig).ignoreNavigation !== true
        );
    }

    private _setDataLoadCallbackFromOptions(dataLoadCallback: Function): void {
        this._dataLoadCallbackFromOptions = dataLoadCallback;
    }

    private _restoreCollapsedGroups(groupHistoryId: string, collapsedGroups: TArrayGroupId): void {
        if (!groupHistoryId) {
            this._collapsedGroups = null;
            return;
        }
        groupUtil
            .restoreCollapsedGroups(groupHistoryId)
            .then((restoredCollapsedGroups: TArrayGroupId) => {
                this._collapsedGroups = restoredCollapsedGroups || collapsedGroups;
            });
    }

    private _isOptionChanged(propertyName: string, newOptions: IControllerOptions): boolean {
        return (
            newOptions[propertyName] !== undefined &&
            !isEqual(newOptions[propertyName], this._options[propertyName]) &&
            !isEqual(newOptions[propertyName], this[`_${propertyName}`])
        );
    }

    private _addFinallyToLoadPromise(
        promise: Promise<LoadPromiseResult>
    ): Promise<LoadPromiseResult> {
        return promise.finally(() => {
            this._loadPromise = null;
        });
    }

    static prepareFilterWithExpandedItems(
        filter: QueryWhereExpression<unknown>,
        expandedItems: TKey[],
        parentProperty: string,
        root: TKey
    ): QueryWhereExpression<unknown> {
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

    private static _getSource(source: ICrud | ICrudPlus | PrefetchProxy): IData & ICrud {
        let resultSource;

        if (source && source['[Types/_source/IDecorator]']) {
            resultSource = (source as IDecorator).getOriginal();

            if (resultSource && resultSource['[Types/_source/IDecorator]']) {
                resultSource = Controller._getSource(resultSource);
            }
        } else {
            resultSource = source;
        }

        return resultSource;
    }

    private static _getOptions<T extends IControllerOptions>(options: T): IControllerOptions {
        const opts = {};

        if (options) {
            for (const optionName of SOURCE_CONTROLLER_OPTIONS) {
                if (options.hasOwnProperty(optionName)) {
                    opts[optionName] = options[optionName];
                }
            }
        }

        return opts;
    }
}
