import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultValueOptionsType'
)
    .attributes({
        defaultValue: NumberType.title(translate('Значение'))
            .extended()
            .editor('Controls-editors/date:DateEditor')
            .optional()
            .defaultValue(null),
    })
    .defaultValue({ defaultValue: null });
