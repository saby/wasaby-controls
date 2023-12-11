/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { TCursor } from 'Controls/list';
import { TAdditionalContentSize } from 'Controls/_tile/display/AdditionalTileItem';

/**
 * Шаблон дополнительного элемента плитки, который может быть размещён в опции {@link Controls/tile:View#beforeItemsTemplate beforeItemsTemplate} или {@link Controls/tile:View#afterItemsTemplate afterItemsTemplate}
 * @class Controls/_tile/interface/AdditionalTemplate
 * @private
 * @see Controls/tile:View
 * @example
 * <pre class="brush: html; highlight: [6-32]">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tile:ItemTemplate"
 *                   imageSize="m"
 *                   border="{{false}}">
 *    </ws:itemTemplate>
 *    <ws:beforeItemsTemplate>
 *        <ws:partial template="Controls/tile:AdditionalTemplate"
 *                    contrastBackground="{{ true }}"
 *                    cursor="pointer"
 *                    on:click="_addItem('before')">
 *            <ws:contentTemplate>
 *                <Controls.icon:Icon iconSize="s" iconStyle="default" icon="icon-RoundPlus"/>
 *            </ws:contentTemplate>
 *        </ws:partial>
 *    </ws:beforeItemsTemplate>
 *    <ws:afterItemsTemplate>
 *        <ws:partial template="Controls/tile:AdditionalTemplate" size="custom">
 *            <ws:contentTemplate>
 *                <Controls.buttons:Button readOnly="{{ false }}"
 *                                         icon="icon-ArrowTimeForward"
 *                                         iconSize="s"
 *                                         caption="Все"
 *                                         captionPosition="left"
 *                                         fontSize="xl"
 *                                         inlineHeight="2xl"
 *                                         buttonStyle="default"
 *                                         viewMode="filled"
 *                                         tooltip="caption"/>
 *            </ws:contentTemplate>
 *         </ws:partial>
 *     </ws:afterItemsTemplate>
 * </Controls.tile:View>
 * </pre>
 * @demo Controls-demo/tileNew/AddButton/Index
 */
export default interface IAdditionalTemplateOptions {
    /**
     * @name Controls/_tile/interface/AdditionalTemplate#contrastBackground
     * @cfg {Boolean} Контрастный фон дополнительного элемента.
     * @default false
     */
    contrastBackground: boolean;

    /**
     * @name Controls/_tile/interface/AdditionalTemplate#size
     * @cfg {Controls/_tile/display/AdditionalTileItem/TAdditionalContentSize.typedef} размер дополнительного элемента.
     * @default auto
     * @remark При настройке auto все размеры берутся от шаблона, указанного в опции {@link Controls/tile:View#itemTemplate},
     * При установке размера custom можно настраивать размер контента дополнительного элемента произвольно
     */
    size: TAdditionalContentSize;

    /**
     * @name Controls/_tile/interface/AdditionalTemplate#cursor
     * @cfg {Controls/_list/interface/IBaseItemTemplate/TCursor.typedef} Вид курсора при ховере на дополнительный элемент
     * @default default
     */
    cursor: TCursor;
}
