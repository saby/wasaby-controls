import { NumberType, ObjectType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    startDate: number,
    endDate: number
}

export const IRangeLimitOptionsType = ObjectType.id('Controls-Input-meta/dateRangeConnected:IRangeLimitOptionsType')
    .attributes({
        limit: ObjectType
            .title(translate('Лимит'))
            .attributes<ILimitOptions>({
                startDate: NumberType,
                endDate: NumberType
            }).editor(() => {
                return import('Controls-editors/properties').then(({LimitDateEditor}) => {
                    return LimitDateEditor;
                });
            }, {titlePosition: 'none'})
            .optional()
            .defaultValue({})
    })
    .defaultValue({});
