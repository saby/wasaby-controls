import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultRangeValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultRangeValueOptionsType'
)
    .properties({
        defaultValue: ObjectType.title(translate('По умолчанию'))
            .properties({
                startDate: NumberType,
                endDate: NumberType,
            })
            .editor('Controls-editors/properties:DateRangeEditor')
            .optional()
            .order(2)
            .defaultValue({}),
    })
    .defaultValue({});
