import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Значение по умолчанию'),
    showPlaceholder: translate('по умолчанию'),
};

export const IDefaultIPValueOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IDefaultIPValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('По умолчанию'))
            .optional()
            .editor('Controls-editors/input:IPEditor', options)
            .defaultValue('')
            .order(2),
    })
    .defaultValue({ defaultValue: '' });
