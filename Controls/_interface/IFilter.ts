/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { QueryWhereExpression } from 'Types/source';
export type TFilter = QueryWhereExpression<unknown>;

export interface IFilterOptions {
    filter?: TFilter;
}

/**
 * Интерфейс для контролов, которые поддерживают фильтрацию данных.
 * @public
 */
export default interface IFilter {
    readonly '[Controls/_interface/IFilter]': boolean;
}

/**
 * @name Controls/_interface/IFilter#filter
 * @cfg {Object} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/ объекта фильтра}. Фильтр отправляется в запрос к источнику для получения данных.
 * @remark
 * При изменении фильтра важно передавать новый объект фильтра, изменение объекта по ссылке не приведет к желаемому результату.
 * @example
 * В данном примере в списке будет отображаться 2 элемента.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View
 *     keyProperty="id"
 *     filter="{{_filter}}"
 *     source="{{_source}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._filter = {id: ['1', '2']};
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {
 *          id: '1',
 *          title: 'Yaroslavl'
 *       },
 *       {
 *          id: '2',
 *          title: 'Moscow'
 *       },
 *       {
 *          id: '3',
 *          title: 'St-Petersburg'
 *       }
 *    ]
 * });
 * </pre>
 * @see filterChanged
 */

/*
 * @name Controls/_interface/IFilter#filter
 * @cfg {Object} Filter configuration - object with field names and their values.
 * @remark
 * You must pass a new filter object when you change the filter. You won't get the desired result if you change the object by reference.
 * @example
 * In this example, the list will be displayed 2 items.
 * TMPL:
 * <pre>
 *    <Controls.list:View
 *       keyProperty="id"
 *       filter={{_filter}}
 *       source="{{_source}}" />
 * </pre>
 * JS:
 * <pre>
 *    this._filter = {id: ['1', '2']};
 *    this._source = new Memory({
 *      keyProperty: 'id',
 *      data: [
 *         {
 *            id: '1',
 *            title: 'Yaroslavl'
 *         },
 *         {
 *            id: '2',
 *            title: 'Moscow'
 *         },
 *         {
 *            id: '3',
 *            title: 'St-Petersburg'
 *         }
 *      ]
 *    });
 * </pre>
 */
