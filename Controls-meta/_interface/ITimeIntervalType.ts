import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = [
    { value: 'MM:SS', caption: rk('ММ:сс') },
    { value: 'HH:MM', caption: rk('ЧЧ:мм') },
    { value: 'HHH:MM', caption: rk('ЧЧЧ:мм') },
    { value: 'HHHH:MM', caption: rk('ЧЧЧЧ:мм') },
    { value: 'HH:MM:SS', caption: rk('ЧЧ:мм:сс') },
    { value: 'HHH:MM:SS', caption: rk('ЧЧЧ:мм:сс') },
    { value: 'HHHH:MM:SS', caption: rk('ЧЧЧЧ:мм:сс') },
];

export const ITimeIntervalType = StringType.id('Controls/meta:ITimeIntervalType')
    .title(rk('Формат'))
    .defaultValue('HH:MM')
    .description(rk('Маска.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ EnumEditor }) => {
                return EnumEditor;
            });
        },
        { options }
    );
