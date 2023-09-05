import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'unaccented',
    'link',
    'label',
    'info',
] as const;

export const TFontColorStyleType = StringType.id('Controls/meta:TFontColorStyleType')
    .title(rk('Стиль текста'))
    .description(rk('Стиль цвета текста контрола.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StyleEditor }) => {
                return StyleEditor;
            });
        },
        { options }
    );
