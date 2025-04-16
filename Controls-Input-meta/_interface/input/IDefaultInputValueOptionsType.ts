import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Значение по умолчанию'),
    shortPlaceholder: translate('по умолчанию'),
    titlePosition: 'none',
};

export const IDefaultInputValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultInputValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('Значение'))
            .optional()
            .editor('Controls-Input-editors/DefaultNumberEditor:DefaultNumberEditor', options)
            .defaultValue('')
            .order(1),
    })
    .defaultValue({ defaultValue: '' });
