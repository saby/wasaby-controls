/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import rk = require('i18n!Controls');

interface IOptions {
    minLength?: number;
    maxLength?: number;
}

interface IValue {
    value: string;
}

/**
 * Функция проверяет, попадает ли введенное значение в заданный диапазон.
 * @class Controls-input/_validators/MinMaxLength
 * @public
 */

export default function (options: IOptions, res: IValue): boolean | string {
    if ((typeof options.minLength === 'undefined' && typeof options.maxLength === 'undefined') ||
        (
            !res.value ||
            !(options.minLength || options.maxLength) ||
            !(res.value?.length < options.minLength || res.value?.length > options.maxLength)
        )
    ) {
        return true;
    }

    let errorText = rk('Значение должно попадать в диапазон');
    if (options.minLength && res.value?.length > options.minLength) {
        errorText += ` ${rk('от')} ${options.minLength} ${rk('символов')}`;
    }
    if (options.maxLength && res.value?.length < options.maxLength) {
        errorText += ` ${rk('до')} ${options.maxLength} ${rk('символов')}`;
    }

    return errorText;
}
