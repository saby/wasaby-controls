import { ObjectType } from 'Types/meta';
import { IIconStyleOptions } from 'Controls/interface';
import { IIconType } from './IIconType';

export const IIconStyleOptionsType = ObjectType.id(
    'Controls/meta:IIconStyleOptionsType'
).attributes<IIconStyleOptions>({
    iconStyle: IIconType.attributes().style,
});
