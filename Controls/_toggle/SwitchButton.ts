/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { descriptor as EntityDescriptor } from 'Types/entity';
import {
    IResetValueOptions,
    ITooltip,
    ITooltipOptions,
    IValidationStatus,
    IValidationStatusOptions,
    IViewModeOptions,
    ICheckable,
    ICheckableOptions,
} from 'Controls/interface';
import 'css!Controls/toggle';
import 'css!Controls/CommonClasses';
import { SyntheticEvent } from 'Vdom/Vdom';
import SwitchTemplate = require('wml!Controls/_toggle/SwitchButton/SwitchButton');

export type TSwitchButtonSize = 's' | 'm' | 'l';

/**
 * Интерфейс для кнопки-переключателя
 * @interface Controls/_toggle/ISwitchButton
 * @private
 * @implements Controls/interface:ICheckable
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IResetValue
 * @implements Controls/interface:IViewMode
 */
export interface ISwitchButtonOptions
    extends IControlOptions,
        ICheckableOptions,
        ITooltipOptions,
        IValidationStatusOptions,
        IViewModeOptions,
        IResetValueOptions {
    position: 'start' | 'end';
    orientation: 'vertical' | 'horizontal';
    size?: TSwitchButtonSize;
}

/**
 * Кнопка-переключатель. Часто используется для настроек "вкл-выкл".
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2ftoggle%2fSwitch%2fIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-22.4000/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/toggle:ISwitchButton
 *
 * @public
 * @demo Controls-demo/toggle/SwitchButton/Base/Index
 */

class SwitchButton
    extends Control<ISwitchButtonOptions>
    implements ITooltip, ICheckable, IValidationStatus
{
    '[Controls/_interface/ITooltip]': true;
    '[Controls/_interface/ICheckable]': true;
    '[Controls/_interface/IValidationStatus]': true;
    protected _template: TemplateFunction = SwitchTemplate;

    protected _clickHandler(e: SyntheticEvent): void {
        if (this._options.readOnly) {
            e.preventDefault();
        }
    }

    protected _isResetValue(): boolean {
        return this._options.resetValue === (this._options.position === 'end');
    }

    static getDefaultOptions(): object {
        return {
            value: false,
            validationStatus: 'valid',
            viewMode: 'filled',
            size: 'm',
            position: 'start',
            orientation: 'horizontal',
        };
    }

    static getOptionTypes(): object {
        return {
            value: EntityDescriptor(Boolean),
            viewMode: EntityDescriptor(String).oneOf(['filled', 'outlined']),
        };
    }
}

/**
 * @name Controls/_toggle/ISwitchButton#size
 * @cfg {string} Определяет размер переключателя.
 * @variant s
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/toggle/SwitchButton/Size/Index
 */

/**
 * @name Controls/_toggle/ISwitchButton#resetValue
 * @cfg {boolean}
 * @demo Controls-demo/toggle/SwitchButton/ResetValue/Index
 */

/**
 * @name Controls/_toggle/ISwitchButton#viewMode
 * @cfg {string}
 * @demo Controls-demo/toggle/SwitchButton/ViewMode/Index
 */

/**
 * @name Controls/_toggle/SwitchButton#position
 * @cfg {string} Определяет положение переключателя
 * @variant start
 * @variant end
 * @default start
 * @demo Controls-demo/toggle/SwitchButton/Base/Index
 */

export default SwitchButton;
