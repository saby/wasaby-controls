/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { IControlOptions } from 'UI/Base';
import { TInternalProps } from 'UICore/Executor';
import { IFontColorStyleOptions } from 'Controls/_interface/IFontColorStyle';
import { IFontWeightOptions } from 'Controls/_interface/IFontWeight';
import { IFontSizeOptions } from 'Controls/_interface/IFontSize';
import { ITooltipOptions } from 'Controls/_interface/ITooltip';
import { INumberFormatOptions } from 'Controls/_interface/INumberFormat';
import { IStrokedOptions } from 'Controls/_interface/IStroked';
import { IOnlyPositiveOptions } from '../interfaces/IOnlyPositive';
import { IControlProps } from 'Controls/interface';

import {
    abbreviateNumber,
    correctNumberValue,
    removeExtraSpaces,
    isStringEqualsNumber,
} from './Formatter';
import numberToString from '../inputUtils/toString';

interface IPaths {
    integer: string;
    fraction: string;
    number: string;
    tooltip: string;
}

type TValue = string | number | null;

type TAbbreviationType = 'long' | 'none';
type TCurrency = 'Ruble' | 'Euro' | 'Dollar' | string;
type TCurrencyPosition = 'right' | 'left';
type TCurrencySize = IFontSizeOptions['fontSize'];
type TUnderline = 'hovered' | 'none';
type TPrecision = 0 | 2 | 4;

export interface IMoneyOptions
    extends IControlOptions,
        INumberFormatOptions,
        IStrokedOptions,
        ITooltipOptions,
        IFontWeightOptions,
        IFontSizeOptions,
        IOnlyPositiveOptions,
        TInternalProps,
        IControlProps {
    value: TValue;
    abbreviationType?: TAbbreviationType;
    currency?: TCurrency;
    currencySize?: TCurrencySize;
    currencyStyle?: IFontColorStyleOptions['fontColorStyle'];
    currencyPosition?: TCurrencyPosition;
    underline?: TUnderline;
    precision?: TPrecision;
    highlightedValue?: number | string;
    fontColorStyle?: IFontColorStyleOptions['fontColorStyle'] | 'contrast';
    fractionFontSize?: IFontSizeOptions['fontSize'];

    onBlur?: (e) => void;
    onClick?: (e) => void;
    onCopy?: (e) => void;
    onCut?: (e) => void;
    onFocus?: (e) => void;
    onInput?: (e) => void;
    onKeyDown?: (e) => void;
    onKeyUp?: (e) => void;
    onMouseDown?: (e) => void;
    onMouseMove?: (e) => void;
    onMouseLeave?: (e) => void;
    onTouchStart?: (e) => void;
}

const partOfNumber: RegExp = /(-? ?)([0-9]*)([.,]?)([0-9]*)/;
const NUMBER_DIGITS_TRIAD = 3;
const SPLITTER = ' ';

// TODO Покрыть тестами функции https://online.sbis.ru/opendoc.html?guid=dd60b3fe-5990-4abf-9a7e-436763a85f69

export function calculateMainClass(
    fontColorStyle: string,
    underline: string
): string {
    return removeExtraSpaces(
        'controls-DecoratorMoney' +
        `${
            underline === 'hovered'
                ? ' controls-DecoratorMoney__underline'
                : ''
        }` +
        `${fontColorStyle ? ' controls-text-' + fontColorStyle : ''}`
    );
}

export function calculateCurrencyClass(
    currencySize: string,
    fontColorStyle: string,
    fontWeight: string
): string {
    return removeExtraSpaces(`${
        currencySize ? 'controls-fontsize-' + currencySize : ''
    } ${fontColorStyle ? ' controls-text-' + fontColorStyle : ''}
            ${fontWeight ? ' controls-fontweight-' + fontWeight : ''}`);
}

export function calculateStrokedClass(stroked: boolean): string {
    return `${stroked ? 'controls-DecoratorMoney__stroked' : ''}`;
}

export function calculateIntegerClass(
    fontSize: string,
    fontColorStyle: string,
    fontWeight: string,
    currency: string,
    currencyPosition: string,
    isDisplayFractionPathParam: boolean
): string {
    return removeExtraSpaces(`${
        fontSize ? 'controls-fontsize-' + fontSize : ''
    } ${fontColorStyle ? ' controls-text-' + fontColorStyle : ''}
            ${fontWeight ? ' controls-fontweight-' + fontWeight : ''} ${
        currency && currencyPosition === 'left'
            ? ' controls-margin_left-2xs'
            : ''
    }
            ${
        currency &&
        currencyPosition === 'right' &&
        !isDisplayFractionPathParam
            ? ' controls-margin_right-2xs'
            : ''
    }`);
}

