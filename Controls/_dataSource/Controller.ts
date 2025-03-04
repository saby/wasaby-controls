/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    ICrud,
    ICrudPlus,
    QueryOrderSelector,
    QueryWhereExpression,
    CrudEntityKey,
    ServicePoolCallHandler,
    Rpc,
    PrefetchProxy,
} from 'Types/source';
import type {
    Direction,
    IBaseSourceConfig,
    INavigationOptionValue,
    INavigationSourceConfig,
    IMultiBaseSourceConfig,
    TKey,
    TNavigationPagingMode,
    TFilter,
    TSortingOptionValue,
    TSourceOption,
} from 'Controls/interface';
import type { IReloadItemOptions, TArrayGroupId } from 'Controls/list';
import type { TNodeLoadCallback } from 'Controls/baseTree';
import type { Path } from './Utils/calculatePath';
import { ISourceControllerProps } from './Controller/ISourceController';
import getRealSourceControllerProps from './Controller/getRealSourceControllerProps';
import { getState as getStateFromMemory } from 'Controls/_dataSource/Controller/LocalMemoryState';
import getStateFromUrl from 'Controls/_dataSource/Controller/getStateFromUrl';
import getSavedParams from 'Controls/_dataSource/Controller/getSavedParams';
import { loadFilterDescriptionDeps } from 'Controls/_dataSource/Controller/filter';
import ISourceControllerLoadResult from 'Controls/_dataSource/Controller/ISourceControllerLoadResult';

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

import { isEqual } from 'Types/object';
import { mixin } from 'Types/util';
import groupUtil from './Utils/GroupUtil';
import { nodeHistoryUtil } from './Utils/nodeHistoryUtil';
import { RecordSetDiffer, calculateAddItemsChanges } from './RecordSetDiffer';
import { calculateBreadcrumbsData } from 'Controls/_dataSource/Utils/calculateBreadcrumbsData';
import { default as DataSet, IDataSetProps } from 'Controls/_dataSource/DataSet';
import prepareFilterWithExpandedItems from './Utils/prepareFilterWithExpandedItems';
import getOriginalSource from './DataSet/getOriginalSource';
import isExpandAll from './DataSet/isExpandAll';

/**
 * Состояние SourceController
 * @private
 */
export interface IControllerState {
    keyProperty?: string;
    source: ICrud | ICrudPlus;

    sorting: QueryOrderSelector;
    filter: QueryWhereExpression<unknown>;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;

    parentProperty?: string;
    root?: TKey;

    items: RecordSet;
    breadCrumbsItems: Path;
    backButtonCaption: string;
    breadCrumbsItemsWithoutBackButton: Path;

    sourceController: Controller;
    dataLoadCallback: Function;

    expandedItems?: TKey[];
}

type TNavSourceConfig = IMultiBaseSourceConfig | IBaseSourceConfig;

interface ILoadConfig {
    filter?: QueryWhereExpression<unknown>;
    sorting?: QueryOrderSelector;
    key?: TKey;
    navigationSourceConfig?: TNavSourceConfig;
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
 * @deprecated Класс устарел и не рекомендуется к использованию.
 * Если вам требуется синхронное построение контрола, задайте ему опцию storeId или items (если опция storeId не поддерживается).
 */

export default class Controller extends mixin<ObservableMixin>(ObservableMixin) {
    private _options: ISourceControllerProps;
    private _filter: QueryWhereExpression<unknown>;
    private _items: RecordSet;
    private _recordSetDiffer: RecordSetDiffer;
    private _dataSet?: DataSet;
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
    private _loadPromise?: CancelablePromise<RecordSet | Error>;
    private _prepareFilterPromise?: CancelablePromise<Record<string, unknown> | Error>;
    private _loadError?: Error;
    private _processCollectionChangeEvent: boolean = true;

    private _dataLoadCallback: Function | void;
    // Это костыль, чтобы работали списки с иерархией без storeId,
    // они сейчас внутри работают через слайс, в слайсе callback'ов нет
    // поэтому для совместимости callback'и (dataLoadCallback и nodeLoadCallback)
    // хранятся на sourceController'e
    private _nodeLoadCallback: TNodeLoadCallback | void;
    private _nodeDataMoreLoadCallback: Function;
    // Необходимо для совместимости в случае, если dataLoadCallback задают на списке, а где-то сверху есть dataContainer
    private _dataLoadCallbackFromOptions: Function | void;

