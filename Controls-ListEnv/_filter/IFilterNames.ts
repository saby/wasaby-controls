export interface IFilterNamesOptions {
    filterNames: string[];
}

/**
 * Интерфейс для контролов, которые поддерживают редактирование параметров фильтрации
 * @public
 */
export default interface IFilterNames {
    readonly '[Controls/_interface/IFilterNames]': boolean;
}

/**
 * @name Controls-ListEnv/_filter/IFilterNames#filterNames
 * @cfg {Array<string>} {@link Controls/filter:IFilterItem#name Имена} параметров фильтра, которые будут доступны для отображения и редактирования в виджете.
 * @remark Имя параметра фильтрации соответствует значению поля {@link Controls/filter:IFilterItem#name name} в описании структуры фильтра.
 * Параметры фильтрации ({@link Controls/filter:View#source filterSource}) настраиваются на уровне {@link doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ SabyPage}
 * или на уровне {@link Controls/browser:Browser}.
 * @example
 * <pre class="brush: html; highlight: [2-7]">
 *     <Controls-ListEnv.filter:View>
 *         <ws:filterNames>
 *             <ws:Array>
 *                 <ws:String>Employees</ws:String>
 *                 <ws:String>Salary</ws:String>
 *             </ws:Array>
 *         </ws:filterNames>
 *     </Controls-ListEnv.filter:View>
 * </pre>
 *
 * @see Controls/filter:View#source
 * @see /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
 * @see doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/
 */
