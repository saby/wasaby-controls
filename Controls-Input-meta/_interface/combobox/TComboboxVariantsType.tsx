import { ArrayType, ObjectType, StringType } from 'Meta/types';
import { IComboboxItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls-Input';

const items = [
    {
        id: 1,
        title: rk('Первый'),
        additional: false,
    },
    {
        id: 2,
        title: rk('Второй'),
        additional: false,
    },
];

export const TComboboxVariantsType = ObjectType.id('Controls/meta:TComboboxVariantsType')
    .properties<IComboboxItemsOptions>({
        variants: ObjectType.title(null)
            .order(3)
            .editor('Controls-editors/properties:TreeEditor', {
                expanderVisibility: 'hasChildren',
                allowHierarchy: false,
                items,
                groupCaption: 'Варианты',
            })
            .properties({
                items: ArrayType.of(ObjectType),
                selectedKeys: ArrayType.of(StringType),
            }),
    })
    .defaultValue({});
