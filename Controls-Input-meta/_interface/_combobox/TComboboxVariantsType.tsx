import { ObjectType } from 'Types/meta';
import { RecordSet } from 'Types/collection';
import { IItemsOptions } from 'Controls-Input/interface';
import { RecordSetType } from 'Controls-meta/controls';
import * as rk from 'i18n!Controls';

const items = new RecordSet({
    keyProperty: 'id',
    rawData: [
        { id: 1, title: rk('Первый'), parent: null, node: false },
        { id: 2, title: rk('Второй'), parent: null, node: false },
    ],
});

export const TComboboxVariantsType = ObjectType.id(
    'Controls/meta:TComboboxVariantsType'
).attributes<IItemsOptions>({
    items: RecordSetType.title(null)
        .order(2)
        .editor(
            () => {
                return import('Controls-editors/properties').then(({ TreeEditor }) => {
                    return TreeEditor;
                });
            },
            {
                expanderVisibility: 'hasChildren',
                allowHierarchy: false,
                items,
            }
        ),
});
