/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
/**
 * Шаблон, который по умолчанию используется для отображения подвала {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
 * @class Controls/suggestPopup:FooterTemplate
 * @remark
 * Подробнее о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ здесь}.
 * @example
 * <pre class="brush: html">
 * <Controls.SuggestInput>
 *    <ws:footerTemplate templateName="Controls/suggestPopup:FooterTemplate">
 *       <ws:templateOptions>
 *          <ws:showSelectorButtonTemplate>
 *             <span on:click="_showAllClick()">
 *                <span>Моя кнопка</span>
 *             </span>
 *          </ws:showSelectorButtonTemplate>
 *       </ws:templateOptions>
 *    </ws:footerTemplate>
 * </Controls.SuggestInput>
 * </pre>
 * @demo Controls-demo/Suggest_new/Input/FooterTemplate/FooterTemplate
 * @see Controls/suggestPopup
 * @see Controls/interface/ISuggest#footerTemplate
 * @public
 */
export default interface IFooterTemplateOptions {
    /**
     * @name Controls/suggestPopup:FooterTemplate#showMoreButtonTemplate
     * @cfg {Function|String} Шаблон кнопки "Ещё".
     * @example
     * <pre class="brush: html">
     * <ws:partial template="Controls/suggestPopup:FooterTemplate">
     *    <ws:showMoreButtonTemplate>
     *       <span on:click="_showAllClick()">
     *          <span>Моя кнопка</span>
     *       </span>
     *    </ws:showMoreButtonTemplate>
     * </ws:partial>
     * </pre>
     */
    showMoreButtonTemplate?: string;
    /**
     * @name Controls/suggestPopup:FooterTemplate#showSelectorButtonTemplate
     * @cfg {Function|String} Шаблон кнопки "Показать всё".
     * @example
     * <pre class="brush: html">
     * <ws:partial template="Controls/suggestPopup:FooterTemplate">
     *    <ws:showSelectorButtonTemplate>
     *       <span on:click="_showAllClick()">
     *          <span>Моя кнопка</span>
     *       </span>
     *    </ws:showSelectorButtonTemplate>
     * </ws:partial>
     * </pre>
     */
    showSelectorButtonTemplate?: string;
    /**
     * @name Controls/suggestPopup:FooterTemplate#caption
     * @cfg {String} Устанавливает пользовательский текст на кнопки "Показать все"
     * @default Показать все
     * @example
     * <ws:footerTemplate templateName="Controls/suggestPopup:FooterTemplate">
     *    <ws:templateOptions caption="Кастомный footer"/>
     * </ws:footerTemplate>
     * @demo Controls-ListEnv-demo/SuggestSearch/FooterCaption/FooterCaption
     */
    caption?: string;
}
