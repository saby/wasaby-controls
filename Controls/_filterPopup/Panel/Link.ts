/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_filterPopup/Panel/Link/Link');
import 'css!Controls/filterPopup';

/**
 * Кнопка-ссылка на панели фильтров.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления}
 *
 * @class Controls/_filterPopup/Panel/Link
 * @extends UI/Base:Control
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/_filterPopup/interface/IVisibilityChanged
 * @public
 *
 * @example
 * Пример использования контрола на панели фильтра в блоке "Можно отобрать"
 * AdditionalItemTemplate.wml
 * <pre class="brush: html">
 *    <ws:template name="FIO">
 *       <Controls.filterPopup:Link caption="Author"/>
 *    </ws:template>
 *
 *    <ws:partial template="{{item.id}}" item="{{item}}"/>
 * </pre>
 */

class FilterLink extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _clickHandler(): void {
        this._notify('visibilityChanged', [true]);
    }
}

/**
 * @name Controls/_filterPopup/Panel/Link#caption
 * @cfg {Object} Текст кнопки-ссылки.
 */
export default FilterLink;
