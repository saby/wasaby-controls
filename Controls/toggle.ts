/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
/**
 * Библиотека контролов, которые позволяют организовать выбор из одного или нескольких значений.
 * @library
 * @includes Switch Controls/_toggle/Switch
 * @includes ISwitchButton Controls/_toggle/ISwitchButton
 * @includes DoubleSwitch Controls/_toggle/DoubleSwitch
 * @includes isRequired Controls/_toggle/validators/isRequired
 * @public
 */

/*
 * toggle library
 * @library
 * @includes Button Controls/_toggle/Button
 * @includes Switch Controls/_toggle/Switch
 * @includes DoubleSwitch Controls/_toggle/DoubleSwitch
 * @public
 * @author Мочалов М.А.
 */

export { default as Switch } from './_toggle/Switch';
export { default as SwitchButton, ISwitchButtonOptions } from './_toggle/SwitchButton';
export { default as DoubleSwitch } from './_toggle/DoubleSwitch';
export { ISwitchCaptionTemplate } from './_toggle/interface/ISwitchCaptionTemplate';
export { default as isRequired } from './_toggle/validators/isRequired';

import * as switchCaptionTemplate from 'wml!Controls/_toggle/Switch/resources/CaptionTemplate';
import * as doubleSwitchCaptionTemplate from 'wml!Controls/_toggle/DoubleSwitch/resources/DoubleSwitchText';

export { switchCaptionTemplate, doubleSwitchCaptionTemplate };
