/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { IFormat, number } from 'Types/formatter';
import { controller } from 'I18n/i18n';

export default function numberToString(
    original: number | string,
    options?: IFormat
): string {
    if (Math.abs(+original) === Infinity) {
        return '0';
    } else if (original === null) {
        return '';
    }
    const res = number(+original, options);
    if (
        controller.currentLocale !== 'en' &&
        controller.currentLocale !== 'en-US'
    ) {
        return res.replace(',', '.');
    } else {
        return res.replace(/,/g, ' ');
    }
}
