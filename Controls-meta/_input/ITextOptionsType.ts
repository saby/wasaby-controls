import { BooleanType, ObjectType, StringType } from 'Types/meta';
import { ITextOptions } from 'Controls/input';
import { IMaxLengthOptionsType } from './IMaxLengthOptionsType';

export const ITextOptionsType = ObjectType.id(
    'Controls/meta:ITextOptionsType'
).attributes<ITextOptions>({
    ...IMaxLengthOptionsType.attributes(),
    constraint: StringType.optional(),
    convertPunycode: BooleanType.optional(),
    trim: BooleanType.optional(),
    transliterate: BooleanType.optional(),
});
