import { ObjectType } from 'Meta/types';
import { IIconOptions } from 'Controls/interface';
import { IIconType } from './IIconType';

interface IIconOptionsAttr extends IIconOptions {
    captionPosition: 'start' | 'end';
}

export const IIconOptionsType = ObjectType.id(
    'Controls/meta:IIconOptionsType'
).attributes<IIconOptionsAttr>({
    icon: IIconType.optional().attributes().uri,
    captionPosition: IIconType.attributes().captionPosition.defaultValue('end'),
});
