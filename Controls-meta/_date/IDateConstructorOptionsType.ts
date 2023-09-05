import { ObjectType, FunctionType } from 'Types/meta';
import { IDateConstructorOptions } from 'Controls/interface';

export const IDateConstructorOptionsType = ObjectType.id(
    'Controls/meta:IDateConstructorOptionsType'
).attributes<IDateConstructorOptions>({
    dateConstructor: FunctionType.optional().hidden(),
});
