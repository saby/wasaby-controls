import { BooleanType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IMultiSelectType = ObjectType.id(
    'Controls-Input-meta/input:IMultiSelectType'
).attributes({
    multiSelect: BooleanType.description(rk('Определяет множественность выбора.'))
        .title('Множественный выбор')
        .order(4)
        .editor('Controls-editors/CheckboxEditor:CheckboxEditor'),
});
