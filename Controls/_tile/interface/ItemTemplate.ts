/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import IBaseItemTemplateOptions from 'Controls/_tile/interface/IBaseItemTemplate';

/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/tile:View плитке}.
 * @class Controls/_tile/interface/ItemTemplate
 * @implements Controls/tile:IBaseItemTemplate
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

export default interface IItemTemplateOptions extends IBaseItemTemplateOptions {
    /**
     * @cfg {Boolean} Видимость заголовка плитки.
     * @see titleStyle
     * @demo Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/HasTitle/Index
     * @remark
     * Опция также работает для шаблона {@link Controls/tile:PreviewTemplate}
     */
    hasTitle?: boolean;
    /**
     * @cfg {Boolean} Динамическое изменение высоты плитки, когда плитка отображается со статической шириной,
     * т.е. опция {@link Controls/tile:ITile#tileMode tileMode} установлена в значение static.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/CustomTemplate/StaticHeight/Index
     * @remark
     * Опция используется с пользовательским шаблоном плитки
     * @see contentTemplate
     */
    staticHeight?: boolean;
}
