/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Шаблон, который по умолчанию используется для отображения {@link Controls/list:View плоского списка} без элементов.
 *
 * @implements Controls/list:IEmptyTemplate
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

/**
 * Допустимые значения для опций {@link topSpacing} и {@link bottomSpacing}.
 * @typedef TEmptyTemplateSpacing
 * @variant xs Минимальный отступ.
 * @variant s Маленький отступ.
 * @variant m Средний отступ.
 * @variant l Большой отступ.
 * @variant xl Очень большой оступ.
 * @variant xxl Максимальный отступ.
 */
export type TEmptyTemplateSpacing = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | '2xl' | string;

/**
 * Допустимые значения для опции {@link align}.
 * @typede TEmptyTemplateAlign
 * @variant center Выравнивание текста по центру.
 * @variant start Выравнивание текста по левому краю.
 * @variant end Выравнивание текста по правому краю.
 */
export type TEmptyTemplateAlign = 'center' | 'start' | 'end';

/**
 * Свойства шаблона пустого представления
 * @public
 */
export default interface IEmptyTemplate {
    /**
     * Отступ между верхней границей  и шаблоном contentTemplate.
     * @cfg
     * @remark
     * В значении null отступ отсутствует.
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * @default l
     */
    topSpacing?: TEmptyTemplateSpacing;
    /**
     * Отступ между нижней границей и шаблоном contentTemplate.
     * @cfg
     * @remark
     * В значении null отступ отсутствует.
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * @default l
     */
    bottomSpacing?: TEmptyTemplateSpacing;
    /**
     * Выравнивание текста в шаблоне пустого представления.
     * @cfg
     * @default center
     */
    align?: TEmptyTemplateAlign;
    /**
     * Шаблон, описывающий контент плоского списка без элементов.
     * @cfg
     */
    contentTemplate?: string;
}
