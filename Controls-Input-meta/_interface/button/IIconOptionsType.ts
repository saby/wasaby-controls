import { ObjectType } from 'Meta/types';
import { IIconType } from './IIconType';

interface IIconOptionsAttr {
    icon: {
        uri?: string;
        captionPosition: 'start' | 'end';
    };
}

/**
 * Определяет интерфейс редактора иконки
 * @public
 */
export const IIconOptionsType = ObjectType.id(
    'Controls/meta:IIconOptionsType'
).properties<IIconOptionsAttr>({
    icon: IIconType.optional(),
});
