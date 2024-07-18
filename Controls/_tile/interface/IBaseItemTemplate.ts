/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { TemplateFunction } from 'UI/Base';
import { TBorderStyle, TShadowVisibility } from 'Controls/display';

/**
 * Базовый интерфейс шаблона отображения элементов в {@link Controls/tile:View плитке}.
 * @class Controls/_tile/interface/IBaseItemTemplate
 * @implements Controls/list:IBaseItemTemplate
 * @implements Controls/list:IContentTemplate
 * @see Controls/tile:View
 * @example
 * <pre class="brush: html; highlight: [3-12]">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tile:ItemTemplate">
 *          <ws:contentTemplate>
 *             <img src="{{contentTemplate.item.contents.Image}}"/>
 *             <div title="{{contentTemplate.item.contents.Name}}">
 *                {{contentTemplate.item.contents.Name}}
 *             </div>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.tile:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/tile/item/ здесь}.
 * @public
 * @demo Controls-demo/tileNew/DifferentItemTemplates/CustomTemplate/Index
 */

export default interface IBaseItemTemplateOptions {
    /**
     * @cfg {String} Отображение тени для плитки.
     * @variant visible Отображается.
     * @variant hidden Не отображается.
     * @variant onhover Отображается только при наведении курсора на плитку.
     * @default visible
     * @demo Controls-demo/tileNew/Shadows/Index
     */
    shadowVisibility?: TShadowVisibility;
    /**
     * @cfg {Boolean} Видимость рамки вокруг элемента плитки.
     * @default true
     * @example
     * В следующем примере отображение рамки вокруг элемента плитки отключено.
     * <pre class="brush: html; highlight: [8]">
     * <!-- WML -->
     * <Controls.tile:View
     *    source="{{_source}}"
     *    imageProperty="image">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/tile:ItemTemplate"
     *          border="{{false}}"/>
     *    </ws:itemTemplate>
     * </Controls.tile:View>
     * </pre>
     * @see borderStyle
     */
    border?: boolean;

    /**
     * @cfg {Controls/display/TBorderStyle.typedef} Цвет рамки вокруг записи.
     * @remark Применяется для валидации записей в списках. Может быть использована
     * только вместе с {@link Controls/_tile/interface/IBaseItemTemplate#border border}.
     * @default default
     * @example
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.tile:View
     *    source="{{_source}}"
     *    imageProperty="image">
     *    <ws:itemTemplate>
     *       <ws:partial
     *          template="Controls/tile:ItemTemplate"
     *          borderStyle="{{ _isInvalid(item) ? 'danger' : 'default' }}"
     *          border="{{false}}"/>
     *    </ws:itemTemplate>
     * </Controls.tile:View>
     * </pre>
     * @demo Controls-demo/tileNew/DifferentItemTemplates/Border/Index
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Border/Index
     * @see border
     */
    borderStyle?: TBorderStyle;

    /**
     * @cfg {UI/Base:TemplateFunction} Шаблон отображения содержимого узла (папки)
     */
    nodeContentTemplate?: TemplateFunction;

    /**
     * @cfg {number | string} Ширина элемента плитки. Можно задать как число (в пикселях) или строку (например, в процентах)
     */
    width?: number | string;
}
