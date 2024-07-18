import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';

const options = [
    { value: 'HH:mm', caption: rk('ЧЧ:мм') },
    { value: 'HH:mm:ss', caption: rk('ЧЧ:мм:сс') },
];

export const ITimeIntervalType = ObjectType.id(
    'Controls-Input-meta/dateRangeConnected:ITimeIntervalType'
)
    .attributes({
        mask: StringType.title(rk('Формат'))
            .description(rk('Маска.'))
            .defaultValue('HH:mm')
            .oneOf(['HH:mm', 'HH:mm:ss'])
            .editor('Controls-editors/properties:EnumComboboxEditor', {
                options,
                isEmptyText: false,
            })
            .optional(),
    })
    .defaultValue({ mask: 'HH:mm' });
