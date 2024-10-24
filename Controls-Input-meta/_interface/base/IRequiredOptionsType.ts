import { BooleanType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IRequiredOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IRequiredOptionsType'
)
    .properties({
        required: BooleanType.description(rk('Определяет, обязательность для заполнения.'))
            .title('Поле обязательно для заполнения')
            .editor('Controls-editors/CheckboxEditor:CheckboxEditor')
            .defaultValue(false),
    })
    .defaultValue({ required: false });
