import { ObjectType, DateType } from 'Meta/types';
import { IDateRangeOptions } from 'Controls/dateRange';

export const IDateRangeOptionsType = ObjectType.id(
    'Controls/meta:IDateRangeOptionsType'
).attributes<IDateRangeOptions>({
    startValue: DateType.optional().hidden(),
    endValue: DateType.optional().hidden(),
});
