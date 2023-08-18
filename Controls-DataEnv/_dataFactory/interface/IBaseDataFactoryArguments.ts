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
 *         sliceExtraValues: {
 *            // searchValue - название поля состояния слайса списка,
 *            // search - название слайса поиска в конфиге,
 *            // searchValue - название поля состояния слайса поиска
 *            searchValue: ['search', 'searchValue'],
 *        },
 *     }
 *   }
 *  }
 * </pre>
 * @name Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments#sliceExtraValues
 * @remark Привязка значений работает только в одну сторону от родителя к ребенку.
 * @cfg {TExtraValues} Экстра значения для слайса. Нужно использовать в случае, если необходимо связать значения между несколькими слайсами.
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
 *         loaderExtraValues: {
 *            // searchValue - название поля в аргументах фабрики списка, в которое будет перемещено значение из заивисимой фабрики search.
 *            // search - название фабрики поиска в конфиге.
 *            // searchValue - название поля из фабрики поиска
 *            searchValue: ['search', 'searchValue'],
 *        },
 *     }
 *   }
 *  }
 * </pre>
 * @name Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments#loaderExtraValues
 * @cfg {TExtraValues} Экстра значения для загрузки данных. Нужно использовать в случае, если необходимо передать аргументы из одной фабрики в другую
 * @demo Controls-ListEnv-demo/Search/Lists/ExtraValues
 */

/**
 * @cfg {Array<string, string>}
 */
export type TExtraValue = [string, string];
/**
 * @cfg {Record<string, TExtraValue>}
 */
export type TExtraValues = Record<string, TExtraValue>;

export interface IBaseDataFactoryArguments {
    loadDataTimeout?: number;
    loaderExtraValues?: TExtraValues;
    sliceExtraValues?: TExtraValues;
}
