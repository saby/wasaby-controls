import { StringType } from 'Types/meta';
import * as translate from 'i18n!Controls';

const options = {
    placeholder: translate('Введите значение по умолчанию')
};

export const IDefaultValueOptionsType = StringType.id('Controls-Input-meta/inputConnected:IDefaultValueOptionsType')
    .title(translate('Значение'))
    .optional()
    .editor(
        () => {
            return import('Controls-editors/properties').then(({StringEditor}) => {
                return StringEditor;
            });
        },
        options
    );
