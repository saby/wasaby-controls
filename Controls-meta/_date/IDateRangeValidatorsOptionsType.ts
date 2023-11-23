import { BooleanType, ObjectType } from 'Types/meta';
import { IDateRangeValidatorsOptions } from 'Controls/interface';
import { TDateRangeValidators } from './TDateRangeValidators';

export const IDateRangeValidatorsOptionsType = ObjectType.id(
    'Controls/meta:IDateRangeValidatorsOptionsType'
).attributes<IDateRangeValidatorsOptions>({
    startValueValidators: TDateRangeValidators.optional().hidden(),
    endValueValidators: TDateRangeValidators.optional().hidden(),
    validateByFocusOut: BooleanType.hidden(),
});
