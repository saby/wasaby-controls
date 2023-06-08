/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { IControlOptions } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { IFormat } from 'Types/formatter';
import { TInternalProps } from 'UICore/Executor';
import { INumberFormatOptions } from 'Controls/_interface/INumberFormat';
import { IFontColorStyleOptions } from 'Controls/_interface/IFontColorStyle';
import { IFontWeightOptions } from 'Controls/_interface/IFontWeight';
import { IFontSizeOptions } from 'Controls/_interface/IFontSize';
import { IControlProps } from 'Controls/interface';

import { IOnlyPositiveOptions } from '../interfaces/IOnlyPositive';
import toString from '../inputUtils/toString';
import {
    abbreviateNumber,
    correctNumberValue,
    fillAdditionalZeros,
    removeExtraSpaces,
    trimTrailingZeros,
    isStringEqualsNumber,
} from './Formatter';

type TValue = string | number | null;
type TAbbreviationType = 'none' | 'short' | 'long';
type TUnderline = 'hovered' | 'none';

export type RoundMode = 'round' | 'trunc';

export interface INumberOptions
    extends IControlOptions,
        INumberFormatOptions,
        IFontWeightOptions,
        IFontSizeOptions,
        IOnlyPositiveOptions,
        TInternalProps,
        IControlProps {
    value: TValue;
    fractionSize?: number;
    precision?: number;
    roundMode?: RoundMode;
    abbreviationType?: TAbbreviationType;
    underline?: TUnderline;
    tooltip?: string;
    highlightedValue?: number | string;
    fontColorStyle?: IFontColorStyleOptions['fontColorStyle'] | 'contrast';
    onClick?: Function;
    onMouseDown?: Function;
}

export function calculateMainClass(
    fontSize: string,
    fontColorStyle: string,
    stroked: boolean,
    underline: string,
    fontWeight: string
): string {
    return removeExtraSpaces(
        'controls-DecoratorNumber' +
            `${fontSize ? ' controls-fontsize-' + fontSize : ''}
    ${fontColorStyle ? ' controls-text-' + fontColorStyle : ''}
    ${stroked ? ' controls-DecoratorNumber__stroked' : ''}
    ${underline === 'hovered' ? ' controls-DecoratorNumber__underline' : ''}` +
            ' controls-fontweight-' +
            (fontWeight ? fontWeight : 'default')
    );
}

export function calculateFontColorStyle(
    stroked: boolean,
    options: INumberOptions
): string {
    if (options.readOnly || stroked) {
        return 'readonly';
    } else {
        return options.fontColorStyle;
    }
}

export function calculateFormattedNumber(
    value: string | number | null,
    useGrouping: boolean,
    roundMode: RoundMode,
    fractionSize: number,
    abbreviationType: TAbbreviationType,
    showEmptyDecimals: boolean,
    format: INumberOptions,
    self?: object
): string {
    if (value === '') {
        return value;
    }
    let precision: number = format.precision;

    if (typeof fractionSize === 'number') {
        Logger.warn(
            'Controls/baseDecorator:Number: Option "fractionSize" is obsolete and will be removed soon. Use "precision" option instead.',
            this
        );
        precision = fractionSize;
    }

    const options: IFormat = {
        maximumFractionDigits: precision,
        useGrouping,
    };
    if (typeof precision === 'number' && roundMode === 'round') {
        options.minimumFractionDigits = format.precision;
    }
    if (roundMode === 'round') {
        options.roundingMode = 'halfExpand';
    } else {
        options.roundingMode = 'trunc';
    }
    let numberValue = value;
    if (typeof numberValue === 'string') {
        if (isStringEqualsNumber(value as string)) {
            numberValue = +numberValue;
        } else {
            if (typeof precision === 'number') {
                numberValue = safeConversion(numberValue, precision);
            }
        }
    }
    let strNumber = toString(numberValue, self, options);

    if (strNumber === '') {
        return '';
    }

    if (typeof precision === 'number') {
        if (showEmptyDecimals) {
            strNumber = fillAdditionalZeros(strNumber, precision);
        }
    }

    if (!showEmptyDecimals) {
        strNumber = trimTrailingZeros(strNumber);
    }

    if (abbreviationType && abbreviationType !== 'none') {
        return correctNumberValue(
            abbreviateNumber(numberValue, abbreviationType, options),
            format.onlyPositive
        );
    }
    strNumber = correctNumberValue(strNumber, format.onlyPositive);

    return strNumber;
}

const safeConversion = (value: string, precision: number): string => {
    const [integer, fraction] = value.split('.');
    if (typeof fraction === 'undefined') {
        return (+integer).toFixed(precision);
    }
    return integer + (+('0.' + fraction)).toFixed(precision).slice(1);
};
