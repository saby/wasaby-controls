/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
import { IMoneyOptions } from 'Controls/baseDecorator';
import IEditingTemplateOptions from './EditingTemplate';

/**
 * Шаблон для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту} денежных полей в {@link /doc/platform/developmentapl/interface-development/controls/list/ списках}.
 * В режиме чтения выводит значение с помощью {@link Controls/baseDecorator:Money}.
 *
 * @class Controls/_list/interface/MoneyEditingTemplate
 * @implements Controls/list:EditingTemplate
 * @mixes Controls/baseDecorator:IMoney
 * @see Controls/list:View
 * @see Controls/list:EditingTemplate
 * @see Controls/list:NumberEditingTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [6-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *              <ws:partial template="Controls/list:MoneyEditingTemplate" value="{{ item.contents.price }}" enabled="{{true}}">
 *                  <ws:editorTemplate>
 *                      <Controls.input:Money bind:value="contentTemplate.item.contents.price" selectOnClick="{{ false }}" />
 *                  </ws:editorTemplate>
 *              </ws:partial>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @public
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/#manual здесь}.
 */
export default interface IMoneyEditingTemplateOptions
    extends IEditingTemplateOptions,
        IMoneyOptions {
    readonly '[Controls/_list/interface/IMoneyEditingTemplateOptions]': boolean;
}
