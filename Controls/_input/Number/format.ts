/**
 * @kaizen_zone bac621e3-f301-4c70-903a-f74de6eae794
 */
import { splitIntoTriads } from 'Controls/baseDecorator';
import { IParsedNumber } from 'Controls/_input/Number/parse';
import { numberConstant } from 'Controls/baseDecorator';
import {
    IText,
    paste,
    pasteWithRepositioning,
    remove,
    removeWithRepositioning,
} from 'Controls/baseDecorator';

const decimalSplitter = numberConstant.decimalSplitter;

interface INumberLength {
    precision?: number;
    integersLength?: number;
}

interface INumberDisplay {
    useGrouping: boolean;
    useAdditionToMaxPrecision: boolean;
}

interface INumberSign {
    onlyPositive: boolean;
}

interface IDataAfterLimiting {
    value: string;
    position: number;
    movedValue: string;
}

interface IPosition {
    absolute: number;
    relative: number;
}

type Parts = 'integer' | 'fractional';
type NumberOptions = INumberLength & INumberDisplay & INumberSign;

/**
 * Format number by options.
 * @param parsedNumber
 * @param options
 * @param carriagePosition
 * @return {IText}
 */
export function format(
    parsedNumber: IParsedNumber,
    options: NumberOptions,
    carriagePosition: number
): IText {
    let position: number = correctSign(parsedNumber, options, carriagePosition);
    position = correctSplitter(parsedNumber, options, position);
    position = correctIntegerPart(parsedNumber, options, position);
    if (shouldBeFractional(parsedNumber.fractional, options)) {
        position = correctFractionalPart(parsedNumber, options, position);
    }

    return concat(parsedNumber, options, position);
}

function correctSign(
    parsedNumber: IParsedNumber,
    { onlyPositive }: INumberSign,
    carriagePosition: number
): number {
    let position: number = carriagePosition;

    if (onlyPositive) {
        position -= parsedNumber.negative;
        parsedNumber.negative = 0;
    }

    return position;
}

function correctIntegerPart(
    parsedNumber: IParsedNumber,
    options: INumberLength & INumberDisplay,
    carriagePosition: number
): number {
    const needlessChars: number = calcNeedlessChars(parsedNumber, 'integer', options);
    const positionRelativeIntegerPart: number = getPositionRelativePart(
        parsedNumber,
        'integer',
        carriagePosition
    );

    const limitedValue: IDataAfterLimiting = limitValue(
        parsedNumber.integer,
        {
            absolute: carriagePosition,
            relative: positionRelativeIntegerPart,
        },
        needlessChars
    );

    const position: number = shouldBeFractional(parsedNumber.fractional, options)
        ? moveIntegerToFractional(
              parsedNumber,
              {
                  value: limitedValue.movedValue,
                  carriagePosition: limitedValue.position,
              },
              limitedValue.value
          )
        : limitedValue.position;

    const processedData: IText = handleInsignificantZero(
        options,
        {
            value: limitedValue.value,
            carriagePosition: position,
        },
        parsedNumber.negative
    );

    /*
     * If the integer part contains the number of numbers corresponding to the limit,
     * the cursor automatically passes through the splitter and is set before the first
     * character in the fractional part.
     */
    if (
        needlessChars === 0 &&
        parsedNumber.negative + processedData.value.length === processedData.carriagePosition
    ) {
        processedData.carriagePosition += decimalSplitter.length;
    }

    parsedNumber.integer = processedData.value;

    return processedData.carriagePosition;
}

/**
 * Get the number of needless characters in a part number.
 */
function calcNeedlessChars(
    original: IParsedNumber,
    part: Parts,
    numberLength: INumberLength
): number {
    const {
        precision = Number.MAX_SAFE_INTEGER,
        integersLength = Number.MAX_SAFE_INTEGER,
    }: INumberLength = numberLength;

    const maxLength: number = part === 'integer' ? integersLength : precision;
    const needlessChars: number = original[part].length - maxLength;

    return needlessChars > -1 ? needlessChars : null;
}

/**
 * Get position with respect to the integer or fractional part.
 */
function getPositionRelativePart(
    original: IParsedNumber,
    part: Parts,
    positionAbsolute: number
): number {
    /*
     * The relative position is the difference between the absolute position and the beginning of the part.
     * The number is presented as {sing}{integer}{splitter}{fractional}.
     */
    let positionRelative: number = positionAbsolute - original.negative;

    if (part === 'fractional') {
        positionRelative -= original.integer.length + decimalSplitter.length;
    }

    /*
     * The position relative to one of the parts, integer or fractional,
     * must be greater than 0 or less their length.
     */
    return Math.max(0, Math.min(positionRelative, original[part].length));
}

function limitValue(value: string, position: IPosition, needlessChars: number): IDataAfterLimiting {
    if (!needlessChars) {
        return { value, position: position.absolute, movedValue: '' };
    }

    /*
     * The needless characters can be removed from the entered value or from
     * the value after it by replacing part of it with part of the entered value.
     * The entered value is in front of the cursor.
     *
     * The number of characters to replace is determined by the number of needless characters.
     * It cannot exceed the length of the value whose characters are replaced.
     */
    const replacingChars: number = Math.min(needlessChars, value.length - position.relative);
    const removingChars: number = needlessChars - replacingChars;
    const removeStartPosition: number = position.relative - removingChars;

    return {
        position: position.absolute - removingChars,
        movedValue: value.substring(removeStartPosition, position.relative),
        value: remove(value, removeStartPosition, position.relative + replacingChars),
    };
}

