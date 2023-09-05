import { NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

export const IDefaultValueOptionsType = NumberType.id(
    'Controls-Input-meta/dateConnected:IDefaultValueOptionsType'
)
    .extended()
    .title(translate('Значение'))
    .editor(() => {
        return import('Controls-editors/properties').then(({ DateEditor }) => {
            return DateEditor;
        });
    })
    .optional()
    .defaultValue(null);