import { ObjectType } from 'Types/meta';
import { IAreaOptions } from 'Controls/input';
import { ITextOptionsType } from './ITextOptionsType';
import { ILengthStringType } from '../_interface/ILengthStringType';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';

export const IAreaOptionsType = ObjectType.attributes<IAreaOptions>({
    ...IBaseInputOptionsType.attributes(),
    ...ITextOptionsType.attributes(),
    maxLines: ILengthStringType,
    minLines: ILengthStringType,
    value: null,
    optimizeShadow: null,
    footerTemplate: null,
    readonlyViewMode: null
});
