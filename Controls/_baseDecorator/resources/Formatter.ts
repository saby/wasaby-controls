/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { IText, pasteWithRepositioning } from './Util';
import {
    IDelimiterGroups,
    IFormat,
    IPairDelimiterData,
    ISingleDelimiterData,
} from './FormatBuilder';
import { IParsedNumber, parse } from './parse';
import { Logger } from 'UI/Utils';
import rk = require('i18n!Controls');
import { number as numberFormatter, IFormat as INumberFormat } from 'Types/formatter';

type TValue = string | number | null;
type TAbbreviationType = 'none' | 'short' | 'long';

const trillion = 1000000000000;
const billion = 1000000000;
const million = 1000000;
const thousand = 1000;
const ten = 10;
const BASE_NUMBERS = {
    trln: trillion,
    bln: billion,
    mln: million,
    thsn: thousand,
    ten,
};

/**
 * Разобрать значение на группы.
 * Успешный разбор будет, только в том случае, если значение полностью подходит формату маски.
 * @return значения групп.
 */
export function splitValue(format: IFormat, value: string): string[] {
    const resultMatch: RegExpMatchArray = value.match(format.searchingGroups);

    if (resultMatch && resultMatch[0].length === resultMatch.input.length) {
        return Array.prototype.filter.call(resultMatch, (item: string, index: number) => {
            return index > 0 && typeof item === 'string';
        });
    }
    // Отображаем предупреждение в консоли тогда, когда заданно любое не пустое значение, не подходящее формату маски
    if (value) {
        Logger.warn('Значение не соответствует формату маски.');
    }
    return null;
}

export interface ICleanData {
    value: string;
    positions: number[];
}

export function clearData(format: IFormat, value: string): ICleanData {
    let currentPosition: number = 0;
    const cleanData: ICleanData = {
        value: '',
        positions: [],
    };
    const groups: string[] = splitValue(format, value);

    if (groups) {
        groups.forEach((groupValue: string, groupIndex: number): void => {
            // При разборе регулярки можем получить пустое значение, поэтому не обрабатываем его
            // https://regex101.com/r/KGL2Xa/1
            if (groupValue === '') {
                return;
            }
            if (groupIndex in format.delimiterGroups) {
                const delimiterLength: number = format.delimiterGroups[groupIndex].value.length;
                for (let i = 0; i < delimiterLength; i++) {
                    cleanData.positions.push(currentPosition);
                }
            } else {
                cleanData.value += groupValue;
                const groupLength: number = groupValue.length;
                for (let i = 0; i < groupLength; i++) {
                    cleanData.positions.push(currentPosition);
                    currentPosition++;
                }
            }
        });
        return cleanData;
    }
    return null;
}

interface IRawDelimiters {
    value: string;
    starting: boolean;
    ending: boolean;
    openPositions: number[];
}

function indexLastGroupOfKeys(groups: string[], delimiterGroups: IDelimiterGroups): number {
    for (let index = groups.length - 1; index > -1; index--) {
        if (!(index in delimiterGroups)) {
            return index;
        }
    }

    return -1;
}

function processingSingleDelimiter(
    text: IText,
    rawDelimiters: IRawDelimiters,
    delimiter: ISingleDelimiterData
): void {
    /*
      Всегда добавляем одиночные разделители, которые стоят в начале маски.
     */
    if (rawDelimiters.starting) {
        pasteWithRepositioning(text, delimiter.value, text.value.length);
        return;
    }
    rawDelimiters.value += delimiter.value;
}

function processingPairDelimiter(
    text: IText,
    rawDelimiters: IRawDelimiters,
    delimiter: IPairDelimiterData
): void {
    if (delimiter.subtype === 'open') {
        const position: number = text.value.length + rawDelimiters.value.length;
        rawDelimiters.openPositions.push(position);
    } else if (delimiter.subtype === 'close') {
        const pairPosition: number = rawDelimiters.openPositions.pop();

        pasteWithRepositioning(text, delimiter.pair, pairPosition);
        if (rawDelimiters.ending) {
            text.value += delimiter.value;
        } else {
            pasteWithRepositioning(text, delimiter.value, text.value.length);
        }
    }
}

