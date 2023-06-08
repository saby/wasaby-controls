import { RecordSet } from 'Types/collection';
import { RecordSetType } from 'Controls-meta/controls';
import { ObjectType } from 'Types/meta';
import { IItemsOptions } from 'Controls-Input/interface';
import * as rk from 'i18n!Controls';

const items = new RecordSet({
    keyProperty: 'id',
    rawData: [
        { id: 1, title: rk('Первый'), parent: null, node: false },
        { id: 2, title: rk('Второй'), parent: null, node: false },
    ],
});

export const TRadioGroupVariantsType = ObjectType.id(
    'Controls/meta:TRadioGroupVariantsType'
).attributes<IItemsOptions>({
    items: RecordSetType.title(null)
        .order(3)
        .editor(
            () => {
                return import('Controls-editors/properties').then(({ TreeEditor }) => {
                    return TreeEditor;
                });
            },
            {
                multiSelectVisibility: 'onhover',
                expanderVisibility: 'hasChildren',
                allowHierarchy: true,
                items,
            }
        ),
});
