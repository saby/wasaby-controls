/**
 * Шаблон, который по умолчанию используется для отображения блока можно отобрать в панели фильтров.
 * @class Controls/filterPanelExtendedItems:DefaultTemplate
 * @public
 */

export default interface IDefaultExtendedTemplateOptions {
    /**
     * @cfg {String} Устанавливает текст заголовка блока "Можно отобрать".
     * @default undefined
     * @example
     * <pre class="brush: html">
     *      <Controls.filterPanelExtendedItems:DefaultTemplate headingCaption="Можно отобрать" />
     * </pre>
     */
    headingCaption?: string;

    /**
     * @cfg {String} Шаблон, который будет отображать справа от заголовка {@link headingCaption}. Если headingCaption не задан, то вместо него.
     * @default undefined
     * @example
     * <pre class="brush: html">
     *      <Controls.filterPanelExtendedItems:DefaultTemplate headingCaption="Можно отобрать">
     *          <ws:headingContentTemplate>
     *             <div class="controls-margin_left-m">
     *                 <Controls.buttons:Button viewMode="link"
     *                                          buttonStyle="unaccented"
     *                                          fontColorStyle="labelContrast"
     *                                          caption="за весь период"
     *                                          on:click="_clickHandler()" />
     *             </div>
     *          </ws:headingContentTemplate>
     *      </Controls.filterPanelExtendedItems:DefaultTemplate>
     * </pre>
     */
    headingContentTemplate?: Function;

    /**
     * @cfg {String} Основной контент шаблона.
     * @default undefined
     * @example
     * <pre class="brush: html">
     *      <Controls.filterPanelExtendedItems:DefaultTemplate headingCaption="Можно отобрать">
     *          <ws:bodyContentTemplate>
     *             <Controls.filterPanel:ListEditor scope={{_listEditorOptions}}/>
     *          </ws:bodyContentTemplate>
     *      </Controls.filterPanelExtendedItems:DefaultTemplate>
     * </pre>
     */
    bodyContentTemplate: Function;
}
