/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TEmptyTemplateAlign, TEmptyTemplateSpacing } from 'Controls/baseList';

/**
 * Шаблон, который по умолчанию используется для отображения {@link Controls/grid:View таблицы} без элементов.
 *
 * @class Controls/_gridRender/interface/EmptyTemplate
 * @implements Controls/gridRender:IEmptyTemplate
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

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
