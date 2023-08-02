/**
 * @kaizen_zone 01c17d93-3c36-4cf9-b699-3a3c59135b8c
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
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @class Controls/_list/AddButton
 * @mixes Controls/buttons:IClick
 * @extends UI/Base:Control
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
