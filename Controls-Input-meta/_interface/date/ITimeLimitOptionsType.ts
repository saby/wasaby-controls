import { ObjectType, NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls';

interface ILimitOptions {
    startDate: number,
    endDate: number
}

export const ITimeLimitOptionsType = ObjectType.id('Controls-Input-meta/dateRangeConnected:ILabelOptionsType')
    .attributes<ILimitOptions>({
        startDate: NumberType,
        endDate: NumberType
    })
    .title(translate('Лимит'))
    .editor(() => {
        return import('Controls-editors/properties').then(({LimitTimeEditor}) => {
            return LimitTimeEditor;
        });
    }, {mask: 'HH:mm'})
    .optional();
