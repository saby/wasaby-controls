import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию'),
};

export const IDefaultValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultValueOptionsType'
)
    .attributes({
        defaultValue: StringType.title(translate('Значение'))
            .extended()
            .optional()
            .editor('Controls-editors/input:TextEditor', options)
            .defaultValue(''),
    })
    .defaultValue({ defaultValue: '' });
