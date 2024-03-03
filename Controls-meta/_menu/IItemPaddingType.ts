import { ObjectType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls';

export const IItemPaddingType = ObjectType.id('Controls/meta:itemPaddingType')
    .title(rk('Горизонтальный отступ элемента'))
    .attributes({
        left: StringType,
        right: StringType,
    });
