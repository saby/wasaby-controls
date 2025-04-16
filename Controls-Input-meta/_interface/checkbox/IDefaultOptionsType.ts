import { BooleanType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

const options = [
    { value: false, caption: rk('Не выбрано') },
    { value: true, caption: rk('Выбрано') },
];

export const IDefaultOptionsType = ObjectType.id(
    'Controls-Input-meta/checkboxConnected:IDefaultOptionsType'
)
    .properties({
        defaultValue: BooleanType.title(rk('По умолчанию'))
            .editor('Controls-editors/dropdown:EnumEditor', {
                options,
                isEmptyText: false,
            })
            .defaultValue(false)
            .optional()
            .order(0),
    })
    .defaultValue({ defaultValue: false });
