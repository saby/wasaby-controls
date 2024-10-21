/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
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
