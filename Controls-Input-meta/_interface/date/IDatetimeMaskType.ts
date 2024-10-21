import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';
import { IBaseInputMaskOptions, } from 'Controls/date';

const options = [
    {value: 'DD.MM.YYYY', caption: rk('ДД.ММ.ГГГГ')},
    {value: 'DD.MM.YY', caption: rk('ДД.ММ.ГГ')},
    {value: 'DD.MM', caption: rk('ДД.ММ')},
    {value: 'YYYY-MM-DD', caption: rk('ГГГГ-ММ-ДД')},
    {value: 'YY-MM-DD', caption: rk('ГГ-ММ-ДД')},
    {value: 'HH:mm:ss:SSS', caption: rk('ЧЧ:мм:cc:CCC')},
    {value: 'HH:mm:ss', caption: rk('ЧЧ:мм:cc')},
    {value: 'HH:mm', caption: rk('ЧЧ:мм')},
    {value: 'DD.MM.YYYY HH:mm:ss', caption: rk('ДД.ММ.ГГГГ') + ' ' + rk('ЧЧ:мм:cc')},
    {value: 'DD.MM.YYYY HH:mm', caption: rk('ДД.ММ.ГГГГ') + ' ' + rk('ЧЧ:мм')},
    {value: 'DD.MM.YY HH:mm:ss', caption: rk('ДД.ММ.ГГ') + ' ' + rk('ЧЧ:мм:cc')},
    {value: 'DD.MM.YY HH:mm', caption: rk('ДД.ММ.ГГ') + ' ' + rk('ЧЧ:мм')},
    {value: 'DD.MM HH:mm:ss', caption: rk('ДД.ММ') + ' ' + rk('ЧЧ:мм:cc')},
    {value: 'DD.MM HH:mm', caption: rk('ДД.ММ') + ' ' + rk('ЧЧ:мм')},
    {value: 'YYYY-MM-DD HH:mm:ss', caption: rk('ГГГГ-ММ-ДД') + ' ' + rk('ЧЧ:мм:сс')},
    {value: 'YYYY-MM-DD HH:mm', caption: rk('ГГГГ-ММ-ДД') + ' ' + rk('ЧЧ:мм')},
    {value: 'YY-MM-DD HH:mm:ss', caption: rk('ГГ-ММ-ДД') + ' ' + rk('ЧЧ:мм:сс')},
    {value: 'YY-MM-DD HH:mm', caption: rk('ГГ-ММ-ДД') + ' ' + rk('ЧЧ:мм')},
    {value: 'YYYY', caption: rk('ГГГГ')},
    {value: 'MM.YYYY', caption: rk('ММ.ГГГГ')},
];

export const IDateTimeMaskType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDateTimeMaskType'
)
    .properties<IBaseInputMaskOptions>({
        mask: StringType.title(rk('Формат'))
            .description(rk('Маска.'))
            .defaultValue('DD.MM.YY')
            .oneOf([
                'DD.MM.YYYY',
                'DD.MM.YY',
                'DD.MM',
                'YYYY-MM-DD',
                'YY-MM-DD',
                'HH:mm:ss:SSS',
                'HH:mm:ss',
                'HH:mm',
                'DD.MM.YYYY HH:mm:ss',
                'DD.MM.YYYY HH:mm',
                'DD.MM.YY HH:mm:ss',
                'DD.MM.YY HH:mm',
                'DD.MM HH:mm:ss',
                'DD.MM HH:mm',
                'YYYY-MM-DD HH:mm:ss',
                'YYYY-MM-DD HH:mm',
                'YY-MM-DD HH:mm:ss',
                'YY-MM-DD HH:mm',
                'YYYY',
                'MM.YYYY',
            ])
            .order(2)
            .editor('Controls-editors/properties:EnumComboboxEditor', {
                options,
                isEmptyText: false,
            })
            .optional(),
    })
    .defaultValue({ mask: 'DD.MM.YY' });
