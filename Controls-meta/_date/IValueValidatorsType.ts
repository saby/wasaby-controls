import { BooleanType, ObjectType } from 'Types/meta';
import { IValueValidatorsOptions } from 'Controls/date';
import { TValueValidatorsType } from '../_interface/TValueValidatorsType';

export const IValueValidatorsType = ObjectType.attributes<IValueValidatorsOptions>({
    valueValidators: TValueValidatorsType,
    validateByFocusOut: BooleanType,
});
