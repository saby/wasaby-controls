import { ObjectMeta, ObjectType } from 'Meta/types';
import { IIcon, IIconType } from './IIconType';

interface IIconOptionsAttr {
    icon?: IIcon;
}

/**
 * Определяет интерфейс редактора иконки
 * @public
 */
export const IIconOptionsType = ObjectType.id('Controls/meta:IIconOptionsType')
    .properties<IIconOptionsAttr>({
        icon: IIconType.optional() as ObjectMeta<IIcon | undefined>,
    })
    .title('Иконка');
