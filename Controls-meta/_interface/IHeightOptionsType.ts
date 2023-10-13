import { ObjectType } from 'Types/meta';
import { IHeightOptions } from 'Controls/interface';
import { IHeightType } from './IHeightType';

export const IHeightOptionsType = ObjectType.id(
    'Controls/meta:IHeightOptionsType'
).attributes<IHeightOptions>({
    inlineHeight: IHeightType.optional(),
});
