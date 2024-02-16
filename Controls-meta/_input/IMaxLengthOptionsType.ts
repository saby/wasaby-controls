import * as rk from 'i18n!Controls';
import { NumberType, ObjectType } from 'Meta/types';
import { IMaxLengthOptions } from 'Controls/input';

export const IMaxLengthOptionsType = ObjectType.id(
    'Controls/meta:IMaxLengthOptionsType'
).attributes<IMaxLengthOptions>({
    maxLength: NumberType.title(rk('Максимальное количество символов')).optional(),
});
