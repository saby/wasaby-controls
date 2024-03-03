import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    startDate: number,
    endDate: number
}

export const ITimeLimitOptionsType = ObjectType.id('Controls-Input-meta/dateRangeConnected:ILabelOptionsType')
    .attributes({
        periodLimit: ObjectType
            .title(translate('Лимит'))
            .attributes<ILimitOptions>({
                startDate: NumberType,
                endDate: NumberType
            })
            .editor(() => {
                return import('Controls-editors/properties').then(({LimitTimeEditor}) => {
                    return LimitTimeEditor;
                });
            }, {mask: 'HH:mm', titlePosition: 'none'})
            .optional()
            .defaultValue({})
    })

    .defaultValue({periodLimit: {}});
