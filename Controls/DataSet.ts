import {
    INavigationSourceConfig,
    IBasePositionSourceConfig,
    IBasePageSourceConfig,
    TNavigationDirection,
    TNavigationSource,
} from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import {
    ICrud,
    CrudEntityKey,
    Query,
    QueryOrderSelector,
    QueryWhereExpression,
} from 'Types/source';
import { default as QueryBuilder } from 'Controls/_DataSet/QueryBuilder';
import { NavigationController } from 'Controls/dataSource';

type TRoot = CrudEntityKey | null;

interface IPagination {
    source: TNavigationSource;
    sourceConfig: INavigationSourceConfig;
}

export interface IQueryParams {
    expandedKey?: CrudEntityKey;
    direction?: TNavigationDirection;
    nextRoot?: TRoot;
    pagination?: IBasePositionSourceConfig | IBasePageSourceConfig;
}

export interface IDataSetProps {
    /**
     * Источник данных
     */
    source: ICrud;
    /**
     * Набор полей в выборке
     * @example
     * <pre class="brush: js;">
     *     fields: ['Дата', 'Название', 'Сотрудник']
     * </pre>
     */
    fields?: string[];
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
     * Описание пагинации для загрузки данных по частям.
     */
    pagination?: IPagination;
    /**
     * Идентификатор корневого узла
     */
    root?: TRoot;
}

/**
 * Класс для работы со списочными данными.
 * Подробнее можно прочитать в статье {@link https://n.sbis.ru/article/ca7c0546-07b9-4af3-b231-ad0508dd7ff0}.
 * @public
 * @expample
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
    #props: IDataSetProps;
    #navigationController?: NavigationController;

    constructor(props: IDataSetProps) {
        this.#props = { ...props };
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
    load(pagination?: IBasePositionSourceConfig | IBasePageSourceConfig): Promise<RecordSet> {
        return this.#load({ pagination });
    }

    /**
     * Загрузить порцию данных назад
     */
    prev(): Promise<RecordSet> {
        return this.#load({ direction: 'backward' });
    }

    /**
     * Загрузить порцию данных вперед
     */
    next(): Promise<RecordSet> {
        return this.#load({ direction: 'forward' });
    }

    /**
     * Загрузить данные для переданного корня
     */
    changeRoot(nextRoot: TRoot): Promise<RecordSet> {
        return this.#load({ nextRoot }).finally(() => {
            this.#props.root = nextRoot;
        });
    }

    /**
     * Загрузить данные для узла
     */
    expand(expandedKey: CrudEntityKey): Promise<RecordSet> {
        return this.#load({ expandedKey });
    }

    #getQuery(queryParams?: IQueryParams): Query {
        return this.#getQueryBuilder(queryParams).getQuery();
    }

    #updateQuery(loadedItems: RecordSet, queryParams?: IQueryParams): void {
        return this.#getQueryBuilder(queryParams).updateQuery(loadedItems);
    }

    #getQueryBuilder(queryParams?: IQueryParams): QueryBuilder {
        return new QueryBuilder({
            ...this.#props,
            ...queryParams,
            pagination: queryParams?.pagination,
            navigationController: this.#getNavigationController(),
        });
    }

    #getNavigationController(): NavigationController {
        if (!this.#navigationController && this.#props.pagination) {
            this.#navigationController = new NavigationController({
                navigationType: this.#props.pagination.source,
                navigationConfig: this.#props.pagination.sourceConfig,
            });
        }

        return this.#navigationController;
    }

    #load(queryParams?: IQueryParams): Promise<RecordSet> {
        return this.#query(queryParams).then((items) => {
            this.#updateQuery(items, queryParams);
            return items;
        });
    }

    #query(queryParams?: IQueryParams): Promise<RecordSet> {
        return this.#props.source.query(this.#getQuery(queryParams)).then((dataSet) => {
            let result;

            if (dataSet.getAll) {
                result = dataSet.getAll();
            } else {
                result = dataSet as unknown as RecordSet;
            }

            return result;
        });
    }
}
