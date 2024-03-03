import * as rk from 'i18n!Controls';
import { StringType } from 'Meta/types';
import { TIconStyle } from 'Controls/interface';

const options: readonly TIconStyle[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'label',
    'default',
    'link',
    'contrast',
    'unaccented',
    'forTranslucent',
    'readonly',
] as const;

export const TIconStyleType = StringType.oneOf(options)
    .id('Controls/meta:TIconStyleType')
    .title(rk('Стиль иконки'))
    .description(rk('Стиль отображения иконки'))
    .editor(
        () => {
            return import('Controls-Buttons-editors/StyleEditor').then(({ StyleEditor }) => {
                return StyleEditor;
            });
        },
        { options }
    );
