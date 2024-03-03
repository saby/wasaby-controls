import { ObjectType, NullType } from 'Meta/types';
import { ISourceOptions } from 'Controls/interface';

export const ISourceOptionsType = ObjectType.id(
    'Controls/meta:ISourceOptionsType'
).attributes<ISourceOptions>({
    source: NullType,
    keyProperty: NullType,
});
