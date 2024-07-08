/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { Formatter, FormatBuilder } from 'Controls/baseDecorator';
import { toString, FORMAT_MASK_CHARS, REPLACER, phoneMask } from 'Controls/Utils/PhoneUtils';

/**
 * Утилита для преобразования номера телефона.
 * @param {String | null} phone Форматируемое значение
 * @param {Boolean} onlyMobile  Определяет необходимость отображения мобильного номера телефона
 *
 * @example
 * <pre  class="brush: js">
 *     formatPhone('7999', false); // '79-99'
 *     formatPhone('7999', true); // '+7 (999)'
 *     formatPhone('3759999999999') // '3759999999999'
 *     formatPhone('79999999999', true); // '+7 (999) 999 99-99'
 * </pre>
 * @public
 * @returns String
 */
export default function formatPhone(phone: string | null, onlyMobile: boolean): string {
    if (onlyMobile) {
        this._options = { onlyMobile };
    }
    const validPhone = toString(phone.replace(/[^+\d]/g, ''), this);
    const mask = phoneMask(validPhone, this);
    const format = FormatBuilder.getFormat(mask, FORMAT_MASK_CHARS, REPLACER);
    const data = Formatter.formatData(format, {
        value: validPhone,
        carriagePosition: 0,
    });
    if (data) {
        if (onlyMobile && !data.value.includes('+')) {
            return '+' + data.value;
        }
        return data.value;
    }
    return '';
}
