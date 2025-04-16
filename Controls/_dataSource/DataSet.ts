import {
    INavigationSourceConfig,
    TNavigationDirection,
    TNavigationSource,
    TKey,
    TSourceOption,
    IBaseSourceConfig,
    TNavigationPagingMode,
    IMultiBaseSourceConfig,
} from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import {
    Query,
    QueryOrderSelector,
    QueryWhereExpression,
    QuerySelectExpression,
    IData,
    ICrud,
    ICrudPlus,
} from 'Types/source';
import type { relation } from 'Types/entity';
import QueryBuilder from './DataSet/QueryBuilder';
import {
    default as NavigationController,
    INavigationChanges,
    INavigationControllerOptions,
} from 'Controls/_dataSource/NavigationController';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import { Model } from 'Types/entity';
import { getRecordSetByHierarchyStrategy } from './getRecordSetByHierarchyStrategy';
import getOriginalSource from './DataSet/getOriginalSource';
import isExpandAll from './DataSet/isExpandAll';

export interface IPagination {
    source: TNavigationSource;
    sourceConfig: INavigationSourceConfig;
}

type TSourceConstructor = new (options: unknown) => TSourceOption;
export type TNavSourceConfig = IMultiBaseSourceConfig | IBaseSourceConfig;

export interface IQueryParams {
    loadKey?: TKey;
    root?: TKey;
    direction?: TNavigationDirection;
    paginationConfig?: TNavSourceConfig;
    keepPagination?: boolean;
    updatePaginationAfterLoad?: boolean;
}

export interface IDataSetProps {
    /**
     * Источник данных
     * @example
     * <pre class="brush: js;">
     *     import { SbisService } from 'Types/source';
     *     import DataSet from 'Controls/DataSet';
     *
     *     const source = new SbisService({...})
     *     const dataSet = new DataSet({
     *         source,
     *         fields: ['Дата', 'Название', 'Сотрудник']
     *     })
     *     const items = await dataSet.load();
     * </pre>
     */
    source?: TSourceOption;
    /**
     * Тип источника данных
     * @remark Указывается в виде строки - пути до модуля с источником, например: 'Types/source:SbisService'
     * @example
     * <pre class="brush: js;">
     *     import DataSet from 'Controls/DataSet';
     *
     *     const dataSet = new DataSet({
     *         sourceType: 'Types/source:SbisService',
     *         sourceOptions: {
     *             endpoint: 'Employee'
     *         }
     *     })
     *     const items = await dataSet.load();
     * </pre>
     */
    sourceType?: string;
    /**
     * Опции источника данных
     * @example
     * <pre class="brush: js;">
     *     import DataSet from 'Controls/DataSet';
     *
     *     const dataSet = new DataSet({
     *         sourceType: 'Types/source:SbisService',
     *         sourceOptions: {
     *             endpoint: 'Employee'
     *         }
     *     })
     *     const items = await dataSet.load();
     * </pre>
     */
    sourceOptions?: Record<string, unknown>;
    /**
     * Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
     */
    keyProperty?: string;
    /**
     * Набор полей в выборке
     * @example
     * <pre class="brush: js;">
     *     fields: ['Дата', 'Название', 'Сотрудник']
     * </pre>
     */
    fields?: QuerySelectExpression;
    /**
     * Набор полей из описания фильтра датасета, с заданными значениями.
     * @example
     * <pre class="brush: js;">
     *     filter: {ДатаС: '26.04.2024', ДатаПо: '27.04.2024', Сотрудник: 12345}
     * </pre>
     */
    filter?: QueryWhereExpression<unknown>;
    /**
     * Упорядоченный массив элементов, содержащий имена полей из описания сортировки датасета, и модификатор означающий направление сортировки.
     * @example
     * <pre class="brush: js;">
     *     sorting: [{name: 'Дата', direction: 'ASC'}, {name: 'Сотрудник', direction: 'DESC'}]
     * </pre>
     */
    sorting?: QueryOrderSelector;
    /**
     * Имя поля, содержащего идентификатор родительского элемента.
     */
    parentProperty?: string;
    /**
     * Имя свойства, содержащего информацию о {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy типе элемента} (лист, узел, скрытый узел).
     */
    nodeProperty?: string;
    /**
     * Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле
     */
    hasChildrenProperty?: string;
    /**
     * Имя поля узла, в котором хранится список детей.
     */
    childrenProperty?: string;
    /**
     * Описание пагинации для загрузки данных по частям.
     */
    pagination?: IPagination;
    /**
     * Идентификатор корневого узла
     */
    root?: TKey;
    /**
     * Начальные данные DataSet'a
     */
    items?: RecordSet;
    /**
     *  Развёрнутые узлы
     */
    expandedItems?: TKey[];
    /**
     * callback который вызывается при изменении состояния пагинации
     */
    paginationParamsChangedCallback?: Function;

