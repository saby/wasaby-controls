import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';
import { TBackgroundStyle } from 'Controls/interface';

const options: readonly TBackgroundStyle[] = [
    'default',
    'danger',
    'success',
    'warning',
    'primary',
    'secondary',
    'unaccented',
    'readonly',
    'info',
] as const;

export const TBackgroundStyleType = StringType.oneOf(options)
    .id('Controls/meta:backgroundStyleType')
    .title(rk('Стиль фона'))
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
