import { ObjectType, StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию')
};

export const IDefaultValueOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:IDefaultValueOptionsType')
    .attributes({
        defaultValue: StringType
            .title(translate('Значение'))
            .extended()
            .optional()
            .editor(
                () => {
                    return import('Controls-editors/input').then(({TextEditor}) => {
                        return TextEditor;
                    });
                },
                options
            )
            .defaultValue('')
    })
    .defaultValue({defaultValue: ''});