    deepReload?: boolean;
    deepScrollLoad?: boolean;
}

/**
 * Класс для работы со списочными данными.
 * Подробнее можно прочитать в статье {@link https://n.sbis.ru/article/ca7c0546-07b9-4af3-b231-ad0508dd7ff0}.
 * @public
 * @example
 * Пример конструирования DataSet'a и загрузка данных
 * <pre class="brush: js;">
 *      import DataSet from 'Controls/DataSet';
 *      import { SbisService } from 'Types/source'
 *
 *      const dataSet = new DataSet({
 *          source: new SbisService({...}),
 *          fields: ['Id', 'Name'],
 *      });
 *
 *      const result = await dataSet.load();
 * </pre>
 *
 * Пример конструирования DataSet'a с навигацией
 * <pre class="brush: js;">
 *      import DataSet from 'Controls/DataSet';
 *      import { SbisService } from 'Types/source'
 *
 *      const dataSet = new DataSet<'page'>({
 *          source: new SbisService({...}),
 *          pagination: {
 *              source: 'page',
 *              sourceConfig: {
 *                  pageSize: 10,
 *                  page: 0,
 *                  hasMore: false,
 *              }
 *          }
 *      });
 *
 *      const result = await dataSet.load();
 *      const nextPageResult = await dataSet.next();
 * </pre>
 */
export default class DataSet {
    _props: IDataSetProps;
    _navigationController?: NavigationController;
    _items?: RecordSet;
    _root: TKey;

    constructor(props: IDataSetProps) {
        this.updateProps(props);

        if (props.items) {
            this._items = props.items;
            this.updateQuery(props.items, { loadKey: this._root });
        }
    }

    /**
     * Загрузить RecordSet
     * @example
     * <pre class="brush: js;">
     *      import DataSet from 'Controls/DataSet';
     *      import { SbisService } from 'Types/source'
     *
     *      const dataSet = new DataSet({
     *          source: new SbisService({...}),
     *          fields: ['Id', 'Name']
     *      });
     *
     *      const result = await dataSet.load();
     * </pre>
     */
    load(
        paginationOrKeepPagination?: TNavSourceConfig | boolean,
        updatePaginationAfterLoad?: boolean
    ): Promise<RecordSet | Error> {
        const queryConfig =
            typeof paginationOrKeepPagination === 'boolean'
                ? { keepPagination: paginationOrKeepPagination }
                : { paginationConfig: paginationOrKeepPagination };

        return this._load({ ...queryConfig, updatePaginationAfterLoad });
    }

    /**
     * Загрузить порцию данных назад
     */
    prev(
        loadKey: TKey = this._root,
        updatePaginationAfterLoad?: boolean
    ): Promise<RecordSet | Error> {
        return this._load({ direction: 'backward', loadKey, updatePaginationAfterLoad });
    }

    /**
     * Загрузить порцию данных вперед
     */
    next(
        loadKey: TKey = this._root,
        updatePaginationAfterLoad?: boolean
    ): Promise<RecordSet | Error> {
        return this._load({ direction: 'forward', loadKey, updatePaginationAfterLoad });
    }

    /**
     * Загрузить данные для переданного корня
     */
    changeRoot(root: TKey): Promise<RecordSet | Error> {
        return this._load({ loadKey: root, root }).finally(() => {
            this._root = root;
        });
    }

    /**
     * Загрузить данные для узла
     */
    expand(loadKey: TKey, updatePaginationAfterLoad?: boolean): Promise<RecordSet | Error> {
        return this._load({ loadKey, updatePaginationAfterLoad });
    }

    /**
     * Развёрнуты ли все узлы
     */
    isExpandAll(): boolean {
        return isExpandAll(this._props.expandedItems);
    }

    updateProps(props: IDataSetProps): void {
        const pagination = props.pagination;
        if (pagination && this._hasPaginationBySource(pagination)) {
            if (this._navigationController) {
                this._navigationController.updateOptions(this._getNavigationControllerProps(props));
            }
        } else {
            this._destroyNavigationController();
        }
        this._props = { ...props };
        this._root = props.root ?? null;
    }

