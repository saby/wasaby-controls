import { BooleanType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IRichTextOptionsType = BooleanType.id('Controls-Input-meta/input:IRichTextOptionsType')
    .description(rk('Определяет, расширенное форматирование.'))
    .title('Расширенное форматирование')
    .editor(
        () => {
            return import('Controls-editors/properties').then(({BooleanEditorCheckbox}) => {
                return BooleanEditorCheckbox;
            });
        }
    )
    .defaultValue(false);
