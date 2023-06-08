import { DateType } from 'Types/meta';
import * as translate from 'i18n!Controls';

export const IDefaultValueOptionsType = DateType
    .id('Controls-Input-meta/dateConnected:IDefaultValueOptionsType')
    .title(translate('Значение'))
    .editor(() => {
        return import('Controls-editors/properties').then(({DateEditor}) => {
            return DateEditor;
        });
    })
    .optional();
