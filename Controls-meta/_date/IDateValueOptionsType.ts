import { ObjectType, StringType } from 'Types/meta';
import { IValue as IDateValueOptions } from 'Controls/date';

export const IDateValueOptionsType = ObjectType.attributes<IDateValueOptions>({
    value: StringType,
});
