/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
/**
 * Библиотека расширенных декораторов.
 * @library
 * @includes IPhone Controls/_extendedDecorator/IPhone
 * @includes IWrapURLs Controls/_extendedDecorator/IWrapURLs
 * @public
 */

export { default as Phone, IPhoneOptions } from './_extendedDecorator/Phone';
export { default as MultilineText } from './_extendedDecorator/MultilineText';
export {
    default as WrapURLs,
    IWrapURLsOptions,
} from './_extendedDecorator/WrapURLs';
export { default as DateRange } from './_extendedDecorator/DateRange';

export { default as getPhoneNumberType } from './_extendedDecorator/Phone/getPhoneNumberType';
export { default as FormatPhone } from './_extendedDecorator/Phone/FormatPhone';
export * from './_extendedDecorator/Phone/phoneMask';
export * as WrapWRLsFunction from './_extendedDecorator/resources/WrapURLs';
