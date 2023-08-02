import { ObjectType, FunctionType } from 'Types/meta';
import { IValueValidatorObject as IDateValueValidatorObject } from 'Controls/date';

export const IValueValidatorObjectType = ObjectType.attributes<IDateValueValidatorObject>({
    validator: FunctionType,
    arguments: ObjectType,
});
