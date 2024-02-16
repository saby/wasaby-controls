import * as rk from 'i18n!Controls';
import { TIconSize, TIconStyle } from 'Controls/interface';
import { ObjectType, StringType } from 'Meta/types';
import { TIconSizeType } from './TIconSizeType';
import { TIconStyleType } from './TIconStyleType';
import { IStartEndPositionType } from './IStartEndPositionType';

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
            .description(rk('Определяет иконку, которая будет отображена в контроле.')),
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
