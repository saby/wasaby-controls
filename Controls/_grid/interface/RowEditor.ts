/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
/**
 * Шаблон, который используется для настройки отображения элемента контрола {@link Controls/grid:View Таблица} в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ режиме редактирования}.
 *
 * @class Controls/_grid/interface/RowEditor
 * @see Controls/grid:View#itemTemplate
 * @example
 * <pre class="brush: html; highlight: [4-9]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:RowEditor" scope="{{itemTemplate}}">
 *          <div>
 *             Этот шаблон отображается в режиме редактирования.
 *             <Controls.ComboBox bind:selectedKey="content.item.contents.documentSign"  />
 *          </div>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @public
 * @deprecated Для редактирования строк используйте {@link /docs/js/Controls/grid/IGridControl/options/colspanCallback/ механизм объединения колонок строки (колспана)}.
 *
 */

export default interface IRowEditorOptions {
    /**
     * @name Controls/_grid/interface/RowEditor#content
     * @cfg {String|TemplateFunction} Пользовательский шаблон, описывающий содержимое элемента в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ режиме редактирования}.
     * @default undefined
     */
    content?: string;
}
