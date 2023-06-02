/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import StringValueConverter from 'Controls/_date/BaseInput/StringValueConverter';
import { Base as dateUtils } from 'Controls/dateUtils';
import { MaskViewModel } from 'Controls/input';

// new Date, без указания года, использует по умолчанию 1900 год. В некоторых контроллах ввода даты
// можно задать только день и месяц. В некоторых случаях может быть необходимо выбрать 29 февраля.
// 1900 год високосным не является, поэтому валидатор такую дату не пропустит,
// поэтому испольуем близжающий к нему високосный 1904 год
const DEFAULT_YEAR_NUM = 1904;
const DEFAULT_YEAR_STR = '1904';

class ModuleClass extends MaskViewModel {
    // При вводе в поле даты мы всегда должны заменять пустое место на символ, а не 'толкать' остальные цифры вперед
    protected _shouldShiftReplacer: boolean = false;
    protected handleInput(splitValue: object, inputType: string): boolean {
        const _stringValueConverter = new StringValueConverter({
            replacer: this.options.replacer,
        });
        let date;
        let textLength;
        if (splitValue.insert.length > 1) {
            date = _stringValueConverter.getValueByString(splitValue.insert);
        }
        if (
            dateUtils.isValidDate(date) &&
            (this.options.mask.indexOf('Y') >= 0 &&
            date.getFullYear() === DEFAULT_YEAR_NUM
                ? splitValue.insert.indexOf(DEFAULT_YEAR_STR) >= 0
                : true)
        ) {
            const dateValue = _stringValueConverter.getStringByValue(
                date,
                this.options.mask
            );
            const displayValue = dateValue;
            const hasChangedDisplayValue = this._displayValue !== displayValue;

            this._displayValue = displayValue;
            this._value = this._convertToValue(displayValue);
            textLength = displayValue.length;
            this._selection.start = textLength;
            this._selection.end = textLength;

            this._shouldBeChanged = true;

            return hasChangedDisplayValue;
        } else {
            return super.handleInput.apply(this, arguments);
        }
    }

    protected _convertToDisplayValue(value: string): string {
        const result = super._convertToDisplayValue(value);
        if (!this._value.trim() && this._options.placeholder) {
            return this._options.placeholder;
        }
        return result;
    }
}

export default ModuleClass;
