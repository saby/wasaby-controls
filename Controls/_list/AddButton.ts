/**
 * @kaizen_zone f3c537c7-1cd5-4a44-a53a-3f5ceaf2ebab
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_list/AddButton/AddButton';
import { descriptor } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Специализированный тип кнопки.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @mixes Controls/buttons:IClick
 * @extends UI/Base:Control
 * @demo Controls-demo/list_new/AddButton/Index
 *
 * @public
 */

export default class AddButton extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected clickHandler(e: SyntheticEvent<MouseEvent>): void {
        if (this._options.readOnly) {
            e.stopPropagation();
        }
    }

    static getOptionTypes(): object {
        return {
            caption: descriptor(String),
            tooltip: descriptor(String),
        };
    }
}

/**
 * @name Controls/_list/AddButton#caption
 * @cfg {String} Текст заголовка контрола.
 * @example
 * <pre class="brush: html">
 * <Controls.list:AddButton caption="add record"/>
 * </pre>
 */

/**
 * Текст всплывающей подсказки, отображаемой при наведении указателя мыши на кнопку.
 * @name Controls/_list/AddButton#tooltip
 * @cfg {String}
 */
