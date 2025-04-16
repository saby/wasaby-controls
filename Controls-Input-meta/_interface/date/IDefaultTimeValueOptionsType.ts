import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultTimeValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultTimeValueOptionsType'
)
    .properties({
        defaultValue: NumberType.title(translate('По умолчанию'))
            .editor('Controls-editors/properties:TimeEditor')
            .optional()
            .order(2)
            .defaultValue(null),
    })
    .defaultValue({ defaultValue: null });
