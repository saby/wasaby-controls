import { ObjectType, ArrayType, StringType } from 'Types/meta';
import { IItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls';

const items = [
    {id: 1, title: rk('Первый'), parent: null, node: false},
    {id: 2, title: rk('Второй'), parent: null, node: false},
];

export const TRadioGroupVariantsType = ObjectType.id(
    'Controls/meta:TRadioGroupVariantsType'
).attributes<IItemsOptions>({
    variants: ObjectType.title(null)
        .order(3)
        .editor(() => {
                return import('Controls-editors/properties').then(({TreeEditor}) => {
                    return TreeEditor;
                });
            },
            {
                markerVisibility: 'visible',
                expanderVisibility: 'hasChildren',
                allowHierarchy: true,
                items,
            })
        .attributes({
            items: ArrayType.of(ObjectType),
            selectedKeys: ArrayType.of(StringType)
        })
});