    private _navigation?: INavigationOptionValue<INavigationSourceConfig>;

    private _parentProperty: string;
    private _root: TKey = null;
    private _sorting: TSortingOptionValue;
    private _hierarchyRelation: relation.Hierarchy;

    private _expandedItems: TKey[];
    private _collapsedGroups?: TArrayGroupId;

    constructor(props: ISourceControllerProps) {
        super();
        EventRaisingMixin.initMixin(this);
        const sourceControllerProps = { ...props };

        if (props.listConfigStoreId) {
            Object.assign(sourceControllerProps, getStateFromMemory(props.listConfigStoreId) || {});
        }

        if (props.storeId) {
            Object.assign(sourceControllerProps, getStateFromUrl(props.storeId));
        }

        if (!sourceControllerProps.filterDescription && sourceControllerProps.filterButtonSource) {
            sourceControllerProps.filterDescription = sourceControllerProps.filterButtonSource;
            Logger.warn(
                'Controls-DataEnv/list:loadData: Свойство filterButtonSource устарело. Вместо него необходимо использовать filterDescription'
            );
        }

        const {
            root,
            sorting,
            dataLoadCallback,
            error,
            expandedItems,
            groupHistoryId,
            items,
            filter,
            navigation,
            collapsedGroups,
            parentProperty,
        } = sourceControllerProps;

        this._initRecordSetDiffer();
        this._dragRandomId = randomId();
        this._options = getRealSourceControllerProps(sourceControllerProps);
        this._setFilter(filter || {});
        this._setNavigation(navigation);

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
            this._restoreCollapsedGroups(groupHistoryId, collapsedGroups);
        }
        if (parentProperty !== undefined) {
            this.setParentProperty(parentProperty);
        }

        if (items) {
            this.setItems(items);
        }

        if (error instanceof Error) {
            this._loadError = error;
        }
    }

