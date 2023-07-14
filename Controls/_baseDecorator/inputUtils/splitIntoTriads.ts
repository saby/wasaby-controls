/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { partOfNumber } from './RegExp';

export const NUMBER_DIGITS_TRIAD = 3;
export const SPLITTER = ' ';

function reducerRight(value: string, current: string, index: number, arr: string[]) {
    const processedElements = arr.length - index - 1;

    if (processedElements % NUMBER_DIGITS_TRIAD === 0) {
        return `${current}${SPLITTER}${value}`;
    }

    return `${current}${value}`;
}

/**
 * Находит в строке число и разделяет его целую часть на триады.
 * @param original
 * @returns Строка, где целая часть числа разделена на триады.
 */
export default function splitIntoTriads(original: string): string {
    const startChar = 1;
    const endChar = 5;
    const part = original.match(partOfNumber).slice(startChar, endChar);

    if (part !== null && part[1]) {
        /*
        We divide the integer part into triads.
       */
        part[1] = Array.prototype.reduceRight.call(part[1], reducerRight);

        return part.join('');
    }

    return original;
}

export function concatTriads(original: string): string {
    return original.replace(new RegExp(`${SPLITTER}`, 'g'), '');
}
