/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { TImageSize } from '../display/mixins/TileItem';

/**
 * Упрощенный шаблон отображения элементов в {@link Controls/tile:View плитке}.
 * @class Controls/_tile/interface/ISmallTemplate
 * @implements Controls/tile:IBaseItemTemplate
 * @see Controls/tile:View
 * @example
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}" imageProperty="image">
 *     <ws:itemTemplate>
 *         <ws:partial template="Controls/tile:SmallItemTemplate"
 *             imageSize="m">
 *         </ws:partial>
 *     </ws:itemTemplate>
 * </Controls.tile:View>
 * </pre>
 * @public
 * @demo Controls-demo/tileNew/DifferentItemTemplates/SmallTemplate/Index
 * @remark
 * Шаблон имеет фиксированную высоту. Опция tileHeight не учитывается.
 * Подробнее о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/tile/item/small/ здесь}.
 */

export default interface ISmallTemplateOptions {
    /**
     * @typedef {String} ImageSize
     * @variant s Размер, соответствующий размеру s.
     * @variant m Размер, соответствующий размеру m.
     */
    /**
     * @cfg {ImageSize} Размер изображения.
     */
    imageSize?: TImageSize;
}
