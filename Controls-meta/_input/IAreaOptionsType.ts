import { ObjectType, NullType } from 'Meta/types';
import { IAreaOptions } from 'Controls/input';
import { ITextOptionsType } from './ITextOptionsType';
import { ILengthStringType } from '../_interface/ILengthStringType';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';

export const IAreaOptionsType = ObjectType.attributes<IAreaOptions>({
    ...IBaseInputOptionsType.attributes(),
    ...ITextOptionsType.attributes(),
    maxLines: ILengthStringType,
    minLines: ILengthStringType,
    value: NullType,
    optimizeShadow: NullType,
    footerTemplate: NullType,
    readonlyViewMode: NullType,
});
