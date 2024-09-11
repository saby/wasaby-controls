import { ArrayType, ObjectType, StringType } from 'Meta/types';
import { IItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls-Input';

const items = [
    { id: 1, title: rk('Первый'), parent: null, node: false },
    { id: 2, title: rk('Второй'), parent: null, node: false },
];

export const TRadioGroupVariantsType = ObjectType.id('Controls/meta:TRadioGroupVariantsType')
    .properties<IItemsOptions>({
        variants: ObjectType.title(null)
            .order(3)
            .editor('Controls-editors/properties:TreeEditor', {
                markerVisibility: 'visible',
                expanderVisibility: 'hasChildren',
                allowHierarchy: true,
                items,
                groupCaption: 'Варианты',
            })
            .properties({
                items: ArrayType.of(ObjectType),
                selectedKeys: ArrayType.of(StringType),
            }),
    })
    .defaultValue({});
