import { StringType } from 'Types/meta';
import { TNavigationButtonView } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationButtonView[] = ['separator', 'link'] as const;

export const TNavigationButtonViewType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationButtonViewType')
    .title(rk('Вид кнопки подгрузки данных'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StringEnumEditor }) => {
                return StringEnumEditor;
            });
        },
        { options }
    );
