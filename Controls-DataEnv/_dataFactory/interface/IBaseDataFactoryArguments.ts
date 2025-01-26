/**
 * Описание элемента привязки значений между фабриками
 * @public
 */
export interface IExtraValue {
    /**
     * Название свойства, в которое будет записано значение, полученное из родительской фабрики данных.
     */
    propName: string;
    /**
     * Название родительской фабрики в конфигурации данных
     */
    dependencyName: string;
    /**
     * Название свойства из состояния родительской фабрики данных
     */
    dependencyPropName: string;

    /**
     * Функция для предобработки значений из родительской фабрики данных перед установкой значения в состояние. Будет вызвана при начальной инициализации контекста и перед вызовом загрузки в зависимой фабрике данных.
     * @demo Controls-ListEnv-demo/Filter/Lists/Index
     * @returns Новое значение свойства
     */
    prepare?(value: unknown, prevValue?: unknown, state?: unknown): unknown;
}

/**
 *
 */
export type TExtraValues = IExtraValue[];

/**
 * Интерфейс базовых аргументов фабрики данных
 * @public
 */
export interface IBaseDataFactoryArguments {
    /**
     * Таймаут загрузки данных.
     * @default 10000
     */
    loadDataTimeout?: number;
    /**
     * Набор связей между методами загрузки фабрик данных. Нужно использовать в случае необходимости получить одно из значений в результате загрузки другой фабрики данных. * @example
     * <pre class="brush: js">
     * const configs = {
     *   search: {
     *      dataFactoryName: 'Controls-ListEnv/searchDataFactory:Factory',
     *      dataFactoryArguments: {},
     *   },
     *   list1: {
     *      dataFactoryName: 'Controls/dataFactory:List',
     *      dataFactoryArguments: {
     *         loaderExtraValues: [{
     *            propName: 'searchValue',
     *            dependencyName: 'search',
     *            dependencyPropName: 'searchValue',
     *        }],
     *     }
     *   }
     *  }
     * </pre>
     * @remark
     * При указании опции загрузка вызывается в порядке очереди. После получения данных фабрики, указанной в свойстве dependencyName будет вызвана загрузка зависимой фабрики.
     * @demo Controls-ListEnv-demo/Search/Lists/ExtraValues
     */
    loaderExtraValues?: TExtraValues;
    /**
     * Набор связей между слайсами. Нужно использовать в случае, если один слайс зависит от другого.
     * @remark Привязка значений работает только в одну сторону от родителя к ребенку.
     * @example
     * <pre class="brush: js">
     * // На примере рассмотрим связь отдельного слайса поиска со списком
     * const configs = {
     *   search: {
     *      dataFactoryName: 'Controls-ListEnv/searchDataFactory:Factory',
     *      dataFactoryArguments: {},
     *   },
     *   list1: {
     *      dataFactoryName: 'Controls/dataFactory:List',
     *      dataFactoryArguments: {
     *         sliceExtraValues: [{
     *            propName: 'searchValue',
     *            dependencyName: 'search',
     *            dependencyPropName: 'searchValue',
     *        }],
     *     }
     *   }
     *  }
     * </pre>
     * @demo Controls-ListEnv-demo/Search/Lists/ExtraValues
     */
    sliceExtraValues?: TExtraValues;
}
