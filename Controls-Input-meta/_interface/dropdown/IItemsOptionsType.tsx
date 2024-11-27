import * as rk from 'i18n!Controls-Input';
import { ArrayType, ObjectType, StringType } from 'Meta/types';
import { IMenuItemType } from './IMenuItemType';
import { IMenuItem } from 'Controls-input/interface';

export interface IItemsOptionsType<T extends IMenuItem> {
    variants?: {
        items: T[];
        selectedKeys?: string[];
    };
}

export const IItemsOptionsType = ObjectType.id('Controls-Input-meta/interface:IItemsOptionsType')
    .properties<IItemsOptionsType<IMenuItem>>({
        variants: ObjectType.title(null)
            .order(40)
            .editor('Controls-Input-editors/ActionsListEditor:ActionsListEditor', {
                expanderVisibility: 'hasChildren',
                allowHierarchy: true,
                items: [],
                selectedKeys: [],
                footerCaption: '',
                groupCaption: rk('Действия'),
                itemActionsPosition: 'inside',
                emptyText: rk('Добавляйте действия и формируйте выпадающее меню'),
            })
            .properties({
                items: ArrayType.of(IMenuItemType),
                selectedKeys: ArrayType.of(StringType),
            })
            .defaultValue({}),
    })
    .defaultValue({});