    private _initRecordSetDiffer() {
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
            if (this._dataSet) {
                this._dataSet.setItems(newItems, true);
            }
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
        navigationSourceConfig?: TNavSourceConfig,
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

    async loadData(_clearResult?: boolean): Promise<ISourceControllerLoadResult> {
        const { root, sorting, countFilterValue } = await getSavedParams(this._options);
        const { listConfigStoreId, filterDescription, parentProperty, source } = this._options;
        let navConfig;
        let loadDataPromise;

        if (root !== undefined) {
            this.setRoot(root);
        }

        if (sorting !== undefined) {
            this.setSorting(sorting);
        }

        if (!this.getItems() && source) {
            if (listConfigStoreId) {
                navConfig = getStateFromMemory(listConfigStoreId)?.navigationSourceConfig;
            }
            loadDataPromise = this.reload(navConfig, true);
        }
        let loadFilterDescriptionPromise;

        if (filterDescription) {
            loadFilterDescriptionPromise = loadFilterDescriptionDeps(
                filterDescription,
                this._options,
                countFilterValue || this._options.countFilterValue
            );
        }

        return Promise.allSettled([loadFilterDescriptionPromise, loadDataPromise]).then(
            ([filterDescriptionResult]) => {
                const loadResult: ISourceControllerLoadResult = {
                    source: this._options.source
                        ? new PrefetchProxy({
                              target: this._options.source,
                              data: {
                                  query: this.getLoadError() || this.getItems(),
                              },
                          })
                        : undefined,
                    items: this.getItems(),
                    data: this.getItems(),
                    collapsedGroups: this.getCollapsedGroups(),
                    error: this.getLoadError(),
                    sorting: this.getSorting(),
                    filter: this.getFilter(),
                };

                if (parentProperty) {
                    loadResult.expandedItems = this.getExpandedItems();
                    loadResult.root = this.getRoot();
                }

                if (filterDescription) {
                    loadResult.filterDescription =
                        filterDescriptionResult.status === 'fulfilled'
                            ? filterDescriptionResult.value || filterDescription
                            : filterDescription;
                    loadResult.historyItems = this._options.historyItems;
                }

                return loadResult;
            }
        );
    }

    /**
     * Перезагружает данные из источника данных
     * @param {SourceConfig} sourceConfig Конфигурация навигации источника данных (например, размер и номер страницы для постраничной навигации), которую можно передать при вызове reload, чтобы перезагрузка произошла с этими параметрами. По умолчанию перезагрузка происходит с параметрами, переданными в опции {@link Controls/interface:INavigation#navigation navigation}.
     * @param {Boolean} isFirstLoad Флаг первичной загрузки.
     * @return {Types/collection:RecordSet}
     */
    reload(
        sourceConfig?: TNavSourceConfig,
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

    reloadItem(key: TKey, options: IReloadItemOptions = {}): Promise<Model | RecordSet | Error> {
        const items = this.getItems();
        const keyProperty = this.getKeyProperty();

        let reloadItemPromise;
        let itemsCount;

        const getReloadableItemIndex = () => {
            return keyProperty ? items.getIndexByValue(keyProperty, key) : -1;
        };

        const loadCallback = (item: Model): void => {
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
            let navigationSourceConfig;

            if (this._options.navigation?.sourceConfig) {
                navigationSourceConfig = {
                    ...this._options.navigation.sourceConfig,
                    multiNavigation: false,
                };
            }

            reloadItemPromise = this.executeLoad({
                filter,
                navigationSourceConfig,
                addItemsAfterLoad: false,
            }).then((loadedItems) => {
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

        return reloadItemPromise.catch((error: Error) => {
            process({ error });
            return Promise.reject(error);
        });
    }

    /**
     * Читает запись из источника данных
     * @param {string|number} key Первичный ключ записи
     * @param {object} meta Дополнительные мета данные
     */
    read(key: TKey, meta?: object): Promise<EntityRecord> {
        return this._callSourceMethod<EntityRecord>('read', key, key, meta);
    }

    /**
     * Обновляет запись в источнике данных
     * @param {Types/entity:Record} item Обновляемая запись или рекордсет
     */
    update(item: Model): Promise<void> {
        return this._callSourceMethod<void>('update', item.getKey(), item);
    }

    /**
     * Создает пустую запись через источник данных (при этом она не сохраняется в хранилище)
     * @param {object} meta Дополнительные мета данные, которые могут понадобиться для создания записи
     * @return {Promise<Record>}
     */
    create(meta?: object): Promise<EntityRecord> {
        return this._callSourceMethod<EntityRecord>('create', void 0, meta);
    }

    /**
     * Устанавливает новый набор элементов коллекции.
     * @param {Types/collection:RecordSet} items набор элементов коллекции.
     */
    setItems(items: RecordSet, keepNavigation?: boolean): RecordSet {
        this._getDataSet().setItems(items, keepNavigation);
        this._addItems(items, this._root);
        return this._items;
    }

    setItemsAfterLoad(
        items: RecordSet,
        sourceConfig?: TNavSourceConfig,
        keepNavigation?: boolean,
        direction?: Direction
    ): LoadPromiseResult {
        this._getDataSet().updateQuery(items, {
            direction: NAVIGATION_DIRECTION_COMPATIBILITY[direction],
            paginationConfig: sourceConfig,
            keepPagination: keepNavigation,
        });
        return this._processQueryResult(items, {
            key: this._root,
            navigationSourceConfig: sourceConfig,
            keepNavigation,
            direction,
        });
    }

    prependItems(items: RecordSet, key: TKey = this._root): RecordSet {
        this._getDataSet().updateQuery(items, {
            root: this._root,
            loadKey: key,
            direction: 'backward',
        });
        this._addItems(items, key, 'up');
        return this._items;
    }

    appendItems(items: RecordSet, key: TKey = this._root): RecordSet {
        this._getDataSet().updateQuery(items, {
            root: this._root,
            loadKey: key,
            direction: 'forward',
        });
        this._addItems(items, key, 'down');
        return this._items;
    }

    /**
     * Возвращает элементы коллекции
     * @return {Types/collection:RecordSet} коллекция
     */
    getItems(): RecordSet {
        return this._items;
    }

    getKeyProperty(): string | undefined {
        return this._getDataSet().getKeyProperty();
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

    setNavigation(navigation?: INavigationOptionValue<INavigationSourceConfig>): void {
        if (this._navigation !== navigation) {
            this._setNavigation(navigation);
            this._notify('navigationChanged', this._navigation);
        }
    }

    _setNavigation(navigation?: INavigationOptionValue<INavigationSourceConfig>): void {
        this._navigation = navigation;
    }

    getNavigation(): INavigationOptionValue<INavigationSourceConfig> | undefined {
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
        if (this._dataSet) {
            this._dataSet.updateProps(this._getDataSetProps());
        }
    }

    updateOptions(newOptions: ISourceControllerProps): boolean {
        if (this._destroyed) {
            return false;
        }

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

        if (isFilterChanged) {
            this.setFilter(newOptions.filter);
        }

        if (
            newOptions.parentProperty !== undefined &&
            newOptions.parentProperty !== this._options.parentProperty
        ) {
            this.setParentProperty(newOptions.parentProperty);
        }

        if (rootChanged && newOptions.root !== undefined) {
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

        if (newOptions.groupHistoryId !== this._options.groupHistoryId) {
            this._restoreCollapsedGroups(newOptions.groupHistoryId, newOptions.collapsedGroups);
        }

        const isChanged =
            isFilterChanged ||
            isNavigationChanged ||
            isSourceChanged ||
            sortingChanged ||
            (this._parentProperty && rootChanged);

        const resetExpandedItems = newOptions.deepReload && !rootChanged;
        if (isChanged && !(isExpandedItemsChanged || resetExpandedItems || this.isExpandAll())) {
            this.setExpandedItems([]);
        }

        if (
            newOptions.navigationParamsChangedCallback !==
            this._options.navigationParamsChangedCallback
        ) {
            this._getDataSet().setPaginationParamsChangedCallback(
                newOptions.navigationParamsChangedCallback
            );
        }
        this._options = getRealSourceControllerProps(newOptions);
        return !!isChanged;
    }

    getState(): IControllerState {
        const source = getOriginalSource(this._options.source);
        const state: IControllerState = {
            keyProperty: this.getKeyProperty(),
            source,

            filter: this._filter,
            navigation: this._navigation,
            selectFields: this._options.selectFields,

            hasChildrenProperty: this._options.hasChildrenProperty,
            displayProperty: this._options.displayProperty,
            nodeProperty: this._options.nodeProperty,
            parentProperty: this._parentProperty,
            root: this._root,

            deepReload: this._options.deepReload,

            items: this._items,
            breadCrumbsItems: this._breadCrumbsItems,
            backButtonCaption: this._backButtonCaption,
            breadCrumbsItemsWithoutBackButton: this._breadCrumbsItemsWithoutBackButton,
            dragControlId: this._dragRandomId,
            sourceController: this,
            expandedItems: this._options.hasOwnProperty('expandedItems')
                ? this._expandedItems
                : undefined,
            selectedKeys: this._options.selectedKeys,
            excludedKeys: this._options.excludedKeys,
        };
        OPTIONS_FOR_UPDATE_AFTER_LOAD.forEach((optionName) => {
            state[optionName] = this._options[optionName];
        });
        return state;
    }

    getCollapsedGroups(): (string | number)[] | undefined {
        return this._collapsedGroups;
    }

    // FIXME для работы дерева без bind'a опции expandedItems
    setExpandedItems(expandedItems: TKey[]): void {
        this._expandedItems = expandedItems;
    }

    resetCollapsedNodes(newExpandedItems: TKey[]): void {
        const oldExpandedItems: TKey[] = this._expandedItems;
        const items: RecordSet = this._items;
        const parentProperty: string = this._parentProperty;
        const hasOldExpandedItems = oldExpandedItems instanceof Array && oldExpandedItems.length;
        const hasNewExpandedItems = newExpandedItems instanceof Array && newExpandedItems.length;
        const collapsedItems: TKey[] = [];

        // без navigationController или без items нет смысла обрабатывать свернутые узлы
        // если не было развернутых узлов, то свернутых точно не будет
        // если развернули все узлы, то свернутых узлов точно не будет
        if (
            !items ||
            !hasOldExpandedItems ||
            (hasNewExpandedItems && newExpandedItems[0] === null)
        ) {
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
            this.resetNavigation(key);

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
        return this._getDataSet().hasMoreData(NAVIGATION_DIRECTION_COMPATIBILITY[direction], key);
    }

    getDataLoadCallback(): Function | void {
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
        this._getDataSet().resetPagination(key);
    }

    /**
     * Возвращает признак, была ли выполнена загрузка узла по переданному идентификатору
     * @param {string|number} key Идентификатор узла
     */
    hasLoaded(key: TKey): boolean {
        return this._getDataSet().hasLoaded(key);
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
    ): IBaseSourceConfig | void {
        return this._getDataSet().shiftToEdge(
            NAVIGATION_DIRECTION_COMPATIBILITY[direction],
            id,
            shiftMode
        );
    }

    /**
     * Отменяет текущий активный запрос к источнику данных
     */
    cancelLoading(): void {
        if (this._loadPromise) {
            this._loadPromise.cancel();
            this._loadPromise = undefined;
        }
        if (this._prepareFilterPromise) {
            this._prepareFilterPromise.cancel();
            this._prepareFilterPromise = undefined;
        }
    }

    getOptions(): ISourceControllerProps {
        return this._options;
    }

    isExpandAll(): boolean {
        return isExpandAll(this.getExpandedItems());
    }

    /**
     * Возвращает источник, переданный в опции {@link source}
     * @return {Types/source:ICrud | Types/source:ICrudPlus} источник данных
     */

    getSource(): TSourceOption | undefined {
        return this._options.source;
    }

    /**
     * Разрушает экземпляр класса.
     * Выполняет отмену запросов, а так же необходимые отписки от событий.
     */
    destroy(): void {
        this.cancelLoading();

        this._unsubscribeItemsCollectionChangeEvent();
        this._unsubscribeBreadcrumbsChange();
        this._destroyDataSet();
        this._dataLoadCallback = undefined;
        this._dataLoadCallbackFromOptions = undefined;
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

    applyNavigationChanges(...args: Parameters<DataSet['applyPaginationChanges']>) {
        this._getDataSet().applyPaginationChanges(...args);
    }

    calculateNavigationChanges(
        list: RecordSet,
        loadConfig: ILoadConfig
    ): ReturnType<DataSet['calculatePaginationChanges']> {
        const {
            key,
            navigationSourceConfig,
            direction,
            keepNavigation: keepPagination,
        } = loadConfig;

        return this._getDataSet().calculatePaginationChanges(list, {
            direction: NAVIGATION_DIRECTION_COMPATIBILITY[direction],
            keepPagination,
            loadKey: key,
            paginationConfig: navigationSourceConfig,
        });
    }

    private _getDataSet(props?: Partial<IDataSetProps>): DataSet {
        if (!this._dataSet) {
            this._dataSet = this._createDataSet(props);
        }
        return this._dataSet;
    }

    private _destroyDataSet(): void {
        this._dataSet?.destroy();
        this._dataSet = undefined;
    }

    private _createDataSet(props?: Partial<IDataSetProps>): DataSet {
        return new DataSet({ ...this._getDataSetProps(), ...props });
    }

    private _getDataSetProps(): IDataSetProps {
        return {
            source: this.getSource(),
            items: this.getItems(),
            filter: this.getFilter(),
            keyProperty: this._options.keyProperty,
            sorting: this.getSorting(),
            parentProperty: this.getParentProperty(),
            nodeProperty: this._options.nodeProperty,
            root: this.getRoot(),
            expandedItems: this.getExpandedItems(),
            fields: this._options.selectFields,
            hasChildrenProperty: this._options.hasChildrenProperty,
            childrenProperty: this._options.childrenProperty,
            pagination: this.getNavigation(),
            paginationParamsChangedCallback: this._options.navigationParamsChangedCallback,
            deepReload: this._options.deepReload,
            deepScrollLoad: this._options.deepScrollLoad,
        };
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
                    : this._getFilterHierarchy(filter || this._filter, key, isFirstLoad, direction);
            this.cancelLoading();
            this._notifyLoadStarted(key, direction);
            this._prepareFilterPromise = new CancelablePromise(filterPromise);

            const callHandler = new ServicePoolCallHandler();
            const source = this.getSource();
            if (source instanceof Rpc && source && useServicePool) {
                source.callHandlers.add(callHandler);
            }

            this._loadPromise = new CancelablePromise(
                this._prepareFilterPromise.promise.then((preparedFilter) => {
                    let requestResult;
                    if (this._options.loadTimeout) {
                        requestResult = wrapTimeout(
                            this._query({
                                ...loadConfig,
                                filter: preparedFilter,
                            }),
                            this._options.loadTimeout
                        ).catch((error: Error) => {
                            return Promise.reject(
                                error instanceof Error
                                    ? error
                                    : new fetch.Errors.HTTP({
                                          httpError: HTTPStatus.GatewayTimeout,
                                          message: '',
                                          url: '',
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
                })
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
                        if (!error.isCanceled && !error.canceled && !error.isForbiddenRPCJSON) {
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

    private _query(loadConfig: ILoadConfig): LoadResult {
        const {
            direction,
            navigationSourceConfig,
            filter,
            addItemsAfterLoad,
            key,
            keepNavigation,
        } = loadConfig;
        let result;
        const dataSetProps = {
            ...this._getDataSetProps(),
            filter: filter || this.getFilter(),
        };

        if (this._dataSet) {
            this._dataSet.updateProps(dataSetProps);
        }

        const dataSet = this._getDataSet(dataSetProps);

        if (direction) {
            result = dataSet[direction === 'down' ? 'next' : 'prev'](key, addItemsAfterLoad);
        } else if (key !== this._root && key !== undefined) {
            result = dataSet.expand(key, addItemsAfterLoad);
        } else {
            result = dataSet.load(navigationSourceConfig || keepNavigation, addItemsAfterLoad);
        }

        return result;
    }

    private _getFilterHierarchy(
        initialFilter: QueryWhereExpression<unknown>,
        root: TKey = this._root,
        isFirstLoad?: boolean,
        direction?: Direction
    ): Promise<QueryWhereExpression<unknown>> {
        const parentProperty = this._parentProperty;
        let resultFilter: Record<string, unknown>;
        const { selectedKeys, source, expandedItems, nodeHistoryId, excludedKeys, deepScrollLoad } =
            this._options;
        if (parentProperty) {
            return this._resolveExpandedHierarchyItems(
                { expandedItems, nodeHistoryId },
                isFirstLoad
            ).then((expandedItems) => {
                this.setExpandedItems(expandedItems);
                resultFilter = { ...initialFilter };
                const isLoadToDirectionWithExpandedItems = direction && deepScrollLoad;
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
                if (selectedKeys && selectedKeys.length && source) {
                    return import('Controls/operations').then((operations) => {
                        resultFilter.entries = operations.selectionToRecord(
                            {
                                selected: selectedKeys,
                                excluded: excludedKeys || [],
                            },
                            getOriginalSource(source)?.getAdapter()
                        );
                        return resultFilter;
                    });
                }

                return resultFilter;
            });
        }
        return Promise.resolve(initialFilter);
    }

    getItemsCountForRoot(key: CrudEntityKey): number {
        return this._getHierarchyRelation().getChildren(key, this._items).length;
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
        options: Pick<ISourceControllerProps, 'nodeHistoryId' | 'expandedItems'>,
        isFirstLoad?: boolean
    ): Promise<TKey[]> {
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

    private _processQueryResult(result: RecordSet, loadConfig: ILoadConfig): LoadPromiseResult {
        const { key, navigationSourceConfig, direction } = loadConfig;
        const loadedInCurrentRoot = key === this._root;

        let methodResult;
        let dataLoadCallbackResult;

        if (loadedInCurrentRoot && this._dataLoadCallback) {
            dataLoadCallbackResult = this._dataLoadCallback(result, direction, this._options.id);
        } else if (this._nodeDataMoreLoadCallback) {
            // Вызываем только когда подгружают узел, определяется по loadedInCurrentRoot
            this._nodeDataMoreLoadCallback(key, result);
        }

        if (loadedInCurrentRoot) {
            dataLoadCallbackResult =
                this._notify('dataLoad', result, direction, navigationSourceConfig) ||
                dataLoadCallbackResult;
        }

        if (dataLoadCallbackResult instanceof Promise) {
            methodResult = dataLoadCallbackResult.then((newResult) => {
                this._loadFinished(newResult || result, key, direction, navigationSourceConfig);
                return this._addItems(newResult || result, key, direction);
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
        this._loadPromise = undefined;
        this._loadError = undefined;
        this._prepareFilterPromise = undefined;
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

    private _processQueryError(
        queryError: Error & { processed?: boolean },
        key?: TKey,
        direction?: Direction
    ): Error {
        this._loadPromise = undefined;
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

    private _notifyLoadError(
        error: Error,
        key?: TKey,
        direction?: Direction,
        reason?: string
    ): void {
        this._notify('dataLoadError', error, key, direction, this._options.id, reason);
    }

    private _callSourceMethod<T>(
        ...args: [
            methodName: keyof Omit<ICrud, '[Types/_source/ICrud]'>,
            key: TKey | undefined,
            ...callArgs: unknown[],
        ]
    ): Promise<T> {
        const source = this._options.source as ICrud;
        const [methodName, key] = args;
        return source[methodName]
            .apply(source, Array.prototype.slice.call(arguments, 2))
            .catch((error) => {
                this._notifyLoadError(error, key, void 0, methodName);

                if (!error?.processed) {
                    return Promise.reject(error);
                }
            });
    }

    private _subscribeItemsCollectionChangeEvent(items: RecordSet): void {
        this._unsubscribeItemsCollectionChangeEvent();
        if (items) {
            items.subscribe('onCollectionChange', this._collectionChange, this);
            items.subscribe('onPropertyChange', this._collectionPropertyChange, this);
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
            breadcrumbs.subscribe('onCollectionChange', this._onBreadcrumbsCollectionChanged, this);
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
        if (this._isNeedProcessCollectionChangeEvent()) {
            const firstItem = this._getFirstItemFromRoot();
            const lastItem = this._getLastItemFromRoot();

            if (firstItem && lastItem) {
                this._getDataSet().updatePaginationRange(firstItem, lastItem);
            }
        }
    }

    private _collectionPropertyChange(
        _event: EventObject,
        changedProps: Record<string, unknown>
    ): void {
        // FIXME observeMetaData нужен до внедрения схемы работы через контекст
        // сейчас проблема, что в странице и в контроле разные sourceController'ы, у которых ссылка на один recordSet
        if (
            this._options.observeMetaData &&
            this._isNeedProcessCollectionChangeEvent() &&
            changedProps.metaData
        ) {
            this._getDataSet().setItems(this._items);
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

    private _setDataLoadCallbackFromOptions(dataLoadCallback?: Function): void {
        this._dataLoadCallbackFromOptions = dataLoadCallback;
    }

    private _restoreCollapsedGroups(groupHistoryId: string, collapsedGroups?: TKey[]): void {
        if (!groupHistoryId) {
            this._collapsedGroups = undefined;
            return;
        }
        groupUtil
            .restoreCollapsedGroups(groupHistoryId)
            .then((restoredCollapsedGroups: TArrayGroupId) => {
                this._collapsedGroups = restoredCollapsedGroups || collapsedGroups;
            });
    }

    private _isOptionChanged(
        propertyName: keyof Pick<
            ISourceControllerProps,
            'filter' | 'root' | 'sorting' | 'expandedItems'
        >,
        newOptions: ISourceControllerProps
    ): boolean {
        return (
            newOptions[propertyName] !== undefined &&
            !isEqual(newOptions[propertyName], this._options[propertyName]) &&
            !isEqual(newOptions[propertyName], this[`_${propertyName}`])
        );
    }

    private _addFinallyToLoadPromise(
        promise: Promise<LoadPromiseResult>
    ): Promise<LoadPromiseResult> {
        return promise
            .catch((error) => {
                if (error && error.isCanceled) {
                    this._notify('dataLoadCancel', error, this._options.id);
                }
                return Promise.reject(error);
            })
            .finally(() => {
                this._loadPromise = undefined;
            });
    }

    static prepareFilterWithExpandedItems = prepareFilterWithExpandedItems;
}
