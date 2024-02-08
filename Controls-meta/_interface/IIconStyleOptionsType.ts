import { ObjectType } from 'Meta/types';
import { IIconStyleOptions } from 'Controls/interface';
import { IIconType } from './IIconType';

export const IIconStyleOptionsType = ObjectType.id(
    'Controls/meta:IIconStyleOptionsType'
).attributes<IIconStyleOptions>({
    iconStyle: IIconType.attributes().style,
});
