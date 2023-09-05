import { StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию')
};

export const IDefaultValueOptionsType = StringType.id('Controls-Input-meta/inputConnected:IDefaultValueOptionsType')
    .extended()
    .title(translate('Значение'))
    .optional()
    .editor(
        () => {
            return import('Controls-editors/properties').then(({StringEditor}) => {
                return StringEditor;
            });
        },
        options
    )
    .defaultValue('');