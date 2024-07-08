/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/**
 * Интерфейс для настройки отображения элементов в {@link Controls/grid:View таблице}.
 *
 * @interface Controls/interface/IGridItemTemplate
 * @public
 */

/*
 * Interface for components with customizable display of elements in Grid control.
 *
 * @interface Controls/interface/IGridItemTemplate
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/interface/IGridItemTemplate#itemTemplate
 * @cfg {String|TemplateFunction} Шаблон отображения элемента.
 * @default undefined
 * @markdown
 * @remark
 * Позволяет установить пользовательский шаблон отображения элемента (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/grid:ItemTemplate}. Шаблон Controls/grid:ItemTemplate поддерживает {@link Controls/grid:ItemTemplate параметры}, с помощью которых можно изменить отображение элемента.
 *
 * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию itemTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ItemTemplate.
 *
 * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/item/ руководстве разработчика}.
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}" />
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @demo Controls-demo/gridNew/ItemTemplate/NoHighlight/Index
 * @see Controls/interface/IGridItemTemplate#itemTemplateProperty
 * @see Controls/grid:ItemTemplate
 */

/*
 * @name Controls/interface/IGridItemTemplate#itemTemplate
 * @cfg {Function} Template for item render.
 * @remark
 * Base itemTemplate for Controls.grid:View: "Controls/grid:ItemTemplate".
 * Inside the template scope, object itemData is available, allowing you to access the render data (for example: item, key, etc.).
 * Base itemTemplate supports these parameters:
 * <ul>
 *    <li>highlightOnHover {Boolean} - Enable highlighting item by hover.</li>
 *    <li>
 *       clickable {Boolean} - Cursor type (default или pointer).
 *       <ul>
 *          <li>true - cursor pointer</li>
 *          <li>false - cursor default</li>
 *       </ul>
 *       By default: <b>true</b>
 *    </li>
 * </ul>
 * @example
 * Using custom template for item rendering:
 * <pre>
 *    <Controls.grid:View>
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}"/>
 *       </ws:itemTemplate>
 *    </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/interface/IGridItemTemplate#itemTemplateProperty
 * @cfg {String|undefined} Имя поля записи, в котором хранится имя {@link Controls/interface/IGridItemTemplate#itemTemplate шаблона отображения элемента}. С помощью этой настройки отдельным элементам можно задать собственный шаблон отображения.
 * @default undefined
 * @remark
 * Если не задано значение в опции itemTemplateProperty или в свойстве элемента, то используется шаблон из {@link Controls/interface/IGridItemTemplate#itemTemplate itemTemplate}.
 * @see Controls/interface/IGridItemTemplate#itemTemplate
 */

/*
 * @name Controls/interface/IGridItemTemplate#itemTemplateProperty
 * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
 */
