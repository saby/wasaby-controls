import { ObjectType } from 'Types/meta';
import { IFontColorStyleOptions } from 'Controls/interface';
import { IFontType } from './IFontType';

export const IFontColorStyleOptionsType = ObjectType.id(
    'Controls/meta:IFontColorStyleOptionsType'
).attributes<IFontColorStyleOptions>({
    fontColorStyle: IFontType.attributes().color.optional(),
});
