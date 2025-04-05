import * as rk from 'i18n!Controls-Input';
import { BooleanType, extended, ObjectType } from 'Meta/types';

export const IUseGroupingOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IUseGroupingOptionsType'
)
    .properties({
        useGrouping: BooleanType.description(
            rk('Определяет, следует ли использовать разделители группы.')
        )
            .title('Разделители триад')
            .editor('Controls-editors/CheckboxEditor:CheckboxEditor')
            .defaultValue(false)
            .optional()
            .order(5),
    })
    .defaultValue({ useGrouping: false });
