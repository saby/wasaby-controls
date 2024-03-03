import { ObjectType } from 'Meta/types';
import { IFontColorStyleOptions } from 'Controls/interface';
import { IFontType } from './IFontType';

export const IFontColorStyleOptionsType = ObjectType.id(
    'Controls/meta:IFontColorStyleOptionsType'
).attributes<IFontColorStyleOptions>({
    fontColorStyle: IFontType.attributes().color.optional(),
});
