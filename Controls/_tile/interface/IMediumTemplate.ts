/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
/**
 * Упрощенный шаблон отображения элементов в {@link Controls/tile:View плитке}.
 * @class Controls/_tile/interface/MediumTemplate
 * @implements Controls/tile:IBaseItemTemplate
 * @see Controls/tile:View
 * @example
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}" imageProperty="image">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tile:MediumTemplate"
 *                   titleLines="2">
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.tile:View>
 * </pre>
 * @public
 * @demo Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/Index
 * @remark
 * Шаблон имеет фиксированную высоту. Опция tileHeight не учитывается.
 */

export default interface IMediumTemplate {
    /**
     * @cfg {Number} Количество строк в описании.
     * @default 1
     * @demo Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/TitleLines/Index
     * @remark
     * Опция также работает для шаблонов {@link Controls/tile:RichTemplate}, {@link Controls/tile:PreviewTemplate}
     */
    titleLines?: number;
}
