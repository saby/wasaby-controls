import { NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls';

export const IDefaultTimeValueOptionsType = NumberType
    .id('Controls-Input-meta/dateConnected:IDefaultTimeValueOptionsType')
    .title(translate('Значение'))
    .editor(() => {
        return import('Controls-editors/properties').then(({TimeEditor}) => {
            return TimeEditor;
        });
    })
    .optional()
    .defaultValue(null);
