import * as rk from 'i18n!Controls';
import { BooleanType } from 'Types/meta';

const options = [
    { value: false, caption: rk('Все') },
    { value: true, caption: rk('Только мобильные') },
];

export const IPhoneType = BooleanType.oneOf([false, true])
    .id('Controls/meta:IPhoneType')
    .title(rk('Формат'))
    .defaultValue(true)
    .description(rk('Ограничивает ввод только мобильными номерами телефона'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ EnumEditor }) => {
                    return EnumEditor;
                }
            );
        },
        { options }
    );
