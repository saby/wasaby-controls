import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType, UnknownType } from 'Meta/types';
import { IItemType } from './IItemType';
import { IMenuItem } from 'Controls-Input/interface';

// const IIconType = StringType.id('Controls-Input-meta/dropdownConnected:IIconType')
//
//     .title(rk('Иконка'))
//     .editor('Controls-editors/properties:IconEditor');

export const IMenuItemType = ObjectType.id('Controls-Input-meta/interface:IMenuItemType')
    .properties<IMenuItem>({
        ...IItemType.properties(),
        icon: StringType.optional(),
        action: UnknownType,
    })
    .defaultValue({});
