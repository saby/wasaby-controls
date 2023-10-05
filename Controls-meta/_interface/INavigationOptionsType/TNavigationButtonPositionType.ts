import { StringType } from 'Types/meta';
import { TNavigationButtonPosition } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationButtonPosition[] = ['center', 'start'] as const;

export const TNavigationButtonPositionType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationButtonPositionType')
    .title(rk('Положение кнопки развертывания.'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
