import { ArrayType, ObjectType, StringType } from 'Meta/types';
import { IItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls-Input';

const items = [
    { id: 1, title: rk('Первый'), parent: null, node: false },
    { id: 2, title: rk('Второй'), parent: null, node: false },
];

export const TCheckboxGroupVariantsType = ObjectType.id('Controls/meta:TCheckboxGroupVariantsType')
    .properties<IItemsOptions>({
        variants: ObjectType.title(null)
            .order(3)
            .editor('Controls-editors/properties:TreeEditor', {
                expanderVisibility: 'hasChildren',
                allowHierarchy: true,
                items,
            })
            .properties({
                items: ArrayType.of(ObjectType),
                selectedKeys: ArrayType.of(StringType),
            }),
    })
    .defaultValue({});
