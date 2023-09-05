import { ObjectType, StringType } from 'Types/meta';
import { IBaseInputMaskOptions } from 'Controls/date';

export const IBaseInputMaskOptionsType = ObjectType.attributes<IBaseInputMaskOptions>({
    mask: StringType,
});
