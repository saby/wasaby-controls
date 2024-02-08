import { TNavigationResetButtonMode } from 'Controls/interface';
import { StringType } from 'Meta/types';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationResetButtonMode[] = ['day', 'home'] as const;

export const TNavigationResetButtonModeType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationResetButtonModeType')
    .title(rk('Режим отображения кнопки возврата к начальной позиции.'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
