import { ObjectType } from 'Meta/types';
import { IDateRangeInputOptions } from 'Controls/dateRange';
import { IDateRangeValidatorsOptionsType } from './IDateRangeValidatorsOptionsType';
import { IDateRangeOptionsType } from './IDateRangeOptionsType';
import { IDatePopupOptionsType } from './IDatePopupOptionsType';
import { ICalendarButtonVisibleOptionsType } from '../_input/ICalendarButtonVisibleOptionsType';

export const IDateRangeInputOptionsType = ObjectType.id(
    'Controls/meta:IDateRangeInputOptionsType'
).attributes<IDateRangeInputOptions>({
    ...IDateRangeValidatorsOptionsType.attributes(),
    ...IDateRangeOptionsType.attributes(),
    ...IDatePopupOptionsType.attributes(),
    ...ICalendarButtonVisibleOptionsType.attributes(),
});
