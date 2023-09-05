import * as rk from 'i18n!Controls-Input';
import { StringType } from 'Types/meta';

const options = [
    {value: 'DD.MM.YYYY', caption: rk('ДД.ММ.ГГГГ')},
    {value: 'DD.MM.YY', caption: rk('ДД.ММ.ГГ')},
    {value: 'MM.YYYY', caption: rk('ММ.ГГГГ')},
    {value: 'YYYY', caption: rk('ГГГГ')},
];

export const IDateMaskType = StringType.id('Controls-Input-meta/dateConnected:IDateMaskType')
    .title(rk('Формат'))
    .order(2)
    .defaultValue('DD.MM.YY')
    .description(rk('Маска.'))
    .oneOf(['DD.MM.YYYY', 'DD.MM.YY', 'MM.YYYY', 'YYYY'])
    .editor(
        () => {
            return import('Controls-editors/properties').then(({EnumComboboxEditor}) => {
                return EnumComboboxEditor;
            });
        },
        {options, isEmptyText: false}
    );