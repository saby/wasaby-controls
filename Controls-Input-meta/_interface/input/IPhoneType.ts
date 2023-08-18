import * as rk from 'i18n!Controls-Input';
import { BooleanType } from 'Types/meta';

export const IPhoneType = BooleanType.oneOf([false, true])
    .id('Controls-Input-meta/inputConnected:IPhoneType')
    .title(rk('Только мобильные'))
    .description(rk('Ограничивает ввод только мобильными номерами телефона'))
    .editor(
        () => {
            return import('Controls-editors/CheckboxEditor').then(({ CheckboxEditor }) => {
                return CheckboxEditor;
            });
        }
    )
    .defaultValue(false);
