/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Шаблон, который по умолчанию используется для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списках}.
 *
 * @class Controls/_list/interface/EditingTemplate
 * @see Controls/list:View
 * @see Controls/list:NumberEditingTemplate
 * @see Controls/list:MoneyEditingTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [6-18]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *             <ws:partial template="Controls/list:EditingTemplate" enabled="{{ true }}">
 *                 <ws:viewTemplate>
 *                      Title: {{ contentTemplate.item.contents.title }}
 *                  </ws:viewTemplate>
 *                <ws:editorTemplate>
 *                   <Controls.validate:InputContainer>
 *                      <ws:validators>
 *                         <ws:Function value="{{ contentTemplate.item.contents.title }}">Controls/validate:isRequired</ws:Function>
 *                      </ws:validators>
 *                      <ws:content>
 *                         <Controls.input:Text bind:value="contentTemplate.item.contents.title" selectOnClick="{{ false }}" />
 *                      </ws:content>
 *                   </Controls.validate:InputContainer>
 *                </ws:editorTemplate>
 *             </ws:partial>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/#manual здесь}.
 * @public
 */

export default interface IEditingTemplateOptions {
    /**
     * @name Controls/_list/interface/EditingTemplate#editorTemplate
     * @cfg {String|TemplateFunction} Шаблон, отображаемый поверх элемента в режиме редактирования.
     */
    editorTemplate?: string | TemplateFunction;

    /**
     * @name Controls/_list/interface/EditingTemplate#viewTemplate
     * @cfg {String|TemplateFunction} Шаблон, отображаемый внутри элемента в режиме просмотра.
     * @remark Настройка viewTemplate приоритетнее {@link Controls/_list/interface/EditingTemplate#value value}.
     */
    viewTemplate?: string | TemplateFunction;

    /**
     * @name Controls/_list/interface/EditingTemplate#enabled
     * @cfg {Boolean} Когда опция задана в значение true, при наведении курсора мыши на элемент в режиме редактирования будет выделяться фон у контрола-редактора.
     * @default false
     * @see editorTemplate
     */
    enabled?: boolean;
    /**
     * @name Controls/_list/interface/EditingTemplate#value
     * @cfg {String} Текст, отображаемый внутри элемента в режиме просмотра, если не задан {@link Controls/list:EditingTemplate#viewTemplate шаблон отображения данных в режиме просмотра}.
     */
    value?: string;
    /**
     * @typedef {String} Controls/_list/interface/EditingTemplate/Size
     * @description Допустимые значения для опции {@link size}.
     * @variant default Размер, используемый по умолчанию.
     * @variant s Маленький размер.
     * @variant m Средний размер.
     * @variant l Большой размер.
     */

    /**
     * @name Controls/_list/interface/EditingTemplate#size
     * @cfg {Controls/_list/interface/EditingTemplate/Size.typedef} Размер шрифта для {@link Controls/list:EditingTemplate#value текста}, который отображается внутри элемента в режиме просмотра.
     * @default default
     * @see Controls/list:EditingTemplate#value
     * @remark
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     */
    size?: string;

    /**
     * @typedef {String} Controls/_list/interface/EditingTemplate/InputBackgroundVisibility
     * @description Допустимые значения для опции {@link inputBackgroundVisibility}.
     * @variant visible Поля ввода подсвечиваются всегда.
     * @variant onhover Поля ввода подсвечиваются при наведении на строку.
     * @variant hidden Поля ввода не подсвечиваются.
     */

    /**
     * @name Controls/_list/interface/EditingTemplate#inputBackgroundVisibility
     * @cfg {Controls/_list/interface/EditingTemplate/InputBackgroundVisibility.typedef} Режим подсветки полей ввода в режиме просмотра.
     * @default onhover
     */
    inputBackgroundVisibility?: 'visible' | 'onhover' | 'hidden';

    /**
     * @typedef {String} Controls/_list/interface/EditingTemplate/InputBorderVisibility
     * @description Допустимые значения для опции {@link inputBorderVisibility}.
     * @variant partial Только нижняя граница поля ввода.
     * @variant hidden Границы поля ввода скрыты.
     */

    /**
     * @name Controls/_list/interface/EditingTemplate#inputBorderVisibility
     * @cfg {Controls/_list/interface/EditingTemplate/InputBorderVisibility.typedef} Видимость границ полей ввода в режиме просмотра.
     * @default hidden
     */
    inputBorderVisibility?: 'partial' | 'hidden';

    /**
     * @typedef {String} Controls/_list/interface/EditingTemplate/Align
     * @description Допустимые значения для опции {@link align}.
     * @variant left Контент выравнен по левому краю.
     * @variant right Контент выравнен по правому краю.
     */

    /**
     * @name Controls/_list/interface/EditingTemplate#align
     * @cfg {Controls/_list/interface/EditingTemplate/Align.typedef} Горизонтальное выравнивание контента.
     * @default left
     */
    align?: 'left' | 'right';

    /**
     * @name Controls/_list/interface/EditingTemplate#tooltip
     * @cfg {String} Устанавливает подсказку при наведении на значение вне режима редактирования. Если подсказка не задана, будет использоваться значение из опции {@link Controls/list:EditingTemplate#value value}.
     * @default undefined
     */
    tooltip?: string;
}
