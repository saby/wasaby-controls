import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultValueOptionsType'
)
    .properties({
        defaultValue: NumberType.title(translate('По умолчанию'))
            .editor('Controls-editors/date:DateEditor')
            .optional()
            .order(2)
            .defaultValue(null),
    })
    .defaultValue({ defaultValue: null });
