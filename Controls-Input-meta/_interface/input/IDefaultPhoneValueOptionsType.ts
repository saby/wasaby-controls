import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию'),
};

export const IDefaultPhoneValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultPhoneValueOptionsType'
)
    .attributes({
        defaultValue: StringType.title(translate('Значение'))
            .extended()
            .optional()
            .editor('Controls-editors/input:PhoneEditor', options)
            .defaultValue(''),
    })
    .defaultValue({ defaultValue: '' });
