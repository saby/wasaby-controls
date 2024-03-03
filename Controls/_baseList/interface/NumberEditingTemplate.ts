/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
import { INumberOptions } from 'Controls/baseDecorator';
import IEditingTemplateOptions from './EditingTemplate';

/**
 * Шаблон для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту} числовых полей в {@link Controls/list:View плоских списках}.
 * В режиме чтения выводит значение с помощью {@link Controls/baseDecorator:Number}.
 *
 * @class Controls/_list/interface/NumberEditingTemplate
 * @implements Controls/list:EditingTemplate
 * @mixes Controls/baseDecorator:INumber
 * @ignoreOptions viewTemplate
 * @see Controls/list:View
 * @see Controls/list:EditingTemplate
 * @see Controls/list:MoneyEditingTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [6-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *              <ws:partial template="Controls/list:NumberEditingTemplate" value="{{ item.contents.count }}" enabled="{{true}}">
 *                  <ws:editorTemplate>
 *                      <Controls.input:Number bind:value="contentTemplate.item.contents.count" selectOnClick="{{ false }}" />
 *                  </ws:editorTemplate>
 *              </ws:partial>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @public
 * @remark
 * Обязательно передайте параметр value, иначе получите ошибку в консоль.
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/#manual здесь}.
 */
export default interface INumberEditingTemplateOptions
    extends INumberOptions,
        IEditingTemplateOptions {
    readonly '[Controls/_list/interface/INumberEditingTemplateOptions]': boolean;
}
