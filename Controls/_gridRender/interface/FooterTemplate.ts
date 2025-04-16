/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/**
 * Шаблон, который по умолчанию используется для отображения подвала {@link Controls/grid:View таблицы}.
 *
 * @class Controls/_gridRender/interface/FooterTemplate
 * @see Controls/grid:View#footerTemplate
 * @see Controls/grid:View
 * @example
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *     <ws:footerTemplate>
 *         <ws:partial template="Controls/grid:FooterTemplate">
 *             <Controls.list:AddButton caption="Add record" on:click="_beginAdd()" class="test_add_record_1"/>
 *         </ws:partial>
 *     </ws:footerTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/footer/ здесь}.
 * @public
 * @demo Controls-demo/gridNew/EditInPlace/EditingCell/Index
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

export default interface IFooterTemplateOptions {
    /**
     * @name Controls/_gridRender/interface/FooterTemplate#contentTemplate
     * @cfg {TemplateFunction|String} Шаблон, описывающий контент подвала.
     */
    contentTemplate?: string;
}
