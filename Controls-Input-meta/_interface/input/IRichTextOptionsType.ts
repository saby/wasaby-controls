import { BooleanType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IRichTextOptionsType = BooleanType.id('Controls-Input-meta/input:IRichTextOptionsType')
    .description(rk('Определяет, расширенное форматирование.'))
    .title('Расширенное форматирование')
    .editor('Controls-editors/CheckboxEditor:CheckboxEditor')
    .defaultValue(false);