export function calculateFractionClass(
    fraction: string,
    fontColorStyle: string,
    fractionFontSize: string,
    currency: string,
    currencyPosition: string,
    fontSize?: string
): string {
    let postfixStyle = fontColorStyle;
    if (fontColorStyle === 'contrast') {
        postfixStyle = fraction === '.00' ? 'semi_contrast' : 'contrast';
    } else if (fraction === '.00' || fontColorStyle === 'readonly') {
        postfixStyle = 'readonly';
    } else if (!(fontSize === '5xl' || fontSize === '6xl' ||
            fontSize === '7xl' || fontSize === '8xl')) {
        postfixStyle = 'label';
    }

    return removeExtraSpaces(
        'controls-DecoratorMoney__fraction__colorStyle-' +
        postfixStyle +
        ` controls-text-${postfixStyle}` +
        (fractionFontSize ? ' controls-fontsize-' + fractionFontSize : '') +
        (currency && currencyPosition === 'right'
            ? ' controls-margin_right-2xs'
            : '')
    );
}

export function calculateCurrency(currency: string): string {
    const currencies = {
        Ruble: '₽',
        Dollar: '$',
        Euro: '€',
    };

    return currencies[currency] ?? currency;
}

export function calculateFontColorStyle(
    stroked: boolean,
    options: IMoneyOptions
): string {
    if (options.readOnly || stroked) {
        return 'readonly';
    } else {
        return options.fontColorStyle;
    }
}

export function calculateTooltip(
    formattedNumber: IPaths,
    options: IMoneyOptions
): string {
    if (options.hasOwnProperty('tooltip')) {
        return options.tooltip;
    }

    return formattedNumber.tooltip ?? formattedNumber.number;
}

export function isDisplayFractionPath(
    value: string,
    showEmptyDecimals: boolean,
    precision: number
): boolean {
    return (showEmptyDecimals || value !== '.00') && !!precision;
}

function reducerRight(
    value: string,
    current: string,
    index: number,
    arr: string[]
) {
    const processedElements = arr.length - index - 1;

    if (processedElements % NUMBER_DIGITS_TRIAD === 0) {
        return `${current}${SPLITTER}${value}`;
    }

    return `${current}${value}`;
}

export default function splitIntoTriads(original: string): string {
    const startChar = 1;
    const endChar = 5;
    const part = original.match(partOfNumber).slice(startChar, endChar);

    if (part !== null && part[startChar]) {
        /*
         * We divide the integer part into triads.
         */
        part[startChar] = Array.prototype.reduceRight.call(
            part[startChar],
            reducerRight
        );

        return part.join('');
    }

    return original;
}

export function calculateFormattedNumber(
    value: TValue,
    useGrouping: boolean,
    abbreviationType: TAbbreviationType,
    precision: number,
    onlyPositive: boolean,
    props?: IMoneyOptions
): IPaths {
    const formattedValue = toFormat(
        toString(value, precision, false),
        precision
    );

    // eslint-disable-next-line prefer-const
    let [integer, fraction] = splitValueIntoParts(formattedValue);
    let normalInteger = useGrouping ? splitIntoTriads(integer) : integer;
    normalInteger = correctNumberValue(normalInteger, onlyPositive);

    if (abbreviationType === 'long') {
        const numberValue = value
            ? typeof value === 'number'
                ? value
                : +value
            : 0;
        integer = abbreviateNumber(numberValue, abbreviationType, {
            useGrouping,
        }, props.showEmptyDecimals);
        integer = correctNumberValue(integer, onlyPositive);
    } else {
        integer = normalInteger;
    }
    let tooltip = props?.tooltip;
    if (typeof tooltip === 'undefined') {
        tooltip = normalInteger + fraction;
    }

    return {
        integer,
        fraction,
        number: integer + fraction,
        tooltip,
    };
}

function toFormat(value: string, precision: number): string {
    const maxPrecision = 4;
    if (value) {
        const dotPosition = value.indexOf('.');

        if (dotPosition === -1) {
            return (
                value +
                (precision
                    ? precision === maxPrecision
                        ? '.0000'
                        : '.00'
                    : '')
            );
        }

        if (!precision) {
            return value.substr(0, dotPosition);
        }

        const fractionLength = value.length - dotPosition - 1;
        if (fractionLength < precision) {
            return value + '0'.repeat(precision - fractionLength);
        }

        if (fractionLength > precision) {
            return value.substr(0, dotPosition + precision + 1);
        }
    }

    return value;
}

function toString(
    value: TValue,
    precision: number,
    useGrouping: boolean
): string {
    if (value === null) {
        return '';
    }

    if (
        (value && typeof value === 'string' && isStringEqualsNumber(value)) ||
        typeof value === 'number'
    ) {
        const options = {
            useGrouping,
        };

        if (precision) {
            options.maximumFractionDigits = precision;
            options.roundingMode = 'trunc';
        }
        return numberToString(+value, this, options);
    }
    return value;
}

function splitValueIntoParts(value: string): string[] {
    // eslint-disable-next-line prefer-const
    let [integer, fraction] = value.split('.');
    if (fraction) {
        fraction = '.' + fraction;
    } else {
        fraction = '';
    }
    return [integer, fraction];
}

export function calculateFractionFontSize(fontSize: string): string {
    if (fontSize === '6xl' || fontSize === '7xl' || fontSize === '8xl') {
        return '3xl';
    }
    if (fontSize === '3xl' || fontSize === '4xl' || fontSize === '5xl') {
        return 'l';
    }
    return 'xs';
}
