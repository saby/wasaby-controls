/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
/**
 * Интерфейс для выпадающих списков, поддерживающих шаблон шапки списка.
 *
 * @interface Controls/_dropdown/interface/IHeaderTemplate
 * @public
 */

/*
 * Interface for dropdown lists that support the template for the header.
 *
 * @interface Controls/_dropdown/interface/IHeaderTemplate
 * @public
 * @author Золотова Э.Е.
 */

/**
 * @name Controls/_dropdown/interface/IHeaderTemplate#menuHeadingCaption
 * @cfg {String} Заголовок шапки меню.
 * @demo Controls-demo/dropdown_new/Button/MenuHeadingCaption/Index
 * @example
 * <pre class="brush: html; highlight: [8-12];">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="key"
 *    icon="icon-Save"
 *    caption="Заголовок для кнопки"
 *    menuHeadingCaption="Заголовок для меню"
 *    source="{{_source}}">
 * </Controls.dropdown:Button>
 * </pre>
 * <pre class="brush: js;">
 * _source: null,
 * _beforeMount: function() {
 *    this._source = new source.Memory ({
 *       data: [
 *          { id: 1, title: 'Task in development' },
 *          { id: 2, title: 'Error in development' }
 *       ],
 *       keyProperty: 'key'
 *    });
 * }
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IHeaderTemplate#headingCaptionProperty
 * @cfg {String} Название свойства, которое содержит заголовок шапки для подменю.
 * @demo Controls-demo/dropdown_new/Button/HeadingCaptionProperty/Index
 * @example
 * <pre class="brush: html; highlight: [8-12];">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="key"
 *    icon="icon-Save"
 *    parentProperty="parent"
 *    nodeProperty="@parent"
 *    headingCaptionProperty="caption"
 *    source="{{_source}}">
 * </Controls.dropdown:Button>
 * </pre>
 * <pre class="brush: js;">
 * _source: null,
 * _beforeMount: function() {
 *    this._source = new source.Memory ({
 *       data: [{ key: 1, title: 'Task', '@parent': true, parent: null },
 *              { key: 2, title: 'Error in the development', '@parent': false, parent: null },
 *              { key: 3, title: 'Commission', parent: 1 },
 *              { key: 4, title: 'Coordination', parent: 1, '@parent': true, caption: 'Node header caption' }
 *       ],
 *       keyProperty: 'key'
 *    });
 * }
 * </pre>
 */
