/**
 * Шаблон, который позволяет отобразить в подвале списка вместо кнопки "Ещё" кнопку "Развернуть".
 *
 * @class Controls/_list/interface/MoreButtonExpandTemplate
 * @author Аверкиев П.А.
 * @see Controls/list:View#moreButtonTemplate
 * @see Controls/list:View
 * @example
 * <pre class="brush: html; highlight: [3,4]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:moreButtonTemplate>
 *        <ws:partial template="Controls/baseList:MoreButtonExpandTemplate"
 *                    cutSize='s'/>
 *    </ws:moreButtonTemplate>
 * </Controls.list:View>
 * </pre>
 * @public
 */

export default interface MoreButtonExpandTemplate {
    /**
     * @name Controls/_list/interface/MoreButtonExpandTemplate#cutSize
     * @cfg {TemplateFunction|String} Размер кнопки подгрузки данных
     */
    cutSize?: string;
}
