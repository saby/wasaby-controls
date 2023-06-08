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
 * @name Controls/_dropdown/interface/IHeaderTemplate#headerTemplate
 * @cfg {TemplateFunction | String} Шаблон отображения шапки меню.
 * @remark
 * По умолчанию для отрисовки шапки меню используется базовый шаблон {@link Controls/dropdown:HeaderTemplate}.
 * Изменяя параметры базового шаблона вы можете задать собственное отображение шапки меню.
 * Параметры шаблона:
 *
 * * caption — текст заголовка. Когда значение параметра не задано, оно наследуется из опции {@link Controls/interface:ICaption#caption caption}.
 * * icon — иконка. Когда значение параметра не задано, оно наследуется из опции {@link Controls/interface:IIcon#icon icon}.
 * * headContentTemplate — пользовательский контент шапки. Контентная опция. В области видимости доступны параметры caption и icon.
 * @example
 * Меню с текстом заголовка — "Add".
 * <pre class="brush: html; highlight: [7-9]">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="id"
 *    icon="icon-medium icon-AddButtonNew"
 *    source="{{_source}}"
 *    tooltip="Add">
 *    <ws:headerTemplate>
 *       <ws:partial template="Controls/dropdown:HeaderTemplate" scope="{{ headerTemplate }}" caption="Add"/>
 *    </ws:headerTemplate>
 * </Controls.dropdown:Button>
 * </pre>
 * <pre class="brush: js;">
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

/*
 * @name Controls/_dropdown/interface/IHeaderTemplate#headerTemplate
 * @cfg {Function | String} Template that will be rendered above the list.
 * @default "Controls/dropdown:HeaderTemplate"
 * @remark
 * To determine the template, you should call the base template 'Controls/dropdown:HeaderTemplate'.
 * The template should be placed in the component using the <ws:partial> tag with the template attribute.
 * By default, the base template 'Controls/dropdown:HeaderTemplate'
 * will display caption and icon, if they are set. You can change the following options:
 * <ul>
 *     <li>caption - header text,</li>
 *     <li>icon - header icon.</li>
 * </ul>
 * @example
 * Menu with text header - "Add".
 * TMPL:
 * <pre>
 *    <Controls.Button.Menu
 *          keyProperty="id"
 *          icon="icon-medium icon-AddButtonNew"
 *          source="{{_source}}"
 *          tooltip="Add">
 *       <ws:headerTemplate>
 *          <ws:partial template="Controls/dropdown:HeaderTemplate" scope="{{ headerTemplate }}" caption="Add"/>
 *       </ws:headerTemplate>
 *    </Controls.Button.Menu>
 * </pre>
 * JS:
 * <pre>
 *    this._source = new Memory ({
 *       data: [
 *           { id: 1, title: 'Task in development' },
 *           { id: 2, title: 'Error in development' }
 *       ],
 *       keyProperty: 'id'
 *    });
 * </pre>
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
