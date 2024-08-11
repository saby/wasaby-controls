import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';

const options = [
    { value: 'DD.MM.YYYY', caption: rk('ДД.ММ.ГГГГ-ДД.ММ.ГГГГ') },
    { value: 'DD.MM.YY', caption: rk('ДД.ММ.ГГ-ДД.ММ.ГГ') },
    { value: 'MM.YYYY', caption: rk('ММ.ГГГГ-ММ.ГГГГ') },
    { value: 'YYYY', caption: rk('ГГГГ-ГГГГ') },
];

export const IDateRangeMaskType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDateRangeMaskType'
)
    .properties({
        mask: StringType.title(rk('Формат'))
            .description(rk('Маска.'))
            .defaultValue('DD.MM.YY')
            .oneOf(['DD.MM.YYYY', 'DD.MM.YY', 'MM.YYYY', 'YYYY'])
            .order(2)
            .editor('Controls-editors/properties:EnumComboboxEditor', {
                options,
                isEmptyText: false,
            })
            .optional(),
    })
    .defaultValue({ mask: 'DD.MM.YY' });
