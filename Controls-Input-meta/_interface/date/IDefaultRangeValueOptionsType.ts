import { ObjectType, NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls';

export const IDefaultRangeValueOptionsType = ObjectType
    .id('Controls-Input-meta/dateConnected:IDefaultRangeValueOptionsType')
    .title(translate('Значение'))
    .attributes({
        startDate: NumberType,
        endDate: NumberType
    })
    .editor(() => {
        return import('Controls-editors/properties').then(({DateRangeEditor}) => {
            return DateRangeEditor;
        });
    })
    .optional();
