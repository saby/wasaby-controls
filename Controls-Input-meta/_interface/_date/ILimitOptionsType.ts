import { ObjectType, DateType } from 'Types/meta';
import * as translate from 'i18n!Controls';

interface ILimitOptions {
    startDate: Date,
    endDate: Date
}

export const ILimitOptionsType = ObjectType.id('Controls-Input-meta/dateRangeConnected:ILabelOptionsType')
    .attributes<ILimitOptions>({
        startDate: DateType,
        endDate: DateType
    })
    .title(translate('Лимит'))
    .editor(() => {
        return import('Controls-editors/properties').then(({LimitDateEditor}) => {
            return LimitDateEditor;
        });
    })
    .optional();
