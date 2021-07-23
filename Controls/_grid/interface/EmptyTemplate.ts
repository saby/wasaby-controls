/**
 * Шаблон, который по умолчанию используется для отображения {@link Controls/grid:View таблицы} без элементов.
 *
 * @class Controls/_grid/interface/EmptyTemplate
 * @author Авраменко А.С.
 * @extends Controls/list:EmptyTemplate
 * @see Controls/grid:View#emptyTemplate
 * @see Controls/grid:View
 * @example
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *     <ws:emptyTemplate>
 *         <ws:partial template="Controls/grid:EmptyTemplate">
 *             <ws:contentTemplate>No data available!</ws:contentTemplate>
 *         </ws:partial>
 *     </ws:emptyTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/ здесь}.
 * @public
 */

export default interface IEmptyTemplateOptions {
    /**
     * @typedef {String} Controls/_grid/interface/EmptyTemplate/Spacing
     * @description Допустимые значения для опций {@link topSpacing} и {@link bottomSpacing}.
     * @variant xs Минимальный отступ.
     * @variant s Маленький отступ.
     * @variant m Средний отступ.
     * @variant l Большой отступ.
     * @variant xl Очень большой оступ.
     * @variant xxl Максимальный отступ.
     */

    /**
     * @typedef {String} Controls/_grid/interface/EmptyTemplate/Align
     * @description Допустимые значения для опции {@link align}.
     * @variant center Выравнивание текста по центру.
     * @variant left Выравнивание текста по левому краю.
     * @variant right Выравнивание текста по правому краю.
     */

    /**
     * @name Controls/_grid/interface/EmptyTemplate#topSpacing
     * @cfg {Controls/_grid/interface/EmptyTemplate/Spacing.typedef|null} Отступ между верхней границей  и шаблоном contentTemplate.
     * @remark
     * В значении null отступ отсутствует.
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * @default l
     */
    topSpacing?: string;
    /**
     * @name Controls/_grid/interface/EmptyTemplate#bottomSpacing
     * @cfg {Controls/_grid/interface/EmptyTemplate/Spacing.typedef|null} Отступ между нижней границей и шаблоном contentTemplate.
     * @remark
     * В значении null отступ отсутствует.
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * @default l
     */
    bottomSpacing?: string;
    /**
     * @name Controls/_grid/interface/EmptyTemplate#align
     * @cfg {Controls/_grid/interface/EmptyTemplate/Align.typedef|null} Выравнивание текста в шаблоне пустого представления.
     * @default center
     */
    align?: 'center' | 'left' | 'right';
    /**
     * @name Controls/_grid/interface/EmptyTemplate#contentTemplate
     * @cfg {String|TemplateFunction|undefined} Шаблон, описывающий контент плоского списка без элементов.
     */
    contentTemplate?: string;
}
