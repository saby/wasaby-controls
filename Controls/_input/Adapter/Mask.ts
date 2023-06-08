/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as InputMask from 'Controls/_input/Mask';
import * as MaskFormatterValue from 'Controls/_input/Mask/FormatterValue';
import * as template from 'wml!Controls/_input/Adapter/Mask/Mask';
import { EventUtils } from 'UI/Events';
/**
 * Контрол обертка над полем ввода маски. Обеспечивает работу со значением с разделителями.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @class Controls/_input/Adapter/Mask
 * @extends UICore/Base:Control
 * @mixes Controls/baseDecorator:IMask
 * @public
 * @demo Controls-demo/Input/AdapterMask/Index
 *
 */
class Mask extends Control<IControlOptions> {
    protected _notifyHandler: Function = EventUtils.tmplNotify;

    protected _template: TemplateFunction = template;

    protected _beforeMount(options: object): void {
        this._value = MaskFormatterValue.formattedValueToValue(options.value, {
            mask: options.mask,
            replacer: options.replacer,
            formatMaskChars: options.formatMaskChars,
        });
    }

    protected _beforeUpdate(newOptions: object): void {
        if (
            this._options.value !== newOptions.value ||
            this._options.mask !== newOptions.mask ||
            this._options.replacer !== newOptions.replacer
        ) {
            this._value = MaskFormatterValue.formattedValueToValue(
                newOptions.value,
                {
                    mask: newOptions.mask,
                    replacer: newOptions.replacer,
                    formatMaskChars: newOptions.formatMaskChars,
                }
            );
        }
    }

    static getDefaultOptions: Function = InputMask.getDefaultOptions;
}

export default Mask;
