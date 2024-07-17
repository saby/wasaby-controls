/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { ISearchOptions } from 'Controls/_interface/ISearch';

export type TSearchStartingWith = 'root' | 'current';
export type TSearchNavigationMode = 'expand' | 'readonly' | 'open';

export interface IHierarchySearchOptions extends ISearchOptions {
    searchStartingWith?: TSearchStartingWith;
    searchNavigationMode?: TSearchNavigationMode;
}
/**
 * Интерфейс для контролов, поддерживающих иерархический поиск.
 * @public
 */

export default interface IHierarchySearch {
    readonly '[Controls/_interface/IHierarchySearch]': boolean;
}
/**
 * @typedef {String} StartingWith
 * @description Допустимые значения для опции {@link searchStartingWith}.
 * @variant root Поиск происходит в корне.
 * @variant current Поиск происходит в текущем резделе.
 */
/**
 * @name Controls/_interface/IHierarchySearch#searchStartingWith
 * @cfg {StartingWith} Режим поиска в иерархическом списке.
 * @demo Controls-ListEnv-demo/Search/Explorer/SearchStartingWith/Current/Index
 * @default root
 * @example
 * В приведённом примере поиск будет происходить в текущей папке.
 *
 * <pre class="brush: js;">
 * const configs = {
 *    list: {
 *       dataFactoryName: 'Controls/dataFactory:List',
 *       dataFactoryArguments: {
 *         searchStartingWith: 'current'
 *       }
 *    }
 * }
 * </pre>
 */

/**
 * @typedef {String} SearchNavigationMode
 * @description Допустимые значения для опции {@link searchNavigationMode}.
 * @variant open В {@link Controls/_explorer/interface/IExplorer#viewMode режиме поиска} при клике на хлебную крошку происходит проваливание в данный узел.
 * @variant expand В режиме поиска при клике на хлебную крошку данные отображаются от корня, путь до узла разворачивается.
 * @variant readOnly
 */
/**
 * @name Controls/_interface/IHierarchySearch#searchNavigationMode
 * @cfg {SearchNavigationMode} Режим навигации при поиске в иерархическом списке.
 * @demo Controls-ListEnv-demo/Search/Explorer/SearchNavigationMode/Expand/Index
 * @default open
 */
