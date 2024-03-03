import { BooleanType, NumberType, ObjectType, StringType } from 'Meta/types';
import { ISearchOptions } from 'Controls/interface';

export const ISearchOptionsType = ObjectType.id(
    'Controls/meta:ISearchOptionsType'
).attributes<ISearchOptions>({
    searchParam: StringType,
    minSearchLength: NumberType,
    searchDelay: NumberType,
    searchValueTrim: BooleanType.optional(),
    searchValue: StringType.optional(),
});
