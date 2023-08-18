import { StringType } from 'Types/meta';
import { TButtonStyle } from 'Controls/buttons';
import * as rk from 'i18n!Controls';

const options: readonly TButtonStyle[] = [
    'primary',
    'warning',
    'secondary',
    'success',
    'danger',
    'info',
    'unaccented',
    'default',
    'pale',
    'navigation',
] as const;

export const TButtonStyleTypeType = StringType.id('Controls/meta:TButtonStyleTypeType')
    .oneOf(options)
    .title(rk('Значения для стиля отображения кнопки.'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
