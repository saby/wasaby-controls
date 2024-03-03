import { StringType } from 'Meta/types';
import { TNavigationButtonSize } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationButtonSize[] = ['l', 's', 'm'];

export const TNavigationButtonSizeType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationButtonSizeType')
    .title(rk('Размер кнопки развертывания.'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options }
    );
