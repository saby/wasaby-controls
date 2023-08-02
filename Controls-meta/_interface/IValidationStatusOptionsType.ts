import { ObjectType } from 'Types/meta';
import { IValidationStatusOptions } from 'Controls/interface';
import { TValidationStatusOptionsType } from './TValidationStatusOptionsType';

export const IValidationStatusOptionsType = ObjectType.id(
    'Controls/meta:IValidationStatusOptionsType'
).attributes<IValidationStatusOptions>({
    validationStatus: TValidationStatusOptionsType,
});
