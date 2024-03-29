import { StringType } from 'Types/meta';
import { TNavigationPagingPadding } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationPagingPadding[] = [
    'null',
    'default',
] as const;

export const TNavigationPagingPaddingType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationPagingPaddingType')
    .title(rk('Опция управляет отображением отступа под пэйджинг.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ StringEnumEditor }) => {
                    return StringEnumEditor;
                }
            );
        },
        { options }
    );
