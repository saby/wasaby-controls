/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
/**
 * Шаблон отображения шапки меню.
 * @class Controls/dropdown:HeaderTemplate
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:IIconSize
 * @public
 * @example
 * Меню с текстом заголовка — "Add".
 * <pre class="brush: html; highlight: [6-8];">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="id"
 *    source="{{_source}}"
 *    tooltip="Add">
 *    <ws:headerTemplate>
 *        <ws:partial template="Controls/dropdown:HeaderTemplate" caption="Add"/>
 *    </ws:headerTemplate>
 *    </Controls.dropdown:Button>
 * </pre>
 * <pre class="brush: js; highlight: [6-8];">
 * // JavaScript
 * _source: null,
 * _beforeMount: function() {
 *    this._source = new source.Memory ({
 *       data: [
 *          { id: 1, title: 'Task in development' },
 *          { id: 2, title: 'Error in development' }
 *       ],
 *       keyProperty: 'id'
 *    });
 * }
 * </pre>
 */
