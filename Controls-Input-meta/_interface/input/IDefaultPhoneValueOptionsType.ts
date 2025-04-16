import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Значение по умолчанию'),
    showPlaceholder: translate('по умолчанию'),
    titlePosition: 'none',
};

export const IDefaultPhoneValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultPhoneValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('Значение'))
            .optional()
            .editor('Controls-editors/input:PhoneEditor', options)
            .defaultValue('')
            .order(2),
    })
    .defaultValue({ defaultValue: '' });
