import { StringType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

const options = [
    { value: 'lastFirst', caption: rk('Фамилия Имя') },
    { value: 'full', caption: rk('Фамилия Имя Отчество') },
];

export const IFieldOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IFieldsOptionsType'
)
    .properties({
        field: StringType.description('Определяет, формат отображения ФИО.')
            .title(rk('Формат'))
            .editor('Controls-editors/dropdown:EnumEditor', {
                options,
                isEmptyText: false,
            })
            .defaultValue('full')
            .optional()
            .order(0),
    })
    .defaultValue({ field: 'full' });
