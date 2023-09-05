import { StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию'),
};

export const IDefaultPhoneValueOptionsType = StringType.id(
    'Controls-Input-meta/inputConnected:IDefaultPhoneValueOptionsType'
)
    .extended()
    .title(translate('Значение'))
    .optional()
    .editor(() => {
        return import('Controls-editors/properties').then(({ PhoneEditor }) => {
            return PhoneEditor;
        });
    }, options)
    .defaultValue('');
