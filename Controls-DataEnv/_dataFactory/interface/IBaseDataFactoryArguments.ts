/**
 * Интерфейс базовых аргументов фабрики данных
 *
 * @interface Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments
 * @public
 */

/**
 * @typedef {Function} TPrepareValueCallback
 * @description Функция предобработки значений из родительской фабрики данных.
 * @param {unknown} value Текущее значение свойства
 * @returns {unknown} Новое значение свойства
 * @demo Controls-ListEnv-demo/Filter/Lists/Index
 */

/**
 * @typedef {Object} IExtraValue
 * @description Описание элемента привязки значений между фабриками
 * @property {string} propName Название свойства, в которое будет записано значение, полученное из родительской фабрики данных.
 * @property {string} dependencyName Название родительской фабрики в конфигурации данных
 * @property {string} dependencyPropName Название свойства из состояния родительской фабрики данных
 * @property {TPrepareValueCallback} prepare Функция для предобработки значений из родительской фабрики данных перед установкой значения в состояние. Будет вызвана при начальной инициализации контекста и перед вызовом загрузки в зависимой фабрике данных.
 */

/**
 * @name Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments#loadDataTimeout
 * @cfg {number} Таймаут загрузки данных.
 * @default 10000
 */

/**
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
 * @name Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments#sliceExtraValues
 * @remark Привязка значений работает только в одну сторону от родителя к ребенку.
 * @cfg {Array.<IExtraValue>} Набор связей между слайсами. Нужно использовать в случае, если один слайс зависит от другого.
 * @demo Controls-ListEnv-demo/Search/Lists/ExtraValues
 */

/**
 * @example
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
 * @name Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments#loaderExtraValues
 * @cfg {Array.<IExtraValue>} Набор связей между методами загрузки фабрик данных. Нужно использовать в случае необходимости получить одно из значений в результате загрузки другой фабрики данных.
 * @remark
 * При указании опции загрузка вызывается в порядке очереди. После получения данных фабрики, указанной в свойстве dependencyName будет вызвана загрузка зависимой фабрики.
 * @demo Controls-ListEnv-demo/Search/Lists/ExtraValues
 */

export interface IExtraValue {
    propName: string;
    dependencyName: string;
    dependencyPropName: string;
    prepare?(value: unknown): unknown;
}

export type TExtraValues = IExtraValue[];

export interface IBaseDataFactoryArguments {
    loadDataTimeout?: number;
    loaderExtraValues?: TExtraValues;
    sliceExtraValues?: TExtraValues;
}
