import { ObjectType, NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    startDate: number,
    endDate: number
}

export const ILimitOptionsType = ObjectType.id('Controls-Input-meta/dateRangeConnected:ILimitOptionsType')
    .attributes<ILimitOptions>({
        startDate: NumberType,
        endDate: NumberType
    })
    .title(translate('Лимит'))
    .editor(() => {
        return import('Controls-editors/properties').then(({LimitDateEditor}) => {
            return LimitDateEditor;
        });
    })
    .optional();
