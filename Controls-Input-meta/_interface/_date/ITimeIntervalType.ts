import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = [
    {value: 'HH:MM', caption: rk('ЧЧ:мм')},
    {value: 'HH:MM:SS', caption: rk('ЧЧ:мм:сс')}
];

export const ITimeIntervalType = StringType.id('Controls-Input-meta/dateRangeConnected:ITimeIntervalType')
    .title(rk('Формат'))
    .defaultValue('HH:MM')
    .description(rk('Маска.'))
    .oneOf(['HH:MM', 'HH:MM:SS'])
    .editor(
        () => {
            return import('Controls-editors/properties').then(({EnumEditor}) => {
                return EnumEditor;
            });
        },
        {options}
    );
