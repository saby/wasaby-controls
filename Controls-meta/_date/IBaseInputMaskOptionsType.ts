import { ObjectType, StringType } from 'Meta/types';
import { IBaseInputMaskOptions } from 'Controls/date';

export const IBaseInputMaskOptionsType = ObjectType.attributes<IBaseInputMaskOptions>({
    mask: StringType,
});
