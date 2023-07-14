import { TNavigationResetButtonMode } from 'Controls/interface';
import { StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationResetButtonMode[] = ['day', 'home'] as const;

export const TNavigationResetButtonModeType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationResetButtonModeType')
    .title(rk('Режим отображения кнопки возврата к начальной позиции.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StringEnumEditor }) => {
                return StringEnumEditor;
            });
        },
        { options }
    );
