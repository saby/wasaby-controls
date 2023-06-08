/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
/**
 * Шаблон отображения заголовка группы.
 * @class Controls/dropdown:GroupTemplate
 * @public
 * @example
 * Меню с отображением заголовка группы 'Select'.
 * <pre class="brush: html">
 * <Controls.dropdown:Button
 *    keyProperty="key"
 *    source="{{_source}}"
 *    groupProperty="group">
 *    <ws:groupTemplate>
 *      <ws:partial template="Controls/dropdown:GroupTemplate" showText="{{true}}"/>
 *    </ws:groupTemplate>
 *    </Controls.dropdown:Button>
 * </pre>
 * <pre class="brush: js">
 *    _source: null,
 *    _beforeMount: function() {
 *        this._source = new source.Memory ({
 *           data: [
 *                   { key: 1, title: 'Project', group: 'Select' },
 *                   { key: 2, title: 'Work plan', group: 'Select' },
 *                   { key: 3, title: 'Task', group: 'Select' },
 *               ],
 *           keyProperty: 'key'
 *        });
 *   }
 * </pre>
 */

/**
 * @name Controls/dropdown:GroupTemplate#showText
 * @cfg {Boolean} Определяет, отображается ли название группы.
 * @default false
 */

/**
 * @name Controls/dropdown:GroupTemplate#separatorVisibility
 * @cfg {Boolean} Определяет видимость горизонтальной линии.
 * @default true
 */

/**
 * @name Controls/dropdown:GroupTemplate#textAlign
 * @cfg {String} Выравнивание заголовка группы по горизонтали.
 * @variant left Текст выравнивается по левой стороне.
 * @variant right Текст выравнивается по правой стороне.
 * @default undefined
 */

/**
 * @name Controls/dropdown:GroupTemplate#contentTemplate
 * @cfg {String|TemplateFunction|undefined} Устанавливает пользовательский шаблон, описывающий содержимое элемента.
 * @default undefined
 */
