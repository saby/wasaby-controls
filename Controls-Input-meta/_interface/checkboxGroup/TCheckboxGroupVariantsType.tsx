import { ArrayType, ObjectType, StringType } from 'Meta/types';
import { IItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls-Input';

const items = [
    {id: 1, title: rk('Первый'), parent: null, node: false},
    {id: 2, title: rk('Второй'), parent: null, node: false},
];

export const TCheckboxGroupVariantsType = ObjectType.id('Controls/meta:TCheckboxGroupVariantsType')
    .attributes<IItemsOptions>({
        variants: ObjectType.title(null)
            .order(3)
            .editor(() => {
                    return import('Controls-editors/properties').then(({TreeEditor}) => {
                        return TreeEditor;
                    });
                },
                {
                    expanderVisibility: 'hasChildren',
                    allowHierarchy: true,
                    items,
                })
            .attributes({
                items: ArrayType.of(ObjectType),
                selectedKeys: ArrayType.of(StringType)
            })
    })
    .defaultValue({});
