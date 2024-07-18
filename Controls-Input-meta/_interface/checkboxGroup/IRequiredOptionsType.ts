import { BooleanType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IRequiredOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IRequiredOptionsType'
)
    .attributes({
        required: BooleanType.description(rk('Определяет, обязательность для заполнения.'))
            .title('Обязательно для выбора')
            .order(5)
            .editor('Controls-editors/CheckboxEditor:CheckboxEditor')
            .defaultValue(false),
    })
    .defaultValue({});
