/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
/**
 * Библиотека базовых декораторов.
 * @library
 * @includes IDate Controls/_baseDecorator/IDate
 * @includes IHighlight Controls/_baseDecorator/IHighlight
 * @includes IMoney Controls/_baseDecorator/IMoney
 * @includes INumber Controls/_baseDecorator/INumber
 * @includes Money Controls/_baseDecorator/Money
 * @includes Number Controls/_baseDecorator/Number
 * @includes Date Controls/_baseDecorator/Date
 * @includes Highlight Controls/_baseDecorator/Highlight
 * @public
 */

export { default as Money } from './_baseDecorator/Money';
export { default as Number } from './_baseDecorator/Number';
export { default as Date, IDateOptions } from './_baseDecorator/Date';
export { default as Highlight, IHighlightOptions } from './_baseDecorator/Highlight';

export { IMoneyOptions, calculateFractionFontSize } from './_baseDecorator/resources/Money';
export {
    default as IOnlyPositive,
    IOnlyPositiveOptions,
} from './_baseDecorator/interfaces/IOnlyPositive';
export { INumberOptions, RoundMode } from './_baseDecorator/resources/Number';
export { IFormat } from './_baseDecorator/resources/FormatBuilder';
export * from './_baseDecorator/resources/Util';

export * as NumberFunctions from './_baseDecorator/resources/Number';
export * as MoneyFunctions from './_baseDecorator/resources/Money';
export * as HighlightFunctions from './_baseDecorator/resources/Highlight';

import {
    default as splitIntoTriads,
    concatTriads,
    NUMBER_DIGITS_TRIAD,
    SPLITTER,
} from './_baseDecorator/inputUtils/splitIntoTriads';
import * as Formatter from './_baseDecorator/resources/Formatter';
import * as FormatBuilder from './_baseDecorator/resources/FormatBuilder';
import * as Parser from './_baseDecorator/resources/parse';
import * as numberConstant from './_baseDecorator/resources/NumberConstant';
import { partOfNumber, escapeSpecialChars, addWordCheck } from './_baseDecorator/inputUtils/RegExp';

export {
    NUMBER_DIGITS_TRIAD,
    SPLITTER,
    Formatter,
    FormatBuilder,
    Parser,
    numberConstant,
    partOfNumber,
    concatTriads,
    splitIntoTriads,
    escapeSpecialChars,
    addWordCheck,
};
