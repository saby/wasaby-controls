import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию'),
};

export const IDefaultInputValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultInputValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('Значение'))
            .extended()
            .optional()
            .editor('Controls-Input-editors/DefaultNumberEditor:DefaultNumberEditor', options)
            .defaultValue(''),
    })
    .defaultValue({ defaultValue: '' });
