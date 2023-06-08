/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
/**
 * Шаблон для отображения строки в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#string режиме редактирования} без деления на колонки.
 * @class Controls/_grid/interface/IitemEditorTemplate
 * @example
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:editingConfig editOnClick="{{true}}" />
 *    <ws:itemEditorTemplate>
 *       <ws:partial scope="{{itemEditorTemplate}}"
 *          template="Controls/grid:ItemEditorTemplate">
 *         <Controls.input:Text contrastBackground="{{true}}"
 *            bind:value="itemEditorTemplate.item.contents.title"/>
 *       </ws:partial>
 *    </ws:itemEditorTemplate>
 * </Controls.grid:View>
 * </pre>
 * @markdown
 * @public
 */
