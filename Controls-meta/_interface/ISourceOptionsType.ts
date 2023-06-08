import { ObjectType, NullType } from 'Types/meta';
import { ISourceOptions } from 'Controls/interface';

export const ISourceOptionsType = ObjectType.id(
    'Controls/meta:ISourceOptionsType'
).attributes<ISourceOptions>({
    source: NullType,
    keyProperty: NullType,
});
