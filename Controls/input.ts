/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
/**
 * Библиотека контролов, которые служат для ввода значений различного типа. Примеры типов: строка, число, дата, телефон и т.д.
 * @library
 * @includes IBaseSelection Controls/_input/interface/ISelection
 * @includes IArea Controls/_input/interface/IArea
 * @includes IMaxLength Controls/_input/interface/IMaxLength
 * @includes IBorderVisibility Controls/_input/interface/IBorderVisibility
 * @includes IFieldTemplate Controls/_input/interface/IFieldTemplate
 * @includes ICounterVisibility Controls/_input/interface/ICounterVisibility
 * @includes Label Controls/_input/Label
 * @public
 */

// TODO: Устаревшая модель, вместо неё нужно использовать NewBaseViewModel.
import BaseViewModel = require('Controls/_input/Base/ViewModel');
import MaskViewModel = require('Controls/_input/Mask/ViewModel');

export {
    default as TextViewModel,
    IViewModelOptions as ITextViewModelOptions,
} from 'Controls/_input/Text/ViewModel';
import { default as MaskInputProcessor } from 'Controls/_input/Mask/InputProcessor';

// Controls
export { default as Base } from 'Controls/_input/Base';
export { BaseText, TInputMode } from 'Controls/_input/BaseText';
export { default as Text, ITextInputOptions } from 'Controls/_input/Text';
export { default as Number, INumberInputOptions } from 'Controls/_input/Number';
export { default as Mask, IMaskOptions } from 'Controls/_input/Mask';
export { default as Phone, IPhoneOptions } from 'Controls/_input/Phone';
export { default as Password, IPasswordOptions } from 'Controls/_input/Password';
export { default as Label, ILabelOptions } from 'Controls/_input/Label';
export { default as TimeInterval } from 'Controls/_input/TimeInterval';
export { default as Money, IMoneyOptions } from 'Controls/_input/Money';
export { default as Area } from 'Controls/_input/Area';
export { default as Render, IRenderOptions, RENDER_JS_SELECTOR } from 'Controls/_input/Render';
export { default as Field } from 'Controls/_input/resources/Field';
export {
    ISelection as IBaseSelection,
    ISelectionOptions,
} from 'Controls/_input/interface/ISelection';

// Interface
export { IAreaOptions } from './_input/interface/IArea';
export {
    THorizontalPadding,
    IPadding,
    IPaddingOptions,
    getDefaultPaddingOptions,
    getOptionPaddingTypes,
} from './_input/interface/IPadding';
export { IText, ITextOptions } from 'Controls/_input/interface/IText';
export { INewLineKey, INewLineKeyOptions } from 'Controls/_input/interface/INewLineKey';
export { IBase, IBaseOptions, TextAlign, AutoComplete } from 'Controls/_input/interface/IBase';
export { ITag, ITagOptions, TagStyle } from 'Controls/_input/interface/ITag';
export { INumberLength, INumberLengthOptions } from 'Controls/_input/interface/INumberLength';
export { ITimeMask, ITimeMaskOptions } from 'Controls/_input/interface/ITimeMask';
export { ITimeInterval, ITimeIntervalOptions } from 'Controls/_input/interface/ITimeInterval';
export { IInputMaskValue, IInputMaskValueOptions } from 'Controls/_input/interface/IInputMaskValue';
export {
    IInputDisplayValue,
    IInputDisplayValueOptions,
    INPUT_MODE,
} from 'Controls/_input/interface/IInputDisplayValue';
export {
    IValue,
    IValueOptions,
    ICallback,
    ICallbackData,
    IFieldData,
} from 'Controls/_input/interface/IValue';
export {
    IBorderVisibility,
    IBorderVisibilityOptions,
    TBorderVisibility,
    getDefaultBorderVisibilityOptions,
    getOptionBorderVisibilityTypes,
} from './_input/interface/IBorderVisibility';
export {
    IBorderVisibilityArea,
    TBorderVisibilityArea,
    getOptionBorderVisibilityAreaTypes,
} from './_input/interface/IBorderVisibilityArea';
export { IFieldTemplate, IFieldTemplateOptions } from './_input/interface/IFieldTemplate';
export { IMaxLengthOptions } from 'Controls/_input/interface/IMaxLength';
export { ICounterVisibilityOptions } from 'Controls/_input/interface/ICounterVisibility';
export { IBaseTextInputOptions } from 'Controls/_input/BaseText';
export { IBaseInputOptions } from 'Controls/_input/Base';

// Helpers
import * as ActualAPI from 'Controls/_input/ActualAPI';
import * as __Util from 'Controls/_input/resources/Util';
import * as MaskFormatterValue from 'Controls/_input/Mask/FormatterValue';
import hoursFormat from 'Controls/_input/InputCallback/hoursFormat';
import lengthConstraint from 'Controls/_input/InputCallback/lengthConstraint';

export { default as IECompatibleLineHeights } from 'Controls/_input/Area/IECompatibleLineHeights';
export { default as MobileFocusController } from 'Controls/_input/resources/MobileFocusController';
export { default as transliterate } from 'Controls/_input/resources/Transliterate';
export { default as NewBaseViewModel } from './_input/BaseViewModel';
export { default as isMaskFormatValid } from 'Controls/_input/Mask/isFormatValid';
export * from './_input/ActualAPI';
export * from './_input/resources/Types';
export { getContent as getReactContentTemplate } from './_input/resources/ReactUtils';
export { default as getNumberInputWidth } from './_input/Number/getInputWidth';

/*
 * ПРИВАТНЫЕ МОДУЛИ.
 * ЭКСПОРТИРУЮТСЯ ДЛЯ UNIT-ТЕСТИРОВАНИЯ.
 * НЕ ИСПОЛЬЗОВАТЬ НА ПРИКЛАДНОЙ СТОРОНЕ!!!
 */
export { FixBugs as __FixBugs } from 'Controls/_input/FixBugs';
export { ValueInField as __ValueInField } from 'Controls/_input/FixBugs/ValueInField';
export { InsertFromDrop as __InsertFromDrop } from 'Controls/_input/FixBugs/InsertFromDrop';
export { MinusProcessing as __MinusProcessing } from 'Controls/_input/FixBugs/MinusProcessing';
export { CarriagePositionWhenFocus as __CarriagePositionWhenFocus } from 'Controls/_input/FixBugs/CarriagePositionWhenFocus';
export { default as __ChangeEventController } from 'Controls/_input/resources/Field/ChangeEventController';
export { __Util };

/**
 * @typedef {Object} TInputCallback
 * @description Объект с набором методов.
 * @property {hoursFormat} hoursFormat Ограничивает ввод времени с 0:00 до 24:00.
 * @property {lengthConstraint} lengthConstraint Ограничивает длину числа.
 */

/**
 * @name Controls/input/InputCallback
 * @cfg {TInputCallback} Объект с набором методов для опции {@link Controls/_input/interface/IValue#inputCallback}
 * @public
 */
const InputCallback = {
    hoursFormat,
    lengthConstraint,
};

export {
    BaseViewModel,
    MaskViewModel,
    MaskInputProcessor,
    MaskFormatterValue,
    InputCallback,
    ActualAPI,
};