    /**
     * Возвращает поле с первчиным ключем записей
     */
    getKeyProperty(): string | undefined {
        const { keyProperty } = this._props;
        const source = getOriginalSource(this._props.source);

        function isIDataSource(source?: TSourceOption): source is IData & ICrud & ICrudPlus {
            return Boolean(source && (source as IData).getKeyProperty !== undefined);
        }

        if (keyProperty) {
            return keyProperty;
        } else if (isIDataSource(source)) {
            return source.getKeyProperty();
        } else if (this._items) {
            return this._items.getKeyProperty();
        }
    }

    setItems(items: RecordSet, keepPagination?: boolean): void {
        if (this._hasPaginationBySource() && items && !keepPagination) {
            this._destroyNavigationController();
            this.updateQuery(items, { loadKey: this._root, keepPagination });
        }
        this._items = items;
    }

    /**
     * Есть ли ещё порции данных для загрузки вперёд/назад
     */
    hasMoreData(direction: TNavigationDirection, key = this._root): boolean {
        let hasMoreData = false;

        if (this._hasPaginationBySource()) {
            hasMoreData = this._getNavigationController().hasMoreData(direction, key);
        }

        return hasMoreData;
    }

    /**
     * Возвращает загружен узел или нет
     * @param {string|number} key Идентификатор узла
     */
    hasLoaded(key: TKey): boolean {
        let loadedResult = false;
        const { hasChildrenProperty, childrenProperty } = this._props;
        const items = this._items;

        if (!items) {
            return false;
        }

        if (this._hasPaginationBySource()) {
            loadedResult = this._getNavigationController().hasLoaded(key);
        } else if (this._props.parentProperty) {
            const childItems = getRecordSetByHierarchyStrategy(
                childrenProperty,
                this._root,
                items,
                key
            );
            loadedResult = Boolean(
                items &&
                    QueryBuilder.getHierarchyRelation(this._props).getChildren(
                        key as relation.HierarchyNodeKey,
                        childItems
                    ).length
            );
        }

        if (!loadedResult && hasChildrenProperty) {
            loadedResult = !items
                .getRecordById(key as relation.HierarchyNodeKey)
                ?.get(hasChildrenProperty);
        }

        return loadedResult;
    }

    /**
     * Выполняет сброс пагинации
     * @param {string|number} key Идентификатор узла, для которого надо выполнить сброс навигации
     * @remark Если в функцию не передать индентификатор узла, то навигация будет сброшена для всех узлов и корня
     */
    resetPagination(key?: TKey): void {
        if (key !== undefined && this._navigationController) {
            this._getNavigationController().reset(key);
        } else {
            this._destroyNavigationController();
        }
    }

    /**
     * Обновить границы пагинации
     * @param {Types/entity:Model} firstItem Первый элемент коллекции
     * @param {Types/entity:Model} lastItem Последний элемент коллекции
     */
    updatePaginationRange(firstItem: Model, lastItem: Model): void {
        if (this._items?.getCount() && this._hasPaginationBySource()) {
            this._getNavigationController().updateQueryRange(
                this._items,
                this._root,
                firstItem,
                lastItem
            );
        }
    }

    shiftToEdge(
        direction: TNavigationDirection,
        id: TKey,
        shiftMode: TNavigationPagingMode
    ): IBaseSourceConfig | void {
        if (this._hasPaginationBySource()) {
            return this._getNavigationController().shiftToEdge(direction, id, shiftMode);
        }
    }

    setPaginationParamsChangedCallback(callback?: Function): void {
        if (this._hasPaginationBySource() && callback) {
            this._props.paginationParamsChangedCallback = callback;
            this._getNavigationController().setNavigationParamsChangedCallback(callback);
        }
    }

    calculatePaginationChanges(
        loadedItems: RecordSet,
        queryParams: IQueryParams
    ): INavigationChanges | undefined {
        const { direction, keepPagination, root, loadKey } = queryParams;
        const { pagination, expandedItems } = this._props;
        const isRoot = root === loadKey || loadKey === undefined;
        const isMultiNavigation = QueryBuilder.isMultiPagination(pagination);
        const resetNavigation = !direction && isRoot && !keepPagination;
        const resetMultiNavigation = !isMultiNavigation || (isRoot && !keepPagination);
        const hasExpandedItems = !!expandedItems?.length;
        if (
            resetNavigation &&
            (resetMultiNavigation || !hasExpandedItems || isExpandAll(expandedItems))
        ) {
            this._destroyNavigationController();
        }

        return this._getQueryBuilder(
            queryParams,
            this._getNavigationController()
        ).calculatePaginationChanges(loadedItems);
    }

