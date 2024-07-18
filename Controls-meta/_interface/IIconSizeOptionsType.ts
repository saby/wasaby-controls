import { ObjectType } from 'Meta/types';
import { IIconSizeOptions } from 'Controls/interface';
import { IIconType } from './IIconType';

export const IIconSizeOptionsType = ObjectType.id(
    'Controls/meta:IIconSizeOptionsType'
).attributes<IIconSizeOptions>({
    iconSize: IIconType.attributes().size,
});
