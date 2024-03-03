import { ObjectType, StringType, AnyType } from 'Meta/types';
import { IMaskOptions } from 'Controls/baseDecorator';
import { IDateMaskType } from '../_interface/IDateMaskType';

export const IMaskOptionsType = ObjectType.id(
    'Controls/meta:IMaskOptionsType'
).attributes<IMaskOptions>({
    mask: IDateMaskType,
    replacer: StringType.optional().hidden(),
    formatMaskChars: AnyType.optional().hidden(),
});
