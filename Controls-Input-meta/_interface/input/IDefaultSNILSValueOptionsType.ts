import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Значение по умолчанию'),
    showPlaceholder: translate('по умолчанию'),
};

export const IDefaultSNILSValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultSNILSValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('По умолчанию'))
            .optional()
            .editor('Controls-editors/input:SNILSEditor', options)
            .defaultValue('')
            .order(2),
    })
    .defaultValue({ defaultValue: '' });
