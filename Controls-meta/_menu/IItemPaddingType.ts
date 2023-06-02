import { ObjectType, StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';

export const IItemPaddingType = ObjectType.id('Controls/meta:itemPaddingType')
    .title(rk('Горизонтальный отступ элемента'))
    .attributes({
        left: StringType,
        right: StringType,
    });
