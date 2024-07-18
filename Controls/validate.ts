/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
/**
 * Библиотека контролов, которые позволяют организовать <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/validation/">валидацию</a> данных на форме.
 * @library
 * @includes isEmail Controls/_validate/Validators/IsEmail
 * @includes isRequired Controls/_validate/Validators/IsRequired
 * @includes isValidDate Controls/_validate/Validators/IsValidDate
 * @includes isValidDateRange Controls/_validate/Validators/IsValidDateRange
 * @includes inRange Controls/_validate/Validators/InRange
 * @includes inDateRange Controls/_validate/Validators/InDateRange
 * @public
 */

import isValidDate from 'Controls/_validate/Validators/IsValidDate';
import isValidDateRange from 'Controls/_validate/Validators/IsValidDateRange';
import * as Highlighter from 'wml!Controls/_validate/Highlighter';

export { default as isEmail } from 'Controls/_validate/Validators/IsEmail';
export { default as isRequired } from 'Controls/_validate/Validators/IsRequired';
export { default as inDateRange } from 'Controls/_validate/Validators/InDateRange';
export { default as inRange } from 'Controls/_validate/Validators/InRange';
export { default as isPhoneMobile } from 'Controls/_validate/Validators/IsPhoneMobile';
export { default as Controller } from 'Controls/_validate/Controller';
export { default as ControllerClass } from 'Controls/_validate/ControllerClass';
export { default as Container } from 'Controls/_validate/Container';
export { default as InputContainer } from 'Controls/_validate/InputContainer';
export { default as DateRangeContainer } from 'Controls/_validate/DateRange';
export { default as SelectionContainer } from 'Controls/_validate/SelectionContainer';
export { default as IValidateResult } from 'Controls/_validate/interfaces/IValidateResult';
export { TValidator, TReactValidator, IValidator } from 'Controls/_validate/interfaces/Validator';

export { isValidDate, isValidDateRange, Highlighter };
