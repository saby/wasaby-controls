import { StringType } from 'Types/meta';
import { TNavigationPagingMode } from 'Controls/interface';
import * as rk from 'i18n!Controls';

const options: readonly TNavigationPagingMode[] = [
    'hidden',
    'basic',
    'edge',
    'edges',
    'end',
    'numbers',
    'direct',
] as const;

export const TNavigationPagingModeType = StringType.oneOf(options)
    .id('Controls/meta:TNavigationPagingModeType')
    .title(rk('Внешний вид пэйджинга.'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StringEnumEditor }) => {
                return StringEnumEditor;
            });
        },
        { options }
    );
