/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
import { Logger } from 'UI/Utils';
import { FormatBuilder, Formatter } from 'Controls/baseDecorator';

export interface IOptions {
    mask: string;
    replacer: string;
    formatMaskChars: object;
}

export function formattedValueToValue(formattedValue: string, options: IOptions): string {
    const format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);

    if (formattedValue.match(format.searchingGroups)) {
        return Formatter.clearData(format, formattedValue).value;
    }

    Logger.error('Некорректные данные. Проверьте значение на соответствие маске.');
    if (options.replacer === '') {
        return '';
    } else {
        const keys = Object.keys(options.formatMaskChars).join('');
        return options.mask.replace(new RegExp(`[${keys}]`, 'g'), options.replacer);
    }
}
