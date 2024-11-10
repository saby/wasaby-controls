import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';
import { IStartEndPositionType } from './IStartEndPositionType';

interface IIcon {
    uri?: string;
    captionPosition: 'start' | 'end';
}

/**
 * Определяет интерфейс редактора, описывающего иконку кнопки.
 * @public
 */
export const IIconType = ObjectType.id('Controls/meta:IIconType')
    .properties<IIcon>({
        uri: StringType.optional()
            .title(rk('Иконка'))
            .description(rk('Определяет иконку, которая будет отображена в контроле')),
        captionPosition: IStartEndPositionType,
    })
    .title(rk('Иконка'))
    .editor('Controls-editors/properties:IconEditor');
