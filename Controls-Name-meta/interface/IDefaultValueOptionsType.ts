import { INameValue } from 'Controls-Name/Input';
import { ObjectType, StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

export const IDefaultValueOptionsType = ObjectType.id(
    'Controls-Name-meta/interface:IDefaultValueOptionsType'
)
    .properties({
        defaultValue: ObjectType.properties<INameValue>({
            firstName: StringType.optional(),
            lastName: StringType.optional(),
            middleName: StringType.optional(),
        })
            .title(translate('По умолчанию'))
            .optional()
            .order(2)
            .editor('Controls-editors/input:NameEditor', {
                titlePosition: 'none',
            })
            .defaultValue(undefined),
    })
    .defaultValue({ defaultValue: {} });
