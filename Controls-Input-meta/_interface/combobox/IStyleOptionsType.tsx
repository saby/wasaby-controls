import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';

export const IStyleOptionsType = ObjectType.id(
    'Controls-Input-meta/comboboxConnected:IStyleOptionsType'
)
    .title('Стиль')
    .description(rk('Стиль'))
    .properties({
        reference: StringType.editor('Controls-Input-editors/inputStyleEditor:StyleEditor', {
            contrastBackgroundVisibility: false,
        }).optional(),
    })
    .optional();
