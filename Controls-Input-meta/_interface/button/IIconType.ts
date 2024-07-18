import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';
import { IStartEndPositionType } from './IStartEndPositionType';

interface IIcon {
    uri?: string;
    captionPosition: 'start' | 'end';
}

export const IIconType = ObjectType.id('Controls/meta:IIconType')
    .attributes<IIcon>({
        uri: StringType.optional()
            .title(rk('Иконка'))
            .description(rk('Определяет иконку, которая будет отображена в контроле')),
        captionPosition: IStartEndPositionType,
    })
    .title(rk('Иконка'))
    .editor('Controls-editors/properties:IconEditor');
