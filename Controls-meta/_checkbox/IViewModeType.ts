import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = ['filled', 'outlined', 'ghost'] as const;

export const IViewModeType = StringType.oneOf(options)
    .id('Controls/meta:Checkbox.IViewModeType')
    .title(rk('Вид чекбокса'))
    .description(rk('Определяет стиль отображения чекбокса'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StringEnumEditor }) => {
                return StringEnumEditor;
            });
        },
        { options }
    );
