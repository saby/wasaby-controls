import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Значение по умолчанию'),
    shortPlaceholder: translate('по умолчанию'),
    titlePosition: 'none',
};

export const IDefaultValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('Значение'))
            .optional()
            .editor('Controls-editors/input:TextEditor', options)
            .defaultValue('')
            .order(1),
    })
    .defaultValue({ defaultValue: '' });
