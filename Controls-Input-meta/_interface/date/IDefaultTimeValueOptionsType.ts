import { NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

export const IDefaultTimeValueOptionsType = NumberType.id(
    'Controls-Input-meta/dateConnected:IDefaultTimeValueOptionsType'
)
    .extended()
    .title(translate('Значение'))
    .editor(() => {
        return import('Controls-editors/properties').then(({ TimeEditor }) => {
            return TimeEditor;
        });
    })
    .optional()
    .defaultValue(null);
