/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_filterPopup/Panel/Text/Text');
import 'css!Controls/filterPopup';

/**
 * Контрол, отображающий текст с кнопкой сброса в виде крестика.
 * Используется для демонстрации пользователю выбранного фильтра, клик по крестику сбрасывает фильтр.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления}
 *
 * @class Controls/_filterPopup/Panel/Text
 * @extends UI/Base:Control
 * @implements Controls/interface:ITextValue
 * @public
 */
class Text extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _afterMount(): void {
        this._notify('valueChanged', [this._options.value]);
        this._notify('textValueChanged', [this._options.caption]);
    }

    protected _resetHandler(): void {
        this._notify('visibilityChanged', [false]);
    }

    static getDefaultOptions(): object {
        return {
            value: true,
        };
    }
}

/**
 * @name Controls/_filterPopup/Panel/Text#caption
 * @cfg {String} Текст, который будет отображаться рядом с кнопкой сброса.
 * @example
 * <pre class="brush: html">
 * <Controls.filterPopup:Text>
 *    <ws:caption>По удалённым</ws:caption>
 * </Controls.filterPopup:Text>
 * </pre>
 */

/**
 * @name Controls/_filterPopup/Panel/Text#value
 * @cfg {*} Значение, которое будет установлено в конфигурацию фильтра после построения контрола.
 * @default true
 * @example
 * <pre class="brush: html">
 * <Controls.filterPopup:Text>
 *    <ws:value>-2</ws:value>
 * </Controls.filterPopup:Text>
 * </pre>
 */
export default Text;
