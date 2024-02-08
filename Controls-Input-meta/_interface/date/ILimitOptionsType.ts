import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    startDate: number,
    endDate: number
}

export const ILimitOptionsType = ObjectType.id('Controls-Input-meta/dateRangeConnected:ILimitOptionsType')
    .attributes({
        periodLimit: ObjectType
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
