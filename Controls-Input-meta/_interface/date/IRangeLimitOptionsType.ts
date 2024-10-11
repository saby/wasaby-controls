import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    startDate: number;
    endDate: number;
}

export const IRangeLimitOptionsType = ObjectType.id(
    'Controls-Input-meta/dateRangeConnected:IRangeLimitOptionsType'
)
    .properties({
        limit: ObjectType.title(translate('Лимит'))
            .properties<ILimitOptions>({
                startDate: NumberType,
                endDate: NumberType,
            })
            .editor('Controls-editors/properties:LimitDateEditor', { titlePosition: 'none' })
            .optional()
            .defaultValue({}),
    })
    .defaultValue({});
