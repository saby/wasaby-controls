/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
/**
 * Библиотека контролов, которые служат для отображения и выбора дат из выпадающей панели.
 * @library
 * @public
 * @includes Input Controls/_date/Input
 * @includes BaseInput Controls/_date/BaseInput
 * @includes IBaseInputMask Controls/_date/interface/IBaseInputMask
 * @includes IDatePopupType Controls/_date/interface/IDatePopupType
 * @includes ICaption Controls/_date/interface/ICaption
 * @includes IExtendedTimeFormat Controls/_date/interface/IExtendedTimeFormat
 * @includes ICalendarButtonVisible Controls/_date/interface/ICalendarButtonVisible
 * @includes IPlaceholder Controls/_date/interface/IPlaceholder
 * @includes IResetValue Controls/_date/interface/IResetValue
 */

export { default as Input } from 'Controls/_date/Input';
export { default as BaseInput } from 'Controls/_date/BaseInput';
export { default as LinkView } from 'Controls/_date/LinkView';
export { default as Selector } from 'Controls/_date/Selector';
export {
    default as BaseSelector,
    IBaseSelectorOptions,
} from 'Controls/_date/BaseSelector';
export { default as SelectorConsumer } from 'Controls/_date/SelectorConsumerReact';
export { default as ArrowButtonConsumer } from 'Controls/_date/ArrowButtonConsumerReact';
export { default as ContextProvider } from 'Controls/_date/DateContextProviderReact';
export { default as WeekdayFormatter } from 'Controls/_date/WeekdayFormatter';
export { DateContext } from 'Controls/_date/DateContextReact';

export { default as IValue } from 'Controls/_date/interface/IValue';
export { IDateBaseOptions } from 'Controls/_date/BaseInput';
export {
    default as IValueValidators,
    TValueValidators,
    IValueValidatorsOptions,
} from 'Controls/_date/interface/IValueValidators';
import * as MonthCaptionTemplate from 'wml!Controls/_date/Selector/monthCaptionTemplate';
export {
    default as IMonthCaptionTemplate,
    IMonthCaptionTemplateOptions,
} from 'Controls/_date/interface/IMonthCaptionTemplate';
export { IDatePopupTypeOptions } from 'Controls/_date/interface/IDatePopupType';
export { default as getDatePopupName } from 'Controls/_date/Utils/getPopupName';
export { ILinkView } from 'Controls/_date/LinkView';
import ILinkViewDefaultOptions from 'Controls/_date/interface/ILinkView';
export { default as ICaptionOptions } from 'Controls/_date/interface/ICaption';
export { default as IBaseInputMask } from 'Controls/_date/interface/IBaseInputMask';
export { default as StringValueConverter } from 'Controls/_date/BaseInput/StringValueConverter';
export { ICalendarButtonVisibleOptions } from 'Controls/_date/interface/ICalendarButtonVisible';
export { IValueValidatorObject } from 'Controls/_date/interface/IValueValidators';
export { IBaseInputMaskOptions } from 'Controls/_date/interface/IBaseInputMask';
export { IDateInput } from './_date/Input';

export { MonthCaptionTemplate, ILinkViewDefaultOptions };
