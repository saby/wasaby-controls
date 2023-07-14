import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = [
    {value: 'HH:mm', caption: rk('ЧЧ:мм')},
    {value: 'HH:mm:ss', caption: rk('ЧЧ:мм:сс')}
];

export const ITimeIntervalType = StringType.id('Controls-Input-meta/dateRangeConnected:ITimeIntervalType')
    .title(rk('Формат'))
    .defaultValue('HH:mm')
    .description(rk('Маска.'))
    .oneOf(['HH:mm', 'HH:mm:ss'])
    .editor(
        () => {
            return import('Controls-editors/properties').then(({EnumComboboxEditor}) => {
                return EnumComboboxEditor;
            });
        },
        {options, isEmptyText: false}
    )
    .optional();