/**
 * Move the integer part to the beginning of the fractional part.
 */
function moveIntegerToFractional(
    parsedNumber: IParsedNumber,
    text: IText,
    integer: string
): number {
    if (!text.value) {
        return text.carriagePosition;
    }

    const { value: fractional, carriagePosition: shiftedPosition }: IText = pasteWithRepositioning(
        {
            value: parsedNumber.fractional,
            carriagePosition: text.carriagePosition,
        },
        text.value,
        0
    );

    parsedNumber.fractional = fractional;

    const movedValuePosition: number =
        parsedNumber.negative + integer.length + decimalSplitter.length + text.value.length;

    return Math.max(shiftedPosition, movedValuePosition);
}

/**
 * Remove all zeros at the beginning. If the value consists only of zeros, then leave one.
 */
function handleInsignificantZero(
    { precision }: INumberLength,
    data: IText,
    negative: number
): IText {
    const { value, carriagePosition }: IText = data;
    const firstSignificantDigitPosition: number = calcFirstSignificantDigit(value);

    let { value: formattedValue, carriagePosition: formattedPosition }: IText =
        removeWithRepositioning(
            {
                value,
                carriagePosition: carriagePosition - negative,
            },
            0,
            firstSignificantDigitPosition
        );

    /*
     * If the field provides input of fractional numbers, when you enter the character "-" zero is not hidden.
     * In the fields intended for entering only integers zero is hidden.
     */
    if ((precision !== 0 || !negative) && formattedValue === '') {
        formattedValue = '0';
        formattedPosition++;
    }

    return {
        value: formattedValue,
        carriagePosition: formattedPosition + negative,
    };
}

/**
 * Calculate the position of the first non-zero character.
 */
function calcFirstSignificantDigit(value: string): number {
    const position = value.search(significantDigit);

    return position === -1 ? value.length : position;
}

const significantDigit: RegExp = /[1-9]/;

function correctFractionalPart(
    parsedNumber: IParsedNumber,
    options: INumberLength,
    carriagePosition: number
): number {
    const needlessChars: number = calcNeedlessChars(parsedNumber, 'fractional', options);
    const positionRelativeIntegerPart: number = getPositionRelativePart(
        parsedNumber,
        'fractional',
        carriagePosition
    );

    const limitedValue: IDataAfterLimiting = limitValue(
        parsedNumber.fractional,
        {
            absolute: carriagePosition,
            relative: positionRelativeIntegerPart,
        },
        needlessChars
    );

    parsedNumber.fractional = handleVoid(options, limitedValue.value);

    return limitedValue.position;
}

function correctSplitter(
    parsedNumber: IParsedNumber,
    options: INumberLength,
    carriagePosition: number
): number {
    if (options.precision === 0 && parsedNumber.hasSplitter) {
        parsedNumber.hasSplitter = false;
        return Math.min(carriagePosition, parsedNumber.integer.length);
    }

    return carriagePosition;
}

/**
 * Convert an empty value to zero if its maximum length is not zero.
 */
function handleVoid({ precision }: INumberLength, value: string): string {
    /*
     * According to the standard, the empty fractional part should be replaced by "0".
     */
    if (precision !== 0 && value === '') {
        return '0';
    }

    return value;
}

function join(original: string[], position: number, additionalZeros: number): string {
    const value = original.join('');

    if (additionalZeros > 0) {
        const zeros = '0'.repeat(additionalZeros);

        // Удаление дробного числа должно приводить к появлению нуля на конце
        return paste(value, zeros, value.length);
    }

    return value;
}

function concat(
    original: IParsedNumber,
    options: INumberDisplay & INumberLength,
    carriagePosition: number
): IText {
    const value: string[] = [];
    let integer: string = original.integer;
    let position: number = carriagePosition;

    if (original.negative) {
        value.push('-');
    }

    if (options.useGrouping) {
        const countTriads = getCountTriads(integer.length);
        const positionRelativeIntegerPart: number = getPositionRelativePart(
            original,
            'integer',
            carriagePosition
        );
        const countTriadsAfterCarriage = getCountTriads(
            integer.length - positionRelativeIntegerPart
        );

        integer = splitIntoTriads(original.integer);
        position += countTriads - countTriadsAfterCarriage;
    }

    if (!(original.negative && integer === '0' && !original.fractional)) {
        value.push(integer);
    }

    if (original.fractional) {
        value.push(decimalSplitter, original.fractional);
    } else if (original.hasSplitter) {
        value.push(decimalSplitter);
    }

    const additionalZeros = options.useAdditionToMaxPrecision
        ? options.precision - original.fractional.length
        : 0;

    return {
        value: join(value, position, additionalZeros),
        carriagePosition: position,
    };
}

function getCountTriads(valueLength: number): number {
    return Math.max(0, Math.floor((valueLength - 1) / numbersInTriad));
}

function shouldBeFractional(fractional: string, options: INumberDisplay): boolean {
    return options.useAdditionToMaxPrecision || fractional !== '';
}

const numbersInTriad: number = 3;
