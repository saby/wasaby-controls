import { ObjectType, FunctionType } from 'Meta/types';
import { IDateConstructorOptions } from 'Controls/interface';

export const IDateConstructorOptionsType = ObjectType.id(
    'Controls/meta:IDateConstructorOptionsType'
).attributes<IDateConstructorOptions>({
    dateConstructor: FunctionType.optional().hidden(),
});
