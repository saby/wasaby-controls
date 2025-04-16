/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/**
 * Шаблон для отображения строки в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#string режиме редактирования} без деления на колонки.
 * @class Controls/_gridRender/interface/IItemEditorTemplate
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */
