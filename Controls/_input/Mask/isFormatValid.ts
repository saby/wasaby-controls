/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
import {
    FormatBuilder,
    Formatter
} from 'Controls/baseDecorator';
import {IFormatMaskChars} from 'Controls/interface';
import {getDefaultMaskOptions} from 'Controls/Utils/PhoneUtils';

const DEFAULT_OPTIONS = getDefaultMaskOptions();

/**
 * Модуль возвращает функцию isFormatValid, которая проверяет соответствие значения формату маски.
 *
 * @class Controls/_input/Mask/isFormatValid
 * @public
 * @example
 * <pre class="brush: html">
 * isFormatValid('1234', 'dd.dd');  // true
 * isFormatValid('1234', 'dd.dd', undefined, undefined, false); // false
 * isFormatValid('12.34', 'dd.dd'); // true
 * isFormatValid('1aa4', 'dd.dd');  // false
 * isFormatValid('1a.a4', 'dd.dd'); // false
 * </pre>
 */
function isFormatValid(
    value: string,
    mask: string,
    replacer: string = DEFAULT_OPTIONS.replacer,
    formatMaskChars: IFormatMaskChars = DEFAULT_OPTIONS.formatMaskChars,
    skipDelimeters: boolean = true
): boolean {
    try {
        const format = FormatBuilder.getFormat(mask, formatMaskChars, replacer, skipDelimeters);
        return Formatter.splitValue(format, value) !== null;
    } catch {
        return false;
    }
}

export default isFormatValid;
