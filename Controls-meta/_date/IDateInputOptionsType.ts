import { ObjectType } from 'Meta/types';
import { IDateInput } from 'Controls/date';
import { IBaseInputOptionsType } from '../_input/IBaseInputOptionsType';
import { ICalendarButtonVisibleOptionsType } from '../_input/ICalendarButtonVisibleOptionsType';
import { IDatePopupOptionsType } from './IDatePopupOptionsType';
import { IMaskOptionsType } from '../_input/IMaskOptionsType';
import { IDateConstructorOptionsType } from './IDateConstructorOptionsType';
import { IDateLitePopupOptionsType } from './IDateLitePopupOptionsType';
import { IDateValueOptionsType } from './IDateValueOptionsType';
import { IValueValidatorObjectType } from './IValueValidatorObjectType';
import { IValueValidatorsType } from './IValueValidatorsType';

export const IDateInputOptionsType = ObjectType.id(
    'Controls/meta:IDateInputOptionsType'
).attributes<IDateInput>({
    ...IBaseInputOptionsType.attributes(),
    ...ICalendarButtonVisibleOptionsType.attributes(),
    ...IDatePopupOptionsType.attributes(),
    ...IValueValidatorObjectType.attributes(),
    ...IValueValidatorsType.attributes(),
    ...IMaskOptionsType.attributes(),
    ...IDateConstructorOptionsType.attributes(),
    ...IDateLitePopupOptionsType.attributes(),
    ...IDateValueOptionsType.attributes(),
});
