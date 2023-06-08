/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import numberToString from './numberToString';
import { Logger } from 'UI/Utils';
import { IFormat } from 'Types/formatter';

export default function toString(
    original: string | number | null,
    self?: object,
    options?: IFormat
): string {
    if (original === null) {
        return '';
    }
    if (typeof original === 'number') {
        return numberToString(original, options);
    }
    if (typeof original === 'string') {
        return original;
    }

    Logger.error(`Первый аргумент ${original} имеет не поддерживаемый тип`, self);
    return '';
}
