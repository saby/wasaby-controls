import { BooleanType, ObjectType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IWrapTextOptionsType = ObjectType.id('Controls/meta:IWrapTextOptionsType').attributes({
    wrapText: BooleanType.description(rk('Определяет возможность переноса текста.'))
        .title('Перенос текста')
        .order(4)
        .editor(() => {
            return import('Controls-editors/properties').then(({ BooleanEditorCheckbox }) => {
                return BooleanEditorCheckbox;
            });
        })
        .defaultValue(false),
});
