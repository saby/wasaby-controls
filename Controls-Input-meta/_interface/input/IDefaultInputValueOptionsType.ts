import { ObjectType, StringType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Отобразится по умолчанию'),
};

export const IDefaultInputValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultInputValueOptionsType'
)
    .attributes({
        defaultValue: StringType
            .title(translate('Значение'))
            .extended()
            .optional()
            .editor(() => {
                return import('Controls-Input-editors/DefaultNumberEditor').then(({DefaultNumberEditor}) => {
                    return DefaultNumberEditor;
                });
            }, options)
            .defaultValue('')
    })
    .defaultValue({defaultValue: ''});
