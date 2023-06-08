/**
 * Библиотека базовых декораторов.
 * @library
 * @includes IDate Controls/_baseDecorator/IDate
 * @includes IHighlight Controls/_baseDecorator/IHighlight
 * @includes IMoney Controls/_baseDecorator/IMoney
 * @includes INumber Controls/_baseDecorator/INumber
 * @public
 */

export { default as Money } from './_baseDecorator/Money';
export { default as Number } from './_baseDecorator/Number';
export { default as Date, IDateOptions } from './_baseDecorator/Date';
export {
    default as Highlight,
    IHighlightOptions,
} from './_baseDecorator/Highlight';

export {
    IMoneyOptions,
    calculateFractionFontSize,
} from './_baseDecorator/resources/Money';
export {
    default as IOnlyPositive,
    IOnlyPositiveOptions,
} from './_baseDecorator/interfaces/IOnlyPositive';
export { INumberOptions, RoundMode } from './_baseDecorator/resources/Number';
export { default as toString } from './_baseDecorator/inputUtils/toString';
export * from './_baseDecorator/interfaces/IMask';
export { IFormat } from './_baseDecorator/resources/FormatBuilder';
export {
    phoneMask,
    getAreaCode,
    REPLACER,
    FORMAT_MASK_CHARS,
} from './_baseDecorator/resources/phoneMask';
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
import { default as numberToString } from './_baseDecorator/inputUtils/numberToString';
import {
    partOfNumber,
    escapeSpecialChars,
    addWordCheck,
} from './_baseDecorator/inputUtils/RegExp';

export {
    NUMBER_DIGITS_TRIAD,
    SPLITTER,
    Formatter,
    FormatBuilder,
    Parser,
    numberConstant,
    partOfNumber,
    numberToString,
    concatTriads,
    splitIntoTriads,
    escapeSpecialChars,
    addWordCheck,
};
