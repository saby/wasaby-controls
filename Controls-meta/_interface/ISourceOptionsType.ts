import { ObjectType } from 'Types/meta';
import { ISourceOptions } from 'Controls/interface';

export const ISourceOptionsType = ObjectType.id(
    'Controls/meta:ISourceOptionsType'
).attributes<ISourceOptions>({
    source: null,
    keyProperty: null,
});
