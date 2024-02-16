import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';

const options = [
    {value: 'DD.MM.YYYY', caption: rk('ДД.ММ.ГГГГ')},
    {value: 'DD.MM.YY', caption: rk('ДД.ММ.ГГ')},
    {value: 'MM.YYYY', caption: rk('ММ.ГГГГ')},
    {value: 'YYYY', caption: rk('ГГГГ')},
];

export const IDateMaskType = ObjectType.id('Controls-Input-meta/dateConnected:IDateMaskType')
    .attributes({
        mask: StringType
            .title(rk('Формат'))
            .description(rk('Маска.'))
            .defaultValue('DD.MM.YY')
            .oneOf(['DD.MM.YYYY', 'DD.MM.YY', 'MM.YYYY', 'YYYY'])
            .order(2)
            .editor(
                () => {
                    return import('Controls-editors/properties').then(({EnumComboboxEditor}) => {
                        return EnumComboboxEditor;
                    });
                },
                {options, isEmptyText: false}
            )
            .optional()
    })
    .defaultValue({mask: 'DD.MM.YY'});
