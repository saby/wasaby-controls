/**
 * Интерфейс базовых аргументов фабрики данных
 *
 * @interface Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments
 * @public
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
 * @cfg {Array.<IExtraValue>} Набор связей между аргументами фабрик данных. Нужно использовать в случае, если необходимо передать аргументы из одной фабрики в другую.
 * @demo Controls-ListEnv-demo/Search/Lists/ExtraValues
 */

export interface IExtraValue {
    propName: string;
    dependencyName: string;
    dependencyPropName: string;
}
/**
 * @cfg {Array.<IExtraValue>}
 */
export type TExtraValues = IExtraValue[];

export interface IBaseDataFactoryArguments {
    loadDataTimeout?: number;
    loaderExtraValues?: TExtraValues;
    sliceExtraValues?: TExtraValues;
}
