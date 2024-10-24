/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
/**
 * Интерфейс для выпадающих списков, поддерживающих ленивую загрузку данных.
 *
 * @interface Controls/dropdown:ILazyItemsLoading
 * @public
 */

export interface ILazyItemsLoadingOptions {
    /**
     * @name Controls/dropdown:ILazyItemsLoading#lazyItemsLoading
     * @cfg {Boolean} Определяет, будут ли элементы меню загружаться лениво, только после первого клика по кнопке.
     * @default false
     * @remark Устанавливать опцию в значение true имеет смысл для локальных данных или
     * при полной уверенности, что источник вернёт данные для меню.
     * @example
     * В данном примере данные для меню будут загружены лениво, после первого клика по кнопке.
     * <pre class="brush: html; highlight: [7];">
     * <!-- WML -->
     * <Controls.dropdown:Button
     *    bind:selectedKeys="_selectedKeys"
     *    keyProperty="id"
     *    displayProperty="title"
     *    source="{{_source}}"
     *    lazyItemsLoading="{{true}}" />
     * </pre>
     * <pre>
     * // JavaScript
     * _source: null,
     * _beforeMount: function() {
     *    this._source = new source.Memory({
     *       idProperty: 'id',
     *       data: [
     *          {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp'},
     *          {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown'}
     *       ]
     *    });
     * }
     * </pre>
     */
    lazyItemsLoading?: boolean;
}
