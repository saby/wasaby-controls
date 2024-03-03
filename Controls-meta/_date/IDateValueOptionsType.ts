import { ObjectType, StringType } from 'Meta/types';
import { IValue as IDateValueOptions } from 'Controls/date';

export const IDateValueOptionsType = ObjectType.attributes<IDateValueOptions>({
    value: StringType,
});
