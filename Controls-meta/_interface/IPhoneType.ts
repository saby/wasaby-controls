import * as rk from 'i18n!Controls';
import { BooleanType } from 'Types/meta';

export const IPhoneType = BooleanType.oneOf([false, true])
    .id('Controls/meta:IPhoneType')
    .title(rk('Только мобильные'))
    .defaultValue(true)
    .description(rk('Ограничивает ввод только мобильными номерами телефона'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({BooleanEditorCheckbox}) => {
                return BooleanEditorCheckbox;
            });
        },
        {}
    );
