import * as rk from 'i18n!Controls';
import { BooleanType } from 'Meta/types';

const options = [
    { value: false, caption: rk('Без фона') },
    { value: true, caption: rk('С фоном') },
];

export const IContrastBackgroundOptionsType = BooleanType.oneOf([false, true])
    .id('Controls/meta:IContrastBackgroundOptionsType')
    .title(rk('Стиль'))
    .description(rk('Определяет контрастность фона контрола по отношению к его окружению.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ EnumEditor }) => {
                return EnumEditor;
            });
        },
        { options }
    );
