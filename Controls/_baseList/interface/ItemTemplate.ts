/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import {
    TBorderVisibility,
    TItemBaseLine,
    TShadowVisibility,
    TBorderStyle,
} from 'Controls/display';

/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/list:View плоском списке}.
 *
 * @class Controls/_list/interface/ItemTemplate
 * @implements Controls/list:IBaseItemTemplate
 * @implements Controls/list:IContentTemplate
 * @see Controls/interface:IItemTemplateListProps#itemTemplate
 * @see Controls/interface:IItemTemplateListProps#itemTemplateProperty
 * @see Controls/list:View
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [3-9]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" marker="{{false}}" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *             {{contentTemplate.item.contents.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/list/item/ здесь}.
 * @public
 */

export default interface IItemTemplateOptions {
    /**
     * @name Controls/_list/interface/ItemTemplate#displayProperty
     * @cfg {String} Имя поля элемента, данные которого будут отображены в шаблоне.
     * @remark
     * Опцию не используют, если задан пользовательский шаблон в опции {@link Controls/list:ItemTemplate#contentTemplate contentTemplate}.
     * @default title
     */
    displayProperty?: string;

    /**
     * @name Controls/_list/interface/ItemTemplate#baseline
     * @cfg {Controls/_display/CollectionItem/TItemBaseLine.typedef} Настройка базовой линии записи плоского списка
     * @remark
     * Необходимо указывать эту опцию, если надо выровнять содержимое записи и чекбокс при multiSelectVisibility="visible" по базовой линии 17px
     * @default none
     */
    baseline?: TItemBaseLine;

    /**
     * @name Controls/_list/interface/ItemTemplate#borderVisibility
     * @cfg {Controls/display/TBorderVisibility.typedef} Видимость рамки вокруг записи.
     * @remark применяется в списках с отступами между записями.
     * @default hidden
     * @see shadowVisibility
     */
    borderVisibility?: TBorderVisibility;

    /**
     * @name Controls/_list/interface/ItemTemplate#href
     * @cfg {String} Опция, позволяющая передать элементу списка ссылку
     * @demo Controls-demo/list_new/ItemTemplate/Href/Integration/Index
     * @default undefined
     */
    href?: string;

    /**
     * @name Controls/_list/interface/ItemTemplate#shadowVisibility
     * @cfg {Controls/display/TShadowVisibility.typedef} Видимость тени вокруг записи.
     * @remark применяется в списках с отступами между записями.
     * @default hidden
     * @see borderVisibility
     */
    shadowVisibility?: TShadowVisibility;

    /**
     * @name Controls/_list/interface/ItemTemplate#borderStyle
     * @cfg {Controls/display/TBorderStyle.typedef} Цвет рамки вокруг записи.
     * @remark Применяется для валидации записей в списках. Может быть использована
     * только вместе с {@link Controls/_list/interface/ItemTemplate#borderVisibility borderVisibility}.
     * @default default
     * @example
     * <pre class="brush:html">
     * <Controls.list:View keyProperty="key"
     *    itemsSpacing="s"
     *    source="{{_viewSource}}">
     *       <ws:itemTemplate>
     *          <ws:partial template="Controls/list:ItemTemplate"
     *             borderVisibility="visible"
     *             borderStyle="{{ _isInvalid(item) ? 'danger' : 'default' }}"/>
     *       </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     * @demo Controls-demo/list_new/RoundBorder/Index
     * @see borderVisibility
     */
    borderStyle?: TBorderStyle;
}
