import { StringType } from 'Types/meta';
import { TNavigationButtonSize } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationButtonSize[] = ['l', 's', 'm'];

export const TNavigationButtonSizeType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationButtonSizeType')
    .title(rk('Размер кнопки развертывания.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StringEnumEditor }) => {
                return StringEnumEditor;
            });
        },
        { options }
    );
