import * as rk from 'i18n!Controls-Buttons';
import { TIconSize, TIconStyle } from 'Controls-Buttons/interface';
import { ObjectType, StringType } from 'Types/meta';
import { TIconSizeType } from '../types/TIconSizeType';
import { TIconStyleType } from '../types/TIconStyleType';
import { IStartEndPositionType } from '../IStartEndPositionType';

interface IIcon {
    uri?: string;
    size?: TIconSize;
    style?: TIconStyle;
    captionPosition: 'start' | 'end';
}

export const IIconType = ObjectType.id('Controls/meta:IIconType')
    .attributes<IIcon>({
        uri: StringType.optional()
            .title(rk('Иконка'))
            .description(rk('Определяет иконку, которая будет отображена в контроле')),
        captionPosition: IStartEndPositionType,
        size: TIconSizeType.optional(),
        style: TIconStyleType.optional(),
    })
    .title(rk('Иконка'))
    .editor(() => {
        return import('Controls-editors/properties').then(({ IconEditor }) => {
            return IconEditor;
        });
    }, {});
