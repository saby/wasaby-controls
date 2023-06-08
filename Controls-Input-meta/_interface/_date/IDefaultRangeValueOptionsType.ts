import { ObjectType, DateType } from 'Types/meta';
import * as translate from 'i18n!Controls';

export const IDefaultRangeValueOptionsType = ObjectType
    .id('Controls-Input-meta/dateConnected:IDefaultRangeValueOptionsType')
    .title(translate('Значение'))
    .attributes({
        startDate: DateType,
        endDate: DateType
    })
    .editor(() => {
        return import('Controls-editors/properties').then(({DateRangeEditor}) => {
            return DateRangeEditor;
        });
    })
    .optional();