export function formatData(format: IFormat, cleanText: IText): IText {
    const text: IText = {
        value: '',
        carriagePosition: cleanText.carriagePosition,
    };
    const rawDelimiters: IRawDelimiters = {
        value: '',
        starting: true,
        openPositions: [],
        ending: null,
    };
    const groups: string[] = splitValue(format, cleanText.value);
    if (groups) {
        const lastGroupOfKeys: number = indexLastGroupOfKeys(groups, format.delimiterGroups);

        groups.forEach((groupValue: string, groupIndex: number) => {
            rawDelimiters.ending = groupIndex > lastGroupOfKeys;
            if (groupIndex in format.delimiterGroups) {
                if (groupValue) {
                    text.carriagePosition -= groupValue.length;
                }
                const delimiterType: string = format.delimiterGroups[groupIndex].type;

                if (delimiterType === 'singleDelimiter') {
                    processingSingleDelimiter(
                        text,
                        rawDelimiters,
                        format.delimiterGroups[groupIndex] as ISingleDelimiterData
                    );
                } else if (delimiterType === 'pairDelimiter') {
                    processingPairDelimiter(
                        text,
                        rawDelimiters,
                        format.delimiterGroups[groupIndex] as IPairDelimiterData
                    );
                }
            } else {
                pasteWithRepositioning(text, rawDelimiters.value, text.value.length);
                text.value += groupValue;

                rawDelimiters.value = '';
                rawDelimiters.starting = false;
            }
        });
        return text;
    }
    return null;
}

export function abbreviateNumber(
    value: TValue,
    abbreviationType: TAbbreviationType,
    options: INumberFormat = {},
    showEmptyDecimals?: boolean
): string {
    if (!value) {
        return '0';
    }
    if (value >= BASE_NUMBERS.trln || value <= -BASE_NUMBERS.trln) {
        return (
            intlFormat((value as number) / BASE_NUMBERS.trln, options, showEmptyDecimals) +
            `${abbreviationType === 'long' ? ' ' + rk('трлн') : 'т'}`
        );
    }
    if (value >= BASE_NUMBERS.bln || value <= -BASE_NUMBERS.bln) {
        return (
            intlFormat((value as number) / BASE_NUMBERS.bln, options, showEmptyDecimals) +
            `${abbreviationType === 'long' ? ' ' + rk('млрд') : rk('г')}`
        );
    }
    if (value >= BASE_NUMBERS.mln || value <= -BASE_NUMBERS.mln) {
        return (
            intlFormat((value as number) / BASE_NUMBERS.mln, options, showEmptyDecimals) +
            `${abbreviationType === 'long' ? ' ' + rk('млн') : 'м'}`
        );
    }
    const roundValue = Math.round(value as number);
    if (
        value >= BASE_NUMBERS.thsn ||
        value <= -BASE_NUMBERS.thsn ||
        roundValue === BASE_NUMBERS.thsn ||
        roundValue === -BASE_NUMBERS.thsn
    ) {
        return (
            intlFormat((value as number) / BASE_NUMBERS.thsn, options, showEmptyDecimals) +
            `${abbreviationType === 'long' ? ' ' + rk('тыс') : 'к'}`
        );
    }

    return roundValue.toString();
}

function intlFormat(num: number, options: INumberFormat = {}, showEmptyDecimals?: boolean): string {
    const action = options?.roundingMode === 'trunc' ? 'trunc' : 'round';
    if (showEmptyDecimals) {
        options.minimumFractionDigits = 1;
    }

    return numberFormatter(
        Math[action](num * BASE_NUMBERS.ten) / BASE_NUMBERS.ten,
        options
    ).replace(',', '.');
}

const valueWithoutTrailingZerosRegExp: RegExp = /-?[0-9 ,]*(([1-9]|([0.])(?!0*$))*)?/;
const valueWithOneTrailingZerosRegExp: RegExp = /-?[0-9 ,]*(\.[0-9]([1-9]|0(?!0*$))*)?/;

export function trimTrailingZeros(str: string, leaveOneZero: boolean = false): string {
    const regExp = leaveOneZero ? valueWithOneTrailingZerosRegExp : valueWithoutTrailingZerosRegExp;
    return str.match(regExp)[0];
}

export function fillAdditionalZeros(str: string, precision: number): string {
    const parsedString: IParsedNumber = parse(str);
    const additionalZeros = Math.max(precision - parsedString.fractional.length, 0);
    const zeros = '0'.repeat(additionalZeros);
    const splitter = parsedString.hasSplitter || !zeros ? '' : '.';
    return `${str}${splitter}${zeros}`;
}

export function correctNumberValue(value: string, onlyPositive?: boolean): string {
    let replaceValue;
    if (onlyPositive) {
        replaceValue = '';
    } else {
        replaceValue = '- ';
    }
    return value.replace(/-\b/, replaceValue);
}

export function isStringEqualsNumber(value: string): boolean {
    const correctValue = value.replace(/\.*(0+)$/, '');
    return (+correctValue).toString() === correctValue;
}

/**
 * Убирает лишние пробелы между классами, которые могут появиться при их вычислении для числового и денежного декораторов
 */
export function removeExtraSpaces(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
}
