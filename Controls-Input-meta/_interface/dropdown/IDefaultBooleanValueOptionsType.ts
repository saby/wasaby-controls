import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

const options = {
    placeholder: translate('Значение по умолчанию'),
    showPlaceholder: translate('по умолчанию'),
};

export const IDefaultBooleanValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dropdownConnected:IDefaultBooleanValueOptionsType'
)
    .properties({
        defaultValue: StringType.title(translate('По умолчанию'))
            .optional()
            .editor('Controls-editors/dropdown:BooleanEditor', options)
            .defaultValue('')
            .order(2),
    })
    .defaultValue({ defaultValue: '' });
