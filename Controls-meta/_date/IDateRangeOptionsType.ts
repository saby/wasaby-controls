import { ObjectType, DateType } from 'Types/meta';
import { IDateRangeOptions } from 'Controls/dateRange';

export const IDateRangeOptionsType = ObjectType.id(
    'Controls/meta:IDateRangeOptionsType'
).attributes<IDateRangeOptions>({
    startValue: DateType.optional().hidden(),
    endValue: DateType.optional().hidden(),
});
