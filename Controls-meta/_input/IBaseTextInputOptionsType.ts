import { ObjectType, NullType } from 'Types/meta';
import { IBaseTextInputOptions } from 'Controls/input';
import { ITextOptionsType } from './ITextOptionsType';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';

export const IBaseTextInputOptionsType = ObjectType.id(
    'Controls/meta:IBaseTextInputOptionsType'
).attributes<IBaseTextInputOptions>({
    ...IBaseInputOptionsType.attributes(),
    ...ITextOptionsType.attributes(),
    inputMode: NullType,
});
