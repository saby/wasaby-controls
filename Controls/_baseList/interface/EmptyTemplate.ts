/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Шаблон, который по умолчанию используется для отображения {@link Controls/list:View плоского списка} без элементов.
 *
 * @class Controls/_list/interface/EmptyTemplate
 * @see Controls/list:IList#emptyTemplate
 * @see Controls/list:View
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:emptyTemplate>
 *       <ws:partial template="Controls/list:EmptyTemplate" topSpacing="xxl" bottomSpacing="m">
 *          <ws:contentTemplate>No data available!</ws:contentTemplate>
 *       </ws:partial>
 *    </ws:emptyTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/list/empty/ здесь}.
 * @public
 */

export default interface IEmptyTemplateOptions {
    /**
     * @typedef {String} Controls/_list/interface/EmptyTemplate/Spacing
     * @description Допустимые значения для опций {@link topSpacing} и {@link bottomSpacing}.
     * @variant xs Минимальный отступ.
     * @variant s Маленький отступ.
     * @variant m Средний отступ.
     * @variant l Большой отступ.
     * @variant xl Очень большой оступ.
     * @variant xxl Максимальный отступ.
     */

    /**
     * @typedef {String} Controls/_list/interface/EmptyTemplate/Align
     * @description Допустимые значения для опции {@link align}.
     * @variant center Выравнивание текста по центру.
     * @variant start Выравнивание текста по левому краю.
     * @variant end Выравнивание текста по правому краю.
     */

    /**
     * @name Controls/_list/interface/EmptyTemplate#topSpacing
     * @cfg {Controls/_list/interface/EmptyTemplate/Spacing.typedef|null} Отступ между верхней границей  и шаблоном contentTemplate.
     * @remark
     * В значении null отступ отсутствует.
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * @default l
     */
    topSpacing?: string;
    /**
     * @name Controls/_list/interface/EmptyTemplate#bottomSpacing
     * @cfg {Controls/_list/interface/EmptyTemplate/Spacing.typedef|null} Отступ между нижней границей и шаблоном contentTemplate.
     * @remark
     * В значении null отступ отсутствует.
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * @default l
     */
    bottomSpacing?: string;
    /**
     * @name Controls/_list/interface/EmptyTemplate#align
     * @cfg {Controls/_list/interface/EmptyTemplate/Align.typedef|null} Выравнивание текста в шаблоне пустого представления.
     * @default center
     */
    align?: 'center' | 'start' | 'end';
    /**
     * @name Controls/_list/interface/EmptyTemplate#contentTemplate
     * @cfg {String|TemplateFunction|undefined} Шаблон, описывающий контент плоского списка без элементов.
     */
    contentTemplate?: string;
}
