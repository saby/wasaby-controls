import { StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию'),
};

export const IDefaultInputValueOptionsType = StringType.id(
    'Controls-Input-meta/inputConnected:IDefaultInputValueOptionsType'
)
    .extended()
    .title(translate('Значение'))
    .optional()
    .editor(() => {
        return import('Controls-editors/properties').then(({ DefaultNumberEditor }) => {
            return DefaultNumberEditor;
        });
    }, options)
    .defaultValue('');
