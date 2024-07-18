import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultRangeValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultRangeValueOptionsType'
)
    .attributes({
        defaultValue: ObjectType.title(translate('Значение'))
            .extended()
            .attributes({
                startDate: NumberType,
                endDate: NumberType,
            })
            .editor('Controls-editors/properties:DateRangeEditor')
            .optional()
            .defaultValue({}),
    })
    .defaultValue({});
