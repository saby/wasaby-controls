/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import IFilter from './IFilter';

/**
 * Интерфейс для контролов, которые поддерживают фильтрацию данных.
 *
 * @implements Controls/interface:IFilter
 * @public
 */
export default interface IFilterChanged extends IFilter {
    readonly '[Controls/_interface/IBaseFilter]': boolean;
}

/**
 * @event filterChanged Происходит при изменении фильтра.
 * @name Controls/_interface/IFilterChanged#filterChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} filter Изменённый фильтр.
 * @remark
 * Важно помнить, что опции {@link https://ru.m.wikipedia.org/wiki/Неизменяемый_объект иммутабельны}, поэтому фильтр в аргументах события отличается от фильтра в опциях контрола.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.filter:Controller on:filterChanged="filterChanged()" filter="{{ _filter }}"/>
 * {{ _filterString }}
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * _filter: null,
 * _beforeMount: function() {
 *    this._filter = {
 *       city: 'Yaroslavl'
 *    }
 * },
 * filterChanged: function(e, filter) {
 *
 *    // Т.к. в приведённом примере опция filter не связана с помощью bind c состоянием,
 *    // необходимо обновить фильтр на состоянии самостоятельно.
 *    this._filter = filter;
 *    this._filterString = JSON.stringify(this._filter, null, 4);
 * }
 * </pre>
 * @see filter
 */

/*
 * @event Occurs when filter were changed.
 * @name Controls/_interface/IFilter#filterChangedENG
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} new filter
 * @noshow
 * @remark
 * It's important to remember that we don't mutate filter from options (or any other option). So filter in the event arguments and filter in the component's options are not the same.
 * @example
 * WML:
 * <pre>
 *    <Controls.filter:Controller on:filterChanged="filterChanged()" filter="{{ _filter }}"/>
 *    <pre>{{ _filterString }}</pre>
 * </pre>
 * JS:
 * <pre>
 *    _filter: null,
 *    _beforeMount: function() {
 *       this._filter = {
 *          city: 'Yaroslavl'
 *       }
 *    },
 *    filterChanged: function(e, filter) {
 *       this._filter = filter; //We don't use binding in this example so we have to update state manually.
 *       this._filterString = JSON.stringify(this._filter, null, 4);
 *    }
 * </pre>
 * @see filter
 */
