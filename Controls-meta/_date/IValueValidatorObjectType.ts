import { ObjectType, FunctionType } from 'Meta/types';
import { IValueValidatorObject as IDateValueValidatorObject } from 'Controls/date';

export const IValueValidatorObjectType = ObjectType.attributes<IDateValueValidatorObject>({
    validator: FunctionType,
    arguments: ObjectType,
});
