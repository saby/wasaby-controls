/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Шаблон, который по умолчанию используется для отображения подвала {@link Controls/list:View плоского списка}.
 *
 * @class Controls/_list/interface/FooterTemplate
 * @see Controls/list:View#footerTemplate
 * @see Controls/list:View
 * @example
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:footerTemplate>
 *       <ws:partial template="Controls/list:FooterTemplate">
 *          <Controls.list:AddButton caption="Add record" on:click="_beginAdd()"/>
 *       </ws:partial>
 *    </ws:footerTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/list/footer/ здесь}.
 * @public
 */

export default interface IFooterTemplateOptions {
    /**
     * @name Controls/_list/interface/FooterTemplate#contentTemplate
     * @cfg {TemplateFunction|String} Шаблон, описывающий контент подвала.
     */
    contentTemplate?: string;

    /**
     * @typedef {String} Controls/_list/interface/FooterTemplate/Height
     * @description Допустимые значения для опций {@link height}.
     * @variant default Подвал имеет минимальную высоту, равную значению высоты строчного контрола (--inline_height_default).
     * @variant auto Автовысота, высота подвала рассчитывается по контенту.
     */

    /**
     * @name Controls/_list/interface/FooterTemplate#contentTemplate
     * @cfg {Controls/_list/interface/FooterTemplate/Height} Высота подвала списка.
     * @default default
     */
    height?: 'default' | 'auto';
}