    applyPaginationChanges(changes?: INavigationChanges): void {
        if (!changes) {
            return;
        }
        const navigationController = this._getNavigationController();
        navigationController.applyChanges(changes);
    }

    destroy(): void {
        this._destroyNavigationController();
        this._items = undefined;
    }

    _getQuery(queryParams?: IQueryParams): Query {
        let navigationController;

        if (this._hasPaginationBySource()) {
            if (queryParams?.root === undefined || queryParams.root === this._props.root) {
                navigationController = this._getNavigationController();
            } else {
                navigationController = this._createNavigationController();
            }
        }
        return this._getQueryBuilder(queryParams, navigationController).getQuery();
    }

    updateQuery(loadedItems: RecordSet, queryParams: IQueryParams): void {
        if (this._hasPaginationBySource()) {
            this.applyPaginationChanges(
                this.calculatePaginationChanges(loadedItems, {
                    root: this._root,
                    loadKey: queryParams.loadKey !== undefined ? queryParams.loadKey : this._root,
                    ...queryParams,
                })
            );
        }
    }

    _getQueryBuilder(
        queryParams?: IQueryParams,
        navigationController?: NavigationController
    ): QueryBuilder {
        return new QueryBuilder({
            ...this._props,
            ...queryParams,
            root: queryParams?.root !== undefined ? queryParams?.root : this._root,
            navigationController,
        });
    }

    _getNavigationController(): NavigationController {
        if (!this._navigationController) {
            this._navigationController = this._createNavigationController();
        }

        return this._navigationController;
    }

    _createNavigationController(props: IDataSetProps = this._props): NavigationController {
        return new NavigationController(this._getNavigationControllerProps(props));
    }

    _getNavigationControllerProps(props: IDataSetProps): INavigationControllerOptions {
        const pagination = props.pagination as IPagination;
        return {
            navigationType: pagination.source,
            navigationConfig: pagination.sourceConfig,
            navigationParamsChangedCallback:
                props.paginationParamsChangedCallback ||
                this._props.paginationParamsChangedCallback,
        };
    }

    _destroyNavigationController(): void {
        if (this._navigationController) {
            this._navigationController.destroy();
            this._navigationController = undefined;
        }
    }

    _load(queryParams: IQueryParams): Promise<RecordSet | Error> {
        return this._query(queryParams)
            .then((items) => {
                if (items instanceof RecordSet) {
                    if (!this._items) {
                        this._items = items;
                    }
                    if (queryParams.updatePaginationAfterLoad !== false) {
                        this.updateQuery(items, queryParams);
                    }
                } else {
                    Logger.error(
                        'Controls/DataSet источник данных должен возвращать Types/collection:RecordSet.'
                    );
                }
                return items;
            })
            .catch((error: Error) => {
                if (!queryParams.direction) {
                    this._destroyNavigationController();
                }
                return Promise.reject(error);
            });
    }

    _query(queryParams?: IQueryParams): Promise<RecordSet> {
        return this._getSource(queryParams?.direction).then((source) => {
            return source.query(this._getQuery(queryParams)).then((dataSet) => {
                const keyProperty = this.getKeyProperty();
                let result;

                if (keyProperty && keyProperty !== dataSet?.getKeyProperty?.()) {
                    dataSet.setKeyProperty(keyProperty);
                }

                if (dataSet.getAll) {
                    result = dataSet.getAll();
                } else {
                    result = dataSet as unknown as RecordSet;
                }

                return result;
            });
        });
    }

    _getSource(direction?: TNavigationDirection): Promise<TSourceOption> {
        if (this._props.source) {
            const source = direction ? getOriginalSource(this._props.source) : this._props.source;
            return Promise.resolve(source as TSourceOption);
        } else if (this._props.sourceType) {
            return loadAsync<TSourceConstructor>(this._props.sourceType).then((Source) => {
                return new Source(this._props.sourceOptions || {});
            });
        } else {
            throw new Error('Controls/DataSet укажите источник данных');
        }
    }

    _hasPaginationBySource(pagination = this._props.pagination): pagination is IPagination {
        return Boolean(pagination && pagination.source);
    }
}
