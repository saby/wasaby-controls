import { ObjectType } from 'Meta/types';
import { IFontSizeOptions } from 'Controls/interface';
import { IFontType } from './IFontType';

export const IFontSizeOptionsType = ObjectType.id(
    'Controls/meta:IFontSizeOptionsType'
).attributes<IFontSizeOptions>({
    fontSize: IFontType.attributes().size.optional(),
});
