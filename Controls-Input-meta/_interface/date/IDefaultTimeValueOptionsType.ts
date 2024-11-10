import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultTimeValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultTimeValueOptionsType'
)
    .properties({
        defaultValue: NumberType.title(translate('Значение'))
            .extended()
            .editor('Controls-editors/properties:TimeEditor')
            .optional()
            .defaultValue(null),
    })
    .defaultValue({ defaultValue: null });
