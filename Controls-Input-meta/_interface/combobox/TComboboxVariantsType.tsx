import { ArrayType, ObjectType, StringType } from 'Types/meta';
import { IComboboxItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls';

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

export const TComboboxVariantsType = ObjectType.id(
    'Controls/meta:TComboboxVariantsType'
).attributes<IComboboxItemsOptions>({
    variants: ObjectType.title(null)
        .order(3)
        .editor(
            () => {
                return import('Controls-editors/properties').then(({TreeEditor}) => {
                    return TreeEditor;
                });
            },
            {
                expanderVisibility: 'hasChildren',
                allowHierarchy: false,
                items,
            }
        ).attributes({
            items: ArrayType.of(ObjectType),
            selectedKeys: ArrayType.of(StringType)
        }),
});
